"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const registrationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    slug: z
      .string()
      .min(3, "Slug must be at least 3 characters")
      .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RegistrationFormProps {
  email: string;
  plan: string;
}

export function PostPaymentRegistrationForm({ email, plan }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email,
      firstName: "",
      lastName: "",
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
        .replace(/\s+/g, "-") // Substituir espaços por hífens
        .replace(/[^a-z0-9-]/g, ""); // Remover caracteres inválidos

      if (!form.getValues("slug")) {
        form.setValue("slug", generatedSlug); // Auto preencher apenas se vazio
      }
    }
  }, [form.watch("firstName"), form.watch("lastName")]);

  // Verificar slug ao clicar fora do campo slug
  const handleSlugBlur = async () => {
    const slug = form.getValues("slug");
    if (slug) {
      await checkSlugAvailability(slug);
    }
  };

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    // Checar a disponibilidade do slug novamente antes do envio
    const slug = values.slug;
    await checkSlugAvailability(slug);

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
          email: values.email,
          name: `${values.firstName} ${values.lastName}`,
          password: values.password,
          slug: values.slug,
          subscriptionTier: plan,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success",
        description: "Registration completed successfully",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Complete Your Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                    <Input type="password" {...field} />
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

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Complete Registration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
