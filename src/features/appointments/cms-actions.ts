"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActionState } from "@/lib/action-state";

/**
 * Inverte o status de ativação (is_active e show_on_site) de uma especialidade.
 */
export async function toggleSpecialtyStatusAction(
  id: string,
  currentStatus: boolean
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("specialties")
      .update({
        is_active: !currentStatus,
        show_on_site: !currentStatus
      })
      .eq("id", id);

    if (error) {
      console.error("[TOGGLE_SPECIALTY_STATUS_ERROR]:", error);
      throw new Error("Falha ao atualizar o status da especialidade no Supabase.");
    }

    revalidatePath("/dashboard/catalogo");
  } catch (error) {
    console.error("[TOGGLE_SPECIALTY_STATUS_CRITICAL]:", error);
    throw error;
  }
}

/**
 * Cria ou atualiza uma especialidade médica (Upsert).
 */
export async function upsertSpecialtyAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string || undefined;
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  const description = formData.get("description") as string || null;
  const category = formData.get("category") as string || "Geral";
  const durationMinutesStr = formData.get("duration_minutes") as string;

  const durationMinutes = parseInt(durationMinutesStr, 10);

  // 1. Validações básicas de entrada
  if (!name || isNaN(durationMinutes) || durationMinutes <= 0) {
    return {
      success: false,
      message: "Preencha o nome e insira uma duração válida em minutos.",
    };
  }

  // 2. Geração automática de slug caso esteja vazio
  if (!slug || slug.trim() === "") {
    slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9]+/g, "-")    // remove especiais e troca por hifen
      .replace(/(^-|-$)+/g, "");       // apara hifens nas pontas
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
        .from("specialties")
        .update({
          name,
          slug,
          description,
          category,
          duration_minutes: durationMinutes,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("[UPSERT_SPECIALTY_UPDATE_ERROR]:", error);
        return {
          success: false,
          message: `Falha ao atualizar especialidade. Código: ${error.message}`,
        };
      }
    } else {
      // 3b. Modo Criação (Insert)
      const { error } = await supabase
        .from("specialties")
        .insert({
          name,
          slug,
          description,
          category,
          duration_minutes: durationMinutes,
          is_active: true,
          show_on_site: true
        });

      if (error) {
        console.error("[UPSERT_SPECIALTY_INSERT_ERROR]:", error);
        return {
          success: false,
          message: `Falha ao registrar especialidade. Código: ${error.message}`,
        };
      }
    }

    revalidatePath("/dashboard/catalogo");
    
    return {
      success: true,
      message: id 
        ? "Especialidade médica atualizada com sucesso!" 
        : "Nova especialidade cadastrada com sucesso!"
    };

  } catch (error) {
    console.error("[UPSERT_SPECIALTY_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro crítico ao salvar os dados da especialidade.",
    };
  }
}

/**
 * Inverte o status de ativação (is_active) de um exame.
 */
export async function toggleExamStatusAction(
  id: string,
  currentStatus: boolean
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("exams")
      .update({
        is_active: !currentStatus
      })
      .eq("id", id);

    if (error) {
      console.error("[TOGGLE_EXAM_STATUS_ERROR]:", error);
      throw new Error("Falha ao atualizar o status do exame no Supabase.");
    }

    revalidatePath("/dashboard/catalogo");
  } catch (error) {
    console.error("[TOGGLE_EXAM_STATUS_CRITICAL]:", error);
    throw error;
  }
}

/**
 * Cria ou atualiza um exame laboratorial (Upsert).
 */
export async function upsertExamAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string || undefined;
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;
  const description = formData.get("description") as string || null;
  const category = formData.get("category") as string || "Análises Clínicas e Laboratoriais";
  const priceStr = formData.get("price") as string;
  const requiresScheduling = formData.get("requires_scheduling") === "on";

  const price = parseFloat(priceStr);

  // 1. Validações básicas de entrada
  if (!name || isNaN(price) || price < 0) {
    return {
      success: false,
      message: "Preencha o nome do exame e insira um preço válido (mínimo R$ 0,00).",
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
        .from("exams")
        .update({
          name,
          slug,
          description,
          category,
          price,
          requires_scheduling: requiresScheduling,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("[UPSERT_EXAM_UPDATE_ERROR]:", error);
        return {
          success: false,
          message: `Falha ao atualizar exame. Código: ${error.message}`,
        };
      }
    } else {
      // 3b. Modo Criação (Insert)
      const { error } = await supabase
        .from("exams")
        .insert({
          name,
          slug,
          description,
          category,
          price,
          requires_scheduling: requiresScheduling,
          is_active: true
        });

      if (error) {
        console.error("[UPSERT_EXAM_INSERT_ERROR]:", error);
        return {
          success: false,
          message: `Falha ao registrar exame. Código: ${error.message}`,
        };
      }
    }

    revalidatePath("/dashboard/catalogo");
    
    return {
      success: true,
      message: id 
        ? "Exame laboratorial atualizado com sucesso!" 
        : "Novo exame laboratorial cadastrado com sucesso!"
    };

  } catch (error) {
    console.error("[UPSERT_EXAM_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro crítico ao salvar os dados do exame.",
    };
  }
}
