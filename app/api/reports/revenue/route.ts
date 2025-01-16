import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Service } from "@/models/service";
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

    await dbConnect();

    // Build query filters
    const filters: any = { userId: session.user.id };
    if (startDate) filters.startDate = { $gte: new Date(startDate) };
    if (endDate) filters.endDate = { $lte: new Date(endDate) };
    if (clientId) filters.clientId = clientId;

    const services = await Service.find(filters);

    // Calculate monthly revenue and expenses
    const monthlyData = services.reduce((acc: any, service) => {
      const month = format(new Date(service.endDate || service.startDate), 'MMM yyyy');
      if (!acc[month]) {
        acc[month] = { revenue: 0, expenses: 0, profit: 0 };
      }
      acc[month].revenue += service.value;
      // Mock expenses calculation (30% of revenue)
      const expenses = service.value * 0.3;
      acc[month].expenses += expenses;
      acc[month].profit += service.value - expenses;
      return acc;
    }, {});

    const monthlyRevenue = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.profit,
    }));

    // Calculate totals
    const totalRevenue = services.reduce((sum, service) => sum + service.value, 0);
    const totalExpenses = totalRevenue * 0.3; // Mock expenses
    const totalProfit = totalRevenue - totalExpenses;

    // Calculate revenue by service type
    const revenueByService = services.reduce((acc: any[], service) => {
      const existingService = acc.find(s => s.name === service.title);
      if (existingService) {
        existingService.value += service.value;
      } else {
        acc.push({ name: service.title, value: service.value });
      }
      return acc;
    }, []);

    return NextResponse.json({
      monthlyRevenue,
      totalRevenue,
      totalExpenses,
      totalProfit,
      revenueByService,
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate revenue report' },
      { status: 500 }
    );
  }
}