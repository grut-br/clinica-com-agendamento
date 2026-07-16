"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, UserRound, Filter, Search } from "lucide-react";
import { fetchDashboardCalendarSlotsAction } from "@/features/appointments/actions";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { PageToolbar } from "@/components/ui/page-toolbar";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { Fade } from "@/components/motion/presets";

interface SpecialtyItem { id: string; name: string; slug: string; }
interface ProfessionalItem { id: string; name: string; specialty_id: string; }
interface SlotItem { id: string; date: string; start_time: string; end_time: string; status: string; }

type StatusFilter = "all" | "available" | "reserved" | "confirmed" | "cancelled" | "blocked";

const statusLabels: Record<string, string> = {
  available: "Disponível",
  reserved: "Reservado",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  blocked: "Bloqueado",
};

const statusTones: Record<string, StatusTone> = {
  available: "success",
  reserved: "warning",
  confirmed: "info",
  cancelled: "danger",
  blocked: "neutral",
};

function todayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function SlotTimeline({ slots, professional, specialty }: { slots: SlotItem[]; professional?: ProfessionalItem; specialty?: SpecialtyItem }) {
  if (!slots.length) {
    return (
      <EmptyState 
        title="Nenhum horário nesta data" 
        description="Não há horários disponíveis ou registrados para este dia. Escolha outra data ou gere uma nova grade." 
        icon={<Clock3 className="h-8 w-8 text-muted-foreground" />} 
      />
    );
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[3.5rem] before:w-px before:bg-border/60" aria-label="Timeline cronológica da agenda">
      {slots.map((slot) => (
        <Fade key={slot.id} className="relative flex items-start gap-4 sm:gap-6">
          <div className="w-14 shrink-0 pt-1 text-right">
            <time dateTime={`${slot.date}T${slot.start_time}`} className="block font-heading text-sm font-bold text-foreground">
              {formatTime(slot.start_time)}
            </time>
            <span className="block text-xs font-medium text-muted-foreground mt-0.5">
              {formatTime(slot.end_time)}
            </span>
          </div>

          <div className="absolute left-[3.5rem] top-2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] border-background bg-accent" aria-hidden="true" />

          <Card className="flex-1 p-5 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-heading text-base font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                    {professional?.name || "Sem profissional"}
                  </h3>
                  <StatusBadge label={statusLabels[slot.status] || slot.status} tone={statusTones[slot.status] || "neutral"} />
                </div>
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {specialty?.name || "Sem especialidade"}
                </p>
              </div>

              <div className="bg-surface rounded-lg border border-border p-3 sm:text-right min-w-[200px] flex-shrink-0">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Paciente
                </span>
                <div className="flex items-center sm:justify-end gap-2 text-sm font-medium text-foreground">
                  <UserRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Sem paciente
                </div>
              </div>
            </div>
          </Card>
        </Fade>
      ))}
    </div>
  );
}

