"use client";

import React, { useState, useActionState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageSquare,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  Stethoscope,
  Smile
} from "lucide-react";
import { bookPublicAppointmentAction, fetchPublicAvailableSlotsAction } from "../actions";
import { ActionState } from "@/lib/action-state";

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
  availability_blocks?: {
    id: string;
    specialty_id: string;
    specialty?: {
      id: string;
      name: string;
    };
  };
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
  
  // Escolha da Especialidade (Etapa 1)
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(initialSpecialtyId);

  // Slots e status de carregamento da agenda (Etapa 2)
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Estados dos slots escolhidos
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [selectedSlotProfessionalId, setSelectedSlotProfessionalId] = useState<string>("");
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string>("");
  
  // Inputs do Paciente (Etapa 3)
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Hook useActionState do React 19 para a Server Action
  const [state, formAction, isPending] = useActionState(
    bookPublicAppointmentAction,
    initialState
  );

  // Nome da especialidade selecionada
  const selectedSpecialtyName = useMemo(() => {
    const spec = specialties.find((s) => s.id === selectedSpecialtyId);
    return spec ? spec.name : "";
  }, [selectedSpecialtyId, specialties]);

  // Busca os horários livres reais sempre que a especialidade muda
  useEffect(() => {
    if (!selectedSpecialtyId) return;
    
    let active = true;
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const slots = await fetchPublicAvailableSlotsAction(selectedSpecialtyId);
        if (active) {
          setAvailableSlots(slots);
        }
      } catch (err) {
        console.error("Erro ao carregar slots da especialidade:", err);
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [selectedSpecialtyId]);

  // Agrupa os slots por dia para facilitar a visualização do usuário
  const groupedSlotsByDate = useMemo(() => {
    const groups: Record<string, SlotItem[]> = {};
    availableSlots.forEach((slot) => {
      const date = slot.date;
      if (!groups[date]) {
        groups[date] = [];
      }
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
    const doctorName = slot.professional?.name || "Sem preferência";

    setSelectedSlotLabel(`${dateFormatted} às ${timeFormatted}h com ${doctorName}`);
    setStep(2);
  };

  const handleGoBack = () => {
    if (step === 2) setStep(1);
  };

  const formatDayHeader = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`);
    const options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "short" };
    const formatted = date.toLocaleDateString("pt-BR", options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className="w-full text-primary">
      
      {/* Indicador de Progresso Superior */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {step > 1 && !state.success && (
            <button 
              type="button"
              onClick={handleGoBack}
              disabled={isPending}
              className="p-2 rounded-full hover:bg-slate-50 border border-slate-200/60 text-primary transition-colors flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
              aria-label="Voltar etapa"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            {selectedSpecialtyName && (
              <span className="text-2xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {selectedSpecialtyName}
              </span>
            )}
            <h2 className="text-xl font-bold text-slate-900">
              {state.success 
                ? "Consulta Solicitada!" 
                : step === 1 
                  ? "Qual o atendimento?" 
                  : "Preencha seus dados de contato"
              }
            </h2>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-400">
          Etapa {state.success ? 3 : step} de 3
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TELA DE SUCESSO (ETAPA 4) */}
        {state.success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 flex flex-col items-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-xs animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Pedido de Agendamento Enviado!
            </h3>
            
            <p className="text-sm text-slate-600 leading-relaxed font-light max-w-md mb-8">
              Sua solicitação de atendimento foi registrada com sucesso. Nossa equipe entrará em contato via <strong className="font-bold text-emerald-600">WhatsApp</strong> para confirmar a sua consulta e enviar o preparo necessário.
            </p>

            <div className="w-full space-y-3">
              <Link
                href="/especialidades"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#0B1A3A] hover:bg-slate-800 text-white py-3.5 px-4 text-sm font-semibold transition-colors text-center"
              >
                Voltar para Especialidades
              </Link>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 py-3.5 px-4 text-sm font-semibold transition-all text-center"
              >
                Ir para o Início
              </Link>
            </div>
          </motion.div>
        ) : step === 1 ? (
          
          /* PASSO 1: SELEÇÃO DE ESPECIALIDADE E HORÁRIOS */
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="specialty" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Stethoscope className="h-4.5 w-4.5 text-[#D4AF37]" />
                Selecione a Especialidade Desejada
              </label>
              <select
                id="specialty"
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-[#0B1A3A]/50 focus:ring-2 focus:ring-[#0B1A3A]/5 cursor-pointer"
              >
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedSpecialtyId && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {loadingSlots ? (
                  <div className="py-16 text-center text-sm text-zinc-400 font-light flex items-center justify-center gap-2">
                    <span className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Carregando horários em tempo real...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-16 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 max-w-md mx-auto">
                    <Smile className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-900">Nenhum horário disponível no momento</h4>
                    <p className="text-xs text-slate-600 font-light mt-1 max-w-xs mx-auto leading-relaxed">
                      Todos os horários desta especialidade já foram reservados. Entre em contato com a clínica para solicitar um encaixe.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(groupedSlotsByDate).map((date) => (
                      <div key={date} className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {formatDayHeader(date)}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {groupedSlotsByDate[date].map((slot) => (
                            <button
                              type="button"
                              key={slot.id}
                              onClick={() => handleSelectSlot(slot)}
                              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200/80 bg-white hover:border-[#0B1A3A] hover:bg-slate-50 transition-all text-center gap-1 cursor-pointer active:scale-95 group"
                            >
                              <span className="font-extrabold text-sm text-[#0B1A3A] group-hover:text-[#0B1A3A]">
                                {slot.start_time.substring(0, 5)}
                              </span>
                              <span className="text-3xs text-slate-500 font-light truncate max-w-full">
                                {slot.professional?.name || "Sem preferência"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          
          /* PASSO 2: DADOS PESSOAIS DO PACIENTE */
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <form action={formAction} className="space-y-5">
              
              {/* Inputs Ocultos contendo informações estruturadas */}
              <input type="hidden" name="specialtyId" value={selectedSpecialtyId} />
              <input type="hidden" name="slotId" value={selectedSlotId} />
              <input type="hidden" name="professionalId" value={selectedSlotProfessionalId} />

              {/* Feedback visual de erro */}
              {!state.success && state.message && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="font-medium">{state.message}</p>
                </div>
              )}

              {/* Resumo do Horário Escolhido */}
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3 text-primary mb-6">
                <Clock className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-xs sm:text-sm font-bold">
                  Reserva: <span className="text-secondary">{selectedSlotLabel}</span>
                </span>
              </div>

              {/* Nome */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="h-4.5 w-4.5 text-slate-400" />
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isPending}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Clara de Souza Pires"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#0B1A3A]/50 focus:ring-2 focus:ring-[#0B1A3A]/5"
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="whatsapp" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Phone className="h-4.5 w-4.5 text-slate-400" />
                  WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  disabled={isPending}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 98920033319"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#0B1A3A]/50 focus:ring-2 focus:ring-[#0B1A3A]/5"
                />
              </div>

              {/* Data Nascimento */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="birthDate" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="h-4.5 w-4.5 text-slate-400" />
                  Data de Nascimento <span className="text-xs font-normal text-slate-500">(Opcional)</span>
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  disabled={isPending}
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-[#0B1A3A]/50 focus:ring-2 focus:ring-[#0B1A3A]/5"
                />
              </div>

              {/* Observações */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="notes" className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-slate-400" />
                  Observações <span className="text-xs font-normal text-slate-500">(Opcional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  disabled={isPending}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Se necessário, informe sintomas, convênios ou alguma necessidade específica de acessibilidade..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#0B1A3A]/50 focus:ring-2 focus:ring-[#0B1A3A]/5 resize-none"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] hover:bg-[#B5952F] py-4 px-6 text-base font-bold text-[#0B1A3A] transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isPending ? "Confirmando Horário..." : "Finalizar Solicitação"}
              </button>

            </form>
          </motion.div>
        )}

      </AnimatePresence>
      
    </div>
  );
}
