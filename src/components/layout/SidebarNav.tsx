"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  FolderOpen, 
  Stethoscope, 
  Clipboard, 
  Users, 
  BarChart 
} from "lucide-react";

interface SidebarNavProps {
  role: string;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

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

  const filteredMenuItens = useMemo(() => {
    return menuItens.filter((item) => {
      if (role === "doctor") {
        return item.href === "/dashboard/meus-atendimentos" || item.href === "/dashboard";
      }
      if (role === "receptionist") {
        return item.href !== "/dashboard/configuracoes" && item.href !== "/dashboard/meus-atendimentos";
      }
      if (role === "admin") {
        return item.href !== "/dashboard/meus-atendimentos";
      }
      return false;
    });
  }, [role, menuItens]);

  return (
    <nav className="flex-1 px-4 py-6 space-y-1">
      {filteredMenuItens.map((item, idx) => {
        const Icon = item.icon;
        // Verifica se o pathname é igual ao href ou se inicia com ele (para subrotas)
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={idx}
            href={item.href}
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
  );
}
