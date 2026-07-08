"use client";

import React, { useState } from "react";
import { Smile, FlaskConical } from "lucide-react";
import { SpecialtiesManager } from "./specialties-manager";
import { ExamsManager } from "./exams-manager";

interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string;
  duration_minutes: number;
  is_active: boolean;
}

interface ExamItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string;
  price: number | null;
  requires_scheduling: boolean;
  is_active: boolean;
}

interface CatalogoTabsProps {
  specialties: SpecialtyItem[];
  exams: ExamItem[];
}

export function CatalogoTabs({ specialties, exams }: CatalogoTabsProps) {
  const [activeTab, setActiveTab] = useState<"specialties" | "exams">("specialties");

  return (
    <div className="space-y-8">
      
      {/* Abas de Navegação Rápida do Catálogo */}
      <div className="flex border-b border-border gap-6 select-none">
        <button 
          onClick={() => setActiveTab("specialties")}
          className={`pb-3 border-b-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "specialties"
              ? "border-secondary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smile className="h-4.5 w-4.5" />
          Especialidades Médicas
        </button>
        
        <button 
          onClick={() => setActiveTab("exams")}
          className={`pb-3 border-b-2 text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "exams"
              ? "border-secondary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FlaskConical className="h-4.5 w-4.5" />
          Exames (Ultralab)
        </button>
      </div>

      {/* Exibição Condicional das Abas do CMS */}
      <div className="transition-all duration-300">
        {activeTab === "specialties" ? (
          <SpecialtiesManager specialties={specialties} />
        ) : (
          <ExamsManager exams={exams} />
        )}
      </div>

    </div>
  );
}
