import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { examsContent } from "@/lib/constants/exams-content";
import { siteConfig } from "@/config/site";
import { 
  Calendar, 
  ChevronRight, 
  Check, 
  Clock,
  Sparkles,
  CircleDollarSign,
  Info
} from "lucide-react";

interface ExamPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Geração dinâmica de metadados para SEO baseada nas orientações reais do exame.
 */
export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const content = examsContent[slug];
  if (!content) {
    return {
      title: "Instruções de Exame | Med Odonto",
    };
  }

  return {
    title: `${content.title} - Preparo & Preços | Med Odonto`,
    description: content.description,
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  const supabase = await createClient();

  // 1. Busca os dados reais de precificação e agendamento do exame no Supabase
  const { data: examData, error } = await supabase
    .from("exams")
    .select("name, description, requires_scheduling, price")
    .ilike("slug", slug)
    .single();

  if (error || !examData) {
    console.error("[EXAM_DETAILS_FETCH_ERROR]:", error);
    notFound();
  }

  // 2. Mapeamento de fallback defensivo em memória caso o exame esteja no banco mas não no arquivo estático
  const defaultPrep = {
    title: examData.name,
    description: examData.description || "Exame de alta precisão diagnóstica realizado no laboratório Ultralab.",
    preparationSteps: [
      "Jejum padrão recomendado de 4 a 8 horas (apenas água permitida)",
      "Evitar o consumo de bebidas alcoólicas nas 48 horas anteriores",
      "Evitar a prática de exercícios físicos intensos no dia anterior",
      "Comparecer ao laboratório com documento de identidade oficial com foto"
    ],
    resultsTime: "Resultado em até 24 horas"
  };

  const content = examsContent[slug] || defaultPrep;

  // Formatação de preço
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined || price === 0) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(price);
  };

  // Monta o link do WhatsApp para agendar ou tirar dúvidas
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=`;
  const message = examData.requires_scheduling
    ? encodeURIComponent(`Olá! Gostaria de agendar o exame de ${examData.name} no laboratório Ultralab. Qual o próximo horário disponível?`)
    : encodeURIComponent(`Olá! Gostaria de tirar dúvidas sobre o preparo para realizar o exame de ${examData.name} no laboratório Ultralab.`);

  return (
    <div className="flex-1 bg-white text-slate-800">
      
      {/* 1. Hero Section com fundo bg-[#0B1A3A] e texto branco */}
      <section className="relative w-full py-16 sm:py-20 bg-[#0B1A3A] text-white overflow-hidden">
        {/* Glows de background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-secondary/15 blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[250px] w-[250px] rounded-full bg-sky-500/10 blur-[70px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {/* Breadcrumb de Acessibilidade */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/exames" className="hover:text-white transition-colors">Exames</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#D4AF37]">{content.title}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#D4AF37] mb-5">
              <Clock className="h-4 w-4 text-[#D4AF37]" />
              <span>Resultados: {content.resultsTime}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {content.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Seção de Conteúdo com fundo bg-slate-50 e textos em text-slate-800 (Split Layout) */}
      <section className="py-16 sm:py-20 bg-slate-50 text-slate-800">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            
            {/* Esquerda: Instruções de Preparo */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <h2 className="text-2xl font-extrabold text-primary flex items-center gap-2 mb-6">
                  <Sparkles className="h-6 w-6 text-secondary shrink-0" />
                  Instruções de Preparo Obrigatórias
                </h2>
                
                <p className="text-slate-600 font-light leading-relaxed mb-6">
                  Para garantir a precisão do laudo e a confiabilidade das suas análises clínicas, siga atentamente cada uma das orientações listadas abaixo antes da realização do procedimento:
                </p>

                <ul className="space-y-4">
                  {content.preparationSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 border border-secondary/20">
                        <Check className="h-3 w-3 text-secondary font-extrabold" />
                      </div>
                      <span className="text-sm font-semibold text-primary leading-normal">{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-4.5 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-600 font-medium leading-relaxed">
                    Caso possua dúvidas adicionais ou faça uso de medicamentos anticoagulantes, entre em contato direto com a nossa recepção laboratorial antes de comparecer à clínica.
                  </p>
                </div>
              </div>
            </div>

            {/* Direita: Card de Valor do Exame & CTA */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center">
                
                {/* Círculo do Preço */}
                <div className="h-16 w-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-secondary mb-4 shadow-inner">
                  <CircleDollarSign className="h-8 w-8 text-secondary" />
                </div>

                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  Valor Especial Particular
                </h3>
                
                <div className="text-3xl sm:text-4xl font-black text-primary mt-2">
                  {formatPrice(examData.price)}
                </div>

                <p className="text-2xs text-zinc-400 font-semibold mt-1">
                  * Aceitamos também diversos convênios de saúde.
                </p>

                <div className="h-[1px] w-full bg-slate-200 my-6" />

                <p className="text-sm text-zinc-600 font-light leading-relaxed mb-6">
                  {examData.requires_scheduling
                    ? "Este exame requer pré-agendamento e alocação de horário específico no laboratório."
                    : "Este exame é realizado por ordem de chegada no laboratório. Não esqueça do preparo necessário."
                  }
                </p>

                {examData.requires_scheduling ? (
                  <a
                    href={`${whatsappUrl}${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary-hover py-3.5 px-4 text-sm font-bold text-primary transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
                  >
                    <Calendar className="h-4.5 w-4.5 shrink-0" />
                    Agendar Exame
                  </a>
                ) : (
                  <a
                    href={`${whatsappUrl}${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-3.5 px-4 text-sm font-bold transition-all duration-300 text-center cursor-pointer"
                  >
                    <Info className="h-4.5 w-4.5 shrink-0 text-secondary" />
                    Tirar Dúvidas / Coleta
                  </a>
                )}

                <Link
                  href="/exames"
                  className="mt-4 text-xs font-semibold text-zinc-400 hover:text-primary transition-colors flex items-center gap-1"
                >
                  Voltar ao catálogo de exames
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
