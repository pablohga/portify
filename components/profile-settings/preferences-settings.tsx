"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface PreferencesSettingsProps {
  userId: string;
}

export function PreferencesSettings({ userId }: PreferencesSettingsProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    paymentReminders: false,
    reportAlerts: false,
    revenueThreshold: 1000,
  });

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await fetch("/api/notifications/settings");
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPreferences();
  }, []);

  async function handlePreferenceChange(key: string, value: boolean | number) {
    try {
      const response = await fetch("/api/notifications/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...preferences, [key]: value }),
      });

      if (!response.ok) throw new Error();

      setPreferences(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Success",
        description: "Preferences updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Preferences</h2>
        <p className="text-muted-foreground">
          Customize your experience and notification settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Dark Mode</Label>
            <Switch
              id="theme"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch
              id="emailNotifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="paymentReminders">Payment Reminders</Label>
            <Switch
              id="paymentReminders"
              checked={preferences.paymentReminders}
              onCheckedChange={(checked) => handlePreferenceChange("paymentReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reportAlerts">Report Alerts</Label>
            <Switch
              id="reportAlerts"
              checked={preferences.reportAlerts}
              onCheckedChange={(checked) => handlePreferenceChange("reportAlerts", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueThreshold">Revenue Threshold Alert</Label>
            <Input
              id="revenueThreshold"
              type="number"
              value={preferences.revenueThreshold}
              onChange={(e) => handlePreferenceChange("revenueThreshold", parseInt(e.target.value))}
              min="0"
              step="100"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}