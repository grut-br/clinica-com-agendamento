"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { 
  CalendarDays, 
  Clock3, 
  UserRound, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ClipboardCheck, 
  Calendar, 
  MessageCircle, 
  Copy, 
  Phone, 
  Eye, 
  Check, 
  X, 
  Stethoscope, 
  User, 
  Plus, 
  AlertCircle 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateAppointmentStatusAction } from "@/features/appointments/actions";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

interface SpecialtyItem { id: string; name: string; slug: string; }
interface ProfessionalItem { id: string; name: string; specialty_id: string; }

interface MappedSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  professional: { id: string; name: string } | null;
  specialty: { id: string; name: string } | null;
  appointment: {
    id: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    notes: string;
    clinical_notes: string;
    created_at: string;
    patient: {
      id: string;
      name: string;
      phone: string;
      birth_date: string | null;
    } | null;
    specialty: {
      id: string;
      name: string;
    } | null;
  } | null;
}

type StatusFilter = "all" | "available" | "pending" | "confirmed" | "completed" | "cancelled" | "blocked";
type PeriodFilter = "all" | "morning" | "afternoon" | "evening";

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  available: {
    label: "Disponível",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    icon: <CheckCircle className="h-3.5 w-3.5 shrink-0" />
  },
  pending: {
    label: "Reservado",
    bg: "bg-warning/10 hover:bg-warning/15",
    text: "text-warning",
    border: "border-warning/20",
    icon: <Clock3 className="h-3.5 w-3.5 shrink-0" />
  },
  confirmed: {
    label: "Confirmado",
    bg: "bg-blue-500/10 hover:bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/20",
    icon: <Calendar className="h-3.5 w-3.5 shrink-0" />
  },
  completed: {
    label: "Concluído",
    bg: "bg-teal-500/10 hover:bg-teal-500/15",
    text: "text-teal-400",
    border: "border-teal-500/20",
    icon: <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
  },
  cancelled: {
    label: "Cancelado",
    bg: "bg-danger/10 hover:bg-danger/15",
    text: "text-danger",
    border: "border-danger/20",
    icon: <XCircle className="h-3.5 w-3.5 shrink-0" />
  },
  blocked: {
    label: "Bloqueado",
    bg: "bg-zinc-500/10 hover:bg-zinc-500/15",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
    icon: <XCircle className="h-3.5 w-3.5 shrink-0" />
  }
};

function getStatusKey(slot: MappedSlot): string {
  if (slot.status === "blocked") return "blocked";
  if (slot.status === "available") return "available";
  if (slot.appointment) {
    return slot.appointment.status; // pending, confirmed, completed, cancelled
  }
  return "pending"; // fallback para reservado
}

function todayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function formatDateHeader(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", { 
    weekday: "long", 
    day: "numeric", 
    month: "long",
    year: "numeric"
  });
}

function formatBirthDate(birthDate: string | null) {
  if (!birthDate) return null;
  const [year, month, day] = birthDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatPhoneNumber(phone: string | null) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  return phone;
}

function getWhatsAppHref(slot: MappedSlot) {
  const patientName = slot.appointment?.patient?.name || "Paciente";
  const professional = slot.professional?.name;
  const specialty = slot.specialty?.name || "consulta";
  const message = encodeURIComponent(
    `Olá, ${patientName}! Gostaríamos de confirmar o horário da sua consulta de ${specialty} com o(a) dr(a). ${professional || ""} no dia ${slot.date.split("-").reverse().join("/")} às ${slot.start_time.slice(0, 5)}.`
  );
  return `https://wa.me/55${slot.appointment?.patient?.phone || ""}?text=${message}`;
}

function getRemainingTimeText(slotDate: string, startTime: string) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  
  const [hour, min] = startTime.split(":").map(Number);
  const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min);
  
  if (slotDate !== todayStr) {
    const diffTime = new Date(slotDate).getTime() - new Date(todayStr).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `Em ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`;
    }
    return "Passado";
  }

  const diffMs = slotTime.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins > 0) {
    if (diffMins < 60) {
      return `Faltam ${diffMins} min`;
    }
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `Faltam ${diffHours}h ${remMins > 0 ? `${remMins}m` : ""}`;
  } else {
    if (diffMins >= -30) {
      return "Agora";
    }
    return "Passado";
  }
}

