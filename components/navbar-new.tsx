"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isPortfolioPage = pathname.startsWith("/portfolio");

  // Navbar para visitantes em portfólios
  const VisitorNavbar = () => (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900">
      <Link href="/" className="text-lg font-bold text-primary">
        Portify
      </Link>
      <div className="flex gap-4">
        <Link href="/" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Home
        </Link>
        <Link href="/about" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Sobre o Criador
        </Link>
        <Link href="/projects" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Projetos
        </Link>
        <Link href="/register" className="text-primary font-bold hover:underline">
          Criar Meu Portfólio
        </Link>
      </div>
    </nav>
  );

  // Navbar para usuários não logados
  const GuestNavbar = () => (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900">
      <Link href="/" className="text-lg font-bold text-primary">
        Portify
      </Link>
      <div className="flex gap-4">
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
        <Link href="/auth/signin" className="text-primary font-bold hover:underline">
          Entrar
        </Link>
        <Link href="/register" className="text-primary font-bold hover:underline">
          Registrar-se
        </Link>
      </div>
    </nav>
  );

  // Navbar para usuários logados
  const AuthenticatedNavbar = () => (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-900">
      <Link href="/" className="text-lg font-bold text-primary">
        Portify
      </Link>
      <div className="flex gap-4">
        <Link href="/dashboard" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Dashboard
        </Link>
        <Link href={`/portfolio/${session?.user.slug}`} className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Meu Portfólio
        </Link>
        <Link href="/settings" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Configurações
        </Link>
        <Link href="/support" className="px-2 text-gray-700 dark:text-gray-300 hover:underline">
          Ajuda
        </Link>
        <Button variant="ghost" onClick={() => signOut()}>
          Sair
        </Button>
      </div>
    </nav>
  );

  // Determinar qual navbar exibir
  if (isPortfolioPage) {
    return <VisitorNavbar />;
  }

  if (session?.user) {
    return <AuthenticatedNavbar />;
  }

  return <GuestNavbar />;
}
