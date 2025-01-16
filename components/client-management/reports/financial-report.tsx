"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface FinancialReportProps {
  userId: string;
  dateRange: DateRange;
  selectedClient: string;
  selectedStatus: string;
}

interface FinancialSummary {
  totalReceived: number;
  totalPending: number;
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
  pendingPayments: {
    clientName: string;
    amount: number;
    dueDate: string;
  }[];
}

export function FinancialReport({
  userId,
  dateRange,
  selectedClient,
  selectedStatus,
}: FinancialReportProps) {
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams({
          startDate: dateRange.from?.toISOString() || "",
          endDate: dateRange.to?.toISOString() || "",
          clientId: selectedClient,
          status: selectedStatus,
        });

        const response = await fetch(`/api/reports/financial?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch financial report:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, dateRange, selectedClient, selectedStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalReceived)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalPending)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                data.monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0) /
                  data.monthlyRevenue.length
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.pendingPayments.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-medium">{payment.clientName}</div>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-bold">{formatCurrency(payment.amount)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}