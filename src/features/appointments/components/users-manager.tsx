"use client";

import React, { useState } from "react";
import { Edit2, User, Stethoscope, UserPlus, Shield } from "lucide-react";
import { UserProfileDialog } from "./user-profile-dialog";
import { CreateUserDialog } from "./create-user-dialog";

import { TableToolbar } from "@/components/ui/table-toolbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge, StatusTone } from "@/components/ui/status-badge";

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
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditClick = (profile: ProfileItem) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProfile(null);
    setIsDialogOpen(false);
  };

  const getRoleBadge = (role: ProfileItem["role"]) => {
    switch (role) {
      case "admin": return { label: "Administrador", tone: "info" as StatusTone };
      case "receptionist": return { label: "Recepcionista", tone: "success" as StatusTone };
      case "doctor": return { label: "Médico", tone: "neutral" as StatusTone };
      case "pending": return { label: "Acesso Pendente", tone: "warning" as StatusTone };
      default: return { label: "Desconhecido", tone: "neutral" as StatusTone };
    }
  };

  const filteredProfiles = profiles.filter(profile => 
    (profile.email && profile.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (profile.professional?.name && profile.professional.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 w-full">
      <TableToolbar
        placeholder="Pesquisar por email ou médico..."
        onSearch={setSearchQuery}
        actions={
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            <UserPlus className="h-4.5 w-4.5" />
            Novo Usuário
          </Button>
        }
      />

      <div className="bg-surface border border-border rounded-[var(--component-card-radius)] shadow-sm overflow-hidden text-foreground">
        {filteredProfiles.length === 0 ? (
          <EmptyState
            title="Nenhum usuário encontrado"
            description={searchQuery ? "Tente buscar por outro termo." : "Nenhum usuário cadastrado no sistema."}
            icon={<Shield className="h-10 w-10" />}
            action={
              !searchQuery && (
                <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
                  <UserPlus className="h-4 w-4" /> Cadastrar Usuário
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                  <th className="px-6 py-4">Usuário / E-mail</th>
                  <th className="px-6 py-4">Função (RBAC)</th>
                  <th className="px-6 py-4">Vínculo Médico</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-foreground">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 border border-border">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-sm truncate max-w-[200px] sm:max-w-xs" title={profile.email || ""}>
                          {profile.email || "Sem e-mail"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <StatusBadge 
                        label={getRoleBadge(profile.role).label} 
                        tone={getRoleBadge(profile.role).tone} 
                      />
                    </td>

                    <td className="px-6 py-4.5">
                      {profile.role === "doctor" && profile.professional ? (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0" />
                          {profile.professional.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(profile)} title="Editar Permissões">
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden sm:inline-block ml-1">Editar</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedProfile && (
        <UserProfileDialog
          key={selectedProfile.id}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          profile={selectedProfile}
          professionals={professionals}
        />
      )}

      <CreateUserDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        professionals={professionals}
      />
    </div>
  );
}
