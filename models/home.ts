import mongoose from 'mongoose';

const homeSchema = new mongoose.Schema({
  heroSection: {
    title: String,
    subtitle: String,
    description: String,
    buttonText: String,
    buttonLink: String,
  },
  featuresSection: {
    title: String,
    subtitle: String,
    features: [{
      icon: String,
      title: String,
      description: String,
    }],
  },
  pricingSection: {
    title: String,
    subtitle: String,
    plans: [{
      name: String,
      price: String,
      description: String,
      features: [String],
      buttonText: String,
      popular: Boolean,
    }],
  },
  testimonialsSection: {
    title: String,
    subtitle: String,
    testimonials: [{
      name: String,
      role: String,
      content: String,
      image: String,
    }],
  },
  faqSection: {
    title: String,
    subtitle: String,
    faqs: [{
      question: String,
      answer: String,
    }],
  },
  ctaSection: {
    title: String,
    subtitle: String,
    buttonText: String,
    features: [String],
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Home = mongoose.models.Home || mongoose.model('Home', homeSchema);