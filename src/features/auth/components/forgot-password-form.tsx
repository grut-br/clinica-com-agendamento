"use client";

import React, { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, ShieldAlert, CheckCircle, Smile, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Insira um endereço de e-mail válido."),
});

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validação com Zod
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/nova-senha`,
          }
        );

        if (supabaseError) {
          console.error("[FORGOT_PASSWORD_ERROR]:", supabaseError.message);
          setError(
            supabaseError.message === "User not found"
              ? "Não foi possível encontrar um usuário com este e-mail."
              : "Erro ao enviar o link de recuperação. Tente novamente mais tarde."
          );
          return;
        }

        setSuccess(true);
        setEmail("");
      } catch (err) {
        console.error("[FORGOT_PASSWORD_CRITICAL]:", err);
        setError("Ocorreu um erro crítico. Verifique sua conexão e tente novamente.");
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 text-card-foreground">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Link href="/" className="flex items-center gap-2 group mb-6">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Smile className="h-6 w-6 text-secondary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Med <span className="text-secondary">Odonto</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Recuperar Senha
        </h1>
        <p className="text-sm text-muted-foreground font-light mt-1.5">
          Insira seu e-mail para receber um link de redefinição de senha.
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Alerta de erro geral */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm" role="alert">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-red-650" />
            <p className="leading-relaxed font-medium">{error}</p>
          </div>
        )}

        {/* Alerta de sucesso geral */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-700 text-sm" role="status">
            <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-relaxed font-medium">
              Link de recuperação enviado com sucesso! Verifique a sua caixa de entrada.
            </p>
          </div>
        )}

        {/* E-mail */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/70" />
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@clinica.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 px-4 text-sm font-semibold transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isPending ? "Enviando..." : "Enviar link de recuperação"}
        </button>

        {/* Link sutil para Voltar ao login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
        </div>

      </form>
    </div>
  );
}
