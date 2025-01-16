"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQSection as FAQSectionType } from "@/types/home";

interface FAQSectionProps {
  data?: FAQSectionType;
}

const defaultFAQs = [
  {
    question: "Quais são as limitações do plano gratuito?",
    answer: "O plano gratuito permite criar até 3 categorias, com 3 projetos em cada categoria. Você terá acesso a todas as funcionalidades básicas do portfólio, incluindo personalização, SEO e domínio personalizado.",
  },
  {
    question: "Como funciona o plano Pagante?",
    answer: "O plano Pagante remove todas as limitações de categorias e projetos. Você pode criar quantas categorias desejar e adicionar quantos projetos precisar. Além disso, tem acesso a temas premium e analytics avançado.",
  },
  {
    question: "O que está incluído no plano Premium?",
    answer: "O plano Premium inclui todas as funcionalidades do plano Pagante, mais acesso ao sistema de gestão de clientes, gestão financeira, curso exclusivo sobre carreira freelancer, mentoria em grupo e comunidade VIP.",
  },
  {
    question: "Posso mudar de plano depois?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ao fazer upgrade, você terá acesso imediato a todas as funcionalidades do novo plano.",
  },
  {
    question: "Como funciona o curso de carreira freelancer?",
    answer: "O curso é exclusivo para assinantes Premium e inclui módulos sobre precificação, gestão de projetos, marketing pessoal, captação de clientes e muito mais. O conteúdo é atualizado regularmente.",
  },
];

export function FAQSection({ data }: FAQSectionProps) {
  const faqs = data?.faqs || defaultFAQs;
  const title = data?.title || "Perguntas Frequentes";
  const subtitle = data?.subtitle || "Tire suas dúvidas sobre nossos planos e funcionalidades. Se precisar de mais informações, nossa equipe está sempre disponível para ajudar.";

  return (
    <section className="py-20 bg-background">
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

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}