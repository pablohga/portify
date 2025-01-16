import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientManagement } from "@/components/client-management";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <ClientManagement userId={user._id.toString()} />;
}