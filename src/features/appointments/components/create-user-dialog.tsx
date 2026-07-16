"use client";

import React, { useActionState, useEffect, useState } from "react";
import { X, Save, UserPlus, Stethoscope, AlertCircle, CheckCircle2, Key, Mail, Shield } from "lucide-react";
import { createInternalUserAction } from "../actions";
import { Button } from "@/components/ui/button";

interface ProfessionalItem {
  id: string;
  name: string;
}

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: ProfessionalItem[];
}

export function CreateUserDialog({ isOpen, onClose, professionals }: CreateUserDialogProps) {
  // Hook useActionState do React 19 para a Server Action de criação
  const [state, formAction, isPending] = useActionState(createInternalUserAction, {
    success: false,
    message: "",
  });

  const [role, setRole] = useState<"admin" | "receptionist" | "doctor" | "pending">("receptionist");
  const [professionalId, setProfessionalId] = useState<string>("");

  // Limpa o formulário e fecha após sucesso
  useEffect(() => {
    if (state.success && isOpen) {
      const timer = setTimeout(() => {
        onClose();
        setRole("receptionist");
        setProfessionalId("");
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
            <UserPlus className="h-5 w-5 text-secondary" />
            Cadastrar Novo Usuário
          </h3>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Formulário */}
        <form action={formAction} className="flex-grow flex flex-col justify-between">
          <div className="p-6 space-y-5">
            
            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-2xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="Ex: joao.silva@medodonto.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-2xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-muted-foreground" />
                Senha de Acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
              />
            </div>

            {/* Nível de Acesso (RBAC) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-2xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                Papel / Permissão
              </label>
              <select
                id="role"
                name="role"
                required
                disabled={isPending}
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "receptionist" | "doctor" | "pending")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 cursor-pointer"
              >
                <option value="receptionist">Recepcionista / Recepção</option>
                <option value="doctor">Corpo Clínico / Médico</option>
                <option value="admin">Administrador Geral</option>
              </select>
            </div>

            {/* Vínculo Clínico (Apenas se role for doctor) */}
            {role === "doctor" && (
              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <label htmlFor="professionalId" className="text-2xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                  Profissional Clínico Vinculado
                </label>
                <select
                  id="professionalId"
                  name="professionalId"
                  required
                  disabled={isPending}
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Selecione um profissional do corpo clínico...</option>
                  {professionals.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Associe esta conta de acesso a um cadastro de médico/dentista no sistema.
                </span>
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
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
            >
              <Save className="h-4 w-4" />
              {isPending ? "Cadastrando..." : "Cadastrar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
