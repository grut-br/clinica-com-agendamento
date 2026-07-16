"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Check, Clock3, FileText, MessageCircle, UserRound, X } from "lucide-react";
import { updateAppointmentStatusAction } from "@/features/appointments/actions";
import type { AppointmentWithRelations } from "@/features/appointments/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { TableToolbar } from "@/components/ui/table-toolbar";
import { cn } from "@/lib/cn";

type FilterStatus = "all" | AppointmentWithRelations["status"];

const statusLabels: Record<AppointmentWithRelations["status"], string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Finalizado",
};

const statusTones: Record<AppointmentWithRelations["status"], StatusTone> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
};

function formatDateTime(slot: AppointmentWithRelations["slot"]) {
  if (!slot) return "Horário pendente";
  const [, month, day] = slot.date.split("-");
  return `${day}/${month} às ${slot.start_time.slice(0, 5)}`;
}

function formatBirthDate(birthDate: string | null) {
  if (!birthDate) return null;
  const [year, month, day] = birthDate.split("-");
  return `${day}/${month}/${year}`;
}

function getWhatsAppHref(appointment: AppointmentWithRelations) {
  const patientName = appointment.patient?.name || "Paciente";
  const professional = appointment.professional?.name;
  const specialty = appointment.specialty?.name || "consulta";
  const message = encodeURIComponent(
    `Olá, ${patientName}! Sou da recepção da clínica. Podemos confirmar sua solicitação de ${specialty}${professional ? ` com ${professional}` : ""}?`,
  );
  return `https://wa.me/55${appointment.patient?.phone || ""}?text=${message}`;
}

function AppointmentActions({ appointment, onStatusChange, isPending }: { appointment: AppointmentWithRelations; onStatusChange: (id: string, status: "confirmed" | "cancelled") => void; isPending: boolean }) {
  if (appointment.status !== "pending") {
    return <span className="text-xs text-muted-foreground">Triado</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {appointment.patient?.phone && (
        <a
          href={getWhatsAppHref(appointment)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir WhatsApp de ${appointment.patient.name}`}
          className="ui-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--component-control-radius)] border border-border px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <MessageCircle className="h-4 w-4 text-success" aria-hidden="true" />
          <span className="hidden lg:inline">WhatsApp</span>
        </a>
      )}
      <Button variant="primary" size="icon" disabled={isPending} onClick={() => onStatusChange(appointment.id, "confirmed")} aria-label={`Confirmar consulta de ${appointment.patient.name}`}>
        <Check className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" disabled={isPending} onClick={() => onStatusChange(appointment.id, "cancelled")} aria-label={`Cancelar solicitação de ${appointment.patient.name}`}>
        <X className="h-4 w-4 text-danger" aria-hidden="true" />
      </Button>
    </div>
  );
}

function AppointmentDetails({ appointment, onStatusChange, isPending }: { appointment: AppointmentWithRelations; onStatusChange: (id: string, status: "confirmed" | "cancelled") => void; isPending: boolean }) {
  const patientName = appointment.patient?.name || "Paciente sem nome";
  const specialtyName = appointment.specialty?.name || "Especialidade não informada";
  const professionalName = appointment.professional?.name;

  return (
    <Card className="p-4 transition-colors duration-150 hover:border-accent/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold text-foreground">{patientName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{specialtyName}{professionalName ? ` · ${professionalName}` : ""}</p>
        </div>
        <StatusBadge label={statusLabels[appointment.status]} tone={statusTones[appointment.status]} />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
        <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
        {formatDateTime(appointment.slot)}
      </div>
      <div className="mt-4 flex justify-end border-t border-border pt-3">
        <AppointmentActions appointment={appointment} onStatusChange={onStatusChange} isPending={isPending} />
      </div>
    </Card>
  );
}

export function ReceptionTriage({ initialAppointments }: { initialAppointments: AppointmentWithRelations[] }) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pending");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => ({
    all: initialAppointments.length,
    pending: initialAppointments.filter((appointment) => appointment.status === "pending").length,
    confirmed: initialAppointments.filter((appointment) => appointment.status === "confirmed").length,
    cancelled: initialAppointments.filter((appointment) => appointment.status === "cancelled").length,
  }), [initialAppointments]);

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return initialAppointments.filter((appointment) => {
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
      const searchable = [appointment.patient?.name, appointment.specialty?.name, appointment.professional?.name].filter(Boolean).join(" ").toLocaleLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filterStatus, initialAppointments, query]);

  const updateStatus = (appointmentId: string, status: "confirmed" | "cancelled") => {
    const actionName = status === "confirmed" ? "confirmar" : "cancelar";
    if (!window.confirm(`Deseja ${actionName} esta solicitação?`)) return;

    setError(null);
    startTransition(async () => {
      try {
        await updateAppointmentStatusAction(appointmentId, status);
      } catch {
        setError("Não foi possível atualizar a solicitação. Tente novamente.");
      }
    });
  };

  const filterOptions: Array<{ label: string; value: FilterStatus; count: number }> = [
    { label: "Todas", value: "all", count: counts.all },
    { label: "Pendentes", value: "pending", count: counts.pending },
    { label: "Confirmadas", value: "confirmed", count: counts.confirmed },
    { label: "Canceladas", value: "cancelled", count: counts.cancelled },
  ];

  return (
    <section aria-labelledby="triage-title" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Atenção da recepção</p>
          <h2 id="triage-title" className="mt-1 font-heading text-xl font-bold text-foreground">Solicitações para decidir</h2>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:inline">{filteredAppointments.length} na visão atual</span>
      </div>

      <TableToolbar
        onSearch={setQuery}
        placeholder="Pesquisar paciente ou especialidade"
        filters={(
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar solicitações por status">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filterStatus === option.value}
                onClick={() => setFilterStatus(option.value)}
                className={cn(
                  "ui-focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition-colors duration-150",
                  filterStatus === option.value ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {option.label}
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">{option.count}</span>
              </button>
            ))}
          </div>
        )}
      />

      {error && <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{error}</p>}

      {filteredAppointments.length === 0 ? (
        <EmptyState
          title={query || filterStatus !== "pending" ? "Nenhuma solicitação encontrada" : "Nenhuma pendência agora"}
          description={query || filterStatus !== "pending" ? "Ajuste a pesquisa ou troque o filtro para ver outros registros." : "As novas solicitações de pacientes aparecerão aqui para confirmação."}
          icon={<Clock3 className="h-8 w-8" />}
        />
      ) : (
        <Card className={cn("overflow-hidden", isPending && "opacity-70")}>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[840px] text-left">
              <caption className="sr-only">Solicitações de agendamento para triagem</caption>
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-4">Paciente</th>
                  <th scope="col" className="px-5 py-4">Atendimento</th>
                  <th scope="col" className="px-5 py-4">Horário</th>
                  <th scope="col" className="px-5 py-4">Status</th>
                  <th scope="col" className="px-5 py-4 text-right">Próxima ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAppointments.map((appointment) => {
                  const patientName = appointment.patient?.name || "Paciente sem nome";
                  const birthDate = formatBirthDate(appointment.patient?.birth_date);
                  return (
                    <tr key={appointment.id} className="transition-colors duration-150 hover:bg-muted/30">
                      <td className="max-w-[240px] px-5 py-4 align-top">
                        <div className="flex items-start gap-2">
                          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">{patientName}</p>
                            {birthDate && <p className="mt-1 text-xs text-muted-foreground">Nascimento: {birthDate}</p>}
                            {appointment.notes && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground" title={appointment.notes}><FileText className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />{appointment.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-foreground">
                        <p className="font-semibold">{appointment.specialty?.name || "Especialidade não informada"}</p>
                        {appointment.professional?.name && <p className="mt-1 text-xs text-muted-foreground">{appointment.professional.name}</p>}
                      </td>
                      <td className="px-5 py-4 align-top text-sm font-medium text-foreground"><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />{formatDateTime(appointment.slot)}</span></td>
                      <td className="px-5 py-4 align-top"><StatusBadge label={statusLabels[appointment.status]} tone={statusTones[appointment.status]} /></td>
                      <td className="px-5 py-4 align-top"><div className="flex justify-end"><AppointmentActions appointment={appointment} onStatusChange={updateStatus} isPending={isPending} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 p-3 md:hidden">
            {filteredAppointments.map((appointment) => <AppointmentDetails key={appointment.id} appointment={appointment} onStatusChange={updateStatus} isPending={isPending} />)}
          </div>
        </Card>
      )}
    </section>
  );
}
