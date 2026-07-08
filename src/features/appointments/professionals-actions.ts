"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionState } from "@/lib/action-state";

/**
 * Inverte o status de atividade (is_active) de um profissional de saúde.
 */
export async function toggleProfessionalStatusAction(
  id: string,
  currentStatus: boolean
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("professionals")
      .update({
        is_active: !currentStatus
      })
      .eq("id", id);

    if (error) {
      console.error("[TOGGLE_PROFESSIONAL_STATUS_ERROR]:", error);
      throw new Error("Falha ao atualizar o status do profissional no Supabase.");
    }

    revalidatePath("/dashboard/profissionais");
  } catch (error) {
    console.error("[TOGGLE_PROFESSIONAL_STATUS_CRITICAL]:", error);
    throw error;
  }
}

/**
 * Cria ou atualiza um profissional de saúde (CRM/CRO) (Upsert).
 */
export async function upsertProfessionalAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string || undefined;
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  const registrationNumber = formData.get("registration_number") as string;
  const specialtyId = formData.get("specialty_id") as string;
  const bio = formData.get("bio") as string || null;

  // 1. Validações básicas de entrada
  if (!name || !registrationNumber || !specialtyId) {
    return {
      success: false,
      message: "Preencha o nome completo, o número do conselho (CRM/CRO) e selecione a especialidade principal.",
    };
  }

  // 2. Geração automática de slug caso esteja vazio
  if (!slug || slug.trim() === "") {
    slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  } else {
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  try {
    const supabase = await createClient();

    if (id) {
      // 3a. Modo Edição (Update)
      const { error } = await supabase
        .from("professionals")
        .update({
          name,
          slug,
          registration_number: registrationNumber,
          specialty_id: specialtyId,
          bio,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("[UPSERT_PROFESSIONAL_UPDATE_ERROR]:", error);
        return {
          success: false,
          message: `Falha ao atualizar dados do profissional. Código: ${error.message}`,
        };
      }
    } else {
      // 3b. Modo Criação (Insert)
      const { error } = await supabase
        .from("professionals")
        .insert({
          name,
          slug,
          registration_number: registrationNumber,
          specialty_id: specialtyId,
          bio,
          is_active: true
        });

      if (error) {
        console.error("[UPSERT_PROFESSIONAL_INSERT_ERROR]:", error);
        return {
          success: false,
          message: `Falha ao registrar profissional. Código: ${error.message}`,
        };
      }
    }

    revalidatePath("/dashboard/profissionais");
    
    return {
      success: true,
      message: id 
        ? "Dados do profissional de saúde atualizados com sucesso!" 
        : "Novo profissional de saúde cadastrado com sucesso!"
    };

  } catch (error) {
    console.error("[UPSERT_PROFESSIONAL_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro crítico ao salvar os dados do profissional de saúde.",
    };
  }
}
