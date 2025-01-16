"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, DollarSign, Users, FileText, PieChart, Calendar } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Controle de Renda",
    description: "Acompanhe seus ganhos, despesas e margens de lucro em tempo real.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Gestão de Clientes",
    description: "Gerencie informações de clientes, projetos e comunicação em um só lugar.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Geração de Faturas",
    description: "Crie e envie faturas profissionais com lembretes automatizados.",
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Relatórios Financeiros",
    description: "Obtenha insights sobre seu negócio com análises financeiras detalhadas.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Planejamento de Projetos",
    description: "Agende projetos, defina marcos e acompanhe prazos de forma eficiente.",
  },
];

export function ComingSoonSection() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Bell className="h-4 w-4" />
            Em Breve
          </span> */}
          <h2 className="text-4xl font-bold mb-4">
            Potencialize Seu Negócio Freelancer
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tenha acesso antecipado aos nossos próximos recursos premium projetados para ajudar você a gerenciar seu negócio freelancer como um profissional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4 p-6 rounded-lg bg-card"
            >
              <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}