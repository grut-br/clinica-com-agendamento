"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, CheckCircle, Smile, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export function NewPasswordForm() {
  const router = useRouter();
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    
    // Detecta quando o usuário chega pelo link de recuperação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      } else if (session) {
        // Se houver uma sessão ativa, assume que o usuário está no fluxo de redefinição
        setIsRecoveryMode(true);
      }
    });

    // Timeout de segurança para marcar como inválido caso não detecte sessão ativa ou evento
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsRecoveryMode(false);
      } else {
        setIsRecoveryMode(true);
      }
    }, 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validação com Zod
    const validation = passwordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        
        // Atualiza a senha do usuário
        const { error: supabaseError } = await supabase.auth.updateUser({
          password: password,
        });

        if (supabaseError) {
          console.error("[NEW_PASSWORD_ERROR]:", supabaseError.message);
          setError("Não foi possível atualizar sua senha. Tente novamente.");
          return;
        }

        // Desconecta o usuário após a alteração da senha por segurança
        await supabase.auth.signOut();

        setSuccess(true);
        setPassword("");
        setConfirmPassword("");

        // Redireciona para o login após 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        console.error("[NEW_PASSWORD_CRITICAL]:", err);
        setError("Ocorreu um erro crítico. Tente novamente mais tarde.");
      }
    });
  };

  if (isRecoveryMode === null) {
    return (
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 flex flex-col items-center justify-center min-h-[300px] text-card-foreground">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground font-light">
          Validando token de recuperação...
        </p>
      </div>
    );
  }

  if (isRecoveryMode === false) {
    return (
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 text-center text-card-foreground">
        <div className="flex flex-col items-center mb-6">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-inner mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Link Inválido ou Expirado
          </h1>
          <p className="text-sm text-muted-foreground font-light mt-2">
            Este link de redefinição de senha já foi utilizado ou expirou. Por favor, solicite um novo link de recuperação.
          </p>
        </div>
        <Link
          href="/esqueci-senha"
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 text-sm font-semibold transition-all duration-300 shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 text-card-foreground">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-2 group mb-6">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Smile className="h-6 w-6 text-secondary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Med <span className="text-secondary">Odonto</span>
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Nova Senha
        </h1>
        <p className="text-sm text-muted-foreground font-light mt-1.5">
          Defina sua nova credencial de acesso ao sistema.
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
              Senha atualizada com sucesso! Você será redirecionado para o login.
            </p>
          </div>
        )}

        {/* Nova Senha */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/70" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isPending || success}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending || success}
              className="absolute right-3.5 top-3.5 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirmar Nova Senha */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Confirmar Nova Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/70" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              disabled={isPending || success}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isPending || success}
              className="absolute right-3.5 top-3.5 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={isPending || success}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 px-4 text-sm font-semibold transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {isPending ? "Atualizando..." : "Definir nova senha"}
        </button>

      </form>
    </div>
  );
}
