"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/types/hero";
import { useToast } from "@/components/ui/use-toast";

export function useHeroData(userId?: string) {
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHero() {
      try {
        const url = userId ? `/api/hero?userId=${userId}` : "/api/hero";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setHero(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch hero data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchHero();
  }, [userId, toast]);

  return { hero, isLoading };
}