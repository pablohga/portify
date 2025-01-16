"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Service {
  clientId: string;
  value: number;
  status: string;
}

interface Client {
  _id: string;
  name: string;
}

interface DistributionChartProps {
  services: Service[];
  clients: Client[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF99E6', '#9B19F5', '#FFA07A', '#98FB98'];

export function DistributionChart({ services, clients }: DistributionChartProps) {
  // Calculate total revenue per client
  const revenueByClient = services
    .filter(service => service.status === 'completed')
    .reduce((acc, service) => {
      const clientId = service.clientId;
      acc[clientId] = (acc[clientId] || 0) + service.value;
      return acc;
    }, {} as Record<string, number>);

  // Transform data for the chart
  const data = Object.entries(revenueByClient).map(([clientId, value]) => ({
    name: clients.find(c => c._id === clientId)?.name || 'Unknown Client',
    value
  }))
  .sort((a, b) => b.value - a.value) // Sort by value descending
  .slice(0, 8); // Show top 8 clients

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {payload[0].name}
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
      </PieChart>
    </ResponsiveContainer>
  );
}