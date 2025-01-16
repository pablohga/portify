import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/user-management";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <UserManagement />;
}