"use client";

import React, { useState } from "react";
import { Edit2, User, Stethoscope, UserPlus, Shield } from "lucide-react";
import { UserProfileDialog } from "./user-profile-dialog";
import { CreateUserDialog } from "./create-user-dialog";

interface ProfileItem {
  id: string;
  email: string | null;
  role: "admin" | "receptionist" | "doctor" | "pending";
  professional_id: string | null;
  professional?: {
    id: string;
    name: string;
  } | null;
}

interface ProfessionalItem {
  id: string;
  name: string;
}

interface UsersManagerProps {
  profiles: ProfileItem[];
  professionals: ProfessionalItem[];
}

export function UsersManager({ profiles, professionals }: UsersManagerProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const handleEditClick = (profile: ProfileItem) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProfile(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Sub-Header com Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-secondary" />
          Usuários Registrados
        </h3>
        
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-sm"
          title="Cadastrar Novo Usuário Administrativo/Médico"
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          Novo Usuário
        </button>
      </div>

      {/* Tabela de Usuários */}
      <div className="w-full bg-card border border-border rounded-3xl shadow-xs overflow-hidden text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-2xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4.5">Usuário / E-mail</th>
                <th className="px-6 py-4.5">Função (RBAC)</th>
                <th className="px-6 py-4.5">Vínculo Médico</th>
                <th className="px-6 py-4.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm font-semibold text-foreground">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-light">
                    Nenhum usuário cadastrado no sistema.
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-muted/30 transition-colors">
                    
                    {/* Usuário / E-mail */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-extrabold text-foreground truncate max-w-xs" title={profile.email || ""}>
                          {profile.email || "Sem e-mail"}
                        </span>
                      </div>
                    </td>

                    {/* Função */}
                    <td className="px-6 py-5">
                      {profile.role === "admin" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                          Administrador
                        </span>
                      )}
                      {profile.role === "receptionist" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                          Recepcionista
                        </span>
                      )}
                      {profile.role === "doctor" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          Médico
                        </span>
                      )}
                      {profile.role === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-700 animate-pulse">
                          Acesso Pendente
                        </span>
                      )}
                    </td>

                    {/* Vínculo Médico */}
                    <td className="px-6 py-5 text-muted-foreground font-medium">
                      {profile.role === "doctor" && profile.professional ? (
                        <div className="flex items-center gap-1.5 text-foreground font-bold">
                          <Stethoscope className="h-4 w-4 text-secondary shrink-0" />
                          {profile.professional.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleEditClick(profile)}
                        className="inline-flex items-center justify-center gap-1 h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                        title="Editar Permissões do Usuário"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Editar
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição (Remontagem dinâmica usando key baseada no ID do perfil selecionado) */}
      {selectedProfile && (
        <UserProfileDialog
          key={selectedProfile.id}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          profile={selectedProfile}
          professionals={professionals}
        />
      )}

      {/* Modal de Cadastro de Novo Usuário Interno */}
      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        professionals={professionals}
      />
    </div>
  );
}
