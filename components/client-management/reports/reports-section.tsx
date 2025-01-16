"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FinancialReport } from "./financial-report";
import { ClientsReport } from "./clients-report";
import { ServicesReport } from "./services-report";
import { ProductivityReport } from "./productivity-report";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface ReportsSectionProps {
  userId: string;
}

export function ReportsSection({ userId }: ReportsSectionProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedServiceType, setSelectedServiceType] = useState("all");

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Export to PDF");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Export to Excel");
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={(newDate) => setDateRange(newDate || { 
              from: addDays(new Date(), -30),
              to: new Date()
            })}
          />
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {/* Add client options dynamically */}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {/* Add service type options dynamically */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial Report</TabsTrigger>
          <TabsTrigger value="clients">Clients Report</TabsTrigger>
          <TabsTrigger value="services">Services Report</TabsTrigger>
          <TabsTrigger value="productivity">Productivity Report</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialReport
            userId={userId}
            dateRange={dateRange}
            selectedClient={selectedClient}
            selectedStatus={selectedStatus}
          />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsReport
            userId={userId}
            dateRange={dateRange}
            selectedStatus={selectedStatus}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServicesReport
            userId={userId}
            dateRange={dateRange}
            selectedClient={selectedClient}
            selectedStatus={selectedStatus}
            selectedServiceType={selectedServiceType}
          />
        </TabsContent>

        <TabsContent value="productivity">
          <ProductivityReport
            userId={userId}
            dateRange={dateRange}
            selectedClient={selectedClient}
            selectedStatus={selectedStatus}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}