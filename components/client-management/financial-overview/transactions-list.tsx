"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Service {
  _id: string;
  clientId: string;
  value: number;
  status: string;
  paymentStatus: string;
  startDate?: string;
  endDate?: string;
}

interface Client {
  _id: string;
  name: string;
}

interface TransactionsListProps {
  services: Service[];
  clients: Client[];
}

export function TransactionsList({ services, clients }: TransactionsListProps) {
  // Sort services by date (most recent first)
  const sortedServices = [...services].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate) : new Date(a.startDate || "");
    const dateB = b.endDate ? new Date(b.endDate) : new Date(b.startDate || "");
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedServices.map((service) => (
          <TableRow key={service._id}>
            <TableCell>
              {service.endDate 
                ? new Date(service.endDate).toLocaleDateString()
                : service.startDate
                ? new Date(service.startDate).toLocaleDateString()
                : 'N/A'
              }
            </TableCell>
            <TableCell>
              {clients.find(c => c._id === service.clientId)?.name || 'Unknown Client'}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(service.value)}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {service.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  service.paymentStatus === "paid"
                    ? "default"
                    : service.paymentStatus === "partial"
                    ? "secondary"
                    : "destructive"
                }
              >
                {service.paymentStatus}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        {services.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}