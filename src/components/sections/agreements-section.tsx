import React from"react";
import { Shield} from"lucide-react";

export function AgreementsSection() {
 const agreements = [
 { name:"Unimed", type:"Nacional & Regional"},
 { name:"Bradesco Saúde", type:"Todos os Planos"},
 { name:"SulAmérica", type:"Rede Especial & Superior"},
 { name:"Cassi", type:"Funcionários Banco do Brasil"},
 { name:"Golden Cross", type:"Rede Básica & Especial"},
 { name:"Geap Saúde", type:"Servidores Públicos"},
 ];

 return (
 <section className="relative w-full py-16 sm:py-20 bg-slate-50 border-y border-slate-100"id="convenios">
 <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center">
 
 {/* Cabeçalho da Seção */}
 <div className="max-w-3xl mx-auto mb-10 text-center">
 <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1A3A]/5 border border-[#0B1A3A]/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#0B1A3A] mb-3">
 <Shield className="h-4 w-4 text-[#D4AF37]"/>
 <span>Facilidade de Acesso</span>
 </div>
 <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A3A]">
 Convênios & Planos de Saúde Atendidos
 </h2>
 <p className="mt-2.5 text-sm text-zinc-600 font-light leading-relaxed">
 Aceitamos uma ampla gama de convênios médicos e odontológicos para garantir seu atendimento com comodidade.
 </p>
 </div>

 {/* Grade de Convênios */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
 {agreements.map((agreement, index) => (
 <div
 key={index}
 className="p-5 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] select-none"
 >
 <span className="text-base font-extrabold text-[#0B1A3A] tracking-tight">
 {agreement.name}
 </span>
 <span className="text-[10px] text-zinc-400 font-semibold mt-1 uppercase tracking-wider">
 {agreement.type}
 </span>
 </div>
))}
 </div>

 </div>
 </section>
);
}
