import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: 'Folder' },
  order: { type: Number, default: 0 },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);