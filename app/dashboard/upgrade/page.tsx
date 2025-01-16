/* "use client"; */

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PlanSelection } from "@/components/plan-selection";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export default async function UpgradePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Upgrade Your Plan</h1>
        <PlanSelection 
          userEmail={user.email || ''}
          onSelectFreePlan={() => redirect("/dashboard")}
        />
      </div>
    </div>
  );
}