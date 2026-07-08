import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/features/appointments/queries";
import { UpdatePasswordForm } from "@/features/appointments/components/update-password-form";
import { User, Shield, Key, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Meu Perfil | Med Odonto",
  description: "Gerencie seus dados de acesso e altere sua senha no painel.",
};

// Desabilita cache estático para manter os dados atualizados em tempo real
export const revalidate = 0;

export default async function MeuPerfilPage() {
  // Busca o perfil de controle de acesso (RBAC) no servidor
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }



  return (
    <div className="space-y-8 min-h-[80vh] transition-colors duration-300">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Meu Perfil de Acesso
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-light">
          Visualize suas permissões administrativas e atualize suas credenciais de segurança.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Card 1: Informações Cadastrais */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 shadow-xs transition-colors duration-300">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <User className="h-5.5 w-5.5 text-secondary" />
            Dados Cadastrais
          </h3>

          {/* Email */}
          <div className="space-y-1.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-450 dark:text-zinc-500 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              E-mail de Login
            </span>
            <p className="text-sm font-semibold text-foreground bg-muted/30 border border-border px-4 py-3 rounded-2xl truncate">
              {profile.email || "Sem e-mail cadastrado"}
            </p>
          </div>

          {/* Cargo */}
          <div className="space-y-1.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-455 dark:text-zinc-500 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-zinc-400" />
              Nível de Permissão (RBAC)
            </span>
            <div className="flex items-center">
              {profile.role === "admin" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-300 px-3.5 py-1 text-sm font-bold">
                  Administrador
                </span>
              )}
              {profile.role === "receptionist" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300 px-3.5 py-1 text-sm font-bold">
                  Recepção / Recepcionista
                </span>
              )}
              {profile.role === "doctor" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 px-3.5 py-1 text-sm font-bold">
                  Corpo Clínico / Médico
                </span>
              )}
              {profile.role === "pending" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300 px-3.5 py-1 text-sm font-bold">
                  Aguardando Aprovação (Pendente)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Alteração de Senha */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 shadow-xs transition-colors duration-300">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <Key className="h-5.5 w-5.5 text-secondary" />
            Atualizar Senha
          </h3>
          <UpdatePasswordForm />
        </div>

      </div>

    </div>
  );
}
