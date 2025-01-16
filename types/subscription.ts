export type SubscriptionTier = 'free' | 'paid' | 'premium';

export interface SubscriptionLimits {
  maxCategories: number;
  maxProjectsPerCategory: number;
  hasCourseAccess: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    maxCategories: 3,
    maxProjectsPerCategory: 3,
    hasCourseAccess: false
  },
  paid: {
    maxCategories: Infinity,
    maxProjectsPerCategory: Infinity,
    hasCourseAccess: false
  },
  premium: {
    maxCategories: Infinity,
    maxProjectsPerCategory: Infinity,
    hasCourseAccess: true
  }
};