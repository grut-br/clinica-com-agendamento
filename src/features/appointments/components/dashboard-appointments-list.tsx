"use client";

import React, { useState, useMemo, useTransition } from "react";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  MessageSquare,
  User,
  Heart
} from "lucide-react";
import { AppointmentWithRelations } from "../queries";
import { updateAppointmentStatusAction } from "../actions";

interface DashboardAppointmentsListProps {
  initialAppointments: AppointmentWithRelations[];
}

export function DashboardAppointmentsList({ initialAppointments }: DashboardAppointmentsListProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Executa a Server Action de atualização de status reativamente
  const handleStatusUpdate = (appointmentId: string, status: "confirmed" | "cancelled") => {
    if (confirm(`Deseja alterar o status desta consulta para ${status === "confirmed" ? "CONFIRMADO" : "CANCELADO"}?`)) {
      startTransition(async () => {
        try {
          await updateAppointmentStatusAction(appointmentId, status);
        } catch (error) {
          alert("Ocorreu um erro ao atualizar o status. Tente novamente.");
          console.error(error);
        }
      });
    }
  };

  // Filtra agendamentos por status
  const filteredAppointments = useMemo(() => {
    if (filterStatus === "all") return initialAppointments;
    return initialAppointments.filter((app) => app.status === filterStatus);
  }, [initialAppointments, filterStatus]);

  // Calcula contadores de status
  const statusCounts = useMemo(() => {
    const counts = {
      all: initialAppointments.length,
      pending: initialAppointments.filter((app) => app.status === "pending").length,
      confirmed: initialAppointments.filter((app) => app.status === "confirmed").length,
      cancelled: initialAppointments.filter((app) => app.status === "cancelled").length,
    };
    return counts;
  }, [initialAppointments]);

  // Formata data e horário do slot de forma amigável
  const formatSlotDateTime = (slot: AppointmentWithRelations["slot"]) => {
    if (!slot) return "Data solicitada pendente";
    
    // Formata data "YYYY-MM-DD" para "DD/MM/YYYY"
    const [year, month, day] = slot.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;
    
    // Formata horário de "14:00:00" para "14:00"
    const timeFormatted = slot.start_time.substring(0, 5);
    
    return `${dateFormatted} às ${timeFormatted}h`;
  };

  // Formata a data de nascimento "YYYY-MM-DD" para "DD/MM/YYYY"
  const formatBirthDate = (birthDate: string | null) => {
    if (!birthDate) return null;
    const parts = birthDate.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return birthDate;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Barra Superior de Filtros de Status (UX de Triagem) */}
      <div className="flex flex-wrap gap-2.5 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
        {[
          { label: "Todos", value: "all", count: statusCounts.all, color: "text-white" },
          { label: "Pendentes", value: "pending", count: statusCounts.pending, color: "text-amber-400" },
          { label: "Confirmados", value: "confirmed", count: statusCounts.confirmed, color: "text-emerald-400" },
          { label: "Cancelados", value: "cancelled", count: statusCounts.cancelled, color: "text-rose-400" }
        ].map((btn) => {
          const isActive = filterStatus === btn.value;
          return (
            <button
              key={btn.value}
              onClick={() => setFilterStatus(btn.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive 
                  ? "bg-primary border border-primary text-white shadow-md shadow-primary/10" 
                  : "text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className={isActive ? "text-white" : btn.color}>{btn.label}</span>
              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-2xs font-bold shrink-0 ${
                isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {btn.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Lista de Agendamentos */}
      <div className={`bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-all duration-300 ${
        isPending ? "opacity-60" : "opacity-100"
      }`}>
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/10">
          <h2 className="text-base font-bold text-card-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary animate-pulse" />
            Grade de Pacientes
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
            {filteredAppointments.length} listados
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-bold text-card-foreground">Nenhum agendamento encontrado</h3>
            <p className="text-sm text-muted-foreground font-light mt-1 max-w-sm">
              Nenhuma solicitação com o status selecionado foi localizada no banco de dados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/20 select-none">
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Especialidade</th>
                  <th className="px-6 py-4">Agendado para</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações & Triagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredAppointments.map((appointment) => {
                  const phoneRaw = appointment.patient?.phone || "";
                  const patientName = appointment.patient?.name || "Paciente Anônimo";
                  const specialtyName = appointment.specialty?.name || "Geral";
                  const professionalName = appointment.professional?.name;
                  const displayService = professionalName ? `${professionalName} - ${specialtyName}` : specialtyName;
                  const birthDateFormatted = formatBirthDate(appointment.patient?.birth_date);
                  
                  // Mensagem profissional pré-formatada para WhatsApp
                  const whatsappMsg = encodeURIComponent(
                    `Olá, ${patientName}! Tudo bem? Sou da recepção da Clínica Med Odonto. Estamos entrando em contato para confirmar a sua solicitação de pré-agendamento de consulta ${professionalName ? `com o ${professionalName} ` : ""}na especialidade de ${specialtyName}.`
                  );

                  return (
                    <tr key={appointment.id} className="hover:bg-muted/40 transition-colors">
                      
                      {/* Paciente (Nome, Data Nasc, Obs) */}
                      <td className="px-6 py-5 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-foreground text-base flex items-center gap-1.5">
                          <User className="h-4.5 w-4.5 text-muted-foreground/60 shrink-0" />
                          {patientName}
                        </div>
                        
                        {birthDateFormatted && (
                          <div className="text-2xs text-muted-foreground/80 font-semibold mt-1">
                            Nascimento: {birthDateFormatted}
                          </div>
                        )}
                        
                        {appointment.notes && (
                          <div className="flex items-start gap-1.5 text-xs text-muted-foreground font-light mt-2 leading-relaxed bg-muted/30 border border-border rounded-lg p-2.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                            <span className="line-clamp-2" title={appointment.notes}>{appointment.notes}</span>
                          </div>
                        )}
                      </td>

                      {/* Especialidade / Médico */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 text-foreground font-bold">
                          <Heart className="h-4 w-4 text-secondary shrink-0" />
                          {displayService}
                        </span>
                      </td>

                      {/* Data & Horário da Consulta */}
                      <td className="px-6 py-5 font-semibold text-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-4.5 w-4.5 text-secondary shrink-0" />
                          {formatSlotDateTime(appointment.slot)}
                        </span>
                      </td>

                      {/* Status (Badge Colorida) */}
                      <td className="px-6 py-5">
                        {appointment.status === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50/70 border border-amber-300/30 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300 px-2.5 py-1 text-xs font-bold">
                            Pendente
                          </span>
                        )}
                        {appointment.status === "confirmed" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50/70 border border-emerald-300/30 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300 px-2.5 py-1 text-xs font-bold">
                            Confirmado
                          </span>
                        )}
                        {appointment.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50/70 border border-rose-300/30 text-rose-700 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300 px-2.5 py-1 text-xs font-bold">
                            Cancelado
                          </span>
                        )}
                        {appointment.status === "completed" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50/70 border border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300 px-2.5 py-1 text-xs font-bold">
                            Finalizado
                          </span>
                        )}
                      </td>

                      {/* Botões de Ação do Operador (Lado Direito) */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          
                          {/* Botão de Contato WhatsApp */}
                          {phoneRaw && (
                            <a
                              href={`https://wa.me/55${phoneRaw}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8.5 px-3 items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/10 cursor-pointer active:scale-95"
                              title="Iniciar Contato no WhatsApp"
                            >
                              <MessageSquare className="h-4 w-4 fill-white/10" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                          )}

                          {/* Ações de Confirmar/Cancelar para agendamentos pendentes */}
                          {appointment.status === "pending" && (
                            <div className="flex items-center gap-1.5 border-l border-slate-100 pl-2.5">
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm shadow-emerald-500/10 cursor-pointer active:scale-90"
                                title="Confirmar Consulta"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-sm shadow-rose-500/10 cursor-pointer active:scale-90"
                                title="Cancelar Consulta"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          {/* Aviso de Processado */}
                          {appointment.status !== "pending" && (
                            <span className="text-2xs font-semibold text-slate-400 select-none bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                              Triado
                            </span>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
