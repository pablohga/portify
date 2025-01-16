"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact-form";
import Image from "next/image";

interface ContactSectionProps {
  userId?: string;
}

interface ContactImage {
  imageUrl: string;
}

export function ContactSection({ userId }: ContactSectionProps) {
  const [contactImage, setContactImage] = useState<ContactImage | null>(null);

  useEffect(() => {
    async function fetchContactImage() {
      try {
        const url = userId ? `/api/contact/image?userId=${userId}` : "/api/contact/image";
        const response = await fetch(url);
        const data = await response.json();
        if (data._id) {
          setContactImage(data);
        }
      } catch (error) {
        console.error("Failed to fetch contact image:", error);
      }
    }

    fetchContactImage();
  }, [userId]);

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container px-4 mx-auto max-w-[960px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Entre em contato</h2>
          <p className="text-muted-foreground">Vamos trabalhar juntos</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <Image
              src={contactImage?.imageUrl || "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
              alt="Contact"
              className="object-cover w-full h-full"
              width={450}
              height={450}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ContactForm userId={userId} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}