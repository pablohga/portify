"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContactSettings } from "@/hooks/use-contact-settings";

const contactSettingsSchema = z.object({
  emailTo: z.string().email("Invalid email address"),
  emailService: z.enum(["resend", "smtp"]),
  smtpSettings: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    secure: z.boolean().optional(),
    auth: z.object({
      user: z.string().optional(),
      pass: z.string().optional(),
    }),
  }).optional(),
  resendApiKey: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

interface ContactSettingsDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ContactSettingsDialog({
  userId,
  open,
  onOpenChange,
  onSubmit,
}: ContactSettingsDialogProps) {
  const { settings, isLoading } = useContactSettings(userId);
  
  const form = useForm<z.infer<typeof contactSettingsSchema>>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      emailTo: "",
      emailService: "resend",
      smtpSettings: {
        host: "",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: "",
        },
      },
      resendApiKey: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const emailService = form.watch("emailService");

  function handleSubmit(values: z.infer<typeof contactSettingsSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contact Form Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/photo-1423666639041-f56000c27a9a" {...field} />
                  </FormControl>
                  <FormDescription>
                    Image to display in the contact section (recommended: square image)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Contact form submissions will be sent to this email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="smtp">SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {emailService === "resend" && (
              <FormField
                control={form.control}
                name="resendApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resend API Key</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="re_..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Get your API key from{" "}
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Resend.com
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {emailService === "smtp" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="smtpSettings.host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="smtp.gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSettings.port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="587"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSettings.auth.user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpSettings.auth.pass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your password or app-specific password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}