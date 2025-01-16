"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";
import { formatName } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const [isPortfolioPage, setIsPortfolioPage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar o menu
  const { firstName, lastName } = session?.user?.name
  ? session.user.name.split(" ").reduce<{ firstName: string; lastName: string }>(
      (acc, name, idx) =>
        idx === 0
          ? { ...acc, firstName: name }
          : { ...acc, lastName: acc.lastName ? acc.lastName + " " + name : name },
      { firstName: "", lastName: "" }
    )
  : { firstName: "", lastName: "" };

  // Detectar se a página é de portfólio com base no título
  useEffect(() => {
    const checkPortfolioPage = () => {
      if (document?.title?.includes(" - Portfolio")) {
        setIsPortfolioPage(true);
      } else {
        setIsPortfolioPage(false);
      }
    };

    checkPortfolioPage();

    const observer = new MutationObserver(() => checkPortfolioPage());
    observer.observe(document.querySelector("title") as Node, { childList: true });

    return () => observer.disconnect();
  }, []);

  // Função para alternar o menu hambúrguer
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderLinks = (links: { label: string; href: string }[]) =>
    links.map(({ label, href }) => (
      <Link
        key={href}
        href={href}
        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar em um link
      >
        {label}
      </Link>
    ));

  const AuthenticatedNavbarPort = () => {
    const links = [
      { label: "Home", href: "/" },
      { label: "Sobre", href: "/about" },
      { label: "Projetos", href: "/projects" },
      { label: "Editar Portfólio", href: "/dashboard" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>

          {/* Botão Hamburguer */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-2 text-gray-700 dark:text-gray-300 hover:underline"
              >
                {label}
              </Link>
            ))}
            
            <ModeToggle/>
            <div className="text-sm font-bold">
              {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              Sair
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
            <Button
              variant="secondary"
              className="w-full text-left py-2"
              onClick={() => signOut()}
            >
              Sair
            </Button>
          </div>
        )}
      </nav>
    );
  };

  const AuthenticatedNavbar = () => {
    const links = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Meu Portfólio", href: `/${session?.user?.slug}` },
      { label: "Configurações", href: "/settings" },
      { label: "Ajuda", href: "/support" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>
          {/*  */}
          {/* Botão Hamburguer */}
          
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            
            {/* <Button variant="ghost" onClick={() => signOut()}>
              Sair
            </Button> */}
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-2 text-gray-700 dark:text-gray-300 hover:underline"
              >
                {label}
              </Link>
            ))}
            
            <ModeToggle />
            <div className="text-sm font-bold">
              {firstName} <span className="text-primary">{lastName}</span>
            </div>
            <Button variant="ghost" onClick={() => signOut()}>
              Sair
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
            <Button
              variant="ghost"
              className="w-full text-left py-2"
              onClick={() => signOut()}
            >
              Sair
            </Button>
          </div>
        )}
      </nav>
    );
  };

  const VisitorNavbarPortifolio = () => {
    const links = [
      { label: "Home", href: "/" },
      { label: "Sobre o Criador", href: "/about" },
      { label: "Projetos", href: "/projects" },
      { label: "Criar Meu Portfólio", href: "/auth/register" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>

          {/* Botão Hamburguer */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center">
            {renderLinks(links)}
            <ModeToggle />
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
          </div>
        )}
      </nav>
    );
  };

  const VisitorNavbar = () => {
    const links = [
      { label: "Home", href: "/" },
      { label: "Recursos", href: "/#features" },
      { label: "Preços", href: "/#pricing" },
      { label: "Ajuda", href: "/support" },
      { label: "Entrar", href: "/auth/signin" },
      { label: "Registrar-se", href: "/auth/register" },
    ];

    return (
      <nav className="fixed w-full z-50 top-0 px-4 py-3 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold">Portify</span>
          </div>

          {/* Botão Hamburguer */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center">
            {renderLinks(links)}
            <ModeToggle />
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-background/90 backdrop-blur-sm border-t px-4 py-2">
            {renderLinks(links)}
          </div>
        )}
      </nav>
    );
  };
// Determinar qual navbar exibir

  // no portifolio e nao logado
  if (isPortfolioPage && !session?.user) {
    console.log('esta no ortifoio')
    if(!session?.user){
      console.log('no portifolio e nao logado', session?.user )
    return <VisitorNavbarPortifolio />;
    } else {
      console.log('logado e no Portifolio', session?.user )
    return <AuthenticatedNavbarPort />;
    }
    
  }
  // logado e no Portifolio
  /* if (isPortfolioPage) {
    console.log('logado e no Portifolio', session?.user )
    return <AuthenticatedNavbarPort />;
  } */
  // logado
  if (session?.user) {
    /* console.log('logado', session?.user ) */
    return <AuthenticatedNavbar />;
  } else {
    // nao logado
  /* console.log('nao logado', session?.user ) */
  return <VisitorNavbar />;
  }
  
}


