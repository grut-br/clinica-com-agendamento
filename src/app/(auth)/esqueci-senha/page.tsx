import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Recuperar Senha | Devio Console",
  description: "Solicite um link de recuperação de senha.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
