"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";

interface Service {
  value: number;
  paymentStatus: string;
  paymentHistory?: {
    amount: number;
    date: Date;
  }[];
  endDate?: string;
  startDate?: string;
}

interface TrendChartProps {
  services: Service[];
}

export function TrendChart({ services }: TrendChartProps) {
  // Get the date range for the last 6 months
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
  
  // Generate an array of all months in the range
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  // Calculate payments received for each month
  const data = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    // Sum all payments received in this month
    const paymentsReceived = services
      .flatMap(service => 
        service.paymentHistory 
          ? service.paymentHistory.map(payment => ({
              amount: payment.amount,
              date: new Date(payment.date)
            }))
          : []
      )
      .filter(payment => 
        payment.date >= monthStart && 
        payment.date <= monthEnd
      )
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      date: format(month, "MMM yy"),
      value: paymentsReceived
    };
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Payments Received
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
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}