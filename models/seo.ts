import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: [{ type: String }],
  ogImage: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const SEO = mongoose.models.SEO || mongoose.model('SEO', seoSchema);