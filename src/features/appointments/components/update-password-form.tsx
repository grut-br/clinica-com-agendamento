"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { Key, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { updateUserPasswordAction } from "../actions";
import { Button } from "@/components/ui/button";

export function UpdatePasswordForm() {
  // Hook useActionState do React 19 para a Server Action de alteração de senha
  const [state, formAction, isPending] = useActionState(updateUserPasswordAction, {
    success: false,
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  
  // Referência do elemento form para resetar campos nativamente sem causar renders
  const formRef = useRef<HTMLFormElement>(null);

  // Limpa o formulário de forma segura e nativa após alteração bem sucedida
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLocalError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validação estrita do client-side
    if (password.length < 6) {
      e.preventDefault();
      setLocalError("A nova senha deve possuir no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      e.preventDefault();
      setLocalError("A nova senha e a confirmação de senha não coincidem.");
      return;
    }
  };

  const displayError = localError || (!state.success && state.message);

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-5">
      
      {/* Mensagem de Feedback de Erro */}
      {displayError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Mensagem de Feedback de Sucesso */}
      {state.success && state.message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5 text-xs font-semibold text-emerald-700 animate-bounce">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Campo Nova Senha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Key className="h-3.5 w-3.5 text-zinc-400" />
          Nova Senha
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={isPending}
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-3 text-sm text-primary placeholder-slate-400 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 font-semibold"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 h-8 w-8 text-slate-450 hover:text-primary hover:bg-transparent shrink-0"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Campo Confirmar Nova Senha */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-2xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Key className="h-3.5 w-3.5 text-zinc-400" />
          Confirmar Nova Senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          disabled={isPending}
          placeholder="Repita a nova senha"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-primary placeholder-slate-400 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/5 font-semibold"
        />
      </div>

      {/* Botão de Envio */}
      <Button
        type="submit"
        disabled={isPending}
        variant="primary"
        className="w-full"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Alterando Senha..." : "Atualizar Senha"}
      </Button>

    </form>
  );
}
