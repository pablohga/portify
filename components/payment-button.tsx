"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { CheckoutForm } from "./stripe/checkout-form";

interface PaymentButtonProps {
  children: React.ReactNode;
  plan: string;
}

export default function PaymentButton({ children, plan }: PaymentButtonProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <Button
        className="w-full mt-5"
        variant="default"
        onClick={() => setIsCheckoutOpen(true)}
      >
        {children}
      </Button>

      <CheckoutForm 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={plan.toLowerCase()}
      />
    </>
  );
}