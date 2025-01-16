import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  }],
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const About = mongoose.models.About || mongoose.model('About', aboutSchema);