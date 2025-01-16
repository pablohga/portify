import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProfitabilityReportProps {
  startDate: Date;
  endDate: Date;
  clientId?: string;
}

interface ProfitabilityData {
  profitMargin: number;
  operatingMargin: number;
  netMargin: number;
  serviceMargins: {
    name: string;
    margin: number;
    revenue: number;
    cost: number;
  }[];
  clientProfitability: {
    name: string;
    value: number;
  }[];
  monthlyMargins: {
    month: string;
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF99E6'];

export function ProfitabilityReport({ startDate, endDate, clientId }: ProfitabilityReportProps) {
  const [data, setData] = useState<ProfitabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...(clientId && { clientId }),
        });

        const response = await fetch(`/api/reports/profitability?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch profitability data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [startDate, endDate, clientId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gross Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.profitMargin.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Operating Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.operatingMargin.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Net Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.netMargin.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.serviceMargins}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                  <Bar dataKey="margin" fill="hsl(var(--primary))">
                    {data.serviceMargins.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Profitability Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.clientProfitability}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.clientProfitability.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Margin Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyMargins}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                <Bar dataKey="grossMargin" name="Gross Margin" fill="hsl(var(--primary))" />
                <Bar dataKey="operatingMargin" name="Operating Margin" fill="hsl(var(--secondary))" />
                <Bar dataKey="netMargin" name="Net Margin" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}