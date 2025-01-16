"use client";

import React, { useEffect } from "react";
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
import { Category } from "@/types/category";
import { RichTextEditor } from "./rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  icon: z.string(),
  order: z.number().min(0),
});

interface CategoryDialogProps {
  category?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Category>) => void;
  maxOrder: number;
}

// Filter out non-icon exports and commonly used utility functions
const iconList = Object.keys(Icons).filter((key) => {
  const value = Icons[key as keyof typeof Icons];
  return (
    typeof value === "function" &&
    !["default", "createLucideIcon", "createElement"].includes(key)
  );
});

export function CategoryDialog({
  category,
  open,
  onOpenChange,
  onSubmit,
  maxOrder,
}: CategoryDialogProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "Folder",
      order: maxOrder + 1,
    },
  });

  // Update form when category data changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
        icon: category.icon,
        order: category.order,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        icon: "Folder",
        order: maxOrder + 1,
      });
    }
  }, [category, form, maxOrder]);

  function handleSubmit(values: z.infer<typeof categorySchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  const getIcon = (iconName: string): LucideIcon => {
    return (Icons[iconName as keyof typeof Icons] as LucideIcon) || Icons.Folder;
  };

  const selectedIcon = form.watch("icon");
  const SelectedIconComponent = getIcon(selectedIcon);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Applications" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {React.createElement(SelectedIconComponent, {
                              className: "h-4 w-4",
                            })}
                            <span>{field.value}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-[300px] overflow-y-auto">
                      {iconList.map((iconName) => {
                        const IconComponent = getIcon(iconName);
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              {React.createElement(IconComponent, {
                                className: "h-4 w-4",
                              })}
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower numbers will appear first
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Add a description for this category..."
                    />
                  </FormControl>
                  <FormDescription>
                    This text will appear above the projects in this category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Category</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}