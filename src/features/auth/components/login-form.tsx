"use client";

import React, { useActionState, useState } from "react";
import { signInAction } from "../actions";
import { ActionState } from "@/lib/action-state";
import { Mail, Lock, ShieldAlert, Smile, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getFieldError = (fieldName: string) => {
    return state.errors?.[fieldName]?.[0] || "";
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8 sm:p-10 text-card-foreground">
      
      {/* Header do Login */}
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
          Painel Administrativo
        </h1>
        <p className="text-sm text-muted-foreground font-light mt-1.5">
          Acesse para gerenciar e triar os agendamentos da clínica.
        </p>
      </div>

      {/* Formulário */}
      <form action={formAction} className="space-y-5">
        
        {/* Alerta de erro geral */}
        {!state.success && state.message && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-red-650" />
            <p className="leading-relaxed font-medium">{state.message}</p>
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
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                getFieldError("email") ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-border bg-muted/50 focus:border-primary/50"
              }`}
            />
          </div>
          {getFieldError("email") && (
            <span className="text-xs text-red-500 font-medium" role="alert">
              {getFieldError("email")}
            </span>
          )}
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/70" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                getFieldError("password") ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-border bg-muted/50 focus:border-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {getFieldError("password") && (
            <span className="text-xs text-red-500 font-medium" role="alert">
              {getFieldError("password")}
            </span>
          )}
        </div>

        {/* Link Esqueceu a Senha */}
        <div className="text-right">
          <Link
            href="/esqueci-senha"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:rounded"
          >
            Esqueceu a senha?
          </Link>
        </div>

        {/* Botão de Entrar */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 px-4 text-sm font-semibold transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Efetuando acesso..." : "Entrar no Painel"}
        </button>



      </form>
    </div>
  );
}
