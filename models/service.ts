import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  value: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    description: String,
  }],
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);