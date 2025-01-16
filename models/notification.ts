import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['payment', 'report', 'threshold'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['urgent', 'info', 'success'],
    required: true 
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  metadata: {
    amount: Number,
    dueDate: Date,
    clientId: String,
    reportId: String,
    thresholdAmount: Number
  }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);