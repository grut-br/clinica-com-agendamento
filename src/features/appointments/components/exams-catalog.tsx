"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Layers, Search } from "lucide-react";
import { siteConfig } from "@/config/site";

// Categorias unificadas de exames
const categories = ["Todas", "Exames de Imagem e Cardiológicos", "Análises Clínicas e Laboratoriais"];

// Mapeamento defensivo para classificar exames nas categorias corretas em memória
const getExamCategory = (requiresScheduling: boolean, slug: string): string => {
  const s = slug.toLowerCase();
  if (requiresScheduling || ["ultrassonografia", "ultrassonografia-abdominal", "eletrocardiograma", "holter-24h", "espirometria", "raio-x", "mamografia"].includes(s)) {
    return "Exames de Imagem e Cardiológicos";
  }
  return "Análises Clínicas e Laboratoriais";
};

interface ExamItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  requires_scheduling: boolean;
  price: number | null;
}

interface ExamsCatalogProps {
  exams: ExamItem[];
}

export function ExamsCatalog({ exams }: ExamsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Processa exames injetando categorias de forma robusta e defensiva
  const processedExams = useMemo(() => {
    return exams.map((exam) => ({
      ...exam,
      category: getExamCategory(exam.requires_scheduling, exam.slug),
    }));
  }, [exams]);

  // Calcula a quantidade de exames por categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: processedExams.length };
    categories.forEach((cat) => {
      if (cat !== "Todas") {
        counts[cat] = processedExams.filter((e) => e.category === cat).length;
      }
    });
    return counts;
  }, [processedExams]);

  // Filtra os exames com base na categoria selecionada E no termo de busca (combinados)
  const filteredExams = useMemo(() => {
    return processedExams.filter((exam) => {
      const matchesCategory = selectedCategory === "Todas" || exam.category === selectedCategory;
      const matchesSearch = exam.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [processedExams, selectedCategory, searchTerm]);

  // Formata o preço em BRL
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined || price === 0) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(price);
  };

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

          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-secondary" />
            Categorias
          </h3>
          <nav className="flex flex-col gap-1.5" aria-label="Filtro de exames do laboratório">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex items-center justify-between min-h-[3rem] text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/10" 
                      : "text-slate-650 hover:bg-slate-50 hover:text-primary"
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

      {/* 2. Grid de Cards de Exames Filtrados (Direita - col-span-3) */}
      <div className="md:col-span-3">
        {filteredExams.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl text-zinc-400 font-light text-sm shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center p-6">
            <Search className="h-10 w-10 text-slate-350 mb-3" />
            <h4 className="text-base font-bold text-primary">Nenhum exame encontrado</h4>
            <p className="text-xs text-zinc-500 mt-1">
              Tente redefinir o termo de pesquisa ou selecionar outra categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const slugNormalized = exam.slug.toLowerCase();
              const requiresScheduling = exam.requires_scheduling;

              // Mensagens personalizadas de WhatsApp
              const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=`;
              const msgAgendar = encodeURIComponent(
                `Olá! Gostaria de agendar o exame de ${exam.name} no laboratório Ultralab da Med Odonto.`
              );
              const msgOrienta = encodeURIComponent(
                `Olá! Gostaria de tirar dúvidas sobre a coleta e orientações para o exame de ${exam.name} na Med Odonto.`
              );

              return (
                <div
                  key={exam.id}
                  className="flex flex-col justify-between rounded-3xl bg-white border border-slate-100 p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                    requiresScheduling ? "bg-secondary" : "bg-primary"
                  }`} />

                  <div>
                    {/* Badge e Ícone */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold ${
                        requiresScheduling 
                          ? "bg-amber-50 text-amber-700 border border-amber-200/50" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                      }`}>
                        {requiresScheduling ? "Agendado" : "Ordem de Chegada"}
                      </span>
                      <span className="text-zinc-500 font-extrabold text-xs">
                        {formatPrice(exam.price)}
                      </span>
                    </div>

                    {/* Nome do Exame */}
                    <h4 className="text-lg font-bold text-primary mb-2 truncate" title={exam.name}>
                      {exam.name}
                    </h4>

                    {/* Descrição */}
                    <p className="text-xs text-zinc-500 leading-relaxed font-light mb-6 line-clamp-3">
                      {exam.description || "Exame de alta precisão diagnóstica realizado no laboratório Ultralab."}
                    </p>
                  </div>

                  {/* Dual-Action Buttons (UX de Conversão) */}
                  <div className="flex gap-2.5 mt-auto pt-4 border-t border-slate-50 w-full font-sans">
                    <Link
                      href={`/exames/${slugNormalized}`}
                      className="flex-1 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 text-center text-xs font-bold transition-all"
                    >
                      Preparo
                    </Link>
                    
                    {requiresScheduling ? (
                      <a
                        href={`${whatsappUrl}${msgAgendar}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-primary text-center text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        Agendar
                      </a>
                    ) : (
                      <a
                        href={`${whatsappUrl}${msgOrienta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-center text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        Orientações
                      </a>
                    )}
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
