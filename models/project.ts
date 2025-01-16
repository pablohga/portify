import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  tech: [{ type: String }],
  category: { type: String, required: true },
  userId: { type: String, required: true },
  liveUrl: { type: String },
  githubUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);