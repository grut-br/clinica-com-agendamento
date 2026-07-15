"use client";

import React, { useState } from "react";

export function DashboardTabsView({
  pendingAppointments,
  calendarContent,
  generatorDialog
}: {
  pendingAppointments: React.ReactNode;
  calendarContent: React.ReactNode;
  generatorDialog: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"triagem" | "calendario">("triagem");

  return (
    <div className="w-full">
      <div className="flex border-b border-border gap-6 mb-6">
        <button 
          onClick={() => setActiveTab("triagem")}
          className={`pb-3 border-b-2 text-sm font-bold transition-all cursor-pointer ${
            activeTab === "triagem" 
              ? "border-secondary text-foreground" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Triagem de Solicitações
        </button>
        <button 
          onClick={() => setActiveTab("calendario")}
          className={`pb-3 border-b-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "calendario" 
              ? "border-secondary text-foreground" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Calendário da Clínica
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "triagem" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {pendingAppointments}
          </div>
        )}
        
        {activeTab === "calendario" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Visão em Calendário</h2>
              {generatorDialog}
            </div>
            {calendarContent}
          </div>
        )}
      </div>
    </div>
  );
}
