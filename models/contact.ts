import mongoose from 'mongoose';

const contactSettingsSchema = new mongoose.Schema({
  emailTo: { type: String, required: true },
  emailService: { type: String, required: true }, // 'resend' or 'smtp'
  smtpSettings: {
    host: String,
    port: Number,
    secure: Boolean,
    auth: {
      user: String,
      pass: String,
    },
  },
  resendApiKey: String,
  imageUrl: { type: String },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ContactSettings = mongoose.models.ContactSettings || mongoose.model('ContactSettings', contactSettingsSchema);