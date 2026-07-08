import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAllProfiles, getAllProfessionals, getUserProfile } from "@/features/appointments/queries";
import { UsersManager } from "@/features/appointments/components/users-manager";
import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Gerenciamento de Usuários | Med Odonto",
  description: "Controle de acessos administrativos, recepcionistas e profissionais clínicos no painel.",
};

// Desabilita cache estático para dados de tempo real
export const revalidate = 0;

export default async function UsuariosDashboardPage() {
  // 1. Verifica privilégios do usuário logado no servidor (Segurança robusta)
  const myProfile = await getUserProfile();

  if (myProfile?.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 animate-pulse border border-rose-500/20">
          <ShieldAlert className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Acesso Negado</h2>
        <p className="mt-2 text-muted-foreground text-sm font-light max-w-sm leading-relaxed">
          Você não possui privilégios de Administrador para gerenciar permissões e usuários do sistema.
        </p>
      </div>
    );
  }

  // 2. Busca de dados paralela no servidor
  const [profiles, professionals] = await Promise.all([
    getAllProfiles(),
    getAllProfessionals()
  ]);

  return (
    <div className="space-y-8 min-h-[80vh]">
      
      {/* Cabeçalho do Módulo de Usuários */}
      <PageHeader 
        title="Controle de Usuários & Acessos"
        description="Gerencie permissões RBAC, eleve recepcionistas a administradores ou crie contas de acesso internas."
      />

      {/* Tabela Gerenciadora */}
      <div className="space-y-6">
        <UsersManager profiles={profiles} professionals={professionals} />
      </div>

    </div>
  );
}
