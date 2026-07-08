"use client";

import React, { useEffect, useActionState } from "react";
import { X, Save, Layers, FileText, Tag, Stethoscope, Award } from "lucide-react";
import { upsertProfessionalAction } from "../professionals-actions";

interface SpecialtyItem {
  id: string;
  name: string;
  category?: string;
}

interface ProfessionalItem {
  id: string;
  name: string;
  slug: string;
  registration_number: string | null;
  bio: string | null;
  specialty_id: string;
}

interface ProfessionalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professional?: ProfessionalItem | null; // Se fornecido, entra em modo Edição
  specialties: SpecialtyItem[];
}

export function ProfessionalFormDialog({ 
  isOpen, 
  onClose, 
  professional, 
  specialties 
}: ProfessionalFormDialogProps) {
  // Inicialização do estado de validação de envio do formulário (React 19 useActionState)
  const [state, formAction, isPending] = useActionState(upsertProfessionalAction, {
    success: false,
    message: ""
  });

  // Fecha o modal e limpa o formulário caso a action retorne sucesso
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Overlay Escuro com Desfoque */}
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Caixa de Diálogo do Modal */}
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl overflow-hidden text-card-foreground animate-in fade-in zoom-in-95 duration-200 z-10">
        
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
          <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-secondary animate-pulse" />
            {professional ? "Editar Profissional" : "Novo Profissional"}
          </h3>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário com Server Action */}
        <form action={formAction} className="p-6 space-y-4.5">
          
          {/* ID oculto em caso de edição */}
          {professional && <input type="hidden" name="id" value={professional.id} />}

          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Nome Completo do Profissional
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={professional?.name || ""}
              placeholder="Ex: Dr. Carlos Eduardo, Dra. Marina Costa..."
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold placeholder:text-muted-foreground placeholder:font-light"
            />
          </div>

          {/* Slug Personalizado (Opcional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Slug da URL (Opcional)
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={professional?.slug || ""}
              placeholder="Ex: dr-carlos-eduardo (gerado do nome se vazio)"
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold placeholder:text-muted-foreground placeholder:font-light"
            />
          </div>

          {/* Registro do Conselho & Especialidade */}
          <div className="grid grid-cols-2 gap-4">
            {/* Registro (CRM/CRO) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                Nº de Registro (CRM/CRO)
              </label>
              <input
                type="text"
                name="registration_number"
                required
                defaultValue={professional?.registration_number || ""}
                placeholder="Ex: CRM/MA 12345"
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold placeholder:text-muted-foreground placeholder:font-light"
              />
            </div>

            {/* Especialidade Principal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Especialidade
              </label>
              <select
                name="specialty_id"
                defaultValue={professional?.specialty_id || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold bg-muted/50 cursor-pointer"
              >
                <option value="" disabled>Selecione...</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name} ({spec.category || "Geral"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Biografia do Médico */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Minibiografia / Experiência
            </label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={professional?.bio || ""}
              placeholder="Texto biográfico exibido na página de agendamento e detalhes..."
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium resize-none placeholder:text-muted-foreground placeholder:font-light"
            />
          </div>

          {/* Mensagem de Feedback de Erro */}
          {state.message && !state.success && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-700">
              {state.message}
            </div>
          )}

          {/* Rodapé e Ações */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
