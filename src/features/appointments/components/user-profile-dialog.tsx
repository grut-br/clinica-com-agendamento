"use client";

import React, { useActionState, useEffect, useState } from "react";
import { X, Save, Shield, Stethoscope, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateUserProfileRoleAction } from "../actions";

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

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileItem;
  professionals: ProfessionalItem[];
}

export function UserProfileDialog({ isOpen, onClose, profile, professionals }: UserProfileDialogProps) {
  // Hook useActionState para execução da Server Action do formulário
  const [state, formAction, isPending] = useActionState(updateUserProfileRoleAction, {
    success: false,
    message: "",
  });

  // Inicializa o estado diretamente a partir das props (sem useEffect de sincronização de props)
  const [role, setRole] = useState<"admin" | "receptionist" | "doctor" | "pending">(profile.role);
  const [professionalId, setProfessionalId] = useState<string>(profile.professional_id || "");

  // Fecha o modal em caso de sucesso
  useEffect(() => {
    if (state.success && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.success, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Card do Modal */}
      <div className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden text-card-foreground animate-in zoom-in-95 duration-200 z-10 flex flex-col justify-between">
        
        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" />
            Configurar Privilégios RBAC
          </h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form action={formAction} className="flex-grow flex flex-col justify-between">
          <div className="p-6 space-y-5">
            {/* ID oculto */}
            <input type="hidden" name="profileId" value={profile.id} />

            {/* Email do Usuário (Somente Leitura) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">E-mail de Acesso</span>
              <div className="px-4 py-3 rounded-xl bg-muted/40 border border-border text-sm font-semibold text-muted-foreground">
                {profile.email || "E-mail não registrado"}
              </div>
            </div>

            {/* Select Role */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">
                Papel Administrativo
              </label>
              <select
                id="role"
                name="role"
                disabled={isPending}
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "receptionist" | "doctor" | "pending")}
                className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer font-semibold"
              >
                <option value="pending" className="bg-card text-foreground">Acesso Pendente</option>
                <option value="receptionist" className="bg-card text-foreground">Recepcionista</option>
                <option value="doctor" className="bg-card text-foreground">Médico / Corpo Clínico</option>
                <option value="admin" className="bg-card text-foreground">Administrador</option>
              </select>
            </div>

            {/* Select Professional (Apenas se for Doctor) */}
            {role === "doctor" && (
              <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                <label htmlFor="professionalId" className="text-2xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-secondary" />
                  Médico Associado
                </label>
                <select
                  id="professionalId"
                  name="professionalId"
                  disabled={isPending}
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer font-semibold"
                  required
                >
                  <option value="">-- Vincular Médico --</option>
                  {professionals.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mensagem de Feedback de Erro ou Sucesso */}
            {state.message && (
              state.success ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>{state.message}</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5 text-xs font-semibold text-rose-700">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                  <span>{state.message}</span>
                </div>
              )
            )}
          </div>

          {/* Rodapé */}
          <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
