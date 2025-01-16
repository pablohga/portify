"use client";

import { useState, useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Service } from "@/types/service";

export function useAnalyticsFilters(services: Service[]) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const serviceDate = service.endDate 
        ? new Date(service.endDate) 
        : service.startDate 
        ? new Date(service.startDate)
        : new Date();

      const isInDateRange = (!dateRange.from || serviceDate >= dateRange.from) && 
                           (!dateRange.to || serviceDate <= dateRange.to);
      const isClientMatch = selectedClient === "all" || service.clientId === selectedClient;
      const isStatusMatch = selectedStatus === "all" || service.status === selectedStatus;

      return isInDateRange && isClientMatch && isStatusMatch;
    });
  }, [services, dateRange, selectedClient, selectedStatus]);

  return {
    dateRange,
    setDateRange,
    selectedClient,
    setSelectedClient,
    selectedStatus,
    setSelectedStatus,
    filteredServices
  };
}