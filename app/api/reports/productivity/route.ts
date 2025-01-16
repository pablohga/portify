import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Service } from "@/models/service";
import { authOptions } from "@/lib/auth-options";
import { format, differenceInDays, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";
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

    const services = await Service.find(filters);

    // Calculate average completion time
    const completedServices = services.filter(s => s.status === 'completed' && s.endDate);
    const averageCompletionTime = Math.round(
      completedServices.reduce((sum, service) => 
        sum + differenceInDays(new Date(service.endDate!), new Date(service.startDate)), 0
      ) / completedServices.length
    );

    // Calculate average service value
    const averageServiceValue = services.reduce((sum, service) => 
      sum + service.value, 0
    ) / services.length;

    // Calculate services per month
    const months = eachMonthOfInterval({
      start: new Date(startDate || services[0]?.startDate || new Date()),
      end: new Date(endDate || new Date())
    });

    const monthlyMetrics = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthServices = services.filter(s => 
        new Date(s.startDate) >= monthStart &&
        new Date(s.startDate) <= monthEnd
      );
      
      const completedMonthServices = monthServices.filter(s => 
        s.status === 'completed' && s.endDate
      );

      const averageTime = completedMonthServices.length > 0
        ? Math.round(
            completedMonthServices.reduce((sum, service) => 
              sum + differenceInDays(new Date(service.endDate!), new Date(service.startDate)), 0
            ) / completedMonthServices.length
          )
        : 0;

      return {
        month: format(month, 'MMM yyyy'),
        completedServices: completedMonthServices.length,
        averageTime,
        revenue: monthServices.reduce((sum, service) => sum + service.value, 0),
      };
    });

    // Calculate performance metrics with change percentage
    const currentMonth = monthlyMetrics[monthlyMetrics.length - 1];
    const previousMonth = monthlyMetrics[monthlyMetrics.length - 2];

    const calculateChange = (current: number, previous: number) =>
      previous ? Math.round(((current - previous) / previous) * 100) : 0;

    const performanceMetrics = [
      {
        metric: "Completed Services",
        value: currentMonth?.completedServices || 0,
        change: calculateChange(
          currentMonth?.completedServices || 0,
          previousMonth?.completedServices || 0
        ),
      },
      {
        metric: "Average Completion Time",
        value: currentMonth?.averageTime || 0,
        change: calculateChange(
          currentMonth?.averageTime || 0,
          previousMonth?.averageTime || 0
        ),
      },
      {
        metric: "Monthly Revenue",
        value: currentMonth?.revenue || 0,
        change: calculateChange(
          currentMonth?.revenue || 0,
          previousMonth?.revenue || 0
        ),
      },
    ];

    return NextResponse.json({
      averageCompletionTime,
      averageServiceValue,
      servicesPerMonth: Math.round(services.length / months.length),
      revenuePerService: averageServiceValue,
      monthlyMetrics,
      performanceMetrics,
    });
  } catch (error) {
    console.error('Productivity report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate productivity report' },
      { status: 500 }
    );
  }
}