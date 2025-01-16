"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import { Service } from "@/types/service";

interface RevenueChartProps {
  services: Service[];
}

export function RevenueChart({ services }: RevenueChartProps) {
  // Get the date range for the last 12 months
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), 1);
  
  // Generate an array of all months in the range
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  // Calculate revenue for each month
  const data = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthlyRevenue = services
      .filter(service => {
        const serviceDate = service.endDate 
          ? new Date(service.endDate) 
          : service.startDate 
          ? new Date(service.startDate)
          : null;
        
        return serviceDate && 
               serviceDate >= monthStart && 
               serviceDate <= monthEnd &&
               service.status === 'completed';
      })
      .reduce((sum, service) => sum + service.value, 0);

    return {
      month: format(month, "MMM yy"),
      revenue: monthlyRevenue
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Revenue
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(payload[0].value as number)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="revenue"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}