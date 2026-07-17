"use client";

import React, { useState, useTransition, useMemo } from "react";
import { User, Clipboard, Smile, Heart, Calendar } from "lucide-react";
import { ClinicalNotesSheet } from "./clinical-notes-sheet";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
 
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
 
interface DoctorAppointmentsListProps {
  appointments: AppointmentItem[];
}
 
export function DoctorAppointmentsList({ appointments }: DoctorAppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  
  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "evolved" | "pending">("all");
  const [, startTransition] = useTransition();
 
  // Formatação de data e hora do slot
  const formatDateTime = (slot: AppointmentItem["slot"]) => {
    if (!slot) return "";
    const [year, month, day] = slot.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;
    const timeFormatted = slot.start_time.substring(0, 5);
    return `${dateFormatted} às ${timeFormatted}h`;
  };
 
  const handleOpenNotes = (appointment: AppointmentItem) => {
    setSelectedAppointment(appointment);
    setIsSheetOpen(true);
  };
 
  // Filtragem reativa com useMemo
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchesSearch = app.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.specialty.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const hasNotes = !!app.clinical_notes;
      const matchesStatus = statusFilter === "all" ||
                            (statusFilter === "evolved" && hasNotes) ||
                            (statusFilter === "pending" && !hasNotes);
      
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);
 
  // Ordena os agendamentos por data e hora do slot
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      const dateA = a.slot?.date || "";
      const dateB = b.slot?.date || "";
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      
      const timeA = a.slot?.start_time || "";
      const timeB = b.slot?.start_time || "";
      return timeA.localeCompare(timeB);
    });
  }, [filteredAppointments]);
 
  return (
    <div className="space-y-6">
      
      {/* Toolbar unificada com campo de busca e filtros rápidos */}
      <TableToolbar
        placeholder="Pesquisar por paciente ou especialidade..."
        onSearch={(value) => startTransition(() => setSearchTerm(value))}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Filtrar status:</span>
            <Select
              value={statusFilter}
              onChange={(e) => startTransition(() => setStatusFilter(e.target.value as "all" | "evolved" | "pending"))}
              aria-label="Selecionar filtro de status"
              className="min-w-[160px]"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente Evolução</option>
              <option value="evolved">Evoluído</option>
            </Select>
          </div>
        }
      />

      {/* Grid/Lista Principal com Layout Timeline / Cards */}
      {sortedAppointments.length === 0 ? (
        <EmptyState
          title="Nenhum atendimento encontrado"
          description={
            searchTerm || statusFilter !== "all"
              ? "Não foram encontrados resultados para a busca e filtros aplicados."
              : "Você não possui agendamentos confirmados nesta listagem."
          }
          icon={<Smile className="h-12 w-12 text-muted-foreground/45" />}
        />
      ) : (
        <div className="relative border-l border-border pl-6 ml-3 space-y-6">
          {sortedAppointments.map((app) => {
            const isEvolved = !!app.clinical_notes;
            
            return (
              <div 
                key={app.id}
                className="relative group transition-all duration-300"
              >
                {/* Indicador visual de timeline na borda */}
                <div 
                  className={`absolute -left-[31px] top-4 h-4.5 w-4.5 rounded-full border-4 border-background flex items-center justify-center transition-all ${
                    isEvolved 
                      ? "bg-emerald-500 shadow-xs" 
                      : "bg-amber-400 animate-pulse"
                  }`} 
                />

                <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300 hover:border-border-hover hover:shadow-xs">
                  
                  {/* Detalhes do Paciente e Consulta */}
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-muted/65 text-foreground flex items-center justify-center shrink-0">
                      <User className="h-5.5 w-5.5 text-secondary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="font-extrabold text-foreground text-base tracking-tight leading-none">
                          {app.patient.name}
                        </h4>
                        <StatusBadge 
                          label={isEvolved ? "Evoluído" : "Pendente"} 
                          tone={isEvolved ? "success" : "warning"} 
                        />
                      </div>
                      
                      {/* Dados secundários (data, hora, especialidade) */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
                          {formatDateTime(app.slot)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Heart className="h-3.5 w-3.5 text-secondary shrink-0" />
                          {app.specialty.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ação: Evoluir ou Ver Ficha */}
                  <div className="flex items-center shrink-0 sm:self-center">
                    <Button 
                      onClick={() => handleOpenNotes(app)}
                      variant={isEvolved ? "outline" : "primary"}
                      className="w-full sm:w-auto"
                    >
                      <Clipboard className="h-4 w-4 shrink-0" />
                      {isEvolved ? "Ver Prontuário" : "Atender / Prontuário"}
                    </Button>
                  </div>

                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-out Prontuário */}
      <ClinicalNotesSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
