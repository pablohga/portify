import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/user";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyStripeSubscription } from "@/lib/stripe/subscription";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Verifica se o e-mail é uma string válida antes de chamar a função
        const email = credentials.email;
        if (!email) {
          throw new Error("Email is required");
        }

        // Verify Stripe subscription and update user tier
        const stripeTier = await verifyStripeSubscription(email);
        if (stripeTier !== user.subscriptionTier) {
          user.subscriptionTier = stripeTier;
          await user.save();
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        // Verifica se o e-mail é uma string válida
        const email = user.email;
        if (!email) {
          throw new Error("Email is required");
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          // For new Google users, verify Stripe subscription
          const stripeTier = await verifyStripeSubscription(email);

          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            subscriptionTier: stripeTier,
          });
        } else {
          // For existing Google users, update subscription tier
          const stripeTier = await verifyStripeSubscription(email);
          if (stripeTier !== existingUser.subscriptionTier) {
            existingUser.subscriptionTier = stripeTier;
            await existingUser.save();
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
      }
      return session;
    },
  },
};
