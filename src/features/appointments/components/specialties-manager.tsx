"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit2, Clock, Layers, Smile } from "lucide-react";
import { toggleSpecialtyStatusAction } from "../cms-actions";
import { SpecialtyFormDialog } from "./specialty-form-dialog";

import { TableToolbar } from "@/components/ui/table-toolbar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCreateNew = () => {
    setSelectedSpecialty(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (specialty: SpecialtyItem) => {
    setSelectedSpecialty(specialty);
    setIsDialogOpen(true);
  };

  const filteredSpecialties = specialties.filter(spec => 
    spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <TableToolbar
        placeholder="Pesquisar especialidades..."
        onSearch={setSearchQuery}
        actions={
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="h-4.5 w-4.5" />
            Nova Especialidade
          </Button>
        }
      />

      <div className={`bg-surface border border-border rounded-[var(--component-card-radius)] shadow-sm overflow-hidden text-foreground transition-opacity duration-300 ${isPending ? "opacity-60" : "opacity-100"}`}>
        {filteredSpecialties.length === 0 ? (
          <EmptyState
            title="Nenhuma especialidade encontrada"
            description={searchQuery ? "Tente buscar por outro termo." : "Cadastre sua primeira especialidade para popular o site e o painel de agenda."}
            icon={<Smile className="h-10 w-10" />}
            action={
              !searchQuery && (
                <Button variant="outline" onClick={handleCreateNew}>
                  <Plus className="h-4 w-4" /> Cadastrar Especialidade
                </Button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 select-none">
                  <th className="px-6 py-4">Nome / Slug</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Duração</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredSpecialties.map((spec) => (
                  <tr key={spec.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="font-bold text-foreground text-sm flex items-center gap-2">
                        {spec.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        /{spec.slug}
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <Badge className="gap-1 bg-surface border border-border font-medium text-muted-foreground">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        {spec.category || "Geral"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        {spec.duration_minutes} min
                      </span>
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={spec.is_active}
                          onCheckedChange={() => handleToggleActive(spec.id, spec.is_active)}
                          disabled={isPending}
                          aria-label="Alternar exibição no site"
                        />
                        <StatusBadge 
                          label={spec.is_active ? "Ativo" : "Inativo"} 
                          tone={spec.is_active ? "success" : "neutral"} 
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(spec)} title="Editar Especialidade">
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

      <SpecialtyFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        specialty={selectedSpecialty}
      />
    </div>
  );
}
