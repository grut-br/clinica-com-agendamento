import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getActiveExams } from "@/features/appointments/queries";
import { ExamsCatalog } from "@/features/appointments/components/exams-catalog";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Ultralab Diagnósticos | Med Odonto",
  description: "Tecnologia de ponta e precisão para os seus exames laboratoriais e de imagem no laboratório da Med Odonto.",
};

// Garante carregamento em tempo real do banco de dados
export const revalidate = 0;

export default async function ExamesPage() {
  // Busca exames ativos no laboratório
  const exams = await getActiveExams();

  return (
    <div className="flex-1 bg-slate-50">
      
      {/* 1. Hero Section (Fundo Escuro bg-[#0B1A3A] com título Ultralab em Dourado) */}
      <section className="bg-[#0B1A3A] py-16 sm:py-20 relative overflow-hidden text-white">
        {/* Glows de background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-secondary/15 blur-[80px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[300px] w-[300px] rounded-full bg-sky-500/10 blur-[80px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center sm:text-left">
          {/* Breadcrumb de Acessibilidade */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm text-zinc-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#D4AF37]">Exames</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              <span className="text-[#D4AF37]">Ultralab</span> Diagnósticos
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/80 font-light leading-relaxed">
              Tecnologia de ponta, rapidez no atendimento e laudos precisos. Filtre por tipo de exame e consulte instruções de preparo, preços e agendamentos.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grid de Exames com Filtro Lateral (Split Layout) */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <ExamsCatalog exams={exams} />
      </section>

    </div>
  );
}
