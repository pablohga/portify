import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { ContactSettings } from "@/models/contact";
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dbConnect from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();

    await dbConnect();
    const settings = await ContactSettings.findOne({ userId: session.user.id }).sort({ createdAt: -1 });

    if (!settings) {
      return NextResponse.json(
        { error: "Contact settings not configured" },
        { status: 500 }
      );
    }

    let subject = "";
    let text = "";

    switch (type) {
      case 'general':
        subject = "Test Email Notification";
        text = "This is a test email to verify your email notification settings are working correctly.";
        break;
      case 'payment':
        subject = "Test Payment Reminder";
        text = "This is a test payment reminder notification. When enabled, you'll receive reminders about upcoming payments.";
        break;
      case 'report':
        subject = "Test Report Alert";
        text = "This is a test report alert notification. When enabled, you'll be notified when new reports are available.";
        break;
      case 'threshold':
        subject = "Test Revenue Threshold Alert";
        text = `This is a test revenue threshold alert. When enabled, you'll be notified when your revenue exceeds the set threshold of ${settings.revenueThreshold}.`;
        break;
      default:
        throw new Error('Invalid notification type');
    }

    if (settings.emailService === 'resend' && settings.resendApiKey) {
      const resend = new Resend(settings.resendApiKey);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: settings.emailTo,
        subject,
        text,
      });
    } else if (settings.emailService === 'smtp' && settings.smtpSettings) {
      const transporter = nodemailer.createTransport(settings.smtpSettings);
      await transporter.sendMail({
        from: settings.smtpSettings.auth.user,
        to: settings.emailTo,
        subject,
        text,
      });
    } else {
      throw new Error('Invalid email service configuration');
    }

    return NextResponse.json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}