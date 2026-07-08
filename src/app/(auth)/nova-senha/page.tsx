import type { Metadata } from "next";
import { NewPasswordForm } from "@/features/auth/components/new-password-form";

export const metadata: Metadata = {
  title: "Definir Nova Senha | Devio Console",
  description: "Escolha uma nova senha para sua conta administrativa.",
};

export default function NewPasswordPage() {
  return <NewPasswordForm />;
}
