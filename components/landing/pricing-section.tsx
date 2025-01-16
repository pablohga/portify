"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { PricingSection as PricingSectionType } from "@/types/home";
import PaymentButton from "../payment-button";

interface PricingSectionProps {
  data?: PricingSectionType;
}

const defaultPlans = [
  {
    name: "Grátis",
    price: "0",
    description: "Perfeito para começar",
    features: [
      "3 Categorias",
      "3 Projetos por Categoria",
      "Portfólio Personalizado",
      "Domínio Personalizado",
      "SEO Otimizado",
      "Suporte por Email",
    ],
    buttonText: "Começar Grátis",
  },
  {
    name: "Pagante",
    price: "29,90",
    description: "Para freelancers estabelecidos",
    features: [
      "Categorias Ilimitadas",
      "Projetos Ilimitados",
      "Portfólio Personalizado",
      "Domínio Personalizado",
      "SEO Otimizado",
      "Suporte Prioritário",
      "Temas Premium",
      "Analytics Avançado",
    ],
    buttonText: "Começar Agora",
    popular: true,
  },
  {
    name: "Premium",
    price: "79,90",
    description: "Solução completa para crescimento",
    features: [
      "Tudo do plano Pagante",
      "Sistema de Gestão de Clientes",
      "Gestão Financeira Completa",
      "Curso: Carreira Freelancer",
      "Mentoria em Grupo",
      "Comunidade VIP",
      "Acesso Antecipado a Recursos",
      "Suporte 24/7",
    ],
    buttonText: "Começar Agora",
  },
];

export function PricingSection({ data }: PricingSectionProps) {
  const plans = data?.plans || defaultPlans;
  const title = data?.title || "Planos que Crescem com Você";
  const subtitle = data?.subtitle || "Escolha o plano perfeito para suas necessidades. Comece gratuitamente e evolua conforme seu negócio cresce.";

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-lg bg-card border ${
                plan.popular ? "border-primary" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Mais Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$ {plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/auth/register">
                    {plan.buttonText}
                  </Link>
                </Button>
                {/* <PaymentButton plan="paid"> */}
                {/* <PaymentButton plan={plan.name}> */}
                  {/* {plan.buttonText} */}
                {/* </PaymentButton> */}

              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}