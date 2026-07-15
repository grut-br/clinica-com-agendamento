"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Smile, 
  Brain, 
  Apple, 
  Stethoscope, 
  HeartPulse, 
  Heart, 
  Activity,
  Layers,
  Search
} from "lucide-react";

// Lista única de categorias ordenadas
const categories = ["Todas", "Odontologia & Estética", "Clínica & Prevenção", "Terapias & Bem-Estar", "Especialidades Médicas"];

// Dicionário de ícones mapeados por slug
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "odontologia": Smile,
  "ortodontia": Activity,
  "ginecologia-integrativa": Heart,
  "gastroenterologia": HeartPulse,
  "psicologia": Brain,
  "nutricao": Apple,
  "clinico-geral": Stethoscope,
};

// Descrições ricas para fallbacks
const descriptionsMap: Record<string, string> = {
  "odontologia": "Cuidado completo com o seu sorriso, desde a prevenção até tratamentos estéticos modernos.",
  "ortodontia": "Alinhamento dentário e correção da mordida com aparelhos estéticos e invisíveis de última geração.",
  "ginecologia-integrativa": "Saúde da mulher sob um olhar global, integrando bem-estar hormonal, físico e emocional.",
  "gastroenterologia": "Prevenção, diagnóstico e tratamento de distúrbios digestivos com foco no equilíbrio intestinal.",
  "psicologia": "Suporte emocional e psicoterapia especializada para promover autoconhecimento e saúde mental.",
  "nutricao": "Planejamento alimentar personalizado focado em longevidade, performance e reeducação alimentar.",
  "clinico-geral": "Atendimento médico primário abrangente, focado no acompanhamento contínuo e preventivo.",
};

// Fallback defensivo para mapeamento de categorias baseado no slug em memória
const getCategoryBySlug = (slug: string): string => {
  const s = slug.toLowerCase();
  if (["odontologia", "estetica", "ortodontia"].includes(s)) {
    return "Odontologia & Estética";
  }
  if (["clinico-geral", "pediatria", "ginecologia-integrativa", "medicina-do-trabalho"].includes(s)) {
    return "Clínica & Prevenção";
  }
  if (["psicologia", "nutricao", "nutrologia", "fisioterapia", "fonoaudiologia"].includes(s)) {
    return "Terapias & Bem-Estar";
  }
  return "Especialidades Médicas";
};

interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string;
}

interface SpecialtiesCatalogProps {
  specialties: SpecialtyItem[];
}

export function SpecialtiesCatalog({ specialties }: SpecialtiesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Processa as especialidades injetando a categoria defensivamente caso não venha preenchida do banco
  const processedSpecialties = useMemo(() => {
    return specialties.map((specialty) => ({
      ...specialty,
      category: specialty.category || getCategoryBySlug(specialty.slug),
    }));
  }, [specialties]);

  // Calcula a quantidade de especialidades por categoria com base no acervo total
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: processedSpecialties.length };
    categories.forEach((cat) => {
      if (cat !== "Todas") {
        counts[cat] = processedSpecialties.filter((s) => s.category === cat).length;
      }
    });
    return counts;
  }, [processedSpecialties]);

  // Filtra as especialidades selecionadas por categoria E termo de pesquisa (combinados)
  const filteredSpecialties = useMemo(() => {
    return processedSpecialties.filter((specialty) => {
      const matchesCategory = selectedCategory === "Todas" || specialty.category === selectedCategory;
      const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [processedSpecialties, selectedCategory, searchTerm]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* 1. Sidebar de Filtros Lateral com Sticky e Pesquisa Integrada */}
      <aside className="md:col-span-1 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          
          {/* Barra de Pesquisa */}
          <div className="relative mb-5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="h-4.5 w-4.5 text-zinc-400" />
            </span>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm font-semibold text-primary transition-all placeholder:text-zinc-400 placeholder:font-light"
            />
          </div>

          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-[#D4AF37]" />
            Categorias
          </h3>
          <nav className="flex flex-col gap-1.5" aria-label="Filtro de especialidades">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex items-center justify-between min-h-[3rem] text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? "bg-[#0B1A3A] text-white shadow-md shadow-[#0B1A3A]/10" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="whitespace-normal text-left leading-tight break-words py-1 flex-1">{category}</span>
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-2xs font-bold shrink-0 ml-2 ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* 2. Grid de Especialidades Filtradas (Direita - col-span-3) */}
      <div className="md:col-span-3">
        {filteredSpecialties.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl text-zinc-400 font-light text-sm shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center p-6">
            <Search className="h-10 w-10 text-slate-350 mb-3" />
            <h4 className="text-base font-bold text-slate-900">Nenhuma especialidade encontrada</h4>
            <p className="text-xs text-slate-600 mt-1">
              Tente redefinir o termo de pesquisa ou selecionar outra categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialties.map((specialty) => {
              const slugNormalized = specialty.slug.toLowerCase();
              const IconComponent = iconMap[slugNormalized] || Stethoscope;
              const description = specialty.description || descriptionsMap[slugNormalized] || `Atendimento especializado em ${specialty.name} com foco no seu bem-estar.`;

              return (
                <div
                  key={specialty.id}
                  className="flex flex-col justify-between rounded-3xl bg-white border border-slate-100 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div>
                    {/* Container do Ícone */}
                    <div className="h-11 w-11 rounded-xl bg-slate-50 text-[#0B1A3A] flex items-center justify-center mb-5 border border-slate-100">
                      <IconComponent className="h-5.5 w-5.5 text-[#D4AF37]" />
                    </div>

                    {/* Nome da Especialidade */}
                    <h4 className="text-lg font-bold text-slate-900 mb-2.5 truncate" title={specialty.name}>
                      {specialty.name}
                    </h4>

                    {/* Descrição */}
                    <p className="text-xs text-slate-600 leading-relaxed font-light mb-6 line-clamp-3">
                      {description}
                    </p>
                  </div>

                  {/* Dual-Action Buttons (UX de Conversão) */}
                  <div className="flex gap-2.5 mt-auto w-full font-sans">
                    <Link
                      href={`/especialidades/${slugNormalized}`}
                      className="flex-1 py-2 rounded-xl border border-[#0B1A3A] text-[#0B1A3A] hover:bg-slate-50 text-center text-xs font-bold transition-all"
                    >
                      Saiba mais
                    </Link>
                    <Link
                      href={`/agendar/${slugNormalized}`}
                      className="flex-1 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B5952F] text-[#0B1A3A] text-center text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Agendar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
