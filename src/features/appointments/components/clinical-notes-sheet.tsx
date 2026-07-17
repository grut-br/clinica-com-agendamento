"use client";

import React, { useEffect, useActionState } from "react";
import { X, Save, Clipboard, User, Clock, FileText, Sparkles } from "lucide-react";
import { saveClinicalNoteAction } from "../actions";
import { Button } from "@/components/ui/button";

interface AppointmentItem {
  id: string;
  notes: string | null;
  clinical_notes: string | null;
  patient: {
    name: string;
    phone: string;
    birth_date: string | null;
  };
  slot: {
    date: string;
    start_time: string;
    end_time: string;
  } | null;
  specialty: {
    name: string;
  };
}

interface ClinicalNotesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentItem | null;
}

export function ClinicalNotesSheet({ isOpen, onClose, appointment }: ClinicalNotesSheetProps) {
  // Inicialização do estado de validação de envio do formulário (React 19 useActionState)
  const [state, formAction, isPending] = useActionState(saveClinicalNoteAction, {
    success: false,
    message: ""
  });

  // Fecha o slide-out caso a action retorne sucesso
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state, onClose]);

  if (!isOpen || !appointment) return null;

  // Formatação amigável da data de nascimento para calcular idade
  const getAge = (birthDateStr: string | null) => {
    if (!birthDateStr) return "";
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  const age = getAge(appointment.patient.birth_date);

  // Formatação de data e hora do slot
  const formatDateTime = (slot: AppointmentItem["slot"]) => {
    if (!slot) return "";
    const [year, month, day] = slot.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;
    const timeFormatted = slot.start_time.substring(0, 5);
    return `${dateFormatted} às ${timeFormatted}h`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      
      {/* Overlay Escuro com Desfoque */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" 
        onClick={onClose} 
      />

      {/* Slide-out Panel (Sheet que desliza da direita) */}
      <div className="relative w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-primary animate-in slide-in-from-right duration-350 z-10">
        
        {/* Cabeçalho do Prontuário */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-secondary" />
            Evolução Clínica / Prontuário
          </h3>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-primary hover:bg-slate-100 shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Corpo do Prontuário */}
        <form action={formAction} className="flex-1 flex flex-col justify-between overflow-hidden">
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            {/* ID do agendamento oculto */}
            <input type="hidden" name="appointmentId" value={appointment.id} />

            {/* Informações Básicas do Paciente */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-150/70 space-y-3">
              
              {/* Nome & Idade */}
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-secondary shrink-0" />
                <div className="font-extrabold text-primary text-base">
                  {appointment.patient.name}
                  {age && <span className="text-zinc-400 font-medium text-xs ml-1.5">({age})</span>}
                </div>
              </div>

              {/* Data/Horário & Especialidade */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-semibold text-zinc-455 border-t border-slate-150 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-secondary shrink-0" />
                  <span>{formatDateTime(appointment.slot)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clipboard className="h-4 w-4 text-secondary shrink-0" />
                  <span>{appointment.specialty.name}</span>
                </div>
              </div>
            </div>

            {/* Histórico e Notas de Triagem da Recepção (Se houver) */}
            {appointment.notes && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-455 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" />
                  Notas de Triagem (Recepção)
                </label>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150 text-xs font-medium text-slate-600 leading-relaxed">
                  {appointment.notes}
                </div>
              </div>
            )}

            {/* Evolução Clínica (Textarea Principal) */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                Evolução Clínica do Paciente
              </label>
              <textarea
                name="clinicalNotes"
                required
                defaultValue={appointment.clinical_notes || ""}
                placeholder="Descreva aqui o histórico do paciente, sintomas relatados, diagnósticos prováveis, receitas prescritas ou recomendações clínicas..."
                className="w-full flex-1 min-h-[250px] p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-medium resize-none placeholder:text-zinc-400 placeholder:font-light leading-relaxed"
              />
            </div>

            {/* Mensagem de Feedback de Erro */}
            {state.message && !state.success && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-700">
                {state.message}
              </div>
            )}
          </div>

          {/* Rodapé do Form */}
          <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-end gap-3 shrink-0">
            <Button
              variant="outline"
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
              {isPending ? "Gravando..." : "Salvar Prontuário"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
