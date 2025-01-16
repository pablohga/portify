import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import { getSubscriptionDisplay } from "@/lib/subscription/display";

interface SubscriptionBadgeProps {
  tier?: string | null;
}

export function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const subscriptionTier = tier || session?.user?.subscriptionTier;
  const { variant, displayName } = getSubscriptionDisplay(subscriptionTier);

  return (
    <Button
      variant="ghost"
      className="gap-2"
      onClick={() => router.push("/dashboard/upgrade")}
    >
      <Crown className="h-4 w-4" />
      <Badge variant={variant}>{displayName} Plan</Badge>
    </Button>
  );
}