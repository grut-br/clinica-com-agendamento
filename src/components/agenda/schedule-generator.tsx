"use client";

import { useActionState, useMemo, useState } from "react";
import { CalendarDays, Clock3, Plus, Trash2, LayoutGrid, CalendarPlus } from "lucide-react";
import { generateScheduleSlotsAction } from "@/features/appointments/actions";
import type { ActionState } from "@/lib/action-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Fade } from "@/components/motion/presets";

interface SpecialtyItem { id: string; name: string; slug: string; }
interface ProfessionalItem { id: string; name: string; specialty_id: string; }
interface Interval { id: number; start: string; end: string; }

const initialState: ActionState = { success: false, message: "" };

function todayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function ScheduleGenerator({ specialties, professionals }: { specialties: SpecialtyItem[]; professionals: ProfessionalItem[] }) {
  const [state, formAction, isPending] = useActionState(generateScheduleSlotsAction, initialState);
  const [specialtySlug, setSpecialtySlug] = useState(specialties[0]?.slug || "");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState(todayString);
  const [intervalMinutes, setIntervalMinutes] = useState("30");
  const [intervals, setIntervals] = useState<Interval[]>([{ id: 1, start: "08:00", end: "12:00" }]);

  const selectedSpecialty = specialties.find((specialty) => specialty.slug === specialtySlug);
  const filteredProfessionals = useMemo(() => selectedSpecialty ? professionals.filter((professional) => professional.specialty_id === selectedSpecialty.id) : [], [professionals, selectedSpecialty]);

  return (
    <Card className="overflow-hidden shadow-sm border-border">
      <div className="border-b border-border bg-surface px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-accent/10 p-3 text-accent" aria-hidden="true">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Operação</p>
            <h2 className="font-heading text-xl font-extrabold text-foreground tracking-tight">Geração de Grade</h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Crie blocos de horários disponíveis automaticamente. Defina a data, os turnos e a duração de cada consulta.
            </p>
          </div>
        </div>
      </div>
      
      <form action={formAction} className="bg-background px-6 py-6 sm:px-8 sm:py-8 space-y-8">
        {state.message && (
          <Fade>
            <div role={state.success ? "status" : "alert"} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm shadow-sm">
              <StatusBadge label={state.success ? "Sucesso" : "Atenção"} tone={state.success ? "success" : "danger"} />
              <p className="pt-0.5 font-medium text-foreground">{state.message}</p>
            </div>
          </Fade>
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Especialidade</label>
            <Select name="specialtySlug" value={specialtySlug} onChange={(event) => { setSpecialtySlug(event.target.value); setProfessionalId(""); }} disabled={isPending} className="w-full">
              <option value="">Selecione a especialidade</option>
              {specialties.map((specialty) => <option key={specialty.id} value={specialty.slug}>{specialty.name}</option>)}
            </Select>
          </div>
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Profissional</label>
            <Select name="professionalId" value={professionalId} onChange={(event) => setProfessionalId(event.target.value)} disabled={isPending || !filteredProfessionals.length} required className="w-full">
              <option value="">Selecione o profissional</option>
              {filteredProfessionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.name}</option>)}
            </Select>
          </div>
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Data da Agenda</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input name="date" type="date" required min={todayString()} value={date} onChange={(event) => setDate(event.target.value)} disabled={isPending} className="pl-10 w-full" />
            </div>
          </div>
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Duração (minutos)</label>
            <Select name="intervalMinutes" value={intervalMinutes} onChange={(event) => setIntervalMinutes(event.target.value)} disabled={isPending} className="w-full">
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">60 minutos</option>
            </Select>
          </div>
        </div>
        
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground border-b border-border pb-2 w-full mb-4">Turnos de Atendimento</legend>
          <div className="space-y-3">
            {intervals.map((interval, index) => (
              <Fade key={interval.id} className="flex flex-col sm:flex-row items-end gap-3 rounded-xl border border-border bg-surface p-4">
                <div className="w-full sm:flex-1 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Início</label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input name="startTime" type="time" required value={interval.start} onChange={(event) => setIntervals(intervals.map((current, currentIndex) => currentIndex === index ? { ...current, start: event.target.value } : current))} disabled={isPending} className="pl-10 font-heading text-sm" />
                  </div>
                </div>
                
                <div className="w-full sm:flex-1 space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fim</label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input name="endTime" type="time" required value={interval.end} onChange={(event) => setIntervals(intervals.map((current, currentIndex) => currentIndex === index ? { ...current, end: event.target.value } : current))} disabled={isPending} className="pl-10 font-heading text-sm" />
                  </div>
                </div>
                
                {intervals.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => setIntervals(intervals.filter((current) => current.id !== interval.id))} disabled={isPending} aria-label={`Remover turno ${index + 1}`} className="w-full sm:w-11 h-11 shrink-0 border-border hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-colors">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </Fade>
            ))}
          </div>
          
          <Button type="button" variant="outline" onClick={() => setIntervals([...intervals, { id: Date.now(), start: "14:00", end: "18:00" }])} disabled={isPending} className="w-full sm:w-auto border-dashed border-border text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Adicionar Turno
          </Button>
        </fieldset>
        
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-border pt-6 mt-6">
          <Button type="submit" disabled={isPending || !professionalId} className="w-full sm:w-auto px-8 min-h-12 shadow-sm font-semibold">
            {isPending ? (
              <>
                <Clock3 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Gerando horários...
              </>
            ) : (
              <>
                <CalendarPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Processar Grade
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
