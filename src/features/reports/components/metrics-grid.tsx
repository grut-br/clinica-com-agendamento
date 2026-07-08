"use client";

import React from "react";
import { 
  Calendar, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  DollarSign
} from "lucide-react";
import { DashboardMetrics } from "../actions";

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  // Auxiliar para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      title: "Consultas no Mês",
      value: metrics.totalAppointments.toString(),
      growth: metrics.growthPercentage.appointments,
      isPositive: metrics.growthPercentage.appointments > 0,
      icon: Calendar,
      iconColor: "text-blue-400 bg-blue-500/10",
      description: "Agendamentos gerais triados"
    },
    {
      title: "Novos Pacientes",
      value: `+${metrics.newPatients}`,
      growth: metrics.growthPercentage.patients,
      isPositive: metrics.growthPercentage.patients > 0,
      icon: Users,
      iconColor: "text-emerald-400 bg-emerald-500/10",
      description: "Cadastrados no período"
    },
    {
      title: "Taxa de Cancelamento",
      value: `${metrics.cancellationRate}%`,
      growth: Math.abs(metrics.growthPercentage.cancellation),
      // Queda na taxa de cancelamento é algo positivo (isPositive = true)
      isPositive: metrics.growthPercentage.cancellation < 0,
      icon: Activity,
      iconColor: "text-rose-400 bg-rose-500/10",
      description: "Absenteísmo de consultas"
    },
    {
      title: "Receita Estimada",
      value: formatCurrency(metrics.estimatedRevenue),
      growth: metrics.growthPercentage.revenue,
      isPositive: metrics.growthPercentage.revenue > 0,
      icon: DollarSign,
      iconColor: "text-amber-400 bg-amber-500/10",
      description: "Faturamento projetado"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx}
            className="bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between text-card-foreground hover:border-accent transition-all duration-300"
          >
            
            {/* Header do Card */}
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                {kpi.title}
              </span>
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${kpi.iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Valor do KPI */}
            <div className="mt-4">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {kpi.value}
              </span>
            </div>

            {/* Footer / Crescimento e Comparação */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-light">
                {kpi.description}
              </span>
              
              {/* Indicador de Crescimento */}
              <div className={`inline-flex items-center gap-0.5 font-bold ${
                kpi.isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
              }`}>
                {kpi.isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                <span>
                  {kpi.growth}%
                </span>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}