export function AgendaWorkspace({ specialties, professionals }: { specialties: SpecialtyItem[]; professionals: ProfessionalItem[] }) {
  // Estados de Controle de Data e Filtros
  const [date, setDate] = useState(todayString);
  const [query, setQuery] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("all");
  
  // Dados do Supabase
  const [slots, setSlots] = useState<MappedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Controle de Drawer Lateral
  const [activeSlot, setActiveSlot] = useState<MappedSlot | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Notas e Observações simuladas locais
  const [localNote, setLocalNote] = useState("");
  const [localNotesMap, setLocalNotesMap] = useState<Record<string, string>>({});
  const [localNoteSaved, setLocalNoteSaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filtro de profissionais com base na especialidade selecionada
  const filteredProfessionalsList = useMemo(() => {
    if (!specialtyId) return professionals;
    return professionals.filter(p => p.specialty_id === specialtyId);
  }, [professionals, specialtyId]);

  // Efeito principal: Carregar slots físicos diretamente do Supabase filtrando por data e profissional
  useEffect(() => {
    let active = true;
    async function loadSlots() {
      setIsLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        let queryBuilder = supabase
          .from("appointment_slots")
          .select(`
            id,
            date,
            start_time,
            end_time,
            status,
            availability_blocks!inner (
              professional_id,
              professional:professionals (
                id,
                name
              ),
              specialty:specialties (
                id,
                name
              )
            ),
            appointments (
              id,
              status,
              notes,
              clinical_notes,
              created_at,
              patient:patients (
                id,
                name,
                phone,
                birth_date
              ),
              specialty:specialties (
                id,
                name
              )
            )
          `)
          .eq("date", date);

        if (professionalId) {
          queryBuilder = queryBuilder.eq("availability_blocks.professional_id", professionalId);
        }

        const { data, error: fetchError } = await queryBuilder;
        if (fetchError) throw fetchError;

        if (active) {
          const mapped: MappedSlot[] = (data || []).map((slot: any) => {
            const appointment = slot.appointments 
              ? (Array.isArray(slot.appointments) ? slot.appointments[0] : slot.appointments) 
              : null;
            const block = slot.availability_blocks;
            const prof = block?.professional 
              ? (Array.isArray(block.professional) ? block.professional[0] : block.professional) 
              : null;
            const spec = block?.specialty 
              ? (Array.isArray(block.specialty) ? block.specialty[0] : block.specialty) 
              : null;

            return {
              id: slot.id,
              date: slot.date,
              start_time: slot.start_time,
              end_time: slot.end_time,
              status: slot.status,
              professional: prof ? { id: prof.id, name: prof.name } : null,
              specialty: spec ? { id: spec.id, name: spec.name } : null,
              appointment: appointment ? {
                id: appointment.id,
                status: appointment.status,
                notes: appointment.notes,
                clinical_notes: appointment.clinical_notes || "",
                created_at: appointment.created_at,
                patient: appointment.patient 
                  ? (Array.isArray(appointment.patient) ? appointment.patient[0] : appointment.patient) 
                  : null,
                specialty: appointment.specialty 
                  ? (Array.isArray(appointment.specialty) ? appointment.specialty[0] : appointment.specialty) 
                  : null
              } : null
            };
          });

          // Ordenação cronológica
          mapped.sort((a, b) => a.start_time.localeCompare(b.start_time));
          setSlots(mapped);
        }
      } catch (err: any) {
        console.error("[LOAD_WORKSPACE_SLOTS_ERROR]:", err);
        if (active) {
          setError("Erro ao conectar com o banco do Supabase.");
          setSlots([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadSlots();
    return () => { active = false; };
  }, [date, professionalId, refreshCount]);

  // Filtro client-side reativo rápido
  const visibleSlots = useMemo(() => {
    return slots.filter((slot) => {
      const slotStatus = getStatusKey(slot);
      
      const matchesSpecialty = !specialtyId || slot.specialty?.id === specialtyId;
      const matchesStatus = status === "all" || slotStatus === status;
      
      let matchesPeriod = true;
      const startHour = parseInt(slot.start_time.split(":")[0], 10);
      if (period === "morning") {
        matchesPeriod = startHour < 12;
      } else if (period === "afternoon") {
        matchesPeriod = startHour >= 12 && startHour < 18;
      } else if (period === "evening") {
        matchesPeriod = startHour >= 18;
      }

      const searchTerms = [
        slot.appointment?.patient?.name,
        slot.appointment?.patient?.phone,
        slot.professional?.name,
        slot.specialty?.name
      ].filter(Boolean).join(" ").toLowerCase();
      const matchesQuery = !query.trim() || searchTerms.includes(query.trim().toLowerCase());

      return matchesSpecialty && matchesStatus && matchesPeriod && matchesQuery;
    });
  }, [slots, specialtyId, status, period, query]);

  // Estatísticas rápidas de volumetria do dia
  const stats = useMemo(() => {
    return {
      total: visibleSlots.length,
      available: visibleSlots.filter(s => getStatusKey(s) === "available").length,
      confirmed: visibleSlots.filter(s => getStatusKey(s) === "confirmed").length,
      pending: visibleSlots.filter(s => getStatusKey(s) === "pending").length,
    };
  }, [visibleSlots]);

  // Alteração física de status
  const handleStatusChange = (appointmentId: string, newStatus: "pending" | "confirmed" | "cancelled" | "completed") => {
    setError(null);
    startTransition(async () => {
      try {
        await updateAppointmentStatusAction(appointmentId, newStatus);
        setRefreshCount(prev => prev + 1);
        
        // Atualiza drawer
        if (activeSlot?.appointment?.id === appointmentId) {
          setActiveSlot(prev => {
            if (!prev || !prev.appointment) return null;
            return {
              ...prev,
              appointment: {
                ...prev.appointment,
                status: newStatus
              }
            };
          });
        }
      } catch {
        setError("Erro ao atualizar o status no Supabase.");
      }
    });
  };

  // Funções de apoio
  const navigateDay = (offset: number) => {
    const current = new Date(date + "T00:00:00");
    current.setDate(current.getDate() + offset);
    setDate(current.toISOString().split("T")[0]);
  };

  const copyToClipboard = (text: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const saveLocalNote = (slotId: string) => {
    setLocalNotesMap(prev => ({ ...prev, [slotId]: localNote }));
    setLocalNoteSaved(true);
    setTimeout(() => setLocalNoteSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* 2. Barra Superior Operacional */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-5 bg-card/60 border border-border rounded-3xl backdrop-blur-md shadow-xs">
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Botão Hoje */}
          <button 
            type="button" 
            onClick={() => setDate(todayString())}
            className="ui-focus-ring px-4 py-2 text-xs font-bold bg-accent text-accent-foreground rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            Hoje
          </button>
          
          {/* Navegação de data */}
          <div className="flex items-center border border-border bg-card rounded-xl overflow-hidden">
            <button 
              type="button" 
              onClick={() => navigateDay(-1)}
              className="p-2.5 text-foreground hover:bg-muted transition-colors border-r border-border cursor-pointer"
              aria-label="Dia Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            />
            <button 
              type="button" 
              onClick={() => navigateDay(1)}
              className="p-2.5 text-foreground hover:bg-muted transition-colors border-l border-border cursor-pointer"
              aria-label="Próximo Dia"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Botão Atualizar */}
          <button
            type="button"
            onClick={() => setRefreshCount(prev => prev + 1)}
            disabled={isLoading}
            className="ui-focus-ring p-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Sincronizar com Supabase"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </button>
        </div>

        {/* Estatísticas Rápidas do Dia */}
        <div className="flex flex-wrap items-center gap-5 text-2xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-muted/40 border border-border px-3 py-1 rounded-full text-foreground">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            {stats.total} slots
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" />
            {stats.available} livres
          </span>
          <span className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400">
            <Calendar className="h-3.5 w-3.5" />
            {stats.confirmed} confirmados
          </span>
          <span className="flex items-center gap-1.5 bg-warning/10 border border-warning/20 px-3 py-1 rounded-full text-warning">
            <Clock3 className="h-3.5 w-3.5" />
            {stats.pending} pendentes
          </span>
        </div>

      </div>

      {/* Grid Principal: Filtros + Grade */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* 3. Painel Lateral de Filtros */}
        <aside className="w-full xl:w-72 shrink-0 xl:sticky xl:top-24 space-y-6">
          <Card className="p-5 border border-border bg-card/40 backdrop-blur-md space-y-5">
            
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <Filter className="h-4 w-4 text-accent" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Filtros da Fila</h3>
            </div>

            {/* Pesquisa */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pesquisa rápida</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Nome do paciente..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:border-accent text-xs placeholder:text-muted-foreground text-foreground"
                />
              </div>
            </div>

            {/* Especialidades */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Especialidade</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={specialtyId}
                  onChange={(e) => {
                    setSpecialtyId(e.target.value);
                    setProfessionalId(""); // Reseta profissional ao trocar especialidade
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-accent text-foreground cursor-pointer font-medium"
                >
                  <option value="">Todas Especialidades</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profissional */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Profissional</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-accent text-foreground cursor-pointer font-medium"
                >
                  <option value="">Todos Profissionais</option>
                  {filteredProfessionalsList.map((prof) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status da Consulta</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusFilter)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-accent text-foreground cursor-pointer font-medium"
                >
                  <option value="all">Todos Status</option>
                  <option value="available">Disponível (Livre)</option>
                  <option value="pending">Pendente (Reservado)</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="blocked">Bloqueado</option>
                </select>
              </div>
            </div>

            {/* Período */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Período</label>
              <div className="relative">
                <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-accent text-foreground cursor-pointer font-medium"
                >
                  <option value="all">Todos Períodos</option>
                  <option value="morning">Manhã (Antes das 12h)</option>
                  <option value="afternoon">Tarde (12h às 18h)</option>
                  <option value="evening">Noite (Após 18h)</option>
                </select>
              </div>
            </div>

          </Card>
        </aside>

        {/* 4. Nova Grade da Agenda */}
        <section className="flex-1 w-full space-y-6">
          
          <div className="p-6 bg-card/30 border border-border rounded-3xl backdrop-blur-md">
            
            <header className="border-b border-border/60 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Painel da Grade</span>
                <h2 className="font-heading text-lg font-extrabold text-foreground capitalize mt-0.5">
                  {formatDateHeader(date)}
                </h2>
              </div>
            </header>

            {/* Renderização de Estados */}
            {isLoading ? (
              <div className="space-y-5 py-8" role="status" aria-live="polite">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="h-28 w-full bg-card border border-border/60 rounded-2xl animate-pulse flex items-center justify-between p-5">
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-muted rounded" />
                      <div className="h-3 w-48 bg-muted rounded" />
                    </div>
                    <div className="h-10 w-24 bg-muted rounded-xl" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-4 text-sm text-danger font-medium text-center">
                {error}
              </p>
            ) : visibleSlots.length === 0 ? (
              <EmptyState 
                title="Agenda vazia para este dia"
                description={query || specialtyId || status !== "all" || period !== "all" 
                  ? "Nenhum slot atendeu aos critérios de busca informados." 
                  : "Não há blocos de horários ativos ou consultas cadastradas nesta data."}
                icon={<CalendarDays className="h-10 w-10 text-muted-foreground" />}
              />
            ) : (
              
              /* Timeline de slots */
              <div className="space-y-4">
                {visibleSlots.map((slot) => {
                  const statusKey = getStatusKey(slot);
                  const config = statusConfig[statusKey] || statusConfig.blocked;
                  const appointment = slot.appointment;
                  
                  // Observação unificada
                  const activeNote = localNotesMap[slot.id] || appointment?.notes;

                  return (
                    <div 
                      key={slot.id}
                      className={cn(
                        "relative flex flex-col md:flex-row items-stretch md:items-center gap-4 p-5 rounded-2xl border transition-all duration-300 group",
                        config.bg,
                        config.border
                      )}
                    >
                      
                      {/* Horário (Timeline) */}
                      <div className="flex md:flex-col items-baseline md:items-center justify-between md:justify-center w-full md:w-20 shrink-0 border-b md:border-b-0 md:border-r border-border/40 pb-3 md:pb-0 md:pr-4">
                        <span className="text-sm font-extrabold text-foreground tracking-tight">
                          {slot.start_time.substring(0, 5)}
                        </span>
                        <span className="text-2xs text-muted-foreground font-medium mt-0.5">
                          Até {slot.end_time.substring(0, 5)}
                        </span>
                      </div>

                      {/* Conteúdo principal */}
                      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        <div className="space-y-1.5 min-w-0">
                          
                          <div className="flex flex-wrap items-center gap-2">
                            {appointment?.patient ? (
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xs font-bold uppercase shrink-0">
                                  {appointment.patient.name.charAt(0)}
                                </div>
                                <h4 className="font-heading text-sm font-bold text-foreground truncate max-w-[200px] md:max-w-xs">
                                  {appointment.patient.name}
                                </h4>
                              </div>
                            ) : (
                              <h4 className="font-heading text-sm font-bold text-foreground">
                                Slot Livre / Disponível
                              </h4>
                            )}
                            
                            {/* Tempo Restante */}
                            {slot.status === "available" || (appointment && appointment.status !== "completed" && appointment.status !== "cancelled") ? (
                              <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
                                {getRemainingTimeText(slot.date, slot.start_time)}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-2xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Stethoscope className="h-3.5 w-3.5 text-accent/80" />
                              {slot.specialty?.name || "Especialidade"}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-accent/80" />
                              {slot.professional?.name || "Médico"}
                            </span>
                          </div>

                          {activeNote && (
                            <p className="text-2xs text-muted-foreground line-clamp-1 italic mt-1">
                              "{activeNote}"
                            </p>
                          )}

                        </div>

                        {/* Status + Ações Rápidas */}
                        <div className="flex items-center gap-3 shrink-0 justify-end mt-2 md:mt-0">
                          
                          {/* Badge de Status com Tooltip virtual */}
                          <span 
                            title={config.label}
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-2xs font-bold border transition-colors select-none",
                              config.text,
                              "bg-card/40 border-border"
                            )}
                          >
                            {config.icon}
                            {config.label}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setLocalNote(localNotesMap[slot.id] || appointment?.notes || "");
                              setActiveSlot(slot);
                              setIsDrawerOpen(true);
                            }}
                            className="ui-focus-ring inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                            title="Ver detalhes da agenda"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>

            )}

          </div>

        </section>

      </div>

      {/* 6. Drawer Lateral de Consultas */}
      {activeSlot && (
        <div className={cn(
          "fixed inset-0 z-50 overflow-hidden transition-all duration-300",
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)} 
          />

          <div className={cn(
            "absolute inset-y-0 right-0 w-full max-w-md bg-card border-l border-border flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out transform",
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          )}>
            
            {/* Header Drawer */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-accent">Central de Horários</span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-0.5">Visão do Horário</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted text-foreground transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conteúdo Drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status do Slot */}
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-2xl">
                <span className="text-xs font-bold text-foreground">Status Atual:</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors select-none",
                  statusConfig[getStatusKey(activeSlot)].bg,
                  statusConfig[getStatusKey(activeSlot)].text,
                  statusConfig[getStatusKey(activeSlot)].border
                )}>
                  {statusConfig[getStatusKey(activeSlot)].icon}
                  {statusConfig[getStatusKey(activeSlot)].label}
                </span>
              </div>

              {/* Informações da Agenda */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                  Atendimento & Profissional
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Especialidade</span>
                      <span className="font-bold text-foreground">{activeSlot.specialty?.name || "Especialidade não vinculada"}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Médico / Especialista</span>
                      <span className="font-bold text-foreground">{activeSlot.professional?.name || "Sem profissional"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Data da Agenda</span>
                      <span className="font-bold text-foreground">
                        {activeSlot.date.split("-").reverse().join("/")}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Horário reservado</span>
                      <span className="font-bold text-foreground">
                        {activeSlot.start_time.substring(0, 5)} - {activeSlot.end_time.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Paciente */}
              {activeSlot.appointment?.patient ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                    Dados do Paciente
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Nome</span>
                      <span className="font-bold text-foreground">{activeSlot.appointment.patient.name}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-2xs text-muted-foreground block font-medium">Telefone</span>
                        <span className="font-bold text-foreground flex items-center gap-1.5">
                          {formatPhoneNumber(activeSlot.appointment.patient.phone)}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(activeSlot.appointment?.patient?.phone || null)}
                            className="text-accent hover:text-accent/80 transition-colors cursor-pointer"
                            title="Copiar telefone"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          {copiedId === activeSlot.appointment.patient.phone && (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 rounded">Copiado!</span>
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="text-2xs text-muted-foreground block font-medium">Data de Nascimento</span>
                        <span className="font-bold text-foreground">
                          {formatBirthDate(activeSlot.appointment.patient.birth_date) || "Não cadastrado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground font-medium">Este slot está disponível e não possui paciente vinculado.</p>
                </div>
              )}

              {/* Notas e Observações */}
              {activeSlot.appointment && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                    Observações e Notas Clínicas
                  </h4>

                  <div className="space-y-3">
                    {/* Nota do Paciente */}
                    {activeSlot.appointment.notes && (
                      <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground block">Mensagem do Paciente:</span>
                        <p className="text-xs text-foreground leading-relaxed">
                          {activeSlot.appointment.notes}
                        </p>
                      </div>
                    )}

                    {/* Evolução Clínica (Apenas leitura) */}
                    {activeSlot.appointment.clinical_notes && (
                      <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 block flex items-center gap-1">
                          <ClipboardCheck className="h-3 w-3" /> Prontuário Médico (Histórico):
                        </span>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                          {activeSlot.appointment.clinical_notes}
                        </p>
                      </div>
                    )}

                    {/* Editar Observação da Recepção */}
                    <div className="space-y-2">
                      <label className="text-2xs font-bold text-muted-foreground block">Observações da Recepção:</label>
                      <textarea
                        rows={2}
                        value={localNote}
                        onChange={(e) => setLocalNote(e.target.value)}
                        placeholder="Escreva notas da recepção para esta consulta..."
                        className="w-full p-2.5 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:border-accent focus:bg-card transition-colors resize-none placeholder:text-muted-foreground"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => saveLocalNote(activeSlot.id)}
                          className="ui-focus-ring inline-flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-2xs font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
                        >
                          Salvar Nota
                        </button>
                        {localNoteSaved && (
                          <span className="text-2xs text-emerald-400 font-bold ml-2 self-center">Salvo localmente!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Ações */}
            <div className="p-6 border-t border-border bg-muted/20 space-y-3">
              
              {activeSlot.appointment && (
                <>
                  <div className="flex gap-3">
                    {activeSlot.appointment.status === "pending" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(activeSlot.appointment!.id, "confirmed")}
                        className="flex-1 ui-focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                        Confirmar
                      </button>
                    )}

                    {activeSlot.appointment.status === "confirmed" && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(activeSlot.appointment!.id, "completed")}
                        className="flex-1 ui-focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                        Concluir
                      </button>
                    )}

                    {(activeSlot.appointment.status === "pending" || activeSlot.appointment.status === "confirmed") && (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(activeSlot.appointment!.id, "cancelled")}
                        className="flex-1 ui-focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-danger/30 hover:border-danger bg-danger/5 hover:bg-danger/10 text-danger text-sm font-semibold active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </button>
                    )}
                  </div>

                  {activeSlot.appointment.patient?.phone && (
                    <div className="flex gap-3">
                      <a
                        href={getWhatsAppHref(activeSlot)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full ui-focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-xs font-bold text-emerald-400 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 text-emerald-400" />
                        WhatsApp
                      </a>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