export function AgendaWorkspace({ specialties, professionals }: { specialties: SpecialtyItem[]; professionals: ProfessionalItem[] }) {
  const [specialtyId, setSpecialtyId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState(todayString);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const filteredProfessionals = useMemo(() => specialtyId ? professionals.filter((professional) => professional.specialty_id === specialtyId) : professionals, [professionals, specialtyId]);
  const selectedProfessional = professionals.find((professional) => professional.id === professionalId);
  const selectedSpecialty = specialties.find((specialty) => specialty.id === specialtyId) || (selectedProfessional ? specialties.find((specialty) => specialty.id === selectedProfessional.specialty_id) : undefined);

  useEffect(() => {
    if (!professionalId) return;

    let active = true;
    async function loadSlots() {
      setIsLoading(true);
      try {
        const data = await fetchDashboardCalendarSlotsAction(professionalId);
        if (active) setSlots(data);
      } catch {
        if (active) setSlots([]);
      } finally {
        if (active) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    }

    void loadSlots();

    return () => { active = false; };
  }, [professionalId]);

  const visibleSlots = useMemo(() => slots.filter((slot) => {
    const matchesDate = slot.date === date;
    const matchesStatus = status === "all" || slot.status === status;
    const matchesSearch = !query.trim() || `${selectedProfessional?.name || ""} ${selectedSpecialty?.name || ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    return matchesDate && matchesStatus && matchesSearch;
  }), [date, query, selectedProfessional?.name, selectedSpecialty?.name, slots, status]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      <aside className="w-full xl:w-72 shrink-0 xl:sticky xl:top-24 space-y-6">
        <PageToolbar aria-label="Filtros da agenda" className="flex-col items-stretch sm:flex-col p-5 gap-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Filter className="h-4 w-4 text-accent" aria-hidden="true" />
            <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">Filtros da Agenda</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pesquisa</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input aria-label="Pesquisar termo" placeholder="Buscar..." value={query} onChange={(event) => setQuery(event.target.value)} className="w-full pl-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input type="date" aria-label="Filtrar por data" value={date} onChange={(event) => setDate(event.target.value)} className="w-full pl-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Especialidade</label>
            <Select aria-label="Filtrar por especialidade" value={specialtyId} onChange={(event) => { setSpecialtyId(event.target.value); setProfessionalId(""); }} className="w-full">
              <option value="">Todas as especialidades</option>
              {specialties.map((specialty) => <option key={specialty.id} value={specialty.id}>{specialty.name}</option>)}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profissional</label>
            <Select aria-label="Filtrar por profissional" value={professionalId} onChange={(event) => setProfessionalId(event.target.value)} disabled={!filteredProfessionals.length} className="w-full">
              <option value="">Selecione o profissional</option>
              {filteredProfessionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.name}</option>)}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
            <Select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="w-full">
              <option value="all">Todos os status</option>
              <option value="available">Disponível</option>
              <option value="reserved">Reservado</option>
              <option value="confirmed">Confirmado</option>
              <option value="cancelled">Cancelado</option>
              <option value="blocked">Bloqueado</option>
            </Select>
          </div>
        </PageToolbar>
      </aside>

      <section className="flex-1 min-w-0 w-full space-y-6 bg-surface p-6 rounded-xl border border-border shadow-sm" aria-labelledby="agenda-timeline-title">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Visão Diária</p>
            <h2 id="agenda-timeline-title" className="font-heading text-2xl font-extrabold text-foreground capitalize">
              {formatDate(date)}
            </h2>
          </div>
          {selectedProfessional && (
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full border border-border shadow-sm">
              <UserRound className="h-4 w-4 text-accent" aria-hidden="true" />
              {selectedProfessional.name}
            </div>
          )}
        </header>

        <div className="pt-2">
          {!professionalId ? (
            <EmptyState 
              title="Escolha um profissional" 
              description="Para visualizar a agenda, é necessário selecionar a especialidade e o profissional no painel de filtros." 
              icon={<UserRound className="h-8 w-8 text-muted-foreground" />} 
            />
          ) : isLoading ? (
            <div className="space-y-5" role="status" aria-live="polite">
              <LoadingState label="Sincronizando horários..." />
              {[1, 2, 3].map((item) => <Skeleton key={item} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : !hasLoaded ? (
            <EmptyState 
              title="Nenhuma grade processada" 
              description="Aguardando a seleção do profissional para carregar a linha do tempo." 
              icon={<Clock3 className="h-8 w-8 text-muted-foreground" />} 
            />
          ) : visibleSlots.length === 0 ? (
            query ? (
              <EmptyState 
                title="Nenhum resultado encontrado" 
                description={`A pesquisa por "${query}" não retornou nenhum horário.`} 
                icon={<Search className="h-8 w-8 text-muted-foreground" />} 
              />
            ) : status !== "all" ? (
              <EmptyState 
                title={`Nenhum horário ${statusLabels[status].toLowerCase()}`} 
                description={`Não existem agendamentos com o status de ${statusLabels[status]} nesta data.`} 
                icon={<Filter className="h-8 w-8 text-muted-foreground" />} 
              />
            ) : (
              <EmptyState 
                title="Grade vazia" 
                description="O profissional não possui horários gerados ou agendamentos nesta data específica." 
                icon={<CalendarDays className="h-8 w-8 text-muted-foreground" />} 
              />
            )
          ) : (
            <SlotTimeline slots={visibleSlots} professional={selectedProfessional} specialty={selectedSpecialty} />
          )}
        </div>
      </section>
    </div>
  );
}
