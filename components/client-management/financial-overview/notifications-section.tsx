import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, DollarSign, FileText, Mail, Settings, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContactSettingsDialog } from "@/components/contact-settings-dialog";
import { useToast } from "@/components/ui/use-toast";

interface NotificationsSectionProps {
  userId: string;
}

interface Notification {
  _id: string;
  type: 'payment' | 'report' | 'threshold';
  title: string;
  message: string;
  status: 'urgent' | 'info' | 'success';
  createdAt: string;
  metadata?: {
    amount?: number;
    dueDate?: string;
    clientId?: string;
    reportId?: string;
    thresholdAmount?: number;
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  paymentReminders: boolean;
  reportAlerts: boolean;
  revenueThreshold: number;
}

export function NotificationsSection({ userId }: NotificationsSectionProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: false,
    paymentReminders: false,
    reportAlerts: false,
    revenueThreshold: 1000,
  });
  const [isContactSettingsOpen, setIsContactSettingsOpen] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, []);

  async function fetchNotifications() {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error();
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    }
  }

  async function fetchSettings() {
    try {
      const response = await fetch('/api/notifications/settings');
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notification settings",
        variant: "destructive",
      });
    }
  }

  async function updateSettings(newSettings: Partial<NotificationSettings>) {
    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, ...newSettings }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setSettings(data);

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  }

  async function sendTestEmail(type: string) {
    try {
      setIsSendingTest(type);
      const response = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Test email sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setIsContactSettingsOpen(true)}
          className="w-full"
        >
          <Settings className="mr-2 h-4 w-4" />
          Configure Email Service
        </Button>
        <p className="text-sm text-muted-foreground">
          More information about email configuration, visit:{" "}
          <a 
            href="https://resend.com/docs/send-with-smtp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            https://resend.com/docs/send-with-smtp
          </a>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    updateSettings({ emailNotifications: checked })
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestEmail('general')}
                  disabled={isSendingTest === 'general'}
                >
                  {isSendingTest === 'general' ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming payments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.paymentReminders}
                  onCheckedChange={(checked) => 
                    updateSettings({ paymentReminders: checked })
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestEmail('payment')}
                  disabled={isSendingTest === 'payment'}
                >
                  {isSendingTest === 'payment' ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Report Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for new reports
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.reportAlerts}
                  onCheckedChange={(checked) => 
                    updateSettings({ reportAlerts: checked })
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestEmail('report')}
                  disabled={isSendingTest === 'report'}
                >
                  {isSendingTest === 'report' ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Test
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Revenue Threshold Alert</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when revenue exceeds this amount
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendTestEmail('threshold')}
                  disabled={isSendingTest === 'threshold'}
                >
                  {isSendingTest === 'threshold' ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Test
                    </>
                  )}
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={settings.revenueThreshold}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      updateSettings({ revenueThreshold: value });
                    }
                  }}
                  placeholder="Enter amount"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start gap-4 p-3 rounded-lg border"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    {notification.type === "payment" && (
                      <DollarSign className="h-4 w-4 text-primary" />
                    )}
                    {notification.type === "report" && (
                      <FileText className="h-4 w-4 text-primary" />
                    )}
                    {notification.type === "threshold" && (
                      <Bell className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <Badge
                        variant={
                          notification.status === "urgent"
                            ? "destructive"
                            : notification.status === "success"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No notifications yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ContactSettingsDialog
        userId={userId}
        open={isContactSettingsOpen}
        onOpenChange={setIsContactSettingsOpen}
        onSubmit={async (data) => {
          setIsContactSettingsOpen(false);
        }}
      />
    </div>
  );
}