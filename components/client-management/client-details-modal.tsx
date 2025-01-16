"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatName } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Service {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  value: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  startDate?: string;
  endDate?: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  document?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  observation?: string;
}

interface ClientDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailsModal({
  client,
  open,
  onOpenChange,
}: ClientDetailsModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { firstName, lastName } = formatName(client?.name);

  useEffect(() => {
    if (client?._id) {
      fetchServices();
    }
  }, [client]);

  async function fetchServices() {
    try {
      const response = await fetch(`/api/services?clientId=${client?._id}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!client) return null;

  const pendingServices = services.filter(
    (service) => service.status === "pending" || service.status === "in_progress"
  );
  const completedServices = services.filter(
    (service) => service.status === "completed"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {firstName} <span className="text-primary">{lastName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-medium">Email:</span> {client.email}
              </p>
              {client.phone && (
                <p>
                  <span className="font-medium">Phone:</span> {client.phone}
                </p>
              )}
              {client.whatsapp && (
                <p>
                  <span className="font-medium">WhatsApp:</span> {client.whatsapp}
                </p>
              )}
              {client.document && (
                <p>
                  <span className="font-medium">Document:</span> {client.document}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.address?.street && (
                <p>
                  <span className="font-medium">Street:</span>{" "}
                  {client.address.street}
                </p>
              )}
              {client.address?.city && (
                <p>
                  <span className="font-medium">City:</span> {client.address.city}
                </p>
              )}
              {client.address?.state && (
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {client.address.state}
                </p>
              )}
              {client.address?.zipCode && (
                <p>
                  <span className="font-medium">ZIP Code:</span>{" "}
                  {client.address.zipCode}
                </p>
              )}
              {client.address?.country && (
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {client.address.country}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {client.observation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Observation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{client.observation}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending Services</TabsTrigger>
            <TabsTrigger value="completed">Completed Services</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {pendingServices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No pending services
                  </p>
                ) : (
                  pendingServices.map((service) => (
                    <Card key={service._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{service.status}</Badge>
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
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            Value:{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(service.value)}
                          </span>
                          {service.startDate && (
                            <span>
                              Started:{" "}
                              {new Date(service.startDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {completedServices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No completed services
                  </p>
                ) : (
                  completedServices.map((service) => (
                    <Card key={service._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{service.status}</Badge>
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
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>
                            Value:{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(service.value)}
                          </span>
                          {service.endDate && (
                            <span>
                              Completed:{" "}
                              {new Date(service.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}