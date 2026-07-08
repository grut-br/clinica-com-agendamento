"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionState } from "@/lib/action-state";

/**
 * Server Action para atualizar ou inserir os dados básicos de clinic_settings.
 */
export async function updateClinicSettingsAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const clinicName = formData.get("clinicName") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const address = formData.get("address") as string;

  if (!clinicName) {
    return {
      success: false,
      message: "O nome da clínica é obrigatório.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Verificar se já existe uma linha de configuração cadastrada
    const { data: existingSettings, error: fetchError } = await supabase
      .from("clinic_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("[FETCH_CLINIC_SETTINGS_ACTION_ERROR]:", fetchError);
      return {
        success: false,
        message: "Erro ao consultar as configurações atuais.",
      };
    }

    if (existingSettings?.id) {
      // 2. Se existe, atualiza as colunas permitidas
      const { error: updateError } = await supabase
        .from("clinic_settings")
        .update({
          clinic_name: clinicName,
          whatsapp: whatsapp || null,
          address: address || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id);

      if (updateError) {
        console.error("[UPDATE_CLINIC_SETTINGS_ACTION_ERROR]:", updateError);
        return {
          success: false,
          message: "Erro ao atualizar os dados da clínica no Supabase.",
        };
      }
    } else {
      // 3. Se não existe, cria a primeira linha
      const { error: insertError } = await supabase
        .from("clinic_settings")
        .insert({
          clinic_name: clinicName,
          whatsapp: whatsapp || null,
          address: address || null,
        });

      if (insertError) {
        console.error("[INSERT_CLINIC_SETTINGS_ACTION_ERROR]:", insertError);
        return {
          success: false,
          message: "Erro ao cadastrar as configurações iniciais da clínica.",
        };
      }
    }

    revalidatePath("/dashboard/configuracoes");

    return {
      success: true,
      message: "Configurações gerais atualizadas com sucesso!",
    };
  } catch (error) {
    console.error("[UPDATE_CLINIC_SETTINGS_CRITICAL]:", error);
    return {
      success: false,
      message: "Erro crítico de comunicação com o servidor.",
    };
  }
}
