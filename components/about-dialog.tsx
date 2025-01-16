"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { About } from "@/types/about";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";
import { useAboutData } from "@/hooks/use-about-data";

const featureSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(featureSchema).min(1, "At least one feature is required"),
});

interface AboutDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<About>) => void;
}

const defaultFeatures = [
  { icon: "Code2", title: "", description: "" },
  { icon: "Palette", title: "", description: "" },
  { icon: "Rocket", title: "", description: "" },
];

export function AboutDialog({
  userId,
  open,
  onOpenChange,
  onSubmit,
}: AboutDialogProps) {
  const { about, isLoading } = useAboutData(userId);
  
  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: "",
      description: "",
      features: defaultFeatures,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  useEffect(() => {
    if (about) {
      form.reset({
        title: about.title,
        description: about.description,
        features: about.features,
      });
    }
  }, [about, form]);

  function handleSubmit(values: z.infer<typeof aboutSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Seção Sobre</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Seção</FormLabel>
                  <FormControl>
                    <Input placeholder="About Me" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Principal</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write about yourself..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recursos</h3>
                {fields.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({ icon: "Star", title: "", description: "" })
                    }
                  >
                    Adicionar Recurso
                  </Button>
                )}
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h4 className="text-sm font-medium">Recurso {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`features.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Ícone</FormLabel>
                          <FormControl>
                            <Input placeholder="Code2, Palette, Rocket, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Feature title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder="Feature description..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button type="submit">Guardar alterações</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}