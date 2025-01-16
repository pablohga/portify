"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useContactSettings(userId?: string) {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const url = userId ? `/api/contact/settings?userId=${userId}` : "/api/contact/settings";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setSettings(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch contact settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, [userId, toast]);

  return { settings, isLoading };
}