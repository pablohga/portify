"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Star } from "lucide-react";
import { About } from "@/types/about";

interface AboutSectionProps {
  userId?: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Code2: <Code2 className="h-10 w-10" />,
  Palette: <Palette className="h-10 w-10" />,
  Rocket: <Rocket className="h-10 w-10" />,
  Star: <Star className="h-10 w-10" />,
};

export function AboutSection({ userId }: AboutSectionProps) {
  const [about, setAbout] = useState<About | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const url = userId ? `/api/about?userId=${userId}` : "/api/about";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setAbout(data);
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    }

    fetchAbout();
  }, [userId]);

  if (!about) return null;

  return (
    <section id="about" className="py-20 bg-background/50">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-center text-4xl font-bold mb-4">{about.title}</h2>
          <div 
            className="text-muted-foreground max-w-2xl mx-auto prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: about.description }}
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {about.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg bg-card hover:shadow-lg hover:shadow-[#5221e6]/10 transition-shadow duration-300"
            >
              <div className="mb-4 inline-block p-4 rounded-full bg-[#5221e6]/10 text-[#5221e6]">
                {iconMap[feature.icon] || <Star className="h-10 w-10" />}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <div 
                className="text-muted-foreground prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}