import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TaxReportProps {
  startDate: Date;
  endDate: Date;
  clientId?: string;
}

interface TaxData {
  totalRevenue: number;
  totalTaxableIncome: number;
  totalTaxDue: number;
  monthlyTaxes: {
    month: string;
    revenue: number;
    taxableIncome: number;
    taxDue: number;
  }[];
  taxDeductions: {
    category: string;
    amount: number;
    status: "approved" | "pending" | "rejected";
  }[];
  taxRates: {
    bracket: string;
    rate: number;
    amount: number;
  }[];
}

export function TaxReport({ startDate, endDate, clientId }: TaxReportProps) {
  const [data, setData] = useState<TaxData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...(clientId && { clientId }),
        });

        const response = await fetch(`/api/reports/tax?${params}`);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Failed to fetch tax data:", error);
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taxable Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalTaxableIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Estimated Tax Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalTaxDue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Tax Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTaxes}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" />
                <Bar dataKey="taxableIncome" name="Taxable Income" fill="hsl(var(--secondary))" />
                <Bar dataKey="taxDue" name="Tax Due" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tax Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.taxDeductions.map((deduction, index) => (
                  <TableRow key={index}>
                    <TableCell>{deduction.category}</TableCell>
                    <TableCell>{formatCurrency(deduction.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deduction.status === "approved"
                            ? "default"
                            : deduction.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {deduction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Brackets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Income Bracket</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Tax Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.taxRates.map((rate, index) => (
                  <TableRow key={index}>
                    <TableCell>{rate.bracket}</TableCell>
                    <TableCell>{rate.rate}%</TableCell>
                    <TableCell>{formatCurrency(rate.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}