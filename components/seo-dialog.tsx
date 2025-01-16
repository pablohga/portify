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
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/types/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEOData } from "@/hooks/use-seo-data";

const seoSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters").max(160, "Description must not exceed 160 characters"),
  keywords: z.string().min(3, "Add at least one keyword"),
  ogImage: z.string().url("Must be a valid URL"),
});

interface SEODialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<SEO>) => void;
}

export function SEODialog({
  userId,
  open,
  onOpenChange,
  onSubmit,
}: SEODialogProps) {
  const { seo, isLoading } = useSEOData(userId);
  
  const form = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
    },
  });

  useEffect(() => {
    if (seo) {
      form.reset({
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords.join(", "),
        ogImage: seo.ogImage,
      });
    }
  }, [seo, form]);

  function handleSubmit(values: z.infer<typeof seoSchema>) {
    onSubmit({
      ...values,
      keywords: values.keywords.split(",").map((k) => k.trim()),
    });
    onOpenChange(false);
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit SEO Settings</DialogTitle>
        </DialogHeader>

        {seo && (
          <Card className="mb-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Current SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Title</h4>
                <p className="text-sm">{seo.title}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{seo.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {seo.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Open Graph Image</h4>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={seo.ogImage} 
                    alt="Open Graph preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Pablo Azevedo - Frontend Developer" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optimal length: 50-60 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Expert Frontend Developer specializing in React.js and Vue.js, creating modern and efficient web applications."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optimal length: 150-160 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (comma-separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Pablo Azevedo, Frontend Reactjs, Frontend VueJS"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant keywords separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Graph Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/og-image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Recommended size: 1200x630 pixels
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save SEO Settings</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}