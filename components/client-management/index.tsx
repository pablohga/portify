"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientList } from "./client-list";
import { ServiceList } from "./service-list";
import { FinancialOverview } from "./financial-overview";
import { ReportsSection } from "./reports/reports-section";

interface ClientManagementProps {
  userId: string;
}

export function ClientManagement({ userId }: ClientManagementProps) {
  return (
    <div className="container mx-auto py-20 max-w-[960px]">
      <h1 className="text-3xl font-bold mb-8">Client Management</h1>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ClientList userId={userId} />
        </TabsContent>

        <TabsContent value="services">
          <ServiceList userId={userId} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialOverview userId={userId} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsSection userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}