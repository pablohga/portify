import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Service } from "@/models/service";
import { Client } from "@/models/client";
import { authOptions } from "@/lib/auth-options";

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
    const status = searchParams.get('status');

    await dbConnect();

    // Get all clients and their services
    const clients = await Client.find({ userId: session.user.id });
    const services = await Service.find({ userId: session.user.id });

    // Calculate active vs inactive clients (inactive = no services in last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const activeClients = clients.filter(client => {
      const lastService = services
        .filter(s => s.clientId === client._id.toString())
        .sort((a, b) => new Date(b.endDate || b.startDate).getTime() - new Date(a.endDate || a.startDate).getTime())[0];
      return lastService && new Date(lastService.endDate || lastService.startDate) > ninetyDaysAgo;
    }).length;

    // Calculate top clients by revenue and service count
    const topClients = await Promise.all(
      clients.map(async client => {
        const clientServices = services.filter(s => s.clientId === client._id.toString());
        const totalRevenue = clientServices.reduce((sum, service) => sum + service.value, 0);
        const lastService = clientServices.sort((a, b) => 
          new Date(b.endDate || b.startDate).getTime() - new Date(a.endDate || a.startDate).getTime()
        )[0];

        return {
          name: client.name,
          totalServices: clientServices.length,
          totalRevenue,
          lastServiceDate: lastService ? (lastService.endDate || lastService.startDate) : null,
        };
      })
    );

    // Sort top clients by revenue
    topClients.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate client activity distribution
    const clientActivity = [
      {
        name: "Very Active (>5 services)",
        value: clients.filter(client => 
          services.filter(s => s.clientId === client._id.toString()).length > 5
        ).length
      },
      {
        name: "Active (2-5 services)",
        value: clients.filter(client => {
          const serviceCount = services.filter(s => s.clientId === client._id.toString()).length;
          return serviceCount >= 2 && serviceCount <= 5;
        }).length
      },
      {
        name: "Occasional (1 service)",
        value: clients.filter(client => 
          services.filter(s => s.clientId === client._id.toString()).length === 1
        ).length
      }
    ];

    return NextResponse.json({
      activeClients,
      inactiveClients: clients.length - activeClients,
      topClients: topClients.slice(0, 10), // Return top 10 clients
      clientActivity,
    });
  } catch (error) {
    console.error('Clients report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate clients report' },
      { status: 500 }
    );
  }
}