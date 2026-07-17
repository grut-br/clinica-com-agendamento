"use client";

import React, { useActionState, useState, useMemo } from "react";
import { generateScheduleSlotsAction } from "../actions";
import { ActionState } from "@/lib/action-state";
import { Calendar, Clock, Sparkles, AlertCircle, CheckCircle2, Stethoscope, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
}

interface ProfessionalItem {
  id: string;
  name: string;
  specialty_id: string;
}

interface SlotGeneratorFormProps {
  specialties: SpecialtyItem[];
  professionals: ProfessionalItem[];
}

const initialState: ActionState = {
  success: false,
  message: "",
};

// Obter string local no formato YYYY-MM-DD
function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function SlotGeneratorForm({ specialties, professionals }: SlotGeneratorFormProps) {
  const [state, formAction, isPending] = useActionState(
    generateScheduleSlotsAction,
    initialState
  );

  const [date, setDate] = useState(getTodayString());
  const [specialtySlug, setSpecialtySlug] = useState(specialties[0]?.slug || "");
  
  // Inicialização do profissional de saúde baseado na especialidade padrão
  const initialProfessionalId = useMemo(() => {
    const firstSpec = specialties[0];
    if (!firstSpec) return "";
    const filtered = professionals.filter((p) => p.specialty_id === firstSpec.id);
    return filtered[0]?.id || "";
  }, [specialties, professionals]);

  const [professionalId, setProfessionalId] = useState(initialProfessionalId);
  const [intervals, setIntervals] = useState([{ id: 1, startTime: "08:00", endTime: "12:00" }]);
  const [intervalMinutes, setIntervalMinutes] = useState("30");

  // Encontra o ID da especialidade com base no slug selecionado
  const selectedSpecialtyId = useMemo(() => {
    const spec = specialties.find((s) => s.slug === specialtySlug);
    return spec ? spec.id : "";
  }, [specialtySlug, specialties]);

  // Filtra os profissionais vinculados à especialidade selecionada (cascata)
  const filteredProfessionals = useMemo(() => {
    if (!selectedSpecialtyId) return [];
    return professionals.filter((p) => p.specialty_id === selectedSpecialtyId);
  }, [professionals, selectedSpecialtyId]);

  // Lógica para sincronizar a especialidade e o primeiro profissional correspondente na mudança (Acessibilidade e performance)
  const handleSpecialtyChange = (slug: string) => {
    setSpecialtySlug(slug);
    const spec = specialties.find((s) => s.slug === slug);
    if (spec) {
      const filtered = professionals.filter((p) => p.specialty_id === spec.id);
      if (filtered.length > 0) {
        setProfessionalId(filtered[0].id);
      } else {
        setProfessionalId("");
      }
    } else {
      setProfessionalId("");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 text-card-foreground transition-colors duration-300">
      
      {/* Header do Gerador */}
      <div className="mb-6 pb-5 border-b border-border">
        <h2 className="text-lg font-bold flex items-center gap-2 text-card-foreground">
          <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
          Gerador de Grade de Horários
        </h2>
        <p className="text-xs text-zinc-500 font-light mt-1">
          Crie os slots de atendimento vinculando os horários diretamente ao médico ou profissional da clínica.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        
        {/* Feedback visual de Sucesso ou Erro */}
        {state.message && (
          state.success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-700 text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
              <p className="font-medium">{state.message}</p>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
              <p className="font-medium">{state.message}</p>
            </div>
          )
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Especialidade */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="specialtySlug" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Especialidade Médica/Odonto
            </label>
            <select
              id="specialtySlug"
              name="specialtySlug"
              disabled={isPending}
              value={specialtySlug}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-popover text-popover-foreground px-4 py-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer appearance-none shadow-sm"
            >
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.slug} className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Profissional de Saúde (Filtro em Cascata) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="professionalId" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-slate-450 dark:text-zinc-500" />
              Profissional de Saúde
            </label>
            <select
              id="professionalId"
              name="professionalId"
              disabled={isPending || !specialtySlug || filteredProfessionals.length === 0}
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
              className="w-full rounded-xl border border-border bg-popover text-popover-foreground px-4 py-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer appearance-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              {filteredProfessionals.length === 0 ? (
                <option value="" className="bg-popover text-popover-foreground">Nenhum médico nesta área...</option>
              ) : (
                filteredProfessionals.map((prof) => (
                  <option key={prof.id} value={prof.id} className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                    {prof.name}
                  </option>
                ))
              )}
            </select>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Data */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-450 dark:text-zinc-500" />
              Data da Agenda
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              disabled={isPending}
              value={date}
              min={getTodayString()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5"
            />
          </div>

          {/* Duração/Intervalo */}
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label htmlFor="intervalMinutes" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Duração da Consulta
            </label>
            <select
              id="intervalMinutes"
              name="intervalMinutes"
              disabled={isPending}
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(e.target.value)}
              className="w-full rounded-xl border border-border bg-popover text-popover-foreground px-4 py-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer appearance-none shadow-sm"
            >
              <option value="15" className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">15 minutos</option>
              <option value="30" className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">30 minutos</option>
              <option value="60" className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">60 minutos</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Horários de Atendimento (Turnos)
          </label>
          
          {intervals.map((interval, index) => (
            <div key={interval.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end bg-muted/10 p-4 rounded-xl border border-border">
              {/* Hora Início */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Hora de Início
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    name="startTime"
                    type="time"
                    required
                    disabled={isPending}
                    value={interval.startTime}
                    onChange={(e) => {
                      const newIntervals = [...intervals];
                      newIntervals[index].startTime = e.target.value;
                      setIntervals(newIntervals);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5"
                  />
                </div>
              </div>

              {/* Hora Fim */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Hora de Término
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    name="endTime"
                    type="time"
                    required
                    disabled={isPending}
                    value={interval.endTime}
                    onChange={(e) => {
                      const newIntervals = [...intervals];
                      newIntervals[index].endTime = e.target.value;
                      setIntervals(newIntervals);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-transparent text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5"
                  />
                </div>
              </div>

              {/* Botão Remover */}
              {intervals.length > 1 && (
                <Button
                  variant="danger"
                  size="icon"
                  disabled={isPending}
                  onClick={() => setIntervals(intervals.filter(i => i.id !== interval.id))}
                  className="h-11 w-11 rounded-xl shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setIntervals([...intervals, { id: Date.now(), startTime: "14:00", endTime: "18:00" }])}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
            Adicionar outro turno
          </Button>
        </div>

        <Button
          type="submit"
          disabled={isPending || filteredProfessionals.length === 0}
          variant="primary"
          className="w-full py-4 text-base font-extrabold shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed"
        >
          {isPending ? "Processando geração..." : "Gerar Grade de Horários"}
        </Button>

      </form>
    </div>
  );
}
