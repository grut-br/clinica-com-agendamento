"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2, Clock } from "lucide-react";
import { fetchDashboardCalendarSlotsAction } from "../actions";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ptBR } from "date-fns/locale";

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

interface SlotData {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface DashboardCalendarViewProps {
  specialties: SpecialtyItem[];
  professionals: ProfessionalItem[];
}

export function DashboardCalendarView({ specialties, professionals }: DashboardCalendarViewProps) {
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("");

  const [slots, setSlots] = useState<SlotData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const filteredProfessionals = useMemo(() => {
    if (!selectedSpecialtyId) return professionals;
    return professionals.filter(p => p.specialty_id === selectedSpecialtyId);
  }, [professionals, selectedSpecialtyId]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedProfessionalId) {
        setSlots([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchDashboardCalendarSlotsAction(selectedProfessionalId);
        setSlots(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSlots();
  }, [selectedProfessionalId]);

  const availableDates = useMemo(() => {
    return slots.map(slot => {
      // slot.date is YYYY-MM-DD
      const [year, month, day] = slot.date.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [slots]);

  const selectedDateSlots = useMemo(() => {
    if (!selectedDate) return [];
    // Convert selectedDate to YYYY-MM-DD
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;
    return slots.filter(s => s.date === formatted);
  }, [selectedDate, slots]);

  return (
    <div className="space-y-4">
      {/* Grid flexível de filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select 
          value={selectedSpecialtyId}
          onChange={(e) => {
            setSelectedSpecialtyId(e.target.value);
            setSelectedProfessionalId("");
          }}
          className="w-full rounded-xl border border-border bg-popover text-popover-foreground px-4 py-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer appearance-none shadow-sm"
        >
          <option value="" className="bg-popover text-popover-foreground">Filtrar Especialidade</option>
          {specialties.map(spec => (
            <option key={spec.id} value={spec.id} className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">
              {spec.name}
            </option>
          ))}
        </select>
        <select 
          value={selectedProfessionalId}
          onChange={(e) => setSelectedProfessionalId(e.target.value)}
          className="w-full rounded-xl border border-border bg-popover text-popover-foreground px-4 py-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 cursor-pointer appearance-none shadow-sm disabled:opacity-50"
          disabled={filteredProfessionals.length === 0}
        >
          <option value="" className="bg-popover text-popover-foreground">Filtrar Profissional</option>
          {filteredProfessionals.map(prof => (
            <option key={prof.id} value={prof.id} className="bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground">
              {prof.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Corpo do Calendário e Horários */}
      {!selectedProfessionalId ? (
        <div className="bg-card border border-border rounded-xl min-h-[400px] flex flex-col items-center justify-center text-center p-6 shadow-sm">
          <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">Selecione um profissional para carregar a grade</p>
        </div>
      ) : isLoading ? (
        <div className="bg-card border border-border rounded-xl min-h-[400px] flex flex-col items-center justify-center text-center p-6 shadow-sm">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Carregando agenda do profissional...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 bg-card border border-border rounded-xl p-6 shadow-sm">
          {/* Calendário */}
          <div className="flex justify-center md:justify-start border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
            <DayPicker 
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              modifiers={{ available: availableDates }}
              modifiersStyles={{
                available: { 
                  fontWeight: "bold", 
                  backgroundColor: "var(--primary, #0B1A3A)", 
                  color: "white", 
                  borderRadius: "100%" 
                }
              }}
              className="text-card-foreground"
            />
          </div>

          {/* Horários do dia selecionado */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {selectedDate ? `Horários em ${selectedDate.toLocaleDateString("pt-BR")}` : "Selecione uma data"}
            </h3>
            
            {!selectedDate ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
                <CalendarIcon className="h-8 w-8 mb-3 opacity-20" />
                <p className="text-sm">Clique em um dia destacado no calendário para ver os horários.</p>
              </div>
            ) : selectedDateSlots.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
                <Clock className="h-8 w-8 mb-3 opacity-20" />
                <p className="text-sm">Nenhum horário disponível para esta data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 content-start max-h-[350px] overflow-y-auto pr-2">
                {selectedDateSlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border bg-muted/30 text-sm font-medium hover:border-primary/50 transition-colors cursor-default">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {slot.start_time.substring(0, 5)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
