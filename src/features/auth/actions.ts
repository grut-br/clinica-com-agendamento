"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActionState } from "@/lib/action-state";
import { loginSchema } from "./schema";

/**
 * Server Action para autenticação de administradores da clínica.
 */
export async function signInAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Validação com o esquema Zod
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Preencha os campos de login corretamente.",
      errors: fieldErrors as Record<string, string[]>,
    };
  }

  const { email: validatedEmail, password: validatedPassword } = result.data;
  let loginSuccess = false;

  try {
    const supabase = await createClient();

    // 2. Tenta autenticar o usuário com e-mail e senha no Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: validatedEmail,
      password: validatedPassword,
    });

    if (error) {
      console.error("[AUTH_SIGNIN_ERROR]:", error.message);
      return {
        success: false,
        message: "Credenciais inválidas. Verifique seu e-mail e senha.",
      };
    }

    loginSuccess = true;
  } catch (error) {
    console.error("[AUTH_SIGNIN_CRITICAL_ERROR]:", error);
    return {
      success: false,
      message: "Ocorreu um erro interno crítico ao tentar fazer login.",
    };
  }

  // 3. Redirecionamento seguro fora do bloco try-catch para evitar captura de erro de redirect do Next.js
  if (loginSuccess) {
    redirect("/dashboard");
  }

  return {
    success: true,
    message: "Login efetuado com sucesso!",
  };
}

/**
 * Server Action para deslogar da conta administrativa (Logout).
 */
export async function logoutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("[AUTH_SIGNOUT_CRITICAL_ERROR]:", error);
  }
  
  redirect("/login");
}
