"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CTASection as CTASectionType } from "@/types/home";

interface CTASectionProps {
  data?: CTASectionType;
}

export function CTASection({ data }: CTASectionProps) {
  const title = data?.title || "Comece a Criar Seu Portfólio Gratuito Hoje";
  const subtitle = data?.subtitle || "Junte-se a milhares de freelancers que estão mostrando seu trabalho e atraindo melhores clientes com nossa plataforma.";
  const buttonText = data?.buttonText || "Criar Seu Portfólio";
  const features = data?.features || ["100% Grátis", "Sem Cartão de Crédito", "Configure em Minutos"];

  return (
    <section className="py-20 bg-primary/5">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
          <Button
            size="lg"
            className="text-lg px-8"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-primary-foreground/80">
            {features.join(" • ")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}