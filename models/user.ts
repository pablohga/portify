import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  //slug: { type: String, required: true, unique: true },  Adicionado campo slug
  slug: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z0-9-]+$/, // Garantir que apenas letras minúsculas, números e hífens sejam usados
  },
  image: String,
  emailVerified: Date,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  subscriptionTier: { type: String, enum: ["free", "paid", "premium"], default: "free" },
  resetToken: String,
  resetTokenExpiry: Date,
  // Campos de configurações de notificações
  emailNotifications: { type: Boolean, default: false },
  paymentReminders: { type: Boolean, default: false },
  reportAlerts: { type: Boolean, default: false },
  revenueThreshold: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para validar e normalizar o slug antes de salvar
userSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    if (!this.slug) {
      const baseSlug = this.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      if (!baseSlug) {
        return next(new Error("Nome inválido para gerar o slug."));
      }

      let uniqueSlug = baseSlug;
      let count = 1;

      // Garante que o slug seja único
      while (await mongoose.models.User.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${count}`;
        count++;
      }

      this.slug = uniqueSlug;
    }
  }
  next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
