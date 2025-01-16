"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfo } from "./personal-info";
import { SecuritySettings } from "./security-settings";
import { SubscriptionInfo } from "./subscription-info";
import { PreferencesSettings } from "./preferences-settings";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatName } from "@/lib/utils";

interface ProfileSettingsProps {
  user: any;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const { firstName, lastName } = formatName(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.image);

  return (
    <div className="container mx-auto py-20 max-w-[960px]">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Card>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-4 h-auto gap-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="p-4">
            <PersonalInfo user={user} onAvatarUpdate={setAvatarUrl} />
          </TabsContent>

          <TabsContent value="security" className="p-4">
            <SecuritySettings userId={user._id} />
          </TabsContent>

          <TabsContent value="subscription" className="p-4">
            <SubscriptionInfo user={user} />
          </TabsContent>

          <TabsContent value="preferences" className="p-4">
            <PreferencesSettings userId={user._id} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}