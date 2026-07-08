import Link from "next/link";
import { 
  LogOut, 
  Smile, 
  User
} from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { getUserProfile } from "@/features/appointments/queries";
import { MobileSidebar } from "./MobileSidebar";
import { SidebarNav } from "./SidebarNav";

export async function Sidebar() {
  // Busca o perfil de controle de acesso (RBAC) no servidor
  const profile = await getUserProfile();
  const role = profile?.role || "pending";

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-full bg-primary dark:bg-card border-r border-border text-primary-foreground dark:text-card-foreground transition-colors duration-300">
        {/* Brand logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border shrink-0">
          <Smile className="h-6 w-6 text-secondary animate-pulse" />
          <span className="font-bold text-primary-foreground dark:text-foreground tracking-wider text-sm">MED ODONTO</span>
        </div>

        {/* Menu Navigation */}
        <SidebarNav role={role} />

        {/* Footer / Perfil & Sair */}
        <div className="p-4 border-t border-border space-y-1 shrink-0">
          {role !== "pending" && (
            <Link
              href="/dashboard/perfil"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-primary-foreground/70 dark:text-muted-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted hover:text-primary-foreground dark:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mb-1.5"
            >
              <User className="h-4.5 w-4.5 text-primary-foreground/70 dark:text-muted-foreground/80 shrink-0" />
              Meu Perfil
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all text-primary-foreground/70 dark:text-muted-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted hover:text-primary-foreground dark:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <LogOut className="h-3.5 w-3.5 text-primary-foreground/70 dark:text-muted-foreground/80 shrink-0" />
            Voltar para Home
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-primary-foreground/70 dark:text-muted-foreground hover:bg-red-500/10 hover:text-red-100 dark:hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer text-left"
            >
              <LogOut className="h-4 w-4 text-red-400 dark:text-red-500 shrink-0" />
              Sair do Painel
            </button>
          </form>
        </div>
      </aside>

      {/* Versão Mobile (Drawer deslizante controlado por eventos de cliente) */}
      <MobileSidebar role={role} />
    </>
  );
}
