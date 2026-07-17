"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Layers, Smile, Award } from "lucide-react";
import { toggleProfessionalStatusAction } from "../professionals-actions";
import { ProfessionalFormDialog } from "./professional-form-dialog";

import { TableToolbar } from "@/components/ui/table-toolbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCreateNew = () => {
    setSelectedProfessional(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (professional: ProfessionalItem) => {
    setSelectedProfessional(professional);
    setIsDialogOpen(true);
  };

  const filteredProfessionals = professionals.filter(prof => 
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prof.registration_number && prof.registration_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <TableToolbar
        placeholder="Pesquisar profissionais..."
        onSearch={setSearchQuery}
        actions={
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="h-4.5 w-4.5" />
            Novo Profissional
          </Button>
        }
      />

      <div className={`bg-surface border border-border rounded-[var(--component-card-radius)] shadow-sm overflow-hidden text-foreground transition-opacity duration-300 ${isPending ? "opacity-60" : "opacity-100"}`}>
        {filteredProfessionals.length === 0 ? (
          <EmptyState
            title="Nenhum profissional encontrado"
            description={searchQuery ? "Tente buscar por outro termo." : "Cadastre o primeiro profissional de saúde para popular a equipe de atendimento."}
            icon={<Smile className="h-10 w-10" />}
            action={
              !searchQuery && (
                <Button variant="outline" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4" /> Cadastrar Profissional
                </Button>
              )
            }
          />
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
                {filteredProfessionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        {prof.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        /{prof.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4.5 font-semibold text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-muted-foreground shrink-0" />
                        {prof.registration_number || "Não Informado"}
                      </span>
                    </td>

                    <td className="px-6 py-4.5">
                      <Badge className="gap-1 bg-surface border border-border font-medium text-muted-foreground">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        {prof.specialty?.name || "Clínico Geral"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={prof.is_active}
                          onCheckedChange={() => handleToggleActive(prof.id, prof.is_active)}
                          disabled={isPending}
                          aria-label="Alternar status do profissional"
                        />
                        <StatusBadge 
                          label={prof.is_active ? "Ativo" : "Inativo"} 
                          tone={prof.is_active ? "success" : "neutral"} 
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(prof)} title="Editar Profissional">
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

      <ProfessionalFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        professional={selectedProfessional}
        specialties={specialties}
      />
    </div>
  );
}
