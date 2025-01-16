"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Crown, AlertTriangle } from "lucide-react";

interface SubscriptionManagementProps {
  currentTier: string;
  email: string;
}

export function SubscriptionManagement({ currentTier, email }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleUpgrade = async (plan: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan,
          email 
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process upgrade request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast({
        title: "Success",
        description: "Your subscription has been cancelled",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </div>
          <Badge variant={currentTier === 'premium' ? 'default' : currentTier === 'paid' ? 'secondary' : 'outline'}>
            <Crown className="mr-1 h-4 w-4" />
            {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTier === 'free' && (
          <div className="space-y-4">
            <p>Upgrade to unlock premium features:</p>
            <div className="flex gap-4">
              <Button 
                onClick={() => handleUpgrade('paid')} 
                disabled={isLoading}
              >
                Upgrade to Paid
              </Button>
              <Button 
                onClick={() => handleUpgrade('premium')} 
                disabled={isLoading}
              >
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}

        {currentTier === 'paid' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={() => handleUpgrade('premium')} 
                disabled={isLoading}
              >
                Upgrade to Premium
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isLoading}>
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your subscription? You will lose access to all paid features at the end of your current billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        {currentTier === 'premium' && (
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Premium Subscription</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your premium subscription? You will lose access to all premium features at the end of your current billing period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}