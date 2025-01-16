import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Service } from "@/models/service";
import { Client } from "@/models/client";
import { authOptions } from "@/lib/auth-options";
import { startOfMonth, endOfMonth, format } from "date-fns";

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    await dbConnect();

    // Build query filters
    const filters: any = { userId: session.user.id };
    if (startDate) filters.startDate = { $gte: new Date(startDate) };
    if (endDate) filters.endDate = { $lte: new Date(endDate) };
    if (clientId && clientId !== 'all') filters.clientId = clientId;
    if (status && status !== 'all') filters.status = status;

    // Get all services within the date range
    const services = await Service.find(filters);
    const clients = await Client.find({ userId: session.user.id });

    // Calculate total received and pending
    const totalReceived = services
      .filter(service => service.paymentStatus === 'paid')
      .reduce((sum, service) => sum + service.value, 0);

    const totalPending = services
      .filter(service => service.paymentStatus !== 'paid')
      .reduce((sum, service) => sum + service.value, 0);

    // Calculate monthly revenue
    const monthlyRevenue = services
      .filter(service => service.status === 'completed')
      .reduce((acc: any[], service) => {
        const month = format(new Date(service.endDate || service.startDate), 'MMM yyyy');
        const existingMonth = acc.find(m => m.month === month);
        if (existingMonth) {
          existingMonth.revenue += service.value;
        } else {
          acc.push({ /* <boltAction type="file" filePath="app/api/reports/financial/route.ts"> */
            month,
            revenue: service.value
          });
        }
        return acc;
      }, [])
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Get pending payments with client details
    const pendingPayments = await Promise.all(
      services
        .filter(service => service.paymentStatus !== 'paid')
        .map(async service => {
          const client = clients.find(c => c._id.toString() === service.clientId);
          return {
            clientName: client?.name || 'Unknown Client',
            amount: service.value,
            dueDate: service.endDate || service.startDate,
          };
        })
    );

    return NextResponse.json({
      totalReceived,
      totalPending,
      monthlyRevenue,
      pendingPayments,
    });
  } catch (error) {
    console.error('Financial report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate financial report' },
      { status: 500 }
    );
  }
}