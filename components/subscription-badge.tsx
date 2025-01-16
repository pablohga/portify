import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";

interface SubscriptionBadgeProps {
  tier?: string | null; // Adicionado suporte para undefined ou null
}

export function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  const router = useRouter();

  const getBadgeVariant = () => {
    switch (tier) {
      case "premium":
        return "default"; // Premium tier
      case "paid":
        return "secondary"; // Paid tier
      default:
        return "outline"; // Free tier
    }
  };

  const getDisplayName = () => {
    switch (tier) {
      case "premium":
        return "Premium";
      case "paid":
        return "Paid";
      default:
        return "Free";
    }
  };

  return (
    <Button
      variant="ghost"
      className="gap-2"
      onClick={() => router.push("/dashboard/upgrade")}
    >
      <Crown className="h-4 w-4" />
      <Badge variant={getBadgeVariant()}>{getDisplayName()} Plan</Badge>
    </Button>
  );
}
