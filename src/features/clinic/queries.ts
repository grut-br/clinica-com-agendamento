import { createClient } from "@/lib/supabase/server";

export interface ClinicSettings {
  id: string;
  clinic_name: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Consulta a primeira linha de configurações da clínica.
 * Retorna null se não houver configurações cadastradas.
 */
export async function getClinicSettings(): Promise<ClinicSettings | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[GET_CLINIC_SETTINGS_QUERY_ERROR]:", error);
      return null;
    }

    return data as ClinicSettings | null;
  } catch (error) {
    console.error("[GET_CLINIC_SETTINGS_CRITICAL_ERROR]:", error);
    return null;
  }
}
