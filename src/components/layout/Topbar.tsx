import { User, Bell } from "lucide-react";
import { getUserProfile } from "@/features/appointments/queries";
import { MobileMenuTrigger } from "./MobileMenuTrigger";
import { ThemeToggleClient } from "./theme-toggle-client";

export async function Topbar() {
  // Busca as informações do usuário atual direto da sessão
  const profile = await getUserProfile();

  const roleLabels: Record<string, string> = {
    admin: "Administrador",
    receptionist: "Recepção",
    doctor: "Corpo Clínico",
    pending: "Pendente",
  };

  const friendlyRole = profile?.role ? roleLabels[profile.role] : "Recepção";
  const userEmail = profile?.email || "usuario@medodonto.com.br";

  return (
    <header className="h-16 w-full border-b border-border bg-primary dark:bg-card px-6 flex items-center justify-between text-primary-foreground dark:text-card-foreground transition-colors duration-300">
      {/* Esquerda: Menu Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <MobileMenuTrigger />
        <span className="font-semibold text-primary-foreground dark:text-foreground hidden sm:inline-block">
          SaaS Dashboard
        </span>
      </div>

      {/* Direita: Alternador de Temas, Notificações & Perfil */}
      <div className="flex items-center gap-4">
        
        {/* Alternador de Temas */}
        <ThemeToggleClient />

        {/* Notificações */}
        <button
          type="button"
          aria-label="Notificações"
          className="p-2 rounded-full text-primary-foreground/70 dark:text-muted-foreground hover:text-primary-foreground dark:hover:text-foreground hover:bg-primary-foreground/10 dark:hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Separador */}
        <div className="h-5 w-[1px] bg-border" />

        {/* Perfil Usuário Dinâmico */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-primary-foreground dark:text-foreground">{friendlyRole}</p>
            <p className="text-[10px] text-primary-foreground/70 dark:text-muted-foreground">{userEmail}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary-foreground/10 dark:bg-primary/10 border border-primary-foreground/20 dark:border-primary/20 flex items-center justify-center text-primary-foreground dark:text-primary shrink-0">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
