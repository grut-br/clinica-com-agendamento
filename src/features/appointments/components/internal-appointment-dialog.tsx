"use client";

import React, { useState, useTransition } from "react";
import { Plus, X, Calendar, Clock, User, Phone, Heart, CheckCircle, ShieldAlert } from "lucide-react";
import { createInternalAppointmentAction } from "../actions";
import { Button } from "@/components/ui/button";

interface Professional {
  id: string;
  name: string;
  is_active: boolean;
  specialty?: {
    id: string;
    name: string;
    category: string;
  } | null;
}

interface InternalAppointmentDialogProps {
  professionals: Professional[];
}

export function InternalAppointmentDialog({ professionals }: InternalAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showToast, setShowToast] = useState(false);

  const activeProfessionals = professionals.filter((p) => p.is_active);

  const handleOpen = () => {
    setIsOpen(true);
    setError("");
  };

  const handleClose = () => {
    if (isPending) return;
    setIsOpen(false);
    setPatientName("");
    setPatientPhone("");
    setProfessionalId("");
    setDate("");
    setTime("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!patientName || !patientPhone || !professionalId || !date || !time) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("patientName", patientName);
    formData.append("patientPhone", patientPhone);
    formData.append("professionalId", professionalId);
    formData.append("date", date);
    formData.append("time", time);

    startTransition(async () => {
      try {
        const response = await createInternalAppointmentAction(formData);

        if (!response.success) {
          setError(response.message || "Erro ao criar o agendamento.");
          return;
        }

        // Sucesso
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        handleClose();
      } catch (err) {
        console.error(err);
        setError("Ocorreu um erro crítico ao criar o agendamento.");
      }
    });
  };

  return (
    <>
      {/* Botão de Trigger (+ Novo Agendamento) */}
      <Button
        type="button"
        onClick={handleOpen}
        variant="primary"
      >
        <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
        Novo Agendamento
      </Button>

      {/* Modal / Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          
          {/* Overlay Escuro com Desfoque */}
          <div
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl flex flex-col text-card-foreground animate-in zoom-in-95 duration-200 z-10 overflow-hidden">
            
            {/* Cabeçalho */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
              <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                Agendamento Manual
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={isPending}
                aria-label="Fechar modal"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Corpo do Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                
                {/* Alerta de erro */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/55 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400 text-sm" role="alert">
                    <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                    <p className="leading-relaxed font-medium">{error}</p>
                  </div>
                )}

                {/* Nome do Paciente */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="patientName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nome do Paciente *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                    <input
                      id="patientName"
                      type="text"
                      required
                      disabled={isPending}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Nome completo do paciente"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/60 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Telefone de Contato */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="patientPhone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Telefone de Contato (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                    <input
                      id="patientPhone"
                      type="tel"
                      required
                      disabled={isPending}
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="(DD) 99999-9999"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/60 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Seleção do Profissional (Dropdown Dinâmico) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="professionalId" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Médico / Profissional *
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                    <select
                      id="professionalId"
                      required
                      disabled={isPending}
                      value={professionalId}
                      onChange={(e) => setProfessionalId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o profissional de saúde</option>
                      {activeProfessionals.map((prof) => (
                        <option key={prof.id} value={prof.id} className="bg-card text-foreground">
                          {prof.name} {prof.specialty ? `(${prof.specialty.name})` : ""}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-muted-foreground w-0 h-0" />
                  </div>
                </div>

                {/* Data e Horário em Grid Flex */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Data do Atendimento */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Data do Atendimento *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60 pointer-events-none" />
                      <input
                        id="date"
                        type="date"
                        required
                        disabled={isPending}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Horário *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60 pointer-events-none" />
                      <input
                        id="time"
                        type="time"
                        required
                        disabled={isPending}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Rodapé com botões de ação */}
              <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-end gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isPending}
                >
                  {isPending ? "Confirmando..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Toast flutuante de sucesso */}
      {showToast && (
        <div
          className="fixed bottom-5 right-5 z-[100] bg-zinc-900 border border-zinc-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300"
          role="status"
        >
          <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
          <span className="text-sm font-bold">Agendamento manual confirmado com sucesso!</span>
        </div>
      )}
    </>
  );
}
