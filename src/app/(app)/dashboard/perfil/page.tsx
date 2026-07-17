import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserProfile, getAllProfessionals } from "@/features/appointments/queries";
import { UpdatePasswordForm } from "@/features/appointments/components/update-password-form";
import { Shield, Key, Mail, Stethoscope, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProfilePreferences } from "@/features/appointments/components/profile-preferences";

export const metadata: Metadata = {
  title: "Meu Perfil | Med Odonto",
  description: "Gerencie seus dados de acesso, preferências e altere sua senha no painel.",
};

// Desabilita cache estático para manter os dados atualizados em tempo real
export const revalidate = 0;

export default async function MeuPerfilPage() {
  // 1. Busca o perfil de controle de acesso (RBAC) no servidor
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  // 2. Se o perfil possui um professional_id vinculado, buscamos seus dados clínicos usando a query helper
  let professional = null;
  if (profile.professional_id) {
    const professionalsList = await getAllProfessionals();
    const data = professionalsList.find((p) => p.id === profile.professional_id);

    if (data) {
      professional = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        registration_number: data.registration_number || "Não informado",
        bio: data.bio || "Nenhuma biografia cadastrada.",
        is_active: data.is_active,
        specialty: data.specialty
      };
    }
  }

  const displayName = professional ? professional.name : (profile.email ? profile.email.split("@")[0] : "Usuário");
  const userInitials = displayName;

  return (
    <div className="space-y-8 min-h-[80vh] transition-colors duration-300">
      
      {/* Cabeçalho unificado */}
      <PageHeader 
        eyebrow="Configurações de Conta"
        title="Meu Perfil de Acesso"
        description="Visualize suas credenciais de segurança, permissões clínicas e preferências do sistema."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Coluna 1 e 2: Dados Pessoais & Profissionais */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Principal: Perfil do Usuário */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border">
              <Avatar name={userInitials} size="lg" className="h-16 w-16 text-lg border-2 border-accent/20" />
              
              <div className="text-center sm:text-left space-y-1.5 flex-1">
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  {displayName}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {profile.email}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden sm:inline" />
                  <StatusBadge 
                    label={
                      profile.role === "admin" ? "Administrador" :
                      profile.role === "receptionist" ? "Recepcionista" :
                      profile.role === "doctor" ? "Corpo Clínico" : "Pendente"
                    }
                    tone={
                      profile.role === "admin" ? "success" :
                      profile.role === "receptionist" ? "info" :
                      profile.role === "doctor" ? "success" : "warning"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Nível de Permissão */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-secondary" />
                  Nível de Acesso (RBAC)
                </span>
                <p className="text-sm font-semibold text-foreground bg-muted/20 border border-border px-4 py-3 rounded-2xl">
                  {profile.role.toUpperCase()}
                </p>
              </div>

              {/* Contato Principal */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                  Contato Oficial
                </span>
                <p className="text-sm font-semibold text-foreground bg-muted/20 border border-border px-4 py-3 rounded-2xl truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Card Detalhado Clínico: Só aparece para profissionais (Corpo Clínico / Médico) */}
          {professional && (
            <Card className="p-6 sm:p-8 space-y-6 border-l-4 border-l-secondary">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                <Stethoscope className="h-5.5 w-5.5 text-secondary" />
                <h3 className="text-lg font-bold text-foreground">Registro Clínico</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Especialidade */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Especialidade Médica
                  </span>
                  <div className="flex items-center gap-2 bg-muted/20 border border-border px-4 py-3 rounded-2xl">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-sm font-semibold text-foreground">
                      {professional.specialty ? professional.specialty.name : "Geral"}
                    </p>
                  </div>
                </div>

                {/* CRM / CRO */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    CRM / CRO (Conselho)
                  </span>
                  <p className="text-sm font-semibold text-foreground bg-muted/20 border border-border px-4 py-3 rounded-2xl">
                    {professional.registration_number}
                  </p>
                </div>

              </div>

              {/* Bio / Descritivo Clínico */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-secondary" />
                  Descrição da Biografia Médica
                </span>
                <div className="p-4 bg-muted/20 border border-border rounded-2xl text-sm font-medium text-muted-foreground leading-relaxed">
                  {professional.bio}
                </div>
              </div>
            </Card>
          )}

        </div>

        {/* Coluna 3: Preferências & Segurança */}
        <div className="space-y-6">
          
          {/* Card 3: Preferências do Usuário (Design System Switches) */}
          <ProfilePreferences />

          {/* Card 4: Alteração de Senha */}
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-4">
              <Key className="h-5 w-5 text-secondary" />
              Segurança da Conta
            </h3>
            <UpdatePasswordForm />
          </Card>

        </div>

      </div>

    </div>
  );
}
