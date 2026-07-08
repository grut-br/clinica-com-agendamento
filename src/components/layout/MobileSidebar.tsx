"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  Smile, 
  LogOut, 
  User,
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart, 
  Calendar, 
  FolderOpen, 
  Stethoscope, 
  Clipboard
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { logoutAction } from "@/features/auth/actions";

interface MobileSidebarProps {
  role: string;
}

export function MobileSidebar({ role }: MobileSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Declaração interna dos itens do menu para evitar a passagem de referências de funções pelo servidor
  const menuItens = useMemo(() => [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Gerenciar Agenda", href: "/dashboard/agenda", icon: Calendar },
    { label: "Catálogo", href: "/dashboard/catalogo", icon: FolderOpen },
    { label: "Corpo Clínico", href: "/dashboard/profissionais", icon: Stethoscope },
    { label: "Meus Atendimentos", href: "/dashboard/meus-atendimentos", icon: Clipboard },
    { label: "Usuários", href: "/dashboard/usuarios", icon: Users },
    { label: "Relatórios", href: "/dashboard/relatorios", icon: BarChart },
    { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
  ], []);

  // Filtro idêntico ao do servidor baseado no RBAC
  const filteredMenuItens = useMemo(() => {
    return menuItens.filter((item) => {
      // 1. Médicos (doctor) visualizam apenas a agenda pessoal de atendimentos
      if (role === "doctor") {
        return item.href === "/dashboard/meus-atendimentos";
      }

      // 2. Recepcionistas (receptionist) visualizam Dashboard, Agenda, Catálogo e Configurações
      if (role === "receptionist") {
        return (
          item.href === "/dashboard" || 
          item.href === "/dashboard/agenda" ||
          item.href === "/dashboard/catalogo" ||
          item.href === "/dashboard/configuracoes"
        );
      }

      // 3. Administradores (admin) possuem visão irrestrita de todas as seções
      if (role === "admin") {
        return true;
      }

      // Contas pendentes não visualizam abas principais
      return false;
    });
  }, [role, menuItens]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          
          {/* Overlay de fundo com desfoque e fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-out Panel (Drawer que desliza da esquerda) */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-xs h-full bg-primary dark:bg-card border-r border-border text-primary-foreground dark:text-card-foreground flex flex-col justify-between shadow-2xl z-10"
          >
            
            {/* Header da Sidebar Mobile */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Smile className="h-6 w-6 text-secondary animate-pulse" />
                <span className="font-bold text-primary-foreground dark:text-foreground tracking-wider text-sm">MED ODONTO</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar menu"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-primary-foreground/70 dark:text-muted-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted hover:text-primary-foreground dark:hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
              {filteredMenuItens.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive 
                        ? "bg-primary-foreground/15 dark:bg-primary text-primary-foreground shadow-sm" 
                        : "text-primary-foreground/70 dark:text-muted-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted hover:text-primary-foreground dark:hover:text-foreground"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? "text-primary-foreground" : "text-primary-foreground/70 dark:text-muted-foreground/80"
                    }`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Rodapé / Meu Perfil & Sair */}
            <div className="p-4 border-t border-border space-y-1 shrink-0">
              {role !== "pending" && (
                <Link
                  href="/dashboard/perfil"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-primary-foreground/70 dark:text-muted-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted hover:text-primary-foreground dark:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mb-1.5"
                >
                  <User className="h-4.5 w-4.5 text-primary-foreground/70 dark:text-muted-foreground/80 shrink-0" />
                  Meu Perfil
                </Link>
              )}

              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all text-primary-foreground/70 dark:text-muted-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted hover:text-primary-foreground dark:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              >
                <LogOut className="h-3.5 w-3.5 text-primary-foreground/70 dark:text-muted-foreground/80 shrink-0" />
                Voltar para Home
              </Link>

              <form action={logoutAction}>
                <button
                  type="submit"
                  onClick={handleLinkClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-primary-foreground/70 dark:text-muted-foreground hover:bg-red-500/10 hover:text-red-100 dark:hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4 text-red-400 dark:text-red-500 shrink-0" />
                  Sair do Painel
                </button>
              </form>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
