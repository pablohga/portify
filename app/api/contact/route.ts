import { NextResponse } from "next/server";
import { ContactSettings } from "@/models/contact";
import dbConnect from "@/lib/db";
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    await dbConnect();
    const settings = await ContactSettings.findOne(userId ? { userId } : {}).sort({ createdAt: -1 });

    if (!settings) {
      return NextResponse.json(
        { error: "Contact settings not configured" },
        { status: 500 }
      );
    }

    const data = await request.json();
    const { name, email, message } = data;
    const emailContent = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;

    if (settings.emailService === 'resend' && settings.resendApiKey) {
      const resend = new Resend(settings.resendApiKey);
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: settings.emailTo,
        subject: `New Contact Form Submission from ${name}`,
        text: emailContent,
      });
    } else if (settings.emailService === 'smtp' && settings.smtpSettings) {
      const transporter = nodemailer.createTransport(settings.smtpSettings);
      await transporter.sendMail({
        from: settings.smtpSettings.auth.user,
        to: settings.emailTo,
        subject: `New Contact Form Submission from ${name}`,
        text: emailContent,
      });
    } else {
      throw new Error('Invalid email service configuration');
    }

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}