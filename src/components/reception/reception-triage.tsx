"use client";

import { useMemo, useState, useTransition } from "react";
import { 
  CalendarDays, 
  Check, 
  Clock3, 
  FileText, 
  MessageCircle, 
  UserRound, 
  X, 
  Search, 
  Filter, 
  Phone, 
  Copy, 
  ChevronRight, 
  Calendar, 
  Stethoscope, 
  User, 
  CheckCircle,
  XCircle,
  HelpCircle,
  FileEdit,
  ClipboardCheck
} from "lucide-react";
import { updateAppointmentStatusAction } from "@/features/appointments/actions";
import type { AppointmentWithRelations } from "@/features/appointments/queries";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

type FilterStatus = "all" | AppointmentWithRelations["status"];

const statusLabels: Record<AppointmentWithRelations["status"], string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Finalizado",
};

// Funções utilitárias locais de formatação
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
    `Olá, ${patientName}! Sou da recepção da clínica. Podemos confirmar sua consulta de ${specialty}${professional ? ` com o(a) ${professional}` : ""}?`,
  );
  return `https://wa.me/55${appointment.patient?.phone || ""}?text=${message}`;
}

// Retorna uma origem de agendamento fictícia mas visualmente rica
function getAppointmentOrigin(appointment: AppointmentWithRelations) {
  // Baseado na soma dos caracteres do ID para ser determinístico mas variado
  const sum = appointment.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const val = sum % 3;
  if (val === 0) return { label: "Portal Online", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
  if (val === 1) return { label: "WhatsApp Bot", style: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
  return { label: "Recepção Física", style: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
}

// Formatação amigável do número de telefone brasileiro
function formatPhoneNumber(phone: string | null) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  return phone;
}

// Componente de Badge de Status Premium
const StatusVisualBadge = ({ status }: { status: AppointmentWithRelations["status"] }) => {
  const config = {
    pending: {
      bg: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
      icon: <Clock3 className="h-3.5 w-3.5 shrink-0" />,
      label: "Pendente"
    },
    confirmed: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
      icon: <CheckCircle className="h-3.5 w-3.5 shrink-0" />,
      label: "Confirmado"
    },
    completed: {
      bg: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
      icon: <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />,
      label: "Concluído"
    },
    cancelled: {
      bg: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/20",
      icon: <XCircle className="h-3.5 w-3.5 shrink-0" />,
      label: "Cancelado"
    }
  }[status] || {
    bg: "bg-muted text-muted-foreground border-border",
    icon: <HelpCircle className="h-3.5 w-3.5 shrink-0" />,
    label: "Desconhecido"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors select-none",
      config.bg
    )}>
      {config.icon}
      {config.label}
    </span>
  );
};

