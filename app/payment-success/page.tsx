"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PostPaymentRegistrationForm } from "@/components/post-payment/registration-form";
import { PlanDetails } from "@/components/post-payment/plan-details";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan");
  const { toast } = useToast();

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) return;

      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.customerEmail) {
          setCustomerEmail(data.customerEmail);
        } else {
          throw new Error("Customer email not found");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to verify payment session",
          variant: "destructive",
        });
      }
    }

    verifySession();
  }, [sessionId, toast]);

  if (!sessionId || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-muted-foreground">Invalid registration link</p>
      </div>
    );
  }

  if (!customerEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-muted-foreground">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md space-y-8">
        <PlanDetails plan={plan} />
        <PostPaymentRegistrationForm email={customerEmail} plan={plan} />
      </div>
    </div>
  );
}