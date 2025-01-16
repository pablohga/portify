import { Logo } from "@/components/brand/logo";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center py-40">
      <Link href={'/'} className="justify-center">
        <Logo 
        alterIcon="https://mundonews.pt/portify/logo_nova_txt_g_dark.png"
        alterH={80}
        alterW={120}/>
        
      
      </Link>
      { children }
    </section>
  )
}