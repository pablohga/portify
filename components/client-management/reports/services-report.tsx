"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ServicesReportProps {
  userId: string;
  dateRange: DateRange;
  selectedClient: string;
  selectedStatus: string;
  selectedServiceType: string;
}

interface ServicesSummary {
  totalServices: number;
  completedServices: number;
  pendingServices: number;
  cancelledServices: number;
  serviceProgress: {
    date: string;
    completed: number;
    inProgress: number;
    pending: number;
  }[];
  serviceDetails: {
    title: string;
    client: string;
    status: string;
    value: number;
    startDate: string;
    endDate?: string;
  }[];
}

export function ServicesReport({
  userId,
  dateRange,
  selectedClient,
  selectedStatus,
  selectedServiceType,
}: ServicesReportProps) {
  const [data, setData] = useState<ServicesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams({
          startDate: dateRange.from?.toISOString() || "",
          endDate: dateRange.to?.toISOString() || "",
          clientId: selectedClient,
          status: selectedStatus,
          type: selectedServiceType,
        });

        const response = await fetch(`/api/reports/services?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch services report:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, dateRange, selectedClient, selectedStatus, selectedServiceType]);

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
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Completed Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completedServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pending Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Cancelled Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cancelledServices}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.serviceProgress}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="inProgress"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="hsl(var(--muted))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.serviceDetails.map((service, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell>{service.client}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "completed"
                          ? "default"
                          : service.status === "in_progress"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(service.value)}</TableCell>
                  <TableCell>
                    {new Date(service.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {service.endDate
                      ? new Date(service.endDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}