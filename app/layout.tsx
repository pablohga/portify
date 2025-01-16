import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ["latin"] });

async function getSEOData() {
  try {
    const host = headers().get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const res = await fetch(`${protocol}://${host}/api/seo`);
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOData();

  return {
    title: seo?.title || "Portify - Seu Portfólio, Sua Identidade",
    description: seo?.description || "Create your professional portfolio with Portify - the platform that helps freelancers showcase their work and attract better clients.",
    keywords: seo?.keywords || ["Portify", "Portfolio Builder", "Freelancer Portfolio"],
    openGraph: {
      title: seo?.title || "Portify - Seu Portfólio, Sua Identidade",
      description: seo?.description || "Create your professional portfolio with Portify - the platform that helps freelancers showcase their work and attract better clients.",
      images: [{ url: seo?.ogImage || "https://mundonews.pt/portify_logo_new_p.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || "Portify - Seu Portfólio, Sua Identidade",
      description: seo?.description || "Create your professional portfolio with Portify - the platform that helps freelancers showcase their work and attract better clients.",
      images: [seo?.ogImage || "https://mundonews.pt/portify_logo_new_p.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}