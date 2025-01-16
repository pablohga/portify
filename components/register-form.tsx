"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    slug: z
      .string()
      .min(3, "Slug must be at least 3 characters")
      .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

interface RegisterFormProps {
  initialEmail?: string | null;
  initialPlan?: string | null;
  onComplete: (data: any) => void;
}

export function RegisterForm({ initialEmail, initialPlan, onComplete }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: initialEmail || "",
      password: "",
      confirmPassword: "",
      slug: "",
    },
  });

  // Verificar disponibilidade do slug
  async function checkSlugAvailability(slug: string) {
    try {
      const response = await fetch("/api/check-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await response.json();
      setIsSlugAvailable(data.available);
    } catch (error) {
      console.error("Failed to check slug availability:", error);
      setIsSlugAvailable(null);
    }
  }

  // Atualizar slug automaticamente baseado em firstName e lastName
  useEffect(() => {
    const firstName = form.watch("firstName");
    const lastName = form.watch("lastName");

    if (firstName || lastName) {
      const generatedSlug = `${firstName.trim()}-${lastName.trim()}`
        .toLowerCase()
        .replace(/\s+/g, "-") // Substitui espaços por hífens
        .replace(/[^a-z0-9-]/g, ""); // Remove caracteres inválidos

      if (!form.getValues("slug")) {
        form.setValue("slug", generatedSlug); // Auto preencher apenas se vazio
      }
    }
  }, [form.watch("firstName"), form.watch("lastName")]);

  // Checar slug ao clicar fora do campo
  const handleSlugBlur = async () => {
    const slug = form.getValues("slug");
    if (slug) {
      await checkSlugAvailability(slug);
    }
  };

  async function handleSubmit(values: z.infer<typeof registerSchema>) {
    if (isSlugAvailable === false) {
      toast({
        title: "Error",
        description: "Slug is not available. Please choose another one.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          password: values.password,
          slug: values.slug,
          subscriptionTier: initialPlan || "free",
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      onComplete(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="py-20 min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} disabled={!!initialEmail} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      URL do seu Portfólio: <br /> 
                      https://portify.pt/
                      <span className="text-primary">{form.watch("slug")}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john-doe"
                        {...field}
                        onBlur={handleSlugBlur} // Checar slug ao sair do campo
                      />
                    </FormControl>
                    <FormMessage />
                    {isSlugAvailable === false && (
                      <p className="text-red-500 text-sm">Slug is already taken.</p>
                    )}
                    {isSlugAvailable === true && (
                      <p className="text-green-500 text-sm">Slug is available.</p>
                    )}
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
