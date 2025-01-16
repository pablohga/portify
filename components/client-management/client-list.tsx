"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientDialog } from "./client-dialog";
import { ClientTable } from "./client-table";
import { ClientDetailsModal } from "./client-details-modal";
import { useToast } from "@/components/ui/use-toast";

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

interface ClientListProps {
  userId: string;
}

export function ClientList({ userId }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const response = await fetch(`/api/clients?userId=${userId}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClient() {
    setSelectedClient(null);
    setIsDialogOpen(true);
  }

  function handleEditClient(client: Client) {
    setSelectedClient(client);
    setIsDialogOpen(true);
  }

  function handleViewClient(client: Client) {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  }

  async function handleDeleteClient(id: string) {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      await fetchClients();
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button onClick={handleAddClient}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <ClientTable
        clients={clients}
        onView={handleViewClient}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />

      <ClientDialog
        client={selectedClient}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={fetchClients}
      />

      <ClientDetailsModal
        client={selectedClient}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
    </div>
  );
}