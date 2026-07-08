"use client";

import React, { useEffect, useActionState } from "react";
import { X, Save, Layers, FileText, Tag, FlaskConical, DollarSign } from "lucide-react";
import { upsertExamAction } from "../cms-actions";

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

  const categories = ["Análises Clínicas e Laboratoriais", "Exames de Imagem e Cardiológicos"];

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
          {exam && <input type="hidden" name="id" value={exam.id} />}

          {/* Nome do Exame */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Nome do Exame
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={exam?.name || ""}
              placeholder="Ex: Hemograma Completo, Ultrassonografia..."
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
              defaultValue={exam?.slug || ""}
              placeholder="Ex: hemograma-completo (gerado do nome se vazio)"
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold placeholder:text-muted-foreground placeholder:font-light"
            />
          </div>

          {/* Categoria & Preço */}
          <div className="grid grid-cols-2 gap-4">
            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                Categoria
              </label>
              <select
                name="category"
                defaultValue={exam?.category || "Análises Clínicas e Laboratoriais"}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold bg-muted/50 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Valor Particular */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Preço Particular (R$)
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                defaultValue={exam?.price || 0}
                className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold"
              />
            </div>
          </div>

          {/* Requer Agendamento (Custom Toggle/Checkbox) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30 border border-border select-none">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Exige Agendamento</span>
              <span className="text-2xs text-muted-foreground font-light mt-0.5">
                Marque se o exame precisa reservar horário específico.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="requires_scheduling"
                defaultChecked={exam?.requires_scheduling ?? true}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted-foreground/30 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/10 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-muted/50 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Descrição do Exame */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Instruções / Descrição
            </label>
            <textarea
              name="description"
              rows={3}
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
