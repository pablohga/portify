import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { DashboardContent } from "@/components/dashboard-content";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = await getCurrentUser();

  if (!session) {
    redirect("/auth/signin");
  }

  return <DashboardContent userId={user?._id.toString()} />;
}