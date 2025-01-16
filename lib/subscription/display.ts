import { SubscriptionTier } from "@/types/subscription";

interface SubscriptionDisplay {
  variant: "default" | "secondary" | "outline";
  displayName: string;
}

export function getSubscriptionDisplay(tier?: string | null): SubscriptionDisplay {
  switch (tier) {
    case "premium":
      return { variant: "default", displayName: "Premium" };
    case "paid":
      return { variant: "secondary", displayName: "Paid" };
    default:
      return { variant: "outline", displayName: "Free" };
  }
}