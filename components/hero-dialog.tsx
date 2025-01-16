"use client";

import { useEffect, useState } from "react";
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
import { Hero } from "@/types/hero";
import { useHeroData } from "@/hooks/use-hero-data";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const heroSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundImageId: z.string().optional(),
});

interface HeroDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Hero>) => void;
}

export function HeroDialog({
  userId = "",
  open,
  onOpenChange,
  onSubmit,
}: HeroDialogProps) {
  const { hero, isLoading } = useHeroData(userId);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      backgroundImage: "",
      backgroundImageId: "",
    },
  });

  useEffect(() => {
    if (hero) {
      form.reset({
        title: hero.title || "",
        subtitle: hero.subtitle || "",
        backgroundImage: hero.backgroundImage || "",
      });
    }
  }, [hero, form]);

  async function handleImageUpload(file: File) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const newFileName = `${userId}-${file.name.split(".")[0].replace(/\s+/g, "")[0]}-${timestamp}.${file.type.split("/")[1]}`;
    const renamedFile = new File([file], newFileName, { type: file.type });

    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("upload_preset", "user-hero-banner");
    formData.append("folder", `/${userId}`);

    try {
      setIsUploading(true);
      const res = await fetch("https://api.cloudinary.com/v1_1/dxqsqcw5p/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("backgroundImageId data.public_id", data.public_id)
      if (data.secure_url && data.public_id) {
        form.setValue("backgroundImage", data.secure_url);
        form.setValue("backgroundImageId", data.public_id); // Define o public_id da imagem.
        
        toast({
          title: "Sucesso",
          description: "Imagem carregada com sucesso!",
        });
      } else {
        throw new Error("Erro ao carregar a imagem.");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit(values: z.infer<typeof heroSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar seção Hero Banner</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Pablo Azevedo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Deixe em branco para ocultar o título.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Full-stack Developer & Creative Problem Solver" {...field} />
                  </FormControl>
                  <FormDescription>
                    Deixe em branco para ocultar o subtítulo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem de fundo</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        disabled={isUploading}
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
                  <FormDescription>
                    Use uma imagem de alta resolução (recomendado: 1920x1080 ou maior).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Carregando imagem..." : "Guardar alterações"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
