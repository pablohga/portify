"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { formatCurrency } from "@/lib/utils";
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

interface ProductivityReportProps {
  userId: string;
  dateRange: DateRange;
  selectedClient: string;
  selectedStatus: string;
}

interface ProductivitySummary {
  averageCompletionTime: number;
  averageServiceValue: number;
  servicesPerMonth: number;
  revenuePerService: number;
  monthlyMetrics: {
    month: string;
    completedServices: number;
    averageTime: number;
    revenue: number;
  }[];
  performanceMetrics: {
    metric: string;
    value: number;
    change: number;
  }[];
}

export function ProductivityReport({
  userId,
  dateRange,
  selectedClient,
  selectedStatus,
}: ProductivityReportProps) {
  const [data, setData] = useState<ProductivitySummary | null>(null);
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

        const response = await fetch(`/api/reports/productivity?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch productivity report:", error);
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Avg. Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.averageCompletionTime} days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Avg. Service Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.averageServiceValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Services per Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.servicesPerMonth}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Revenue per Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.revenuePerService)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyMetrics}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="completedServices"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="averageTime"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {data.performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div
                  className={`text-sm ${
                    metric.change > 0
                      ? "text-green-500"
                      : metric.change < 0
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}