"use client";

import React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";

const data = [
  { day: "Seg", appointments: 28 },
  { day: "Ter", appointments: 35 },
  { day: "Qua", appointments: 32 },
  { day: "Qui", appointments: 30 },
  { day: "Sex", appointments: 17 },
];

export function AppointmentsChart() {

  return (
    <div className="bg-card border border-border rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col justify-between text-card-foreground w-full">
      
      {/* Cabeçalho do Gráfico */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary" />
            Volumetria Diária
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Quantidade de consultas e exames realizados de segunda a sexta-feira.
          </p>
        </div>
        
        {/* Badge de Indicador Positivo */}
        <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold select-none">
          <TrendingUp className="h-3.5 w-3.5" />
          +12% esta semana
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-[280px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              {/* Gradiente sutil para as barras - Utiliza a cor verde-água/esmeralda condizente com a marca */}
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
            
            <XAxis 
              dataKey="day" 
              stroke="#71717a" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10} 
            />
            
            <YAxis 
              stroke="#71717a" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            
            <Tooltip 
              cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 8 }}
              contentStyle={{ 
                backgroundColor: "#18181b", 
                borderColor: "#27272a", 
                borderRadius: "16px",
                color: "#ffffff",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
              }}
              labelStyle={{ fontWeight: "bold", color: "#10b981", fontSize: "12px", marginBottom: "4px" }}
              itemStyle={{ fontSize: "13px", fontWeight: "500" }}
              formatter={(value) => [`${value} atendimentos`, "Agendamentos"]}
            />
            
            <Bar 
              dataKey="appointments" 
              fill="url(#barGradient)" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={55}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
