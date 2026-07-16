"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { User, Clock, Clipboard, Sparkles, Smile, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { ClinicalNotesSheet } from "./clinical-notes-sheet";
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
 
interface DoctorDashboardProps {
  doctorName: string;
  appointments: AppointmentItem[];
}
 
export function DoctorDashboard({ doctorName, appointments }: DoctorDashboardProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Filtragem de agendamentos de hoje
  const todayAppointments = appointments.filter((app) => app.slot?.date === todayKey);

  // KPIs
  const totalToday = todayAppointments.length;
  const evolvedToday = todayAppointments.filter((app) => app.clinical_notes).length;
  const pendingToday = todayAppointments.filter((app) => !app.clinical_notes).length;

  // Próximo paciente (o primeiro da fila hoje que ainda não foi evoluído)
  const nextAppointment = todayAppointments
    .filter((app) => !app.clinical_notes)
    .sort((a, b) => {
      const timeA = a.slot?.start_time || "";
      const timeB = b.slot?.start_time || "";
      return timeA.localeCompare(timeB);
    })[0] || null;

  // Histórico recente (pacientes evoluídos recentemente de qualquer dia, ordenados por data decrescente)
  const recentHistory = appointments
    .filter((app) => app.clinical_notes)
    .slice(0, 5);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    return timeStr.substring(0, 5);
  };

  const handleOpenNotes = (appointment: AppointmentItem) => {
    setSelectedAppointment(appointment);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Cabeçalho da Área do Médico */}
      <PageHeader
        eyebrow="Área do Profissional"
        title={`Olá, Dr(a). ${doctorName.split(" ")[0]}`}
        description="Acompanhe seus atendimentos agendados, evolua prontuários e visualize estatísticas do dia."
      />

      {/* Grid de Métricas Rápidas */}
      <section aria-label="Resumo estatístico do dia" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Consultas de Hoje"
          value={totalToday}
          detail="Agendamentos marcados"
          icon={<Clock className="h-5 w-5 text-secondary" />}
        />
        <StatCard
          label="Pacientes Evoluídos"
          value={evolvedToday}
          detail="Prontuários salvos hoje"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          label="Evoluções Pendentes"
          value={pendingToday}
          detail="Aguardando atendimento"
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="Próximo Paciente"
          value={nextAppointment ? nextAppointment.patient.name.split(" ")[0] : "Ninguém"}
          detail={nextAppointment ? `${formatTime(nextAppointment.slot?.start_time)}h` : "Sem fila hoje"}
          icon={<User className="h-5 w-5 text-secondary" />}
        />
      </section>

      {/* Divisão do Painel Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Próximo Paciente (Destaque) & Lista Completa de Hoje */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card Destaque: Próximo Paciente */}
          {nextAppointment && (
            <Card className="p-6 border-l-4 border-l-accent bg-card relative overflow-hidden transition-all hover:shadow-md">
              <div className="absolute right-4 top-4 text-accent/15">
                <Sparkles className="h-20 w-20 pointer-events-none" />
              </div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-2xs font-bold text-accent">
                  PRÓXIMO PACIENTE
                </div>
                
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {nextAppointment.patient.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-secondary shrink-0" />
                      {formatTime(nextAppointment.slot?.start_time)}h - {formatTime(nextAppointment.slot?.end_time)}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Clipboard className="h-4 w-4 text-secondary shrink-0" />
                      {nextAppointment.specialty.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground font-light leading-relaxed max-w-xs">
                    Inicie o atendimento do paciente e faça o registro das notas clínicas na ficha.
                  </span>
                  
                  <Button
                    onClick={() => handleOpenNotes(nextAppointment)}
                    variant="primary"
                  >
                    Atender Agora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Lista de Atendimentos de Hoje */}
          <section aria-labelledby="today-list-heading" className="space-y-4">
            <h2 id="today-list-heading" className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              Fila de Atendimento de Hoje
            </h2>

            {todayAppointments.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground font-light text-sm flex flex-col items-center justify-center">
                <Smile className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="text-base font-bold text-foreground">Sem consultas hoje</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xs">
                  Sua agenda de hoje não possui agendamentos marcados.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {todayAppointments
                  .sort((a, b) => {
                    const timeA = a.slot?.start_time || "";
                    const timeB = b.slot?.start_time || "";
                    return timeA.localeCompare(timeB);
                  })
                  .map((app) => {
                    const isEvolved = !!app.clinical_notes;
                    return (
                      <div
                        key={app.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border transition-all hover:border-border-hover"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${isEvolved ? "bg-emerald-500" : "bg-amber-400"}`} />
                          <div>
                            <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                              {app.patient.name}
                              {isEvolved && (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  Evoluído
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatTime(app.slot?.start_time)}h • {app.specialty.name}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleOpenNotes(app)}
                          variant={isEvolved ? "outline" : "primary"}
                          size="sm"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                          {isEvolved ? "Ver Prontuário" : "Registrar Ficha"}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

        </div>

        {/* Lado Direito: Histórico Recente de Evoluções */}
        <section aria-labelledby="history-heading" className="space-y-4">
          <h2 id="history-heading" className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-secondary" />
            Evoluções Recentes
          </h2>

          {recentHistory.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground font-light text-xs flex flex-col items-center justify-center">
              <Smile className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p>Nenhuma evolução registrada recentemente.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((app) => {
                const [, month, day] = app.slot?.date.split("-") || ["", "", ""];
                const dateFormatted = `${day}/${month}`;
                return (
                  <Card
                    key={app.id}
                    className="p-4 flex flex-col gap-2 transition-all hover:border-border-hover cursor-pointer"
                    onClick={() => handleOpenNotes(app)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-foreground text-xs truncate max-w-[70%]">
                        {app.patient.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded-full">
                        {dateFormatted}
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                      {app.clinical_notes}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* Modal / Slide-out de evolução clínica */}
      <ClinicalNotesSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        appointment={selectedAppointment}
      />

    </div>
  );
}
