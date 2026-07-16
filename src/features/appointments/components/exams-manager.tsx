"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Layers, FlaskConical } from "lucide-react";
import { toggleExamStatusAction } from "../cms-actions";
import { ExamFormDialog } from "./exam-form-dialog";

import { TableToolbar } from "@/components/ui/table-toolbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCreateNew = () => {
    setSelectedExam(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (exam: ExamItem) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined || price === 0) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(price);
  };

  const filteredExams = exams.filter(exam => 
    exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TableToolbar
        placeholder="Pesquisar exames..."
        onSearch={setSearchQuery}
        actions={
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="h-4.5 w-4.5" />
            Novo Exame
          </Button>
        }
      />

      <div className={`bg-surface border border-border rounded-[var(--component-card-radius)] shadow-sm overflow-hidden text-foreground transition-opacity duration-300 ${isPending ? "opacity-60" : "opacity-100"}`}>
        {filteredExams.length === 0 ? (
          <EmptyState
            title="Nenhum exame encontrado"
            description={searchQuery ? "Tente buscar por outro termo." : "Cadastre o primeiro exame laboratorial para popular a página pública do Ultralab."}
            icon={<FlaskConical className="h-10 w-10" />}
            action={
              !searchQuery && (
                <Button variant="outline" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4" /> Cadastrar Exame
                </Button>
              )
            }
          />
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
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-foreground text-sm">
                        {exam.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        /{exam.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <Badge className="gap-1 bg-surface border border-border font-medium text-muted-foreground">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        {exam.category || "Análises Clínicas"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4.5 font-bold text-foreground">
                      {formatPrice(exam.price)}
                    </td>

                    <td className="px-6 py-4.5">
                      <StatusBadge 
                        label={exam.requires_scheduling ? "Requer Agendamento" : "Ordem de Chegada"} 
                        tone={exam.requires_scheduling ? "warning" : "success"} 
                      />
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={exam.is_active}
                          onCheckedChange={() => handleToggleActive(exam.id, exam.is_active)}
                          disabled={isPending}
                          aria-label="Alternar exibição no site"
                        />
                        <StatusBadge 
                          label={exam.is_active ? "Ativo" : "Inativo"} 
                          tone={exam.is_active ? "success" : "neutral"} 
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(exam)} title="Editar Exame">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ExamFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        exam={selectedExam}
      />
    </div>
  );
}
