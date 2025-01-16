"use client";

import { useState, useEffect } from "react";
import { About } from "@/types/about";
import { useToast } from "@/components/ui/use-toast";

export function useAboutData(userId?: string) {
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAbout() {
      try {
        const url = userId ? `/api/about?userId=${userId}` : "/api/about";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setAbout(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch about data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAbout();
  }, [userId, toast]);

  return { about, isLoading };
}