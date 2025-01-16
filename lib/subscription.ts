import { Category } from "@/models/category";
import { Project } from "@/models/project";
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from "@/types/subscription";

export async function checkSubscriptionLimits(userId: string, subscriptionTier: SubscriptionTier) {
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];
  
  // When creating a new category, only check category limit
  const categoryCount = await Category.countDocuments({ userId });
  if (categoryCount >= limits.maxCategories) {
    throw new Error(`You have reached the maximum number of categories (${limits.maxCategories}) for your subscription tier.`);
  }
}

export async function checkProjectLimits(userId: string, categoryId: string, subscriptionTier: SubscriptionTier) {
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];

  // When creating a new project, check project limit for the specific category
  const projectCount = await Project.countDocuments({ 
    userId, 
    category: categoryId 
  });
  
  if (projectCount >= limits.maxProjectsPerCategory) {
    throw new Error(`You have reached the maximum number of projects (${limits.maxProjectsPerCategory}) for this category.`);
  }
}