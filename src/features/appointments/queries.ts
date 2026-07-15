import { createClient } from "@/lib/supabase/server";

export interface AppointmentWithRelations {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  created_at: string;
  patient: {
    name: string;
    phone: string;
    birth_date: string | null;
  };
  specialty: {
    name: string;
  };
  slot: {
    date: string;
    start_time: string;
    end_time: string;
  } | null;
  professional: {
    name: string;
  } | null;
}

interface RawRecentAppointment {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  created_at: string;
  patient: { name: string; phone: string; birth_date: string | null } | { name: string; phone: string; birth_date: string | null }[] | null;
  specialty: { name: string } | { name: string }[] | null;
  slot: { date: string; start_time: string; end_time: string } | { date: string; start_time: string; end_time: string }[] | null;
  professional: { name: string } | { name: string }[] | null;
}

export async function getRecentAppointments(): Promise<AppointmentWithRelations[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id,
        status,
        notes,
        created_at,
        patient:patients (
          name,
          phone,
          birth_date
        ),
        specialty:specialties (
          name
        ),
        slot:appointment_slots (
          date,
          start_time,
          end_time
        ),
        professional:professionals (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[GET_RECENT_APPOINTMENTS_QUERY_ERROR]:", error);
      return [];
    }

    const formattedData = (data || []).map((item: RawRecentAppointment) => {
      const patientObj = Array.isArray(item.patient) ? item.patient[0] : item.patient;
      const specialtyObj = Array.isArray(item.specialty) ? item.specialty[0] : item.specialty;
      const slotObj = Array.isArray(item.slot) ? item.slot[0] : item.slot;
      const profObj = Array.isArray(item.professional) ? item.professional[0] : item.professional;

      return {
        id: item.id,
        status: item.status,
        notes: item.notes,
        created_at: item.created_at,
        patient: patientObj ? {
          name: patientObj.name || "",
          phone: patientObj.phone || "",
          birth_date: patientObj.birth_date || null
        } : { name: "", phone: "", birth_date: null },
        specialty: specialtyObj ? {
          name: specialtyObj.name || ""
        } : { name: "" },
        slot: slotObj ? {
          date: slotObj.date || "",
          start_time: slotObj.start_time || "",
          end_time: slotObj.end_time || ""
        } : null,
        professional: profObj ? {
          name: profObj.name || ""
        } : null
      };
    });

    return formattedData as AppointmentWithRelations[];
  } catch (error) {
    console.error("[GET_RECENT_APPOINTMENTS_CRITICAL]:", error);
    return [];
  }
}

/**
 * Consulta todas as especialidades ativas registradas no banco de dados do Supabase.
 */
export async function getActiveSpecialties() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("specialties")
      .select("id, name, slug, description, duration_minutes, category")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("[GET_ACTIVE_SPECIALTIES_QUERY_ERROR]:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[GET_ACTIVE_SPECIALTIES_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Consulta slots disponíveis para uma especialidade em uma data específica (busca case-insensitive).
 */
export async function fetchAvailableSlots(
  specialtySlug: string,
  date: string
): Promise<{ id: string; time: string; isAvailable: boolean }[]> {
  try {
    const supabase = await createClient();

    // 1. Obter o ID da especialidade pelo slug de forma case-insensitive (.ilike)
    const { data: specialtyData, error: specialtyError } = await supabase
      .from("specialties")
      .select("id")
      .ilike("slug", specialtySlug)
      .single();

    if (specialtyError || !specialtyData) {
      console.error("[FETCH_SLOTS_SPECIALTY_ERROR]:", specialtyError);
      return [];
    }

    const specialtyId = specialtyData.id;

    // 2. Buscar slots físicos agendáveis existentes no banco de dados para a data informada
    const { data: slotsData, error: slotsError } = await supabase
      .from("appointment_slots")
      .select(`
        id,
        date,
        start_time,
        status,
        availability_blocks!inner (
          specialty_id
        )
      `)
      .eq("date", date)
      .eq("availability_blocks.specialty_id", specialtyId);

    if (slotsError) {
      console.error("[FETCH_SLOTS_QUERY_ERROR]:", slotsError);
    }

    // Se houver slots físicos configurados no banco, mapeia e retorna
    if (slotsData && slotsData.length > 0) {
      return slotsData.map((slot) => {
        // Formatar start_time de "14:00:00" para "14:00"
        const time = slot.start_time.substring(0, 5);
        return {
          id: slot.id,
          time,
          isAvailable: slot.status === "available",
        };
      });
    }

    // 3. Fallback / Mock Virtual do MVP: 
    // Se a clínica ainda não gerou slots físicos na agenda para o dia, criamos uma grade comercial virtual.
    const defaultTimes = [
      "08:00", "09:00", "10:00", "11:00", 
      "14:00", "15:00", "16:00", "17:00"
    ];

    // Cruzamos os horários virtuais com os agendamentos existentes para invalidar horários já ocupados
    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`
        id,
        appointment_slots!inner (
          start_time,
          date
        )
      `)
      .eq("appointment_slots.date", date)
      .eq("specialty_id", specialtyId);

    interface RawAppointmentSlot {
      id: string;
      appointment_slots: { start_time: string; date: string } | { start_time: string; date: string }[] | null;
    }

    const occupiedTimes = new Set<string>();
    if (appointmentsData) {
      appointmentsData.forEach((app: RawAppointmentSlot) => {
        const slotObj = Array.isArray(app.appointment_slots) 
          ? app.appointment_slots[0] 
          : app.appointment_slots;

        if (slotObj?.start_time) {
          const time = slotObj.start_time.substring(0, 5);
          occupiedTimes.add(time);
        }
      });
    }

    return defaultTimes.map((time) => {
      const isOccupied = occupiedTimes.has(time);
      return {
        id: `${date} - ${time}`, // ID virtual estruturado
        time,
        isAvailable: !isOccupied,
      };
    });

  } catch (error) {
    console.error("[FETCH_SLOTS_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Consulta exames ativos do laboratório Ultralab.
 */
export async function getActiveExams() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("exams")
      .select("id, name, slug, description, requires_scheduling, price")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("[GET_ACTIVE_EXAMS_QUERY_ERROR]:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[GET_ACTIVE_EXAMS_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Consulta todas as especialidades cadastradas (ativas e inativas) para o CMS do Dashboard.
 */
export async function getAllSpecialties() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("specialties")
      .select("id, name, slug, description, duration_minutes, category, is_active")
      .order("name", { ascending: true });

    if (error) {
      console.error("[GET_ALL_SPECIALTIES_QUERY_ERROR]:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[GET_ALL_SPECIALTIES_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Consulta todos os exames cadastrados (ativos e inativas) para o CMS do Dashboard.
 */
export async function getAllExams() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("exams")
      .select("id, name, slug, description, requires_scheduling, is_active, price, category")
      .order("name", { ascending: true });

    if (error) {
      console.error("[GET_ALL_EXAMS_QUERY_ERROR]:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[GET_ALL_EXAMS_CRITICAL_ERROR]:", error);
    return [];
  }
}

interface RawProfessional {
  id: string;
  name: string;
  slug: string;
  registration_number?: string | null;
  bio: string | null;
  is_active: boolean;
  specialty_id: string;
  specialty: { id: string; name: string; category: string } | { id: string; name: string; category: string }[] | null;
}

/**
 * Consulta todos os profissionais cadastrados e realiza join com a especialidade vinculada.
 */
export async function getAllProfessionals() {
  try {
    const supabase = await createClient();

    // Mapeador comum para formatar o objeto do profissional resolvendo o array de especialidades
    const formatProfessional = (p: RawProfessional) => {
      const specialtyObj = Array.isArray(p.specialty) ? p.specialty[0] : p.specialty;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        registration_number: p.registration_number !== undefined ? p.registration_number : null,
        bio: p.bio,
        is_active: p.is_active,
        specialty_id: p.specialty_id || "",
        specialty: specialtyObj ? {
          id: specialtyObj.id,
          name: specialtyObj.name,
          category: specialtyObj.category || ""
        } : null
      };
    };

    const { data, error } = await supabase
      .from("professionals")
      .select(`
        id, 
        name, 
        slug, 
        registration_number, 
        bio, 
        is_active, 
        specialty_id,
        specialty:specialties (
          id,
          name,
          category
        )
      `)
      .order("name", { ascending: true });

    if (error) {
      // Código 42703 indica que a coluna não existe no banco físico ainda (aguardando execução da migration)
      if (error.code === "42703") {
        console.warn("[DATABASE_FALLBACK_ACTIVE]: A coluna registration_number não existe na tabela professionals. Executando query alternativa.");
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("professionals")
          .select(`
            id, 
            name, 
            slug, 
            bio, 
            is_active, 
            specialty_id,
            specialty:specialties (
              id,
              name,
              category
            )
          `)
          .order("name", { ascending: true });

        if (fallbackError) {
          console.error("[GET_ALL_PROFESSIONALS_FALLBACK_ERROR]:", fallbackError);
          return [];
        }

        return (fallbackData || []).map((p) => formatProfessional(p));
      }

      console.error("[GET_ALL_PROFESSIONALS_QUERY_ERROR]:", error);
      return [];
    }

    return (data || []).map((p) => formatProfessional(p));
  } catch (error) {
    console.error("[GET_ALL_PROFESSIONALS_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Consulta agendamentos confirmados vinculados ao ID de um profissional de saúde.
 */
interface RawDoctorAppointment {
  id: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  clinical_notes: string | null;
  created_at: string;
  patient: { name: string; phone: string; birth_date: string | null } | { name: string; phone: string; birth_date: string | null }[] | null;
  specialty: { name: string } | { name: string }[] | null;
  slot: { date: string; start_time: string; end_time: string } | { date: string; start_time: string; end_time: string }[] | null;
}

export async function getDoctorAppointments(professionalId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("appointments")
      .select(`
        id, 
        status, 
        notes, 
        clinical_notes,
        created_at,
        patient:patients (
          name,
          phone,
          birth_date
        ),
        specialty:specialties (
          name
        ),
        slot:appointment_slots (
          date,
          start_time,
          end_time
        )
      `)
      .eq("professional_id", professionalId)
      .eq("status", "confirmed");

    if (error) {
      console.error("[GET_DOCTOR_APPOINTMENTS_QUERY_ERROR]:", error);
      return [];
    }

    // Mapeia os relacionamentos que vêm do Supabase como array de tamanho 1 para objeto simples
    const formattedData = (data || []).map((item: RawDoctorAppointment) => {
      const patientObj = Array.isArray(item.patient) ? item.patient[0] : item.patient;
      const specialtyObj = Array.isArray(item.specialty) ? item.specialty[0] : item.specialty;
      const slotObj = Array.isArray(item.slot) ? item.slot[0] : item.slot;

      return {
        id: item.id,
        status: item.status,
        notes: item.notes,
        clinical_notes: item.clinical_notes,
        created_at: item.created_at,
        patient: patientObj ? {
          name: patientObj.name || "",
          phone: patientObj.phone || "",
          birth_date: patientObj.birth_date || null
        } : { name: "", phone: "", birth_date: null },
        specialty: specialtyObj ? {
          name: specialtyObj.name || ""
        } : { name: "" },
        slot: slotObj ? {
          date: slotObj.date || "",
          start_time: slotObj.start_time || "",
          end_time: slotObj.end_time || ""
        } : null
      };
    });

    // Ordena os agendamentos pela data e hora de início
    const sortedData = formattedData.sort((a, b) => {
      const dateA = a.slot ? `${a.slot.date}T${a.slot.start_time}` : "";
      const dateB = b.slot ? `${b.slot.date}T${b.slot.start_time}` : "";
      return dateA.localeCompare(dateB);
    });

    return sortedData;
  } catch (error) {
    console.error("[GET_DOCTOR_APPOINTMENTS_CRITICAL_ERROR]:", error);
    return [];
  }
}

interface RawAvailableSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  professional_id: string | null;
  professional: { id: string; name: string } | { id: string; name: string }[] | null;
  availability_blocks: {
    id: string;
    specialty_id: string;
    specialty: { id: string; name: string } | { id: string; name: string }[] | null;
  } | {
    id: string;
    specialty_id: string;
    specialty: { id: string; name: string } | { id: string; name: string }[] | null;
  }[] | null;
}

/**
 * Consulta horários físicos disponíveis do futuro para o funil público.
 */
export async function getAvailableSlots(specialtyId?: string) {
  try {
    const supabase = await createClient();
    
    // Obter data de hoje no formato YYYY-MM-DD
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

    let query = supabase
      .from("appointment_slots")
      .select(`
        id,
        date,
        start_time,
        end_time,
        status,
        professional_id,
        professional:professionals (
          id,
          name
        ),
        availability_blocks!inner (
          id,
          specialty_id,
          specialty:specialties (
            id,
            name
          )
        )
      `)
      .eq("status", "available")
      .gte("date", today);

    if (specialtyId) {
      query = query.eq("availability_blocks.specialty_id", specialtyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[GET_AVAILABLE_SLOTS_ERROR]:", error);
      return [];
    }

    // Filtrar horários passados se a data for hoje
    const filteredSlots = (data || []).filter((slot) => {
      if (slot.date === today) {
        return slot.start_time > currentTime;
      }
      return true;
    });

    // Mapear relacionamentos do Supabase para o formato esperado pelo SlotItem
    const formattedSlots = filteredSlots.map((slot: RawAvailableSlot) => {
      const profObj = Array.isArray(slot.professional) ? slot.professional[0] : slot.professional;
      
      let blockObj = undefined;
      if (slot.availability_blocks) {
        const rawBlock = Array.isArray(slot.availability_blocks) 
          ? slot.availability_blocks[0] 
          : slot.availability_blocks;
        
        if (rawBlock) {
          const specialtyObj = Array.isArray(rawBlock.specialty)
            ? rawBlock.specialty[0]
            : rawBlock.specialty;

          blockObj = {
            id: rawBlock.id,
            specialty_id: rawBlock.specialty_id,
            specialty: specialtyObj ? {
              id: specialtyObj.id,
              name: specialtyObj.name
            } : undefined
          };
        }
      }

      return {
        id: slot.id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        status: slot.status,
        professional_id: slot.professional_id,
        professional: profObj ? {
          id: profObj.id,
          name: profObj.name
        } : null,
        availability_blocks: blockObj
      };
    });

    // Ordenar em ordem cronológica
    return formattedSlots.sort((a, b) => {
      const dtA = `${a.date}T${a.start_time}`;
      const dtB = `${b.date}T${b.start_time}`;
      return dtA.localeCompare(dtB);
    });
  } catch (error) {
    console.error("[GET_AVAILABLE_SLOTS_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Recupera o perfil de controle de acesso (RBAC) do usuário logado atual.
 */
export async function getUserProfile() {
  try {
    const supabase = await createClient();
    
    // Obtém o usuário autenticado na sessão
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Busca o perfil correspondente na tabela profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, professional_id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[GET_USER_PROFILE_QUERY_ERROR]:", error);
      return null;
    }

    if (data) {
      return {
        ...data,
        email: user.email || null,
      };
    }

    return null;
  } catch (error) {
    console.error("[GET_USER_PROFILE_CRITICAL_ERROR]:", error);
    return null;
  }
}

interface RawProfileInput {
  id: string;
  email: string;
  role: string;
  professional_id: string | null;
  professional: { id: string; name: string } | { id: string; name: string }[] | null;
}

interface RawProfile {
  id: string;
  email: string;
  role: "admin" | "pending" | "doctor" | "receptionist";
  professional_id: string | null;
  professional: { id: string; name: string } | null;
}

/**
 * Consulta todos os perfis de usuários cadastrados no sistema (Visualização do Admin).
 */
export async function getAllProfiles() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        email,
        role,
        professional_id,
        professional:professionals (
          id,
          name
        )
      `)
      .order("email", { ascending: true });

    if (error) {
      console.error("[GET_ALL_PROFILES_QUERY_ERROR]:", error);
      return [];
    }

    const formattedData = (data || []).map((item: RawProfileInput): RawProfile => {
      const profObj = Array.isArray(item.professional) ? item.professional[0] : item.professional;
      return {
        id: item.id,
        email: item.email,
        role: item.role as "admin" | "pending" | "doctor" | "receptionist",
        professional_id: item.professional_id,
        professional: profObj ? {
          id: profObj.id,
          name: profObj.name
        } : null
      };
    });

    return formattedData;
  } catch (error) {
    console.error("[GET_ALL_PROFILES_CRITICAL_ERROR]:", error);
    return [];
  }
}

/**
 * Consulta horários físicos disponíveis no Dashboard para um profissional específico.
 */
export async function fetchDashboardCalendarSlots(professionalId: string) {
  try {
    const supabase = await createClient();
    
    // Obter data de hoje no formato YYYY-MM-DD
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

    const { data, error } = await supabase
      .from("appointment_slots")
      .select(`
        id,
        date,
        start_time,
        end_time,
        status,
        availability_blocks!inner (
          professional_id
        )
      `)
      .eq("status", "available")
      .eq("availability_blocks.professional_id", professionalId)
      .gte("date", today);

    if (error) {
      console.error("[FETCH_DASHBOARD_CALENDAR_SLOTS_ERROR]:", error);
      return [];
    }

    // Filtrar horários passados se a data for hoje
    const filteredSlots = (data || []).filter((slot) => {
      if (slot.date === today) {
        return slot.start_time > currentTime;
      }
      return true;
    });

    // Ordenar em ordem cronológica
    return filteredSlots.sort((a, b) => {
      const dtA = `${a.date}T${a.start_time}`;
      const dtB = `${b.date}T${b.start_time}`;
      return dtA.localeCompare(dtB);
    });
  } catch (error) {
    console.error("[FETCH_DASHBOARD_CALENDAR_SLOTS_CRITICAL_ERROR]:", error);
    return [];
  }
}
