"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Service } from "@/types/service";

interface Client {
  _id: string;
  name: string;
}

export function useAnalyticsData(userId: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      fetchServices(),
      fetchClients()
    ]).finally(() => setIsLoading(false));
  }, [userId]);

  async function fetchServices() {
    try {
      const response = await fetch(`/api/services?userId=${userId}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    }
  }

  async function fetchClients() {
    try {
      const response = await fetch(`/api/clients?userId=${userId}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    }
  }

  return { services, clients, isLoading };
}