import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: { type: String, required: false },
  subtitle: { type: String, required: false },
  backgroundImage: { type: String, required: true },
  backgroundImageId: String, // public_id da imagem no Cloudinary
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Hero = mongoose.models.Hero || mongoose.model('Hero', heroSchema);