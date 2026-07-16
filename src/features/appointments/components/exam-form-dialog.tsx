"use client";

import React, { useEffect, useActionState } from "react";
import { X, Save, Layers, FileText, Tag, FlaskConical, DollarSign } from "lucide-react";
import { upsertExamAction } from "../cms-actions";
import { Button } from "@/components/ui/button";

interface ExamItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string;
  price: number | null;
  requires_scheduling: boolean;
}

interface ExamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: ExamItem | null; // Se fornecido, entra em modo Edição
}

export function ExamFormDialog({ isOpen, onClose, exam }: ExamFormDialogProps) {
  // Inicialização do estado de validação de envio do formulário (React 19 useActionState)
  const [state, formAction, isPending] = useActionState(upsertExamAction, {
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
            <FlaskConical className="h-5 w-5 text-secondary animate-pulse" />
            {exam ? "Editar Exame" : "Novo Exame"}
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

        {/* Formulário com Server Action */}
        <form action={formAction} className="p-6 space-y-4.5">
          
          {/* ID oculto em caso de edição */}
          {exam && <input type="hidden" name="id" value={exam.id} />}

          {/* Nome do Exame */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Nome do Exame
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isPending}
              defaultValue={exam?.name || ""}
              placeholder="Ex: Hemograma Completo"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 font-medium"
            />
          </div>

          {/* Categoria do Exame */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              Categoria / Grupo
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              disabled={isPending}
              defaultValue={exam?.category || ""}
              placeholder="Ex: Análises Clínicas, Imagem, Cardiologia..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 font-medium"
            />
          </div>

          {/* Grid Duplo: Preço e Tipo de Agendamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Preço (Estimado) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Valor (R$)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                disabled={isPending}
                defaultValue={exam?.price !== null && exam?.price !== undefined ? exam.price : ""}
                placeholder="Ex: 150.00"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 font-semibold"
              />
            </div>

            {/* Tipo de Agendamento */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Fluxo de Agendamento
              </label>
              <select
                id="requiresScheduling"
                name="requiresScheduling"
                required
                disabled={isPending}
                defaultValue={exam?.requires_scheduling ? "true" : "false"}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 cursor-pointer font-semibold"
              >
                <option value="true">Requer Agendamento (Hora Marcada)</option>
                <option value="false">Ordem de Chegada (Sem Hora)</option>
              </select>
            </div>

          </div>

          {/* Descrição do Exame */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Instruções / Preparo
            </label>
            <textarea
              id="description"
              name="description"
              disabled={isPending}
              defaultValue={exam?.description || ""}
              placeholder="Ex: Hemograma para contagem total de plaquetas e glóbulos..."
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
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              <Save className="h-4 w-4" />
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
