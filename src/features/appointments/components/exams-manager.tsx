"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Layers, FlaskConical } from "lucide-react";
import { toggleExamStatusAction } from "../cms-actions";
import { ExamFormDialog } from "./exam-form-dialog";

interface ExamItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string;
  price: number | null;
  requires_scheduling: boolean;
  is_active: boolean;
}

interface ExamsManagerProps {
  exams: ExamItem[];
}

export function ExamsManager({ exams }: ExamsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Executa a alteração de status reativamente
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleExamStatusAction(id, currentStatus);
      } catch (error) {
        alert("Ocorreu um erro ao atualizar o status.");
        console.error(error);
      }
    });
  };

  // Abre o modal em modo de Criação
  const handleCreateNew = () => {
    setSelectedExam(null);
    setIsDialogOpen(true);
  };

  // Abre o modal em modo de Edição
  const handleEdit = (exam: ExamItem) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  // Formata preço em BRL
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined || price === 0) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(price);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Ações Superior */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">Gestão de Exames (Ultralab)</h3>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Cadastre novos exames de imagem e laboratoriais ou gerencie preços e agendamentos.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent/90 py-2.5 px-4 text-xs sm:text-sm font-extrabold text-accent-foreground shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Novo Exame
        </button>
      </div>

      {/* Tabela de Exames */}
      <div className={`bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-opacity ${
        isPending ? "opacity-60" : "opacity-100"
      }`}>
        {exams.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-base font-bold text-primary">Nenhum exame cadastrado</h3>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Cadastre o primeiro exame laboratorial para popular a página pública do Ultralab.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 select-none">
                  <th className="px-6 py-4">Exame / Slug</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Agendamento</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-muted/30 transition-colors">
                    
                    {/* Nome & Slug */}
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-foreground text-sm">
                        {exam.name}
                      </div>
                      <div className="text-2xs text-muted-foreground font-semibold mt-1">
                        URL: /exames/{exam.slug}
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1 text-foreground font-bold">
                        <Layers className="h-3.5 w-3.5 text-secondary shrink-0" />
                        {exam.category || "Análises Clínicas"}
                      </span>
                    </td>

                    {/* Preço Particular */}
                    <td className="px-6 py-4.5 font-bold text-foreground">
                      {formatPrice(exam.price)}
                    </td>

                    {/* Agendamento Necessário */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold ${
                        exam.requires_scheduling 
                          ? "bg-amber-50 text-amber-700 border border-amber-200/50" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                      }`}>
                        {exam.requires_scheduling ? "Requer Agendamento" : "Ordem de Chegada"}
                      </span>
                    </td>

                    {/* Status (Switch Toggle) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(exam.id, exam.is_active)}
                          disabled={isPending}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                            exam.is_active ? "bg-emerald-500" : "bg-muted"
                          }`}
                          title={exam.is_active ? "Desativar Exame" : "Ativar Exame"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              exam.is_active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-2xs font-semibold text-muted-foreground select-none">
                          {exam.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Editar Exame"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Form */}
      <ExamFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        exam={selectedExam}
      />

    </div>
  );
}
