import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { VerificationResultsDialog } from "./verification-results-dialog";
import type { VerificationResult } from "@/types/verification";

interface VerifySubscriptionsButtonProps {
  onVerificationComplete: () => void;
}

export function VerifySubscriptionsButton({ onVerificationComplete }: VerifySubscriptionsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  async function handleVerify() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriptions/verify", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to verify subscriptions");
      }

      const data = await response.json();
      setResults(data.updates);
      setShowResults(true);

      toast({
        title: "Success",
        description: "Subscription verification completed",
      });

      onVerificationComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify subscriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={handleVerify}
        disabled={isLoading}
        className="gap-2 mb-6"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Verify Subscriptions
      </Button>

      <VerificationResultsDialog
        results={results}
        open={showResults}
        onOpenChange={setShowResults}
      />
    </>
  );
}