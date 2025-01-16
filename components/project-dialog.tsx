"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldImage } from 'next-cloudinary';
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
import { Category } from "@/types/category";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";



const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be a valid URL"),
  tech: z.string(),
  category: z.string().min(1, "Please select a category"),
});

interface ProjectDialogProps {
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Project) => void;
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
  onSubmit,
}: ProjectDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      image: project?.image || "",
      tech: project?.tech.join(", ") || "",
      category: project?.category || "",
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/categories?userId=${session?.user?.id}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    if (open && session?.user?.id) {
      fetchCategories();
    }
  }, [open, session?.user?.id]);

  function handleSubmit(values: z.infer<typeof projectSchema>) {
    onSubmit({
      ...project,
      ...values,
      tech: values.tech.split(",").map((t) => t.trim()),
    } as Project);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create Project"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const userId = session?.user?.id; // Substitua pelo ID real do usuário
                          const currentDate = new Date();
                          const timestamp = currentDate
                            .toISOString()
                            .replace(/[-:.TZ]/g, ""); // Formato: YYYYMMDDHHMMSS
                          const newFileName = `${userId}-${file.name.split(".")[0].replace(/\s+/g, "")[0]}-${timestamp}.${file.type.split("/")[1]}`;
                          const renamedFile = new File([file], newFileName, {
                            type: file.type,
                          });

                          const formData = new FormData();
                          formData.append("file", renamedFile);
                          // formData.append("upload_preset", "your_upload_preset");  O mesmo configurado no Cloudinary
                          formData.append("upload_preset", "user-projects-imgs"); // O mesmo configurado no Cloudinary
                          formData.append("folder", `user_uploads/user-projects/${userId}`);

                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            });

                            const data = await res.json();
                            if (data.secure_url) {
                              field.onChange(data.secure_url); // Atualiza o campo com a URL retornada
                              toast({
                                title: "Success",
                                description: "Image uploaded successfully!",
                              });
                            } else {
                              toast({
                                title: "Error",
                                description: "Failed to upload image.",
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            console.error("Upload error:", error);
                            toast({
                              title: "Error",
                              description: "An error occurred while uploading the image.",
                              variant: "destructive",
                            });
                          }
                        }}
                      />
                      {field.value && (
                        <Image
                          src={field.value}
                          alt="Uploaded Preview"
                          className="w-full max-h-48 object-cover rounded-md"
                          height={120}
                          width={80}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="tech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="React, TypeScript, Tailwind" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Project</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}