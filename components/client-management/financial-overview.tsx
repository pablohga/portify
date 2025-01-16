"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsSection } from "./financial-overview/analytics-section";
import { ReportsSection } from "./financial-overview/reports-section";
import { NotificationsSection } from "./financial-overview/notifications-section";

interface FinancialOverviewProps {
  userId: string;
}

interface FinancialMetrics {
  totalRevenue: number;
  pendingPayments: number;
  completedProjects: number;
  activeProjects: number;
  monthlyRevenue: number;
  lastMonthRevenue: number;
}

export function FinancialOverview({ userId }: FinancialOverviewProps) {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    pendingPayments: 0,
    completedProjects: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    lastMonthRevenue: 0,
  });

  // ... rest of the existing code ...

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... existing metric cards ... */}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsSection userId={userId} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsSection userId={userId} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsSection userId={userId} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSection userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}