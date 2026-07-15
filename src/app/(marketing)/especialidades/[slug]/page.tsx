import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { specialtiesContent } from "@/lib/constants/specialties-content";
import { SchedulingForm } from "@/features/appointments/components/scheduling-form";
import { getActiveSpecialties } from "@/features/appointments/queries";
import { 
  Calendar, 
  ChevronRight, 
  User, 
  Check, 
  Heart,
  Sparkles,
  Award
} from "lucide-react";

export const revalidate = 0;

interface SpecialtyPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Geração dinâmica de metadados para SEO baseada no conteúdo real fornecido pelo cliente.
 */
export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  const content = specialtiesContent[slug];

  if (!content) {
    return {
      title: "Especialidade | Med Odonto",
    };
  }

  return {
    title: `${content.title} | Med Odonto`,
    description: content.heroDescription,
  };
}

export default async function SpecialtyPage({ params }: SpecialtyPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  const content = specialtiesContent[slug];

  // Se não encontrar o slug no banco de conteúdo estático rico, envia 404
  if (!content) {
    notFound();
  }

  // Busca as especialidades ativas cadastradas no banco de dados do Supabase
  const specialties = await getActiveSpecialties();
  const currentSpecialty = specialties.find(
    (s) => s.slug.toLowerCase() === slug.toLowerCase()
  );
  const initialSpecialtyId = currentSpecialty ? currentSpecialty.id : (specialties[0]?.id || "");

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
            <Link href="/especialidades" className="hover:text-white transition-colors">Especialidades</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#D4AF37]">{content.title}</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#D4AF37] mb-5">
              <Award className="h-4 w-4" />
              <span>Atendimento Premium</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {content.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              {content.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Seção de Conteúdo com fundo bg-slate-50 e textos em text-slate-800 (Split Layout) */}
      <section className="py-16 sm:py-20 bg-slate-50 text-slate-800">
        <div className="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            
            {/* Lado Esquerdo: Lista de Procedimentos / Serviços */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-extrabold text-primary flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-secondary shrink-0" />
                {content.servicesTitle}
              </h2>
              <p className="text-slate-600 font-light leading-relaxed">
                Nossos especialistas realizam uma ampla gama de atendimentos especializados com foco no seu bem-estar completo:
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {content.services.map((service, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                  >
                    <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 border border-secondary/20">
                      <Check className="h-3 w-3 text-secondary font-extrabold" />
                    </div>
                    <span className="text-sm font-semibold text-primary leading-normal">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lado Direito: Card do Médico de Destaque */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center text-center">
                
                {/* Foto do Médico (Placeholder Circular) */}
                <div className="h-24 w-24 rounded-full bg-primary/5 border-2 border-slate-200 flex items-center justify-center text-secondary mb-4 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                  <User className="h-10 w-10 text-secondary" />
                </div>

                {/* Perfil */}
                <h3 className="text-lg font-bold text-primary font-sans">
                  {content.doctor.name}
                </h3>
                <span className="text-xs text-secondary font-bold tracking-wider uppercase mt-1">
                  {content.doctor.role}
                </span>

                <div className="h-[1px] w-full bg-slate-200 my-4" />

                <p className="text-sm text-zinc-600 font-light leading-relaxed">
                  {content.doctor.description}
                </p>
                
                <div className="mt-5 flex items-center gap-2 text-2xs font-semibold text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full">
                  <Heart className="h-3.5 w-3.5 text-secondary fill-secondary/5 shrink-0" />
                  Atendimento Humanizado
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Módulo de Agendamento (Fundo Branco) */}
      <section className="relative w-full py-16 sm:py-20 bg-white border-t border-slate-100" id="agendar">
        <div className="container mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary mb-3">
              <Calendar className="h-4 w-4 text-secondary" />
              <span>Agendamento Online</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">
              Reserve seu horário em minutos
            </h2>
            <p className="text-sm text-zinc-500 font-light mt-2 max-w-md mx-auto">
              Consulte nossa grade médica, selecione o melhor horário e preencha o formulário para garantir o seu pré-agendamento no Supabase.
            </p>
          </div>

          {/* O componente SchedulingForm carrega os dados reais e interativos do Supabase */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl p-6 sm:p-8">
            <SchedulingForm 
              specialties={specialties} 
              initialSpecialtyId={initialSpecialtyId} 
            />
          </div>

        </div>
      </section>

    </div>
  );
}
