"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check } from "lucide-react";
import Link from "next/link";
import { SubscriptionManagement } from "./subscription-management";

interface SubscriptionInfoProps {
  user: any;
}

export function SubscriptionInfo({ user }: SubscriptionInfoProps) {
  const planFeatures = {
    free: [
      "3 Categories",
      "3 Projects per Category",
      "Basic Portfolio Features",
      "Community Support",
    ],
    paid: [
      "Unlimited Categories",
      "Unlimited Projects",
      "Advanced Portfolio Features",
      "Priority Support",
      "Custom Domain",
    ],
    premium: [
      "Everything in Paid plan",
      "Client Management",
      "Financial Management",
      "Advanced Analytics",
      "Priority Support",
      "1-on-1 Consultation",
    ],
  };

  const getPlanFeatures = () => {
    return planFeatures[user.subscriptionTier as keyof typeof planFeatures] || planFeatures.free;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      <SubscriptionManagement 
        currentTier={user.subscriptionTier} 
        email={user.email}
      />

      <Card>
        <CardHeader>
          <CardTitle>Current Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-2">
              {getPlanFeatures().map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}