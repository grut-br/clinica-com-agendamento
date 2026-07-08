"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Clock, Layers, Smile } from "lucide-react";
import { toggleSpecialtyStatusAction } from "../cms-actions";
import { SpecialtyFormDialog } from "./specialty-form-dialog";

interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string;
  duration_minutes: number;
  is_active: boolean;
}

interface SpecialtiesManagerProps {
  specialties: SpecialtyItem[];
}

export function SpecialtiesManager({ specialties }: SpecialtiesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Executa a alteração de status reativamente
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleSpecialtyStatusAction(id, currentStatus);
      } catch (error) {
        alert("Ocorreu um erro ao atualizar o status.");
        console.error(error);
      }
    });
  };

  // Abre o modal em modo de Criação
  const handleCreateNew = () => {
    setSelectedSpecialty(null);
    setIsDialogOpen(true);
  };

  // Abre o modal em modo de Edição
  const handleEdit = (specialty: SpecialtyItem) => {
    setSelectedSpecialty(specialty);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Ações Superior */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">Gestão de Especialidades</h3>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Cadastre novas áreas médicas ou gerencie a exibição e status de atendimento do catálogo.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent/90 py-2.5 px-4 text-xs sm:text-sm font-extrabold text-accent-foreground shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Nova Especialidade
        </button>
      </div>

      {/* Tabela de Especialidades */}
      <div className={`bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-opacity ${
        isPending ? "opacity-60" : "opacity-100"
      }`}>
        {specialties.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Smile className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-base font-bold text-primary">Nenhuma especialidade cadastrada</h3>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Cadastre sua primeira especialidade para popular o site e o painel de agenda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 select-none">
                  <th className="px-6 py-4">Nome / Slug</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Duração</th>
                  <th className="px-6 py-4">Exibir no Site</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {specialties.map((spec) => (
                  <tr key={spec.id} className="hover:bg-muted/30 transition-colors">
                    
                    {/* Nome & Slug */}
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        {spec.name}
                      </div>
                      <div className="text-2xs text-muted-foreground font-semibold mt-1">
                        URL: /especialidades/{spec.slug}
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1 text-foreground font-bold">
                        <Layers className="h-3.5 w-3.5 text-secondary shrink-0" />
                        {spec.category || "Geral"}
                      </span>
                    </td>

                    {/* Duração da Consulta */}
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                        <Clock className="h-4 w-4 text-secondary shrink-0" />
                        {spec.duration_minutes} min
                      </span>
                    </td>

                    {/* Exibir no Site (Custom Switch Toggle) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(spec.id, spec.is_active)}
                          disabled={isPending}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                            spec.is_active ? "bg-emerald-500" : "bg-muted"
                          }`}
                          title={spec.is_active ? "Desativar Especialidade" : "Ativar Especialidade"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              spec.is_active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-2xs font-semibold text-muted-foreground select-none">
                          {spec.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </td>

                    {/* Ações (Editar) */}
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleEdit(spec)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Editar Especialidade"
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
      <SpecialtyFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        specialty={selectedSpecialty}
      />

    </div>
  );
}
