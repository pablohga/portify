export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSection {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
}

export interface PricingSection {
  title: string;
  subtitle: string;
  plans: Plan[];
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface TestimonialsSection {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}

export interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
  features: string[];
}

export interface HomeData {
  _id?: string;
  heroSection?: HeroSection;
  featuresSection?: FeaturesSection;
  pricingSection?: PricingSection;
  testimonialsSection?: TestimonialsSection;
  faqSection?: FAQSection;
  ctaSection?: CTASection;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}