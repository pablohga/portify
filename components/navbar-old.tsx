"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useToast } from "@/components/ui/use-toast";
import { formatName } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  const { data: session } = useSession();
  const [isPortfolioPage, setIsPortfolioPage] = useState(false);
  const { firstName, lastName } = formatName(session?.user?.name);
  const { toast } = useToast();

  // Detectar se a página é de portfólio com base no título
  useEffect(() => {
    
    const checkPortfolioPage = () => {
      if (document?.title?.includes(" - Portfolio")) {
        setIsPortfolioPage(true);
      } else {
        setIsPortfolioPage(false);
      }
    };

    // Executar a verificação inicial
    checkPortfolioPage();

    // Opcional: Adiciona um listener para mudanças no título da página
    const observer = new MutationObserver(() => checkPortfolioPage());
    observer.observe(document.querySelector("title") as Node, { childList: true });

    // Limpar observador ao desmontar
    return () => observer.disconnect();
  }, []);

  const VisitorNavbar = () => (
    <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold">Portify</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Home
          </Link>
          <Link href="/about" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Sobre o Criador
          </Link>
          <Link href="/projects" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Projetos
          </Link>
          <ModeToggle />
          <Link href="/register" className="text-primary font-bold hover:underline">
            Criar Meu Portfólio
          </Link>
        </div>
      </div>
    </nav>
  );

  const AuthenticatedNavbarPort = () => (
    <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold">Portify</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Home
          </Link>
          <Link href="/about" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Sobre
          </Link>
          <Link href="/projects" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Projetos
          </Link>
          <Link href="/dashboard" className="text-primary font-bold hover:underline">
          Editar portifolio
          </Link>
          <ModeToggle />
          <div className="text-sm font-bold">
                {firstName} <span className="text-primary">{lastName}</span>
          </div>
          <Button variant="ghost" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );

  const GuestNavbar = () => (
    <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold">Portify</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Home
          </Link>
          <Link href="/features" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Recursos
          </Link>
          <Link href="/pricing" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Preços
          </Link>
          <Link href="/support" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Ajuda
          </Link>
          <ModeToggle />
          <Link href="/auth/signin" className="text-primary font-bold hover:underline">
            Entrar
          </Link>
          <Link href="/register" className="text-primary font-bold hover:underline">
            Registrar-se
          </Link>
        </div>
      </div>
    </nav>
  );

  const AuthenticatedNavbar = () => (
    <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold">Portify</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Dashboard
          </Link>
          <Link href={`/portfolio/${session?.user?.slug}`} className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Meu Portfólio
          </Link>
          <Link href="/settings" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Configurações
          </Link>
          <Link href="/support" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
            Ajuda
          </Link>
          <ModeToggle />
          <div className="text-sm font-bold">
                {firstName} <span className="text-primary">{lastName}</span>
          </div>
          <Button variant="ghost" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );

  // Determinar qual navbar exibir

  // no portifolio e nao logado
  if (isPortfolioPage && !session?.user) {
    /* console.log('-{ VisitorNavbar?.user }-', session?.user ) */
    return <VisitorNavbar />;
  }
  // logado e no Portifolio
  if (isPortfolioPage) {
    return <AuthenticatedNavbarPort />;
  }
  // logado
  if (session?.user) {
    return <AuthenticatedNavbar />;
  }
  // nao logado
  return <GuestNavbar />;
}


  