import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  whatsapp: { type: String },
  document: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  observation: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);