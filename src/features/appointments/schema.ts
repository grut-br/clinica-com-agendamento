import { z } from "zod";

// Schema estrito de validação do agendamento
export const appointmentSchema = z.object({
  name: z
    .string({ required_error: "Nome completo é obrigatório." })
    .min(3, { message: "O nome completo deve conter no mínimo 3 caracteres." })
    .max(100, { message: "O nome completo deve conter no máximo 100 caracteres." }),
  whatsapp: z
    .string({ required_error: "WhatsApp é obrigatório." })
    .min(10, { message: "O número do WhatsApp deve conter no mínimo 10 dígitos (DDD + Número)." })
    .max(20, { message: "O número do WhatsApp é excessivamente longo." })
    .refine((val) => /^\+?[0-9\s\-()]+$/.test(val), {
      message: "O formato do WhatsApp é inválido. Utilize apenas números.",
    }),
  birthDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
  notes: z
    .string()
    .max(500, { message: "As observações não devem exceder 500 caracteres." })
    .optional()
    .nullable(),
  specialtySlug: z.string({ required_error: "Especialidade inválida." }),
  selectedSlot: z.string({ required_error: "Horário selecionado inválido." }),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
