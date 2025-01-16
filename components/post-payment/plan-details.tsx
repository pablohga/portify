import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PlanDetailsProps {
  plan: string;
}

const PLAN_FEATURES = {
  paid: [
    "Categorias Ilimitadas",
    "Projetos Ilimitados",
    "Portfólio Personalizado",
    "Domínio Personalizado",
    "SEO Otimizado",
    "Suporte Prioritário",
  ],
  premium: [
    "Tudo do plano Paid",
    "Sistema de Gestão de Clientes",
    "Gestão Financeira Completa",
    "Curso: Carreira Freelancer",
    "Mentoria em Grupo",
    "Comunidade VIP",
  ],
};

export function PlanDetails({ plan }: PlanDetailsProps) {
  const features = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || [];
  const planName = plan === "premium" ? "Premium" : "Paid";

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Plano {planName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}