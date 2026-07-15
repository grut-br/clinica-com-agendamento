"use client";

import React from"react";
import Link from"next/link";
import { motion as motionFramer} from"framer-motion";
import { 
 CheckCircle2, 
 Microscope, 
 ArrowRight, 
 FlaskConical, 
 Activity
} from"lucide-react";

export function ExamsSection() {
 const categories = [
 {
 title:"Exames Laboratoriais",
 description:"Hemograma, perfil lipídico, tireoide, glicose e check-ups completos."
},
 {
 title:"Ultrassonografias",
 description:"Ultrassom obstétrico, abdominal, tireoide, mama e articulações."
},
 {
 title:"Teste de Paternidade (DNA)",
 description:"Análise genética de alta precisão com sigilo absoluto e laudo rápido."
},
 {
 title:"Exames Cardiológicos",
 description:"Eletrocardiograma (ECG) para avaliação preventiva da saúde do coração."
}
 ];

 return (
 <section className="relative w-full py-20 sm:py-28 bg-white overflow-hidden"id="exames">
 {/* Glows de background sutis */}
 <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[30%] right-[-10%] h-[350px] w-[350px] rounded-full bg-[#D4AF37]/5 blur-[90px]"/>
 <div className="absolute bottom-[10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-[#0B1A3A]/5 blur-[80px]"/>
 </div>

 <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
 
 {/* Coluna da Esquerda: Conteúdo */}
 <motionFramer.div
 initial={{ opacity: 0, x: -30}}
 whileInView={{ opacity: 1, x: 0}}
 viewport={{ once: true, margin:"-100px"}}
 transition={{ duration: 0.6}}
 className="lg:col-span-6 text-left flex flex-col items-start"
 >
 {/* Badge */}
 <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1A3A]/5 border border-[#0B1A3A]/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#0B1A3A] mb-5">
 <FlaskConical className="h-4 w-4 text-[#D4AF37]"/>
 <span>Tecnologia Própria</span>
 </div>

 {/* Título Principal */}
 <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1A3A] sm:text-5xl leading-tight">
 Ultralab: Nosso <br className="hidden sm:inline"/>
 <span className="text-[#D4AF37] bg-clip-text">Laboratório Próprio</span>
 </h2>

 {/* Parágrafo */}
 <p className="mt-6 text-base sm:text-lg text-zinc-500 leading-relaxed font-light">
 Realize seus exames laboratoriais e de imagem com rapidez, conforto e tecnologia de ponta, tudo em um só lugar. Nossa infraestrutura permite diagnósticos ágeis e laudos online seguros.
 </p>

 {/* Lista de Recursos */}
 <ul className="mt-8 space-y-5 w-full">
 {categories.map((category) => (
 <li key={category.title} className="flex items-start gap-3">
 <CheckCircle2 className="h-5.5 w-5.5 text-[#D4AF37] shrink-0 mt-0.5"/>
 <div>
 <h4 className="text-base font-bold text-[#0B1A3A]">{category.title}</h4>
 <p className="text-sm text-zinc-500 font-light mt-0.5">{category.description}</p>
 </div>
 </li>
))}
 </ul>

 {/* CTAs */}
 <div className="mt-10 flex flex-wrap gap-4 w-full sm:w-auto">
 <Link
 href="/exames"
 className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[#0B1A3A] bg-transparent hover:bg-[#0B1A3A] px-7 py-3 text-sm sm:text-base font-bold text-[#0B1A3A] hover:text-white transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0"
 >
 Ver todos os exames
 <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1"/>
 </Link>
 </div>
 </motionFramer.div>
 
 {/* Coluna da Direita: Composição Fotográfica Médica Clean */}
 <motionFramer.div
 initial={{ opacity: 0, x: 30}}
 whileInView={{ opacity: 1, x: 0}}
 viewport={{ once: true, margin:"-100px"}}
 transition={{ duration: 0.6}}
 className="lg:col-span-6 relative flex items-center justify-center"
 >
 {/* Container da composição fotográfica */}
 <div className="relative w-full aspect-square max-w-[420px] sm:max-w-[450px]">
 
 {/* Foto de Trás (Laboratório) */}
 <div className="absolute top-0 left-0 w-[82%] h-[82%] bg-slate-100 border-4 border-white rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6 select-none transition-transform hover:scale-[1.01] duration-300">
 <Microscope className="h-8 w-8 text-[#D4AF37] mb-2"/>
 <span className="text-xs font-bold text-[#0B1A3A] tracking-wide">INFRAESTRUTURA</span>
 <span className="text-[10px] text-zinc-500 font-light mt-1">Foto do Laboratório Ultralab</span>
 </div>
 
 {/* Foto da Frente (Equipamento / Atendimento) */}
 <div className="absolute bottom-0 right-0 w-[70%] h-[70%] bg-slate-200/80 border-4 border-white rounded-2xl shadow-xl flex flex-col items-center justify-center text-center p-6 select-none transition-transform hover:scale-[1.02] duration-300">
 <Activity className="h-8 w-8 text-[#D4AF37] mb-2"/>
 <span className="text-xs font-bold text-[#0B1A3A] tracking-wide">TECNOLOGIA</span>
 <span className="text-[10px] text-zinc-500 font-light mt-1">Equipamentos de Diagnóstico</span>
 </div>

 </div>
 </motionFramer.div>

 </div>
 </div>
 </section>
);
}
