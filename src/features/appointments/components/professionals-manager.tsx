"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Layers, Smile, Award } from "lucide-react";
import { toggleProfessionalStatusAction } from "../professionals-actions";
import { ProfessionalFormDialog } from "./professional-form-dialog";

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
  is_active: boolean;
  specialty: {
    id: string;
    name: string;
    category: string;
  } | null;
}

interface ProfessionalsManagerProps {
  professionals: ProfessionalItem[];
  specialties: SpecialtyItem[];
}

export function ProfessionalsManager({ professionals, specialties }: ProfessionalsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Executa a alteração de status reativamente
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleProfessionalStatusAction(id, currentStatus);
      } catch (error) {
        alert("Ocorreu um erro ao atualizar o status do profissional.");
        console.error(error);
      }
    });
  };

  // Abre o modal em modo de Criação
  const handleCreateNew = () => {
    setSelectedProfessional(null);
    setIsDialogOpen(true);
  };

  // Abre o modal em modo de Edição
  const handleEdit = (professional: ProfessionalItem) => {
    setSelectedProfessional(professional);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Barra de Ações Superior */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">Corpo Clínico</h3>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Cadastre médicos e dentistas parceiros ou gerencie a ativação de atendimento no painel.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent/90 py-2.5 px-4 text-xs sm:text-sm font-extrabold text-accent-foreground shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Novo Profissional
        </button>
      </div>

      {/* Tabela de Profissionais */}
      <div className={`bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-opacity ${
        isPending ? "opacity-60" : "opacity-100"
      }`}>
        {professionals.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Smile className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-base font-bold text-primary">Nenhum profissional cadastrado</h3>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Cadastre o primeiro profissional de saúde para popular a equipe de atendimento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 select-none">
                  <th className="px-6 py-4">Nome Completo</th>
                  <th className="px-6 py-4">Conselho (CRM/CRO)</th>
                  <th className="px-6 py-4">Especialidade Principal</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {professionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-muted/30 transition-colors">
                    
                    {/* Nome & Slug */}
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        {prof.name}
                      </div>
                      <div className="text-2xs text-muted-foreground font-semibold mt-1">
                        URL: /profissionais/{prof.slug}
                      </div>
                    </td>

                    {/* Conselho CRM/CRO */}
                    <td className="px-6 py-4.5 font-semibold text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-secondary shrink-0" />
                        {prof.registration_number || "Não Informado"}
                      </span>
                    </td>

                    {/* Especialidade Principal */}
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1 text-foreground font-bold">
                        <Layers className="h-3.5 w-3.5 text-secondary shrink-0" />
                        {prof.specialty?.name || "Clínico Geral"}
                      </span>
                    </td>

                    {/* Status (Switch Toggle) */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(prof.id, prof.is_active)}
                          disabled={isPending}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                            prof.is_active ? "bg-emerald-500" : "bg-muted"
                          }`}
                          title={prof.is_active ? "Desativar Profissional" : "Ativar Profissional"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              prof.is_active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-2xs font-semibold text-muted-foreground select-none">
                          {prof.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleEdit(prof)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Editar Profissional"
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
      <ProfessionalFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        professional={selectedProfessional}
        specialties={specialties}
      />

    </div>
  );
}
