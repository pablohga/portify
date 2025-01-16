export interface Service {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  value: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  startDate?: string;
  endDate?: string;
  paymentHistory?: {
    amount: number;
    date: Date;
    description: string;
  }[];
}