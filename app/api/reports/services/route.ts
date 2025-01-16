import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Service } from "@/models/service";
import { Client } from "@/models/client";
import { authOptions } from "@/lib/auth-options";
import { format, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";

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
    const type = searchParams.get('type');

    await dbConnect();

    // Build query filters
    const filters: any = { userId: session.user.id };
    if (startDate) filters.startDate = { $gte: new Date(startDate) };
    if (endDate) filters.endDate = { $lte: new Date(endDate) };
    if (clientId && clientId !== 'all') filters.clientId = clientId;
    if (status && status !== 'all') filters.status = status;
    if (type && type !== 'all') filters.type = type;

    // Get all services and clients
    const services = await Service.find(filters);
    const clients = await Client.find({ userId: session.user.id });

    // Calculate service counts
    const totalServices = services.length;
    const completedServices = services.filter(s => s.status === 'completed').length;
    const pendingServices = services.filter(s => s.status === 'pending').length;
    const cancelledServices = services.filter(s => s.status === 'cancelled').length;

    // Calculate service progress over time
    const months = eachMonthOfInterval({
      start: new Date(startDate || services[0]?.startDate || new Date()),
      end: new Date(endDate || new Date())
    });

    const serviceProgress = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      return {
        date: format(month, 'MMM yyyy'),
        completed: services.filter(s => 
          s.status === 'completed' && 
          new Date(s.endDate || s.startDate) >= monthStart &&
          new Date(s.endDate || s.startDate) <= monthEnd
        ).length,
        inProgress: services.filter(s => 
          s.status === 'in_progress' &&
          new Date(s.startDate) >= monthStart &&
          new Date(s.startDate) <= monthEnd
        ).length,
        pending: services.filter(s => 
          s.status === 'pending' &&
          new Date(s.startDate) >= monthStart &&
          new Date(s.startDate) <= monthEnd
        ).length,
      };
    });

    // Get detailed service information
    const serviceDetails = await Promise.all(
      services.map(async service => {
        const client = clients.find(c => c._id.toString() === service.clientId);
        return {
          title: service.title,
          client: client?.name || 'Unknown Client',
          status: service.status,
          value: service.value,
          startDate: service.startDate,
          endDate: service.endDate,
        };
      })
    );

    return NextResponse.json({
      totalServices,
      completedServices,
      pendingServices,
      cancelledServices,
      serviceProgress,
      serviceDetails,
    });
  } catch (error) {
    console.error('Services report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate services report' },
      { status: 500 }
    );
  }
}