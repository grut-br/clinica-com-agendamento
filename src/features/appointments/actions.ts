"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionState } from "@/lib/action-state";
import { appointmentSchema } from "./schema";
import { fetchAvailableSlots as fetchAvailableSlotsQuery } from "./queries";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server Action para consultar os slots disponíveis no lado do cliente.
 */
export async function fetchAvailableSlots(
  specialtySlug: string,
  date: string
) {
  return fetchAvailableSlotsQuery(specialtySlug, date);
}

/**
 * Server Action para criar um pré-agendamento no Supabase (resiliente a slots físicos e virtuais).
 */
export async function createAppointmentAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Extrair os campos do FormData enviado pelo cliente
  const rawData = {
    name: formData.get("name") as string,
    whatsapp: formData.get("whatsapp") as string,
    birthDate: formData.get("birthDate") as string || undefined,
    notes: formData.get("notes") as string || undefined,
    specialtySlug: formData.get("specialtySlug") as string,
    selectedSlot: formData.get("selectedSlot") as string,
  };

  // 1. Validação estrita de entrada com Zod no lado do servidor
  const result = appointmentSchema.safeParse(rawData);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Falha na validação do formulário. Verifique os dados informados.",
      errors: fieldErrors as Record<string, string[]>,
    };
  }

  const { name, whatsapp, birthDate, notes, specialtySlug, selectedSlot } = result.data;

  try {
    const supabase = await createClient();

    // 2. Buscar o ID da especialidade na tabela specialties pelo slug de forma case-insensitive
    const { data: specialtyData, error: specialtyError } = await supabase
      .from("specialties")
      .select("id")
      .ilike("slug", specialtySlug)
      .single();

    if (specialtyError || !specialtyData) {
      console.error("[CREATE_APPOINTMENT_SPECIALTY_ERROR]:", specialtyError);
      return {
        success: false,
        message: "A especialidade selecionada não pôde ser encontrada no sistema.",
      };
    }

    const specialtyId = specialtyData.id;

    // 3. Cadastrar ou buscar o paciente na tabela patients usando o telefone/whatsapp
    let patientId: string;
    
    // Tratamento simples para padronizar o número (apenas dígitos)
    const phoneDigits = whatsapp.replace(/[^0-9]/g, "");

    const { data: existingPatient, error: searchPatientError } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", phoneDigits)
      .maybeSingle();

    if (searchPatientError) {
      console.error("[CREATE_APPOINTMENT_SEARCH_PATIENT_ERROR]:", searchPatientError);
      return {
        success: false,
        message: "Ocorreu um erro ao consultar as informações do paciente.",
      };
    }

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      // Se não existe, cria um novo cadastro de paciente
      const { data: newPatient, error: insertPatientError } = await supabase
        .from("patients")
        .insert({
          name,
          phone: phoneDigits,
          birth_date: birthDate ? birthDate : null,
        })
        .select("id")
        .single();

      if (insertPatientError || !newPatient) {
        console.error("[CREATE_APPOINTMENT_INSERT_PATIENT_ERROR]:", insertPatientError);
        return {
          success: false,
          message: "Falha ao registrar novo cadastro de paciente no sistema.",
        };
      }

      patientId = newPatient.id;
    }

    // 4. Parser Inteligente do Slot Selecionado
    let slotId: string;

    // Verifica se o selectedSlot enviado é um UUID (slot físico existente no banco)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedSlot);

    if (isUuid) {
      slotId = selectedSlot;
      
      // Atualiza o status do slot físico para reservado para evitar conflito de concorrência
      const { error: updateSlotError } = await supabase
        .from("appointment_slots")
        .update({ status: "reserved" })
        .eq("id", slotId);

      if (updateSlotError) {
        console.error("[CREATE_APPOINTMENT_UPDATE_SLOT_ERROR]:", updateSlotError);
      }
    } else {
      // É um slot virtual: ID no formato "YYYY-MM-DD - HH:MM"
      let formattedDate = "";
      let startTime = "09:00:00";
      let endTime = "09:30:00";

      const parts = selectedSlot.split(" - ");
      if (parts.length === 2) {
        formattedDate = parts[0]; // "YYYY-MM-DD"
        startTime = `${parts[1]}:00`; // "HH:MM:00"
        
        // Calcular hora final somando 30 minutos de forma padrão
        const timeMatch = parts[1].match(/(\d{2}):(\d{2})/);
        if (timeMatch) {
          const hour = parseInt(timeMatch[1], 10);
          const min = parseInt(timeMatch[2], 10);
          let endMin = min + 30;
          let endHour = hour;
          if (endMin >= 60) {
            endMin -= 60;
            endHour += 1;
          }
          const pad = (n: number) => n.toString().padStart(2, "0");
          endTime = `${pad(endHour)}:${pad(endMin)}:00`;
        }
      } else {
        formattedDate = new Date().toISOString().split("T")[0];
      }

      // 4a. Buscar ou criar bloco de disponibilidade fictício e inativo da especialidade para suporte
      let blockId: string;
      const { data: existingBlock, error: searchBlockError } = await supabase
        .from("availability_blocks")
        .select("id")
        .eq("specialty_id", specialtyId)
        .eq("type", "occasional")
        .eq("active", false)
        .limit(1)
        .maybeSingle();

      if (searchBlockError) {
        console.error("[CREATE_APPOINTMENT_SEARCH_BLOCK_ERROR]:", searchBlockError);
        return {
          success: false,
          message: "Ocorreu um erro de comunicação com o servidor de agenda.",
        };
      }

      if (existingBlock) {
        blockId = existingBlock.id;
      } else {
        const { data: newBlock, error: insertBlockError } = await supabase
          .from("availability_blocks")
          .insert({
            specialty_id: specialtyId,
            type: "occasional",
            active: false,
            start_time: "08:00:00",
            end_time: "18:00:00",
            slot_duration: 30,
          })
          .select("id")
          .single();

        if (insertBlockError || !newBlock) {
          console.error("[CREATE_APPOINTMENT_INSERT_BLOCK_ERROR]:", insertBlockError);
          return {
            success: false,
            message: "Falha ao configurar a agenda da especialidade médica.",
          };
        }
        blockId = newBlock.id;
      }

      // 4b. Inserir o slot de horário na tabela física do banco de dados marcando-o como reserved
      const { data: newSlot, error: insertSlotError } = await supabase
        .from("appointment_slots")
        .insert({
          availability_block_id: blockId,
          date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          status: "reserved",
        })
        .select("id")
        .single();

      if (insertSlotError || !newSlot) {
        console.error("[CREATE_APPOINTMENT_INSERT_SLOT_ERROR]:", insertSlotError);
        return {
          success: false,
          message: "Erro ao alocar o slot de horário na agenda médica.",
        };
      }
      slotId = newSlot.id;
    }

    // 5. Inserir o agendamento associado à ID do slot resolvido
    const { error: insertAppointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientId,
        specialty_id: specialtyId,
        slot_id: slotId,
        status: "pending",
        notes: notes ? `${notes} (Horário solicitado: ${selectedSlot})` : `Horário solicitado: ${selectedSlot}`,
      });

    if (insertAppointmentError) {
      console.error("[CREATE_APPOINTMENT_INSERT_APPOINTMENT_ERROR]:", insertAppointmentError);
      return {
        success: false,
        message: "Não foi possível registrar o pré-agendamento do paciente.",
      };
    }

    return {
      success: true,
      message: "Pré-agendamento criado com sucesso no banco de dados!",
    };

  } catch (error) {
    console.error("[CREATE_APPOINTMENT_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro interno crítico ao tentar agendar sua consulta.",
    };
  }
}

/**
 * Server Action para atualizar o status de um agendamento (Recepção/Admin).
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: "confirmed" | "cancelled" | "completed"
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);

    if (error) {
      console.error("[UPDATE_APPOINTMENT_STATUS_ERROR]:", error);
      throw new Error("Falha ao atualizar o status do agendamento no Supabase.");
    }

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("[UPDATE_APPOINTMENT_STATUS_CRITICAL_ERROR]:", error);
    throw error;
  }
}

/**
 * Server Action para geração em lote de slots de atendimento médico (Agenda).
 */
export async function generateScheduleSlotsAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const specialtySlug = formData.get("specialtySlug") as string;
  const professionalId = formData.get("professionalId") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const intervalMinutesStr = formData.get("intervalMinutes") as string;

  const intervalMinutes = parseInt(intervalMinutesStr, 10) || 30;

  // 1. Validações básicas de entrada
  if (!specialtySlug || !date || !startTime || !endTime || !professionalId) {
    return {
      success: false,
      message: "Preencha todos os campos obrigatórios para poder gerar horários.",
    };
  }

  try {
    const supabase = await createClient();

    // 2. Busca ID da especialidade médica pelo slug
    const { data: specialtyData, error: specialtyError } = await supabase
      .from("specialties")
      .select("id")
      .eq("slug", specialtySlug)
      .single();

    if (specialtyError || !specialtyData) {
      console.error("[GENERATE_SLOTS_SPECIALTY_ERROR]:", specialtyError);
      return {
        success: false,
        message: "A especialidade selecionada não pôde ser encontrada.",
      };
    }

    const specialtyId = specialtyData.id;

    // 3. Criar ou reutilizar bloco de disponibilidade na data informada (tipo occasional, ativo, com profissional)
    let blockId: string;
    const { data: existingBlock, error: searchBlockError } = await supabase
      .from("availability_blocks")
      .select("id")
      .eq("specialty_id", specialtyId)
      .eq("professional_id", professionalId)
      .eq("type", "occasional")
      .eq("date", date)
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (searchBlockError) {
      console.error("[GENERATE_SLOTS_SEARCH_BLOCK_ERROR]:", searchBlockError);
      return {
        success: false,
        message: "Ocorreu um erro ao consultar blocos operacionais de agenda.",
      };
    }

    if (existingBlock) {
      blockId = existingBlock.id;
    } else {
      const { data: newBlock, error: insertBlockError } = await supabase
        .from("availability_blocks")
        .insert({
          specialty_id: specialtyId,
          professional_id: professionalId,
          type: "occasional",
          date: date,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          slot_duration: intervalMinutes,
          active: true,
        })
        .select("id")
        .single();

      if (insertBlockError || !newBlock) {
        console.error("[GENERATE_SLOTS_INSERT_BLOCK_ERROR]:", insertBlockError);
        return {
          success: false,
          message: "Falha ao registrar novo bloco operacional de agenda.",
        };
      }
      blockId = newBlock.id;
    }

    // 4. Cálculo matemático da grade de horários
    const slotsToInsert = [];
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + intervalMinutes <= endMinutes) {
      const slotStartHour = Math.floor(currentMinutes / 60);
      const slotStartMin = currentMinutes % 60;

      const nextMinutes = currentMinutes + intervalMinutes;
      const slotEndHour = Math.floor(nextMinutes / 60);
      const slotEndMin = nextMinutes % 60;

      const formatTime = (h: number, m: number) => {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
      };

      slotsToInsert.push({
        availability_block_id: blockId,
        professional_id: professionalId,
        date,
        start_time: formatTime(slotStartHour, slotStartMin),
        end_time: formatTime(slotEndHour, slotEndMin),
        status: "available",
      });

      currentMinutes = nextMinutes;
    }

    if (slotsToInsert.length === 0) {
      return {
        success: false,
        message: "O horário de término deve ser posterior ao horário de início somado ao intervalo.",
      };
    }

    // 5. Evita duplicações consultando slots físicos já existentes na data, especialidade e profissional
    const { data: existingSlots, error: fetchExistingError } = await supabase
      .from("appointment_slots")
      .select("start_time, availability_blocks!inner(specialty_id, professional_id)")
      .eq("date", date)
      .eq("availability_blocks.specialty_id", specialtyId)
      .eq("availability_blocks.professional_id", professionalId);

    if (fetchExistingError) {
      console.error("[GENERATE_SLOTS_FETCH_EXISTING_ERROR]:", fetchExistingError);
    }

    const existingStartTimes = new Set<string>();
    if (existingSlots) {
      existingSlots.forEach((slot) => {
        existingStartTimes.add(slot.start_time);
      });
    }

    // Filtra apenas os horários que ainda não existem
    const filteredSlotsToInsert = slotsToInsert.filter(
      (slot) => !existingStartTimes.has(slot.start_time)
    );

    if (filteredSlotsToInsert.length === 0) {
      return {
        success: true,
        message: `Todos os horários calculados para este dia (${date.split("-").reverse().join("/")}) já existem na agenda deste profissional.`,
      };
    }

    // 6. Inserção em lote (batch insert) para melhoria de performance
    const { error: insertSlotsError } = await supabase
      .from("appointment_slots")
      .insert(filteredSlotsToInsert);

    if (insertSlotsError) {
      console.error("[GENERATE_SLOTS_BATCH_INSERT_ERROR]:", insertSlotsError);
      return {
        success: false,
        message: "Erro ao persistir a grade de horários da agenda no Supabase.",
      };
    }

    revalidatePath("/dashboard/agenda");

    return {
      success: true,
      message: `${filteredSlotsToInsert.length} horários gerados com sucesso para o dia ${date.split("-").reverse().join("/")}!`,
    };

  } catch (error) {
    console.error("[GENERATE_SLOTS_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro crítico interno ao processar a geração da agenda.",
    };
  }
}

/**
 * Server Action pública para alterar o status do agendamento a partir da recepção.
 */
export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<void> {
  return updateAppointmentStatus(appointmentId, status);
}

/**
 * Salva as anotações clínicas (prontuário) de uma consulta pelo médico.
 */
export async function saveClinicalNoteAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const appointmentId = formData.get("appointmentId") as string;
  const clinicalNotes = formData.get("clinicalNotes") as string || "";

  if (!appointmentId) {
    return {
      success: false,
      message: "Identificador de consulta inválido.",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("appointments")
      .update({
        clinical_notes: clinicalNotes,
        updated_at: new Date().toISOString()
      })
      .eq("id", appointmentId);

    if (error) {
      console.error("[SAVE_CLINICAL_NOTE_ERROR]:", error);
      return {
        success: false,
        message: `Falha ao salvar anotação clínica. Código: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/meus-atendimentos");

    return {
      success: true,
      message: "Prontuário e evolução do paciente salvos com sucesso!",
    };
  } catch (error) {
    console.error("[SAVE_CLINICAL_NOTE_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro crítico ao tentar salvar a evolução clínica do paciente.",
    };
  }
}

/**
 * Server Action para agendamento de consultas pelo funil público (Wizard do Paciente).
 */
export async function bookPublicAppointmentAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const birthDate = formData.get("birthDate") as string || undefined;
  const notes = formData.get("notes") as string || undefined;
  const specialtyId = formData.get("specialtyId") as string;
  const slotId = formData.get("slotId") as string;
  const professionalId = formData.get("professionalId") as string || undefined;

  if (!name || !whatsapp || !specialtyId || !slotId) {
    return {
      success: false,
      message: "Preencha todos os campos obrigatórios para poder agendar.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Cadastrar ou buscar o paciente na tabela patients usando o telefone/whatsapp
    let patientId: string;
    const phoneDigits = whatsapp.replace(/[^0-9]/g, "");

    const { data: existingPatient, error: searchPatientError } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", phoneDigits)
      .maybeSingle();

    if (searchPatientError) {
      console.error("[BOOK_PUBLIC_SEARCH_PATIENT_ERROR]:", searchPatientError);
      return {
        success: false,
        message: "Erro ao consultar cadastro de paciente.",
      };
    }

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient, error: insertPatientError } = await supabase
        .from("patients")
        .insert({
          name,
          phone: phoneDigits,
          birth_date: birthDate ? birthDate : null,
        })
        .select("id")
        .single();

      if (insertPatientError || !newPatient) {
        console.error("[BOOK_PUBLIC_INSERT_PATIENT_ERROR]:", insertPatientError);
        return {
          success: false,
          message: "Falha ao registrar novo cadastro de paciente no sistema.",
        };
      }
      patientId = newPatient.id;
    }

    // 2. Validar e reservar o slot de horário físico
    const { data: slotData, error: slotError } = await supabase
      .from("appointment_slots")
      .select("status, professional_id")
      .eq("id", slotId)
      .single();

    if (slotError || !slotData) {
      console.error("[BOOK_PUBLIC_SLOT_VALIDATION_ERROR]:", slotError);
      return {
        success: false,
        message: "O horário selecionado não pôde ser verificado ou não existe mais.",
      };
    }

    if (slotData.status !== "available") {
      return {
        success: false,
        message: "Desculpe, este horário acabou de ser reservado por outro paciente. Escolha outro horário.",
      };
    }

    // Atualiza o status do slot físico para reservado
    const { error: updateSlotError } = await supabase
      .from("appointment_slots")
      .update({ status: "reserved" })
      .eq("id", slotId);

    if (updateSlotError) {
      console.error("[BOOK_PUBLIC_UPDATE_SLOT_ERROR]:", updateSlotError);
      return {
        success: false,
        message: "Erro ao alocar o slot de horário na agenda.",
      };
    }

    // 3. Criar o agendamento associado à ID do slot resolvido
    const resolvedProfessionalId = professionalId || slotData.professional_id;

    const { error: insertAppointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientId,
        specialty_id: specialtyId,
        professional_id: resolvedProfessionalId || null,
        slot_id: slotId,
        status: "pending",
        notes: notes ? notes : "Agendado pelo portal público de consultas.",
      });

    if (insertAppointmentError) {
      console.error("[BOOK_PUBLIC_INSERT_APPOINTMENT_ERROR]:", insertAppointmentError);
      // Rollback do slot para disponível caso dê erro ao agendar
      await supabase
        .from("appointment_slots")
        .update({ status: "available" })
        .eq("id", slotId);

      return {
        success: false,
        message: "Não foi possível registrar o pré-agendamento do paciente no momento.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/agenda");

    return {
      success: true,
      message: "Pré-agendamento realizado com sucesso!",
    };
  } catch (error) {
    console.error("[BOOK_PUBLIC_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro interno crítico ao tentar agendar sua consulta.",
    };
  }
}

/**
 * Server Action para carregar horários disponíveis reais pelo cliente.
 */
export async function fetchPublicAvailableSlotsAction(specialtyId?: string) {
  const { getAvailableSlots } = await import("./queries");
  return getAvailableSlots(specialtyId);
}

/**
 * Server Action para o Administrador atualizar permissões de perfis (RBAC).
 */
export async function updateUserProfileRoleAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profileId = formData.get("profileId") as string;
  const role = formData.get("role") as string;
  const professionalId = formData.get("professionalId") as string || null;

  if (!profileId || !role) {
    return {
      success: false,
      message: "Identificador ou privilégio inválido.",
    };
  }

  try {
    const supabase = await createClient();

    // Valida se o solicitante ativo é um Administrador
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, message: "Não autorizado." };
    }

    const { data: requesterProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (requesterProfile?.role !== "admin") {
      return {
        success: false,
        message: "Acesso negado. Apenas administradores podem atualizar privilégios.",
      };
    }

    // Faz o update do perfil correspondente
    const { error } = await supabase
      .from("profiles")
      .update({
        role,
        professional_id: role === "doctor" ? (professionalId === "" ? null : professionalId) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (error) {
      console.error("[UPDATE_USER_PROFILE_ERROR]:", error);
      return {
        success: false,
        message: `Erro ao salvar alterações do usuário. Código: ${error.message}`,
      };
    }

    revalidatePath("/dashboard/usuarios");

    return {
      success: true,
      message: "Usuário atualizado com sucesso!",
    };
  } catch (error) {
    console.error("[UPDATE_USER_PROFILE_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Erro interno crítico ao tentar atualizar privilégios.",
    };
  }
}

/**
 * Server Action para o Administrador criar uma nova conta de usuário interno via Service Role (Supabase Admin API).
 */
export async function createInternalUserAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const professionalId = formData.get("professionalId") as string || null;

  if (!email || !password || !role) {
    return {
      success: false,
      message: "Preencha todos os campos obrigatórios.",
    };
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        success: false,
        message: "As chaves administrativas do Supabase não estão configuradas no servidor.",
      };
    }

    // 1. Criar o cliente administrativo especial (Supabase Admin) bypassando a sessão ativa
    const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 2. Criar a credencial de autenticação do usuário no Supabase Auth (email confirmado de início)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData?.user) {
      console.error("[CREATE_INTERNAL_USER_AUTH_ERROR]:", authError);
      return {
        success: false,
        message: `Falha ao criar credencial de autenticação: ${authError?.message || "Erro desconhecido"}`,
      };
    }

    const newUserId = authData.user.id;

    // 3. Atualiza o perfil criado automaticamente pela trigger para a role correta
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        role,
        professional_id: role === "doctor" ? (professionalId === "" ? null : professionalId) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", newUserId);

    if (profileError) {
      console.error("[CREATE_INTERNAL_USER_PROFILE_ERROR]:", profileError);
      
      // Rollback da credencial caso falhe o insert no profile
      await supabaseAdmin.auth.admin.deleteUser(newUserId);

      return {
        success: false,
        message: `Falha ao configurar as permissões do perfil: ${profileError.message}`,
      };
    }

    revalidatePath("/dashboard/usuarios");

    return {
      success: true,
      message: "Novo usuário cadastrado com sucesso!",
    };
  } catch (error) {
    console.error("[CREATE_INTERNAL_USER_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Erro interno crítico ao criar o usuário.",
    };
  }
}

/**
 * Server Action para o usuário autenticado alterar sua própria senha.
 */
export async function updateUserPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return {
      success: false,
      message: "Preencha a nova senha e a confirmação.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "A senha provisória ou nova senha deve ter no mínimo 6 caracteres.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "As senhas não coincidem.",
    };
  }

  try {
    const supabase = await createClient();

    // Atualizar a senha no Supabase Auth para a sessão ativa
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("[UPDATE_PASSWORD_ERROR]:", error);
      return {
        success: false,
        message: `Falha ao alterar a senha: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Sua senha foi alterada com sucesso!",
    };
  } catch (error) {
    console.error("[UPDATE_PASSWORD_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro interno crítico ao tentar atualizar a senha.",
    };
  }
}

/**
 * Server Action para criar um agendamento interno (manual) pela Recepção/Admin.
 * O agendamento é inserido automaticamente com o status 'confirmed' (Confirmado).
 */
export async function createInternalAppointmentAction(
  formData: FormData
): Promise<ActionState> {
  const patientName = formData.get("patientName") as string;
  const patientPhone = formData.get("patientPhone") as string;
  const professionalId = formData.get("professionalId") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  if (!patientName || !patientPhone || !professionalId || !date || !time) {
    return {
      success: false,
      message: "Todos os campos do agendamento são obrigatórios.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Obter a especialidade vinculada ao profissional de saúde
    const { data: professional, error: professionalError } = await supabase
      .from("professionals")
      .select("specialty_id")
      .eq("id", professionalId)
      .single();

    if (professionalError || !professional?.specialty_id) {
      console.error("[CREATE_INTERNAL_APPOINTMENT_PROF_ERROR]:", professionalError);
      return {
        success: false,
        message: "Profissional não encontrado ou não possui especialidade vinculada.",
      };
    }

    // 2. Cadastrar ou buscar o paciente pelo número de telefone
    const phoneDigits = patientPhone.replace(/[^0-9]/g, "");
    let patientId: string;

    const { data: existingPatient, error: searchPatientError } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", phoneDigits)
      .maybeSingle();

    if (searchPatientError) {
      console.error("[CREATE_INTERNAL_APPOINTMENT_SEARCH_PATIENT_ERROR]:", searchPatientError);
      return {
        success: false,
        message: "Erro ao consultar o cadastro do paciente.",
      };
    }

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient, error: insertPatientError } = await supabase
        .from("patients")
        .insert({
          name: patientName,
          phone: phoneDigits,
        })
        .select("id")
        .single();

      if (insertPatientError || !newPatient) {
        console.error("[CREATE_INTERNAL_APPOINTMENT_INSERT_PATIENT_ERROR]:", insertPatientError);
        return {
          success: false,
          message: "Erro ao criar novo cadastro para o paciente.",
        };
      }
      patientId = newPatient.id;
    }

    // 3. Parser e Alocação de Horário
    const startTimeFormatted = `${time}:00`;

    // Buscar a duração da consulta para definir o end_time
    const { data: specialty } = await supabase
      .from("specialties")
      .select("duration_minutes")
      .eq("id", professional.specialty_id)
      .single();

    const duration = specialty?.duration_minutes || 30;

    // Calcular end_time
    const [h, m] = time.split(":").map(Number);
    let endM = m + duration;
    let endH = h;
    if (endM >= 60) {
      endH += Math.floor(endM / 60);
      endM = endM % 60;
    }
    const endTimeFormatted = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;

    // Verificar se o slot já existe para o profissional nessa data e hora
    const { data: existingSlot } = await supabase
      .from("appointment_slots")
      .select("id, status")
      .eq("professional_id", professionalId)
      .eq("date", date)
      .eq("start_time", startTimeFormatted)
      .maybeSingle();

    let slotId: string;

    if (existingSlot) {
      // Se o slot já existe e está reservado, verificar se existe algum agendamento ativo (não cancelado)
      if (existingSlot.status === "reserved") {
        const { data: activeApp } = await supabase
          .from("appointments")
          .select("id")
          .eq("slot_id", existingSlot.id)
          .in("status", ["pending", "confirmed"])
          .maybeSingle();

        if (activeApp) {
          return {
            success: false,
            message: "Este horário já está reservado para este profissional nesta data.",
          };
        }
      }

      slotId = existingSlot.id;
      // Atualiza o slot físico para reservado
      await supabase
        .from("appointment_slots")
        .update({ status: "reserved" })
        .eq("id", slotId);
    } else {
      // Criar bloco de disponibilidade avulso caso não exista
      let blockId: string;
      const { data: existingBlock } = await supabase
        .from("availability_blocks")
        .select("id")
        .eq("specialty_id", professional.specialty_id)
        .eq("professional_id", professionalId)
        .eq("type", "occasional")
        .eq("active", false)
        .limit(1)
        .maybeSingle();

      if (existingBlock) {
        blockId = existingBlock.id;
      } else {
        const { data: newBlock, error: blockError } = await supabase
          .from("availability_blocks")
          .insert({
            specialty_id: professional.specialty_id,
            professional_id: professionalId,
            type: "occasional",
            active: false,
            start_time: "08:00:00",
            end_time: "18:00:00",
            slot_duration: duration,
          })
          .select("id")
          .single();

        if (blockError || !newBlock) {
          console.error("[CREATE_INTERNAL_BLOCK_ERROR]:", blockError);
          return {
            success: false,
            message: "Erro ao inicializar bloco de agenda para o profissional.",
          };
        }
        blockId = newBlock.id;
      }

      // Criar o slot físico e reservá-lo
      const { data: newSlot, error: slotError } = await supabase
        .from("appointment_slots")
        .insert({
          availability_block_id: blockId,
          professional_id: professionalId,
          date,
          start_time: startTimeFormatted,
          end_time: endTimeFormatted,
          status: "reserved",
        })
        .select("id")
        .single();

      if (slotError || !newSlot) {
        console.error("[CREATE_INTERNAL_SLOT_ERROR]:", slotError);
        return {
          success: false,
          message: "Erro ao alocar novo horário na agenda.",
        };
      }
      slotId = newSlot.id;
    }

    // 4. Inserir o agendamento com status 'confirmed' (Confirmado)
    const { error: insertAppointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientId,
        specialty_id: professional.specialty_id,
        professional_id: professionalId,
        slot_id: slotId,
        status: "confirmed",
        notes: "Agendamento manual criado pela equipe interna.",
      });

    if (insertAppointmentError) {
      console.error("[CREATE_INTERNAL_APPOINTMENT_INSERT_ERROR]:", insertAppointmentError);
      return {
        success: false,
        message: "Erro ao registrar o agendamento no banco de dados.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/agenda");

    return {
      success: true,
      message: "Agendamento interno criado e confirmado com sucesso!",
    };
  } catch (error) {
    console.error("[CREATE_INTERNAL_APPOINTMENT_CRITICAL]:", error);
    return {
      success: false,
      message: "Erro interno crítico ao processar o agendamento manual.",
    };
  }
}
