import React from "react";
import Link from "next/link";
import { 
  Smile, 
  Brain, 
  Apple, 
  Stethoscope, 
  HeartPulse, 
  Heart, 
  Activity,
  Sparkles
} from "lucide-react";
import { getActiveSpecialties } from "@/features/appointments/queries";

// Dicionário de ícones mapeados por slug (normalizados em minúsculas)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "odontologia": Smile,
  "ortodontia": Activity,
  "ginecologia-integrativa": Heart,
  "gastroenterologia": HeartPulse,
  "psicologia": Brain,
  "nutricao": Apple,
  "clinico-geral": Stethoscope,
};

// Descrições curtas e humanizadas para fallback caso o banco esteja em branco
const descriptionsMap: Record<string, string> = {
  "odontologia": "Cuidado completo com o seu sorriso, desde a prevenção até tratamentos estéticos modernos.",
  "ortodontia": "Alinhamento dentário e correção da mordida com aparelhos estéticos e invisíveis de última geração.",
  "ginecologia-integrativa": "Saúde da mulher sob um olhar global, integrando bem-estar hormonal, físico e emocional.",
  "gastroenterologia": "Prevenção, diagnóstico e tratamento de distúrbios digestivos com foco no equilíbrio intestinal.",
  "psicologia": "Suporte emocional e psicoterapia especializada para promover autoconhecimento e saúde mental.",
  "nutricao": "Planejamento alimentar personalizado focado em longevidade, performance e reeducação alimentar.",
  "clinico-geral": "Atendimento médico primário abrangente, focado no acompanhamento contínuo e preventivo.",
};

export async function SpecialtiesSection() {
  // Buscar especialidades ativas registradas no banco de dados do Supabase
  const specialties = await getActiveSpecialties();

  return (
    <section className="relative w-full py-20 sm:py-28 bg-gradient-to-br from-primary to-slate-900 text-white overflow-hidden" id="especialidades">
      {/* Detalhes sutis de background para o fundo escuro */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -left-[10%] h-[300px] w-[300px] rounded-full bg-secondary/10 blur-[80px]" />
        <div className="absolute bottom-[20%] -right-[10%] h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-secondary mb-4">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>Nossos Serviços</span>
          </div>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Nossas Especialidades
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-zinc-350 leading-relaxed font-light">
            Oferecemos uma equipe multidisciplinar altamente qualificada para cuidar de você e de sua família em todas as etapas da vida.
          </p>
        </div>

        {/* Grade de Cards dinâmicos vindos do Supabase */}
        {specialties.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 font-light text-sm">
            Nenhuma especialidade disponível no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {specialties.map((specialty) => {
              const slugNormalized = specialty.slug.toLowerCase();
              const IconComponent = iconMap[slugNormalized] || Stethoscope;
              const description = specialty.description || descriptionsMap[slugNormalized] || "Atendimento especializado focado no seu bem-estar completo.";

              return (
                <div
                  key={specialty.id}
                  className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Linha decorativa no hover do card */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Container do Ícone */}
                    <div className="h-12 w-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 border border-primary/5">
                      <IconComponent className="h-6 w-6 text-secondary group-hover:text-white transition-colors" />
                    </div>

                    {/* Nome da Especialidade */}
                    <h3 className="text-xl font-bold text-primary mb-3 font-sans">
                      {specialty.name}
                    </h3>

                    {/* Descrição */}
                    <p className="text-sm text-zinc-500 leading-relaxed font-light mb-6">
                      {description}
                    </p>
                  </div>

                  {/* Dual-Action Buttons (UX de Conversão) */}
                  <div className="flex gap-3 mt-6 w-full">
                    <Link
                      href={`/especialidades/${slugNormalized}`}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-primary/35 text-primary hover:bg-primary/5 text-center text-xs font-bold transition-all"
                    >
                      Saiba mais
                    </Link>
                    <Link
                      href={`/agendar/${slugNormalized}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary-hover text-primary text-center text-xs font-extrabold shadow-sm transition-all active:scale-95"
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
    </section>
  );
}
