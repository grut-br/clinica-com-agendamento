"use client";

import React, { useState } from "react";
import { User, Clock, Clipboard, Smile, Heart } from "lucide-react";
import { ClinicalNotesSheet } from "./clinical-notes-sheet";

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

interface DoctorAppointmentsListProps {
  appointments: AppointmentItem[];
}

export function DoctorAppointmentsList({ appointments }: DoctorAppointmentsListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  // Formatação de data e hora do slot
  const formatDateTime = (slot: AppointmentItem["slot"]) => {
    if (!slot) return "";
    const [year, month, day] = slot.date.split("-");
    const dateFormatted = `${day}/${month}/${year}`;
    const timeFormatted = slot.start_time.substring(0, 5);
    return `${dateFormatted} às ${timeFormatted}h`;
  };

  const handleOpenNotes = (appointment: AppointmentItem) => {
    setSelectedAppointment(appointment);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/85 rounded-3xl text-zinc-500 font-light text-sm shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center max-w-xl mx-auto">
          <Smile className="h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-base font-bold text-primary">Nenhum atendimento agendado</h3>
          <p className="text-xs text-zinc-450 font-light mt-1.5 leading-relaxed max-w-xs">
            Não existem consultas marcadas ou confirmadas para este profissional no dia de hoje.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-3xl">
          {appointments.map((app) => {
            const hasNotes = !!app.clinical_notes;

            return (
              <div 
                key={app.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-150/70 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-slate-200 transition-all group relative overflow-hidden"
              >
                {/* Linha indicativa de status preenchido */}
                <div className={`absolute top-0 bottom-0 left-0 w-[4px] ${
                  hasNotes ? "bg-emerald-500" : "bg-amber-400"
                }`} />

                <div className="flex items-start gap-3.5 pl-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-base flex items-center gap-2">
                      {app.patient.name}
                      {hasNotes && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-3xs font-bold text-emerald-700">
                          Evoluído
                        </span>
                      )}
                    </h4>
                    
                    {/* Horário & Especialidade */}
                    <div className="flex items-center gap-3.5 text-2xs font-semibold text-zinc-400 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-secondary shrink-0" />
                        {formatDateTime(app.slot)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 text-secondary shrink-0" />
                        {app.specialty.name}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenNotes(app)}
                  className="sm:self-center inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white py-2.5 px-5 text-xs font-bold shadow-md shadow-primary/10 transition-all active:scale-95 cursor-pointer"
                >
                  <Clipboard className="h-4 w-4 text-secondary" />
                  {hasNotes ? "Ver Prontuário" : "Atender / Prontuário"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-out Prontuário */}
      <ClinicalNotesSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
