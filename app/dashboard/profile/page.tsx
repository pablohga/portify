import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/components/profile-settings";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <ProfileSettings user={user} />;
}