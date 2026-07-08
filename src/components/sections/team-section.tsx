import React from "react";
import { Stethoscope, Users } from "lucide-react";

export function TeamSection() {
  const doctors = [
    {
      name: "Dr. Arthur Lima",
      role: "Cirurgião-Dentista & Ortodontista",
      registry: "CRO-MA 4321",
      detail: "Especialista em alinhamento invisível e estética do sorriso.",
    },
    {
      name: "Dra. Camila Soares",
      role: "Ginecologia Geral & Integrativa",
      registry: "CRM-MA 8976 / RQE 4532",
      detail: "Referência em modulação hormonal preventiva e saúde feminina global.",
    },
    {
      name: "Dr. Ricardo Ramos",
      role: "Gastroenterologia & Clínica Geral",
      registry: "CRM-MA 6543 / RQE 3210",
      detail: "Foco no equilíbrio digestivo, microbiota intestinal e longevidade.",
    },
  ];

  return (
    <section className="relative w-full py-20 sm:py-28 bg-white overflow-hidden border-t border-slate-100" id="equipe">
      <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary mb-4">
            <Users className="h-4 w-4 text-secondary" />
            <span>Nossos Especialistas</span>
          </div>
          <h2 className="text-3xl font-extrabold text-primary sm:text-5xl">
            Corpo Clínico Multidisciplinar
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-500 font-light leading-relaxed">
            Profissionais dedicados ao diagnóstico de alta precisão e ao atendimento médico e odontológico humanizado.
          </p>
        </div>

        {/* Grade de Profissionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Foto do Profissional (Placeholder elegante) */}
              <div className="h-28 w-28 rounded-full bg-primary/5 border-2 border-slate-200 flex items-center justify-center text-secondary mb-6 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                <Stethoscope className="h-10 w-10 text-secondary" />
              </div>

              {/* Informações */}
              <h3 className="text-xl font-bold text-primary font-sans">
                {doctor.name}
              </h3>
              <span className="text-xs text-secondary font-bold tracking-wider uppercase mt-1">
                {doctor.role}
              </span>
              <span className="inline-block mt-3 px-3 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-2xs font-semibold text-primary">
                {doctor.registry}
              </span>
              <p className="mt-5 text-sm text-zinc-500 font-light leading-relaxed">
                {doctor.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