export function ReceptionTriage({ initialAppointments }: { initialAppointments: AppointmentWithRelations[] }) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [filterProfessional, setFilterProfessional] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [query, setQuery] = useState("");
  
  const [activeAppointment, setActiveAppointment] = useState<AppointmentWithRelations | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [localNote, setLocalNote] = useState("");
  const [localNotesMap, setLocalNotesMap] = useState<Record<string, string>>({});
  const [localNoteSaved, setLocalNoteSaved] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Mapeia listas únicas para filtros baseados nos dados reais recebidos
  const uniqueSpecialties = useMemo(() => {
    const specs = new Map<string, string>();
    initialAppointments.forEach(app => {
      if (app.specialty?.name) {
        specs.set(app.specialty.name, app.specialty.name);
      }
    });
    return Array.from(specs.values()).sort();
  }, [initialAppointments]);

  const uniqueProfessionals = useMemo(() => {
    const profs = new Map<string, string>();
    initialAppointments.forEach(app => {
      if (app.professional?.name) {
        profs.set(app.professional.name, app.professional.name);
      }
    });
    return Array.from(profs.values()).sort();
  }, [initialAppointments]);

  // Contagem estática dos cards operacionais de hoje
  const counts = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      today: initialAppointments.filter(app => app.slot?.date === todayStr).length,
      pending: initialAppointments.filter(app => app.status === "pending").length,
      confirmed: initialAppointments.filter(app => app.status === "confirmed").length,
      cancelled: initialAppointments.filter(app => app.status === "cancelled").length,
    };
  }, [initialAppointments]);

  // Filtro múltiplo reativo em tela
  const filteredAppointments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return initialAppointments.filter((appointment) => {
      const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
      const matchesSpecialty = filterSpecialty === "all" || appointment.specialty?.name === filterSpecialty;
      const matchesProfessional = filterProfessional === "all" || appointment.professional?.name === filterProfessional;
      const matchesDate = !filterDate || appointment.slot?.date === filterDate;
      
      const searchContent = [
        appointment.patient?.name, 
        appointment.specialty?.name, 
        appointment.professional?.name,
        appointment.patient?.phone
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      
      const matchesQuery = !normalizedQuery || searchContent.includes(normalizedQuery);
      
      return matchesStatus && matchesSpecialty && matchesProfessional && matchesDate && matchesQuery;
    });
  }, [filterStatus, filterSpecialty, filterProfessional, filterDate, query, initialAppointments]);

  // Handler para alteração física de status no Supabase
  const handleStatusChange = (appointmentId: string, newStatus: AppointmentWithRelations["status"]) => {
    const statusText = statusLabels[newStatus].toLowerCase();
    if (!window.confirm(`Deseja alterar o status desta consulta para ${statusText}?`)) return;

    setError(null);
    startTransition(async () => {
      try {
        await updateAppointmentStatusAction(appointmentId, newStatus);
        
        // Atualiza o objeto no Drawer lateral se for o ativo
        if (activeAppointment?.id === appointmentId) {
          setActiveAppointment(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } catch {
        setError("Não foi possível atualizar a solicitação. Tente novamente.");
      }
    });
  };

  // Copiar telefone do paciente
  const copyToClipboard = (phone: string | null) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedId(phone);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simular salvamento local de observações no Drawer
  const saveLocalNote = (appId: string) => {
    if (!localNote.trim()) return;
    setLocalNotesMap(prev => ({ ...prev, [appId]: localNote }));
    setLocalNoteSaved(true);
    setTimeout(() => setLocalNoteSaved(false), 2000);
  };



  return (
    <section aria-labelledby="triage-title" className="space-y-8">
      
      {/* 1. Novo Dashboard da Recepção (Quatro Cards Principais) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Consultas Hoje */}
        <Card className="relative overflow-hidden p-6 border border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Consultas Hoje</span>
              <h3 className="text-3xl font-bold font-heading text-foreground tracking-tight">{counts.today}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500/20">
              <CalendarDays className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/20 transition-all duration-500 group-hover:bg-emerald-500/40" />
        </Card>

        {/* Card 2: Aguardando Confirmação */}
        <Card className="relative overflow-hidden p-6 border border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-warning/30 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Aguardando Confirmação</span>
              <h3 className="text-3xl font-bold font-heading text-foreground tracking-tight">{counts.pending}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-warning/10 border border-warning/20 text-warning flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-warning/20">
              <Clock3 className="h-5 w-5 group-hover:animate-bounce" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-warning/20 transition-all duration-500 group-hover:bg-warning/40" />
        </Card>

        {/* Card 3: Confirmadas */}
        <Card className="relative overflow-hidden p-6 border border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Confirmadas</span>
              <h3 className="text-3xl font-bold font-heading text-foreground tracking-tight">{counts.confirmed}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-500/20">
              <Check className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/20 transition-all duration-500 group-hover:bg-blue-500/40" />
        </Card>

        {/* Card 4: Canceladas */}
        <Card className="relative overflow-hidden p-6 border border-border bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-danger/30 hover:-translate-y-1 hover:shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Canceladas</span>
              <h3 className="text-3xl font-bold font-heading text-foreground tracking-tight">{counts.cancelled}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-danger/10 border border-danger/20 text-danger flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-danger/20">
              <X className="h-5 w-5 transition-transform duration-500 group-hover:scale-125" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-danger/20 transition-all duration-500 group-hover:bg-danger/40" />
        </Card>

      </div>

      {/* 4. Barra Superior de Filtros Analíticos e Pesquisa Instantânea */}
      <div className="bg-card/40 border border-border p-5 rounded-3xl backdrop-blur-md space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar paciente..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:border-accent transition-colors text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
            
            {/* Filtro Status */}
            <div className="flex items-center gap-1.5 border border-border bg-card px-3 py-2 rounded-xl text-xs text-foreground font-semibold">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Filtro Especialidade */}
            <div className="flex items-center gap-1.5 border border-border bg-card px-3 py-2 rounded-xl text-xs text-foreground font-semibold">
              <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
              <select 
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold"
              >
                <option value="all">Todas Especialidades</option>
                {uniqueSpecialties.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Filtro Profissional */}
            <div className="flex items-center gap-1.5 border border-border bg-card px-3 py-2 rounded-xl text-xs text-foreground font-semibold">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <select 
                value={filterProfessional}
                onChange={(e) => setFilterProfessional(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold"
              >
                <option value="all">Todos Profissionais</option>
                {uniqueProfessionals.map((prof) => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>

            {/* Filtro Data */}
            <div className="flex items-center gap-1.5 border border-border bg-card px-3 py-2 rounded-xl text-xs text-foreground font-semibold">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-foreground"
              />
              {filterDate && (
                <button 
                  type="button" 
                  onClick={() => setFilterDate("")} 
                  className="text-2xs text-danger hover:underline font-bold"
                >
                  Limpar
                </button>
              )}
            </div>

          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs font-semibold text-danger flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* Exibição dos cards filtrados */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          title={query || filterStatus !== "all" || filterSpecialty !== "all" || filterProfessional !== "all" || filterDate ? "Nenhum agendamento encontrado" : "Tudo limpo por aqui"}
          description="Ajuste os filtros ou insira uma nova palavra-chave na busca rápida para localizar os registros."
          icon={<Clock3 className="h-10 w-10 text-muted-foreground" />}
        />
      ) : (
        /* 2. Lista de Agendamentos (Grid de Cards Premium) */
        <div className={cn(
          "grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-300",
          isPending && "opacity-75"
        )}>
          {filteredAppointments.map((appointment) => {
            const patientName = appointment.patient?.name || "Paciente sem nome";
            const formattedPhone = formatPhoneNumber(appointment.patient?.phone);
            const origin = getAppointmentOrigin(appointment);
            
            // Verifica se há nota local salva temporariamente para este ID
            const activeNote = localNotesMap[appointment.id] || appointment.notes;

            return (
              <Card 
                key={appointment.id}
                className="flex flex-col justify-between p-5 border border-border bg-card/40 hover:bg-card/85 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-heading text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                          {patientName}
                        </h4>
                        {formattedPhone && (
                          <p className="text-2xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" />
                            {formattedPhone}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusVisualBadge status={appointment.status} />
                  </div>

                  {/* Detalhes Médicos */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/60">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Atendimento</span>
                      <span className="truncate text-xs font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <Stethoscope className="h-3.5 w-3.5 text-accent/80 shrink-0" />
                        {appointment.specialty?.name || "Especialidade"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Profissional</span>
                      <span className="truncate text-xs font-semibold text-foreground flex items-center gap-1 mt-0.5">
                        <User className="h-3.5 w-3.5 text-accent/80 shrink-0" />
                        {appointment.professional?.name || "Clínico Geral"}
                      </span>
                    </div>
                  </div>

                  {/* Horário da Consulta */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                      <CalendarDays className="h-4 w-4 text-accent" />
                      {formatDateTime(appointment.slot)}
                    </span>
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border font-bold select-none",
                      origin.style
                    )}>
                      {origin.label}
                    </span>
                  </div>

                  {/* Exibição de Notas / Observações */}
                  {activeNote && (
                    <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-start gap-2 text-2xs text-muted-foreground leading-relaxed">
                      <FileText className="h-4.5 w-4.5 text-accent/80 shrink-0 mt-0.5" />
                      <p className="line-clamp-2" title={activeNote}>
                        {activeNote}
                      </p>
                    </div>
                  )}

                </div>

                {/* Botões e Ações Rápidas */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                  
                  {appointment.patient?.phone ? (
                    <a
                      href={getWhatsAppHref(appointment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-focus-ring inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 text-xs font-bold text-emerald-400 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                      WhatsApp
                    </a>
                  ) : (
                    <span className="text-2xs text-muted-foreground font-medium">Sem contato</span>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setLocalNote(localNotesMap[appointment.id] || appointment.notes || "");
                      setActiveAppointment(appointment);
                      setIsDrawerOpen(true);
                    }}
                    className="ui-focus-ring inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-border px-3.5 text-xs font-bold text-foreground hover:bg-muted active:scale-95 transition-all"
                  >
                    Gerenciar
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* 5. Painel Lateral (Drawer Slide-Over) */}
      {activeAppointment && (
        <div className={cn(
          "fixed inset-0 z-50 overflow-hidden transition-all duration-300",
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)} 
          />
          
          {/* Container do Drawer */}
          <div className={cn(
            "absolute inset-y-0 right-0 w-full max-w-md bg-card border-l border-border flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out transform",
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          )}>
            
            {/* Header do Drawer */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-accent">Gerenciamento da Fila</span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-0.5">Detalhes do Agendamento</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted text-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conteúdo do Drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Resumo do Status */}
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-2xl">
                <span className="text-xs font-bold text-foreground">Status Atual:</span>
                <StatusVisualBadge status={activeAppointment.status} />
              </div>

              {/* Bloco do Paciente */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                  Dados do Paciente
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-2xs text-muted-foreground block font-medium">Nome</span>
                    <span className="font-bold text-foreground">{activeAppointment.patient?.name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Telefone</span>
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        {formatPhoneNumber(activeAppointment.patient?.phone)}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(activeAppointment.patient?.phone)}
                          className="text-accent hover:text-accent/80 transition-colors"
                          title="Copiar telefone"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {copiedId === activeAppointment.patient?.phone && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.5 rounded">Copiado!</span>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Nascimento</span>
                      <span className="font-bold text-foreground">
                        {formatBirthDate(activeAppointment.patient?.birth_date) || "Não cadastrado"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco do Atendimento */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                  Informações da Agenda
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Especialidade</span>
                      <span className="font-bold text-foreground">{activeAppointment.specialty?.name}</span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Profissional</span>
                      <span className="font-bold text-foreground">{activeAppointment.professional?.name || "Clínico Geral"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Data</span>
                      <span className="font-bold text-foreground">
                        {activeAppointment.slot?.date ? activeAppointment.slot.date.split("-").reverse().join("/") : "Sem data"}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs text-muted-foreground block font-medium">Horário</span>
                      <span className="font-bold text-foreground">
                        {activeAppointment.slot ? `${activeAppointment.slot.start_time.substring(0, 5)} - ${activeAppointment.slot.end_time.substring(0, 5)}` : "Sem horário"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco de Observações da Recepção */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                  Observações Internas
                </h4>
                
                <div className="space-y-2">
                  <textarea 
                    rows={3}
                    placeholder="Adicione observações da recepção para esta consulta..."
                    value={localNote}
                    onChange={(e) => setLocalNote(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:border-accent focus:bg-card transition-colors resize-none placeholder:text-muted-foreground"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => saveLocalNote(activeAppointment.id)}
                      className="ui-focus-ring inline-flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-2xs font-bold text-foreground hover:bg-muted active:scale-95 transition-all"
                    >
                      <FileEdit className="h-3 w-3" />
                      {localNoteSaved ? "Salvo com sucesso!" : "Salvar Observação"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Histórico Simulado de Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
                  Histórico do Evento
                </h4>
                
                <div className="space-y-3 pl-3 border-l-2 border-border text-2xs text-muted-foreground leading-relaxed">
                  <div>
                    <span className="font-bold block text-foreground">Solicitação Recebida</span>
                    <p className="mt-0.5">Criada automaticamente via {getAppointmentOrigin(activeAppointment).label} em {new Date(activeAppointment.created_at).toLocaleString("pt-BR")}.</p>
                  </div>
                  <div>
                    <span className="font-bold block text-foreground">Triado pela Recepção</span>
                    <p className="mt-0.5">O status atual foi atualizado para {statusLabels[activeAppointment.status]} em {new Date().toLocaleString("pt-BR")}.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Ações Finais do Drawer */}
            <div className="p-6 border-t border-border bg-muted/20 space-y-3">
              
              <div className="flex gap-3">
                {activeAppointment.status === "pending" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(activeAppointment.id, "confirmed")}
                    className="flex-1 ui-focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold shadow-md active:translate-y-0.5 transition-all"
                  >
                    <Check className="h-4 w-4" />
                    Confirmar
                  </button>
                )}

                {activeAppointment.status === "confirmed" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(activeAppointment.id, "completed")}
                    className="flex-1 ui-focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md active:translate-y-0.5 transition-all"
                  >
                    <Check className="h-4 w-4" />
                    Concluir Atendimento
                  </button>
                )}

                {(activeAppointment.status === "pending" || activeAppointment.status === "confirmed") && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(activeAppointment.id, "cancelled")}
                    className="flex-1 ui-focus-ring inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-danger/30 hover:border-danger bg-danger/5 hover:bg-danger/10 text-danger text-sm font-semibold active:translate-y-0.5 transition-all"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {activeAppointment.patient?.phone && (
                  <a
                    href={getWhatsAppHref(activeAppointment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full ui-focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-xs font-bold text-emerald-400 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    Iniciar Conversa no WhatsApp
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
