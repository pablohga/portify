import { notFound } from "next/navigation";
import { User } from "@/models/user";
import { Project } from "@/models/project";
import dbConnect from "@/lib/db";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { SEO } from "@/models/seo";
import { Category } from "@/models/category";

interface UserPortfolioPageProps {
  params: {
    slug: string;
  };
}

async function getUser(slug: string) {
  await dbConnect();
  return User.findOne({ slug });
}

async function getUserSEO(userId: string) {
  return SEO.findOne({ userId }).sort({ createdAt: -1 });
}

async function getUserCategories(userId: string) {
  return Category.find({ userId }).sort({ order: 1 });
}

async function getUserProjects(userId: string) {
  return Project.find({ userId }).sort({ createdAt: -1 });
}

export async function generateMetadata({ params }: UserPortfolioPageProps) {
  const user = await getUser(params.slug);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  const seo = await getUserSEO(user._id.toString());

  return {
    title: `${seo?.title} - Portfolio` || `${user.name} - Portfolio`,
    description:
      seo?.description ||
      `${user.name}'s portfolio showcasing their projects and skills`,
    keywords: seo?.keywords || [],
    openGraph: {
      title: seo?.title || `${user.name} - Portfolio`,
      description:
        seo?.description ||
        `${user.name}'s portfolio showcasing their projects and skills`,
      images: [{ url: seo?.ogImage || "/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || `${user.name} - Portfolio`,
      description:
        seo?.description ||
        `${user.name}'s portfolio showcasing their projects and skills`,
      images: [seo?.ogImage || "/og-image.jpg"],
    },
  };
}

export default async function UserPortfolioPage({
  params,
}: UserPortfolioPageProps) {
  const user = await getUser(params.slug);

  if (!user) {
    return notFound();
  }

  const userId = user._id.toString();
  const [categories, projects] = await Promise.all([
    getUserCategories(userId),
    getUserProjects(userId),
  ]);

  // Convert Mongoose documents to plain objects and ensure proper typing
  const plainCategories = categories.map((cat) => ({
    ...cat.toObject(),
    _id: cat._id.toString(),
  }));

  const plainProjects = projects.map((proj) => ({
    ...proj.toObject(),
    _id: proj._id.toString(),
  }));

  return (
    <div className="min-h-screen bg-background">
      <HeroSection userId={userId} />
      <ProjectsSection
        userId={userId}
        initialCategories={plainCategories}
        initialProjects={plainProjects}
      />
      <AboutSection userId={userId} />
      <ContactSection userId={userId} />
    </div>
  );
}
