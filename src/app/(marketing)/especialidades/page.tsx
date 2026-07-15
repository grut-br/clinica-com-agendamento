import React from "react";
import Link from "next/link";
import { getActiveSpecialties } from "@/features/appointments/queries";
import { SpecialtiesCatalog } from "@/features/appointments/components/specialties-catalog";
import { ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function EspecialidadesPage() {
  // Busca as especialidades ativas registradas no banco de dados do Supabase
  const specialties = await getActiveSpecialties();

  return (
    <div className="flex-1 bg-slate-50">
      
      {/* Page Header (Alinhado com o padrão de /exames) */}
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
            <span className="text-[#D4AF37]">Especialidades</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Nossas <span className="text-[#D4AF37]">Especialidades</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl font-light leading-relaxed">
              Filtre por categoria médica e odontológica para encontrar o especialista ideal e agendar o seu atendimento em minutos.
            </p>
          </div>
        </div>
      </section>

      {/* Catálogo com Filtro Lateral e Grade de Cards */}
      <section className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <SpecialtiesCatalog specialties={specialties} />
      </section>

    </div>
  );
}
