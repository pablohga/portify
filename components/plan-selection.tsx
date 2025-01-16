"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

interface PlanSelectionProps {
  userEmail: string;
  onSelectFreePlan: () => void;
}

export function PlanSelection({ userEmail, onSelectFreePlan }: PlanSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePlanSelection = async (plan: string) => {
    try {
      setIsLoading(true);

      if (plan === 'free') {
        router.push(`/auth/register?plan=free`);
        return;
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: userEmail }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process plan selection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$0/mês</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  3 Categorias
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  3 Projetos por Categoria
                </li>
              </ul>
              <Button 
                className="mt-6 w-full" 
                onClick={() => handlePlanSelection('free')}
                disabled={isLoading}
              >
                Começar Grátis
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-primary">
            <CardHeader>
              <CardTitle>Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$29,90/mês</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Categorias Ilimitadas
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Projetos Ilimitados
                </li>
              </ul>
              <Button 
                className="mt-6 w-full" 
                onClick={() => handlePlanSelection('paid')}
                disabled={isLoading}
              >
                Assinar Plano Paid
              </Button>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$79,90/mês</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Tudo do Plano Paid
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Gestão de Clientes
                </li>
              </ul>
              <Button 
                className="mt-6 w-full" 
                onClick={() => handlePlanSelection('premium')}
                disabled={isLoading}
              >
                Assinar Plano Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}