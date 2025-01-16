import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Service } from "@/models/service";
import { Client } from "@/models/client";
import { authOptions } from "@/lib/auth-options";
import { format } from "date-fns";

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

    await dbConnect();

    // Build query filters
    const filters: any = { userId: session.user.id };
    if (startDate) filters.startDate = { $gte: new Date(startDate) };
    if (endDate) filters.endDate = { $lte: new Date(endDate) };
    if (clientId) filters.clientId = clientId;

    const services = await Service.find(filters);
    const clients = await Client.find({ userId: session.user.id });

    // Calculate total revenue and costs
    const totalRevenue = services.reduce((sum, service) => sum + service.value, 0);
    const totalCosts = totalRevenue * 0.3; // Mock costs as 30% of revenue
    const operatingCosts = totalRevenue * 0.2; // Mock operating costs as 20% of revenue
    const taxes = totalRevenue * 0.15; // Mock taxes as 15% of revenue

    // Calculate margins
    const profitMargin = ((totalRevenue - totalCosts) / totalRevenue) * 100;
    const operatingMargin = ((totalRevenue - totalCosts - operatingCosts) / totalRevenue) * 100;
    const netMargin = ((totalRevenue - totalCosts - operatingCosts - taxes) / totalRevenue) * 100;

    // Calculate service margins
    const serviceMargins = services.reduce((acc: any[], service) => {
      const existingService = acc.find(s => s.name === service.title);
      if (existingService) {
        existingService.revenue += service.value;
        existingService.cost += service.value * 0.3;
      } else {
        acc.push({
          name: service.title,
          revenue: service.value,
          cost: service.value * 0.3,
          margin: 70, // Mock margin as 70%
        });
      }
      return acc;
    }, []);

    // Calculate client profitability
    const clientProfitability = clients.map(client => {
      const clientServices = services.filter(s => s.clientId === client._id.toString());
      const revenue = clientServices.reduce((sum, service) => sum + service.value, 0);
      const profit = revenue * 0.7; // Mock profit as 70% of revenue
      return {
        name: client.name,
        value: profit,
      };
    });

    // Calculate monthly margins
    const monthlyData = services.reduce((acc: any, service) => {
      const month = format(new Date(service.endDate || service.startDate), 'MMM yyyy');
      if (!acc[month]) {
        acc[month] = { revenue: 0, costs: 0, operatingCosts: 0, taxes: 0 };
      }
      acc[month].revenue += service.value;
      acc[month].costs += service.value * 0.3;
      acc[month].operatingCosts += service.value * 0.2;
      acc[month].taxes += service.value * 0.15;
      return acc;
    }, {});

    const monthlyMargins = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      grossMargin: ((data.revenue - data.costs) / data.revenue) * 100,
      operatingMargin: ((data.revenue - data.costs - data.operatingCosts) / data.revenue) * 100,
      netMargin: ((data.revenue - data.costs - data.operatingCosts - data.taxes) / data.revenue) * 100,
    }));

    return NextResponse.json({
      profitMargin,
      operatingMargin,
      netMargin,
      serviceMargins,
      clientProfitability,
      monthlyMargins,
    });
  } catch (error) {
    console.error('Profitability report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate profitability report' },
      { status: 500 }
    );
  }
}
