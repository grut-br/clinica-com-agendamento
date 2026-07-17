"use client";

import React, { useState, useActionState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  CalendarDays, 
  Clock3, 
  UserRound, 
  Phone, 
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  Stethoscope,
  Check,
  Info
} from "lucide-react";
import { bookPublicAppointmentAction, fetchPublicAvailableSlotsAction } from "../actions";
import { ActionState } from "@/lib/action-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Fade } from "@/components/motion/presets";
import { Button } from "@/components/ui/button";

interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
}

interface SlotItem {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  professional_id: string | null;
  professional: {
    id: string;
    name: string;
  } | null;
}

interface SchedulingFormProps {
  specialties: SpecialtyItem[];
  initialSpecialtyId: string;
}

const initialState: ActionState = {
  success: false,
  message: "",
};

export function SchedulingForm({ specialties, initialSpecialtyId }: SchedulingFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(initialSpecialtyId);

  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [selectedSlotProfessionalId, setSelectedSlotProfessionalId] = useState<string>("");
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string>("");
  
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [state, formAction, isPending] = useActionState(
    bookPublicAppointmentAction,
    initialState
  );

  const selectedSpecialtyName = useMemo(() => {
    const spec = specialties.find((s) => s.id === selectedSpecialtyId);
    return spec ? spec.name : "";
  }, [selectedSpecialtyId, specialties]);

  useEffect(() => {
    if (!selectedSpecialtyId) return;
    
    let active = true;
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const slots = await fetchPublicAvailableSlotsAction(selectedSpecialtyId);
        if (active) setAvailableSlots(slots);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    void loadSlots();
    return () => { active = false; };
  }, [selectedSpecialtyId]);

  const groupedSlotsByDate = useMemo(() => {
    const groups: Record<string, SlotItem[]> = {};
    availableSlots.forEach((slot) => {
      const date = slot.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(slot);
    });
    return groups;
  }, [availableSlots]);

  const handleSelectSlot = (slot: SlotItem) => {
    setSelectedSlotId(slot.id);
    setSelectedSlotProfessionalId(slot.professional_id || "");

    const [year, month, day] = slot.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;
    const timeFormatted = slot.start_time.substring(0, 5);
    const doctorName = slot.professional?.name || "Nossa equipe";

    setSelectedSlotLabel(`${dateFormatted} às ${timeFormatted} com ${doctorName}`);
    setStep(2);
  };

  const formatDayHeader = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`);
    const formatted = date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const getVisualStep = () => {
    if (state.success) return 4; // Confirmação
    if (step === 2) return 3; // Dados
    if (!selectedSpecialtyId) return 1; // Especialidade (fallback)
    return 2; // Horário
  };

  const visualStep = getVisualStep();

  return (
    <div className="w-full">
      {/* Visual Stepper */}
      <div className="mb-8 hidden sm:flex items-center justify-between relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-px before:bg-border before:z-0">
        {[
          { id: 1, label: "Especialidade", icon: Stethoscope },
          { id: 2, label: "Horário", icon: CalendarDays },
          { id: 3, label: "Dados", icon: UserRound },
          { id: 4, label: "Confirmação", icon: CheckCircle2 }
        ].map((s) => {
          const isActive = visualStep === s.id;
          const isPast = visualStep > s.id;
          
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive 
                    ? "border-accent bg-accent/10 text-accent" 
                    : isPast 
                      ? "border-accent bg-accent text-primary-foreground" 
                      : "border-border bg-surface text-muted-foreground"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {isPast ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </div>
              <span className={`text-xs font-semibold ${isActive || isPast ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex items-center gap-3 sm:hidden">
        {step === 2 && !state.success && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setStep(1)}
            disabled={isPending}
            className="p-2 -ml-2 rounded-full text-foreground shrink-0"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <span className="text-sm font-bold text-accent uppercase tracking-wider">
          Etapa {visualStep} de 4
        </span>
      </div>

      {state.success ? (
        <Fade className="text-center py-8">
          <div className="mx-auto h-20 w-20 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground mb-3">
            Solicitação Enviada!
          </h2>
          <p className="text-base text-muted-foreground max-w-md mx-auto mb-8">
            O horário escolhido <strong className="font-semibold text-foreground">permanece reservado</strong>. A recepção entrará em contato em breve via WhatsApp para confirmar a sua consulta e passar as orientações.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border hover:bg-surface text-foreground px-6 py-3.5 font-semibold transition-colors">
              Voltar ao Início
            </Link>
            <Link href="/especialidades" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-accent hover:bg-accent/90 text-primary-foreground px-6 py-3.5 font-bold transition-colors">
              Agendar Outra Consulta
            </Link>
          </div>
        </Fade>
      ) : step === 1 ? (
        <Fade className="space-y-8">
          <div className="space-y-3">
            <label htmlFor="specialty-select" className="text-sm font-bold text-foreground">
              Qual especialidade você procura?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Stethoscope className="h-5 w-5 text-accent" />
              </div>
              <select
                id="specialty-select"
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-surface pl-12 pr-10 py-4 text-base font-semibold text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedSpecialtyId && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
                Escolha o melhor dia e horário
              </h3>

              {loadingSlots ? (
                <div className="space-y-6" aria-live="polite" aria-busy="true">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-5 w-40 rounded-md" />
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface p-8 text-center flex flex-col items-center">
                  <CalendarDays className="h-10 w-10 text-muted-foreground mb-4" />
                  <h4 className="text-base font-bold text-foreground mb-2">Nenhum horário disponível</h4>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    A agenda para {selectedSpecialtyName} não possui vagas no momento. Por favor, tente outra especialidade ou entre em contato.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.keys(groupedSlotsByDate).map((date) => (
                    <div key={date} className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {formatDayHeader(date)}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {groupedSlotsByDate[date].map((slot) => (
                          <button
                            type="button"
                            key={slot.id}
                            onClick={() => handleSelectSlot(slot)}
                            className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-border bg-background hover:border-accent hover:bg-accent/5 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            <span className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                              {slot.start_time.substring(0, 5)}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1 truncate w-full text-center group-hover:text-foreground">
                              {slot.professional?.name?.split(" ")[0] || "Livre"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Fade>
      ) : (
        <Fade>
          <div className="flex items-center gap-3 mb-6 hidden sm:flex">
             <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setStep(1)}
              disabled={isPending}
              className="p-2 -ml-2 rounded-full text-foreground shrink-0"
              aria-label="Voltar para escolha de horário"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Preencha seus dados
            </h2>
          </div>

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="specialtyId" value={selectedSpecialtyId} />
            <input type="hidden" name="slotId" value={selectedSlotId} />
            <input type="hidden" name="professionalId" value={selectedSlotProfessionalId} />

            {!state.success && state.message && (
              <div className="flex items-start gap-3 rounded-xl bg-danger/10 p-4 border border-danger/20 text-danger" role="alert">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium pt-0.5">{state.message}</p>
              </div>
            )}

            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                <Clock3 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Sua Reserva</p>
                <p className="text-sm font-bold text-foreground">{selectedSlotLabel}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-foreground">Nome Completo <span className="text-danger">*</span></label>
                <div className="relative">
                  <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    disabled={isPending}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Como devemos lhe chamar?"
                    className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="whatsapp" className="text-sm font-bold text-foreground">WhatsApp <span className="text-danger">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      disabled={isPending}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(DD) 90000-0000"
                      className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="birthDate" className="text-sm font-bold text-foreground flex items-center justify-between">
                    Data de Nascimento
                    <span className="text-xs font-medium text-muted-foreground font-normal">Opcional</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      disabled={isPending}
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3.5 text-base text-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-bold text-foreground flex items-center justify-between">
                  Observações
                  <span className="text-xs font-medium text-muted-foreground font-normal">Opcional</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  disabled={isPending}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Informe necessidade de acessibilidade, sintomas breves ou convênio."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                variant="primary"
                className="w-full py-4 text-base font-extrabold shadow-sm"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-4">
              <Info className="h-3.5 w-3.5" /> Suas informações são confidenciais e seguras.
            </p>

          </form>
        </Fade>
      )}
    </div>
  );
}
