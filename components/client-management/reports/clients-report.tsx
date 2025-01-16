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
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface ClientsReportProps {
  userId: string;
  dateRange: DateRange;
  selectedStatus: string;
}

interface ClientSummary {
  activeClients: number;
  inactiveClients: number;
  topClients: {
    name: string;
    totalServices: number;
    totalRevenue: number;
    lastServiceDate: string;
  }[];
  clientActivity: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF99E6'];

export function ClientsReport({
  userId,
  dateRange,
  selectedStatus,
}: ClientsReportProps) {
  const [data, setData] = useState<ClientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams({
          startDate: dateRange.from?.toISOString() || "",
          endDate: dateRange.to?.toISOString() || "",
          status: selectedStatus,
        });

        const response = await fetch(`/api/reports/clients?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch clients report:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, dateRange, selectedStatus]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{data.activeClients}</div>
                <div className="text-sm text-muted-foreground">Active Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{data.inactiveClients}</div>
                <div className="text-sm text-muted-foreground">
                  Inactive Clients
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.clientActivity}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.clientActivity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Total Services</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Last Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topClients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.totalServices}</TableCell>
                  <TableCell>{formatCurrency(client.totalRevenue)}</TableCell>
                  <TableCell>
                    {new Date(client.lastServiceDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        new Date(client.lastServiceDate) >
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                          ? "default"
                          : "secondary"
                      }
                    >
                      {new Date(client.lastServiceDate) >
                      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
                        ? "Active"
                        : "Inactive"}
                    </Badge>
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