"use client";

import { useState, useEffect } from "react";
import { SEO } from "@/types/seo";
import { useToast } from "@/components/ui/use-toast";

export function useSEOData(userId?: string) {
  const [seo, setSEO] = useState<SEO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSEO() {
      try {
        const url = userId ? `/api/seo?userId=${userId}` : "/api/seo";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setSEO(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch SEO data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSEO();
  }, [userId, toast]);

  return { seo, isLoading };
}