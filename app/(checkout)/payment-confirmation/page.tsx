import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutReturnPage(){
/* export default async function CheckoutReturnPage(){*/
  return (
    <Card className="max-w-lg mt-10 text-center">
      <CardContent>
        <CardHeader>
          <ShoppingBag className="mx-auto mb-4 w-12 h-12"/>
          <CardTitle>
            Assinatura confirmada!
          </CardTitle>
          <CardDescription>
            Agora você está a frente de mais da metade do mercado profissional!
            Você já pode acessar o conteúdo da assinatura. Se você não recebeu o
            e-mail de confirmação, por favor, verifique sua caixa de entrada e
            pasta de spam.
          </CardDescription>
        </CardHeader>
        <div className="text-sm">
          <p>Sua assinatura foi processada com sucesso e sua conta já esta ativa!</p>
          <p>Agora é só aproveitar o Portify!</p>
          <Link href="/dashboard" className={cn(buttonVariants(), 'mt-12')}>
            Ir para o dashboard
          </Link>
        </div>
      </CardContent>
      
    </Card>
  )
}