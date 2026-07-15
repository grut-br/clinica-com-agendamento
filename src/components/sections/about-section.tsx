"use client";

import React from"react";
import { motion} from"framer-motion";
import { 
 Users, 
 HeartHandshake, 
 Building2, 
 MapPin, 
 Sparkles,
 ArrowUpRight
} from"lucide-react";
import Link from"next/link";

// Definição dos cards de diferenciais
const differentials = [
 {
 icon: Users,
 title:"Equipe Multidisciplinar",
 description:"Especialistas altamente capacitados nas mais diversas áreas da saúde e odontologia.",
},
 {
 icon: HeartHandshake,
 title:"Atendimento Humanizado",
 description:"Cuidado centrado em você, priorizando a empatia, o conforto e a sua segurança em primeiro lugar.",
},
 {
 icon: Building2,
 title:"Estrutura Completa",
 description:"Equipamentos de última geração e laboratório próprio Ultralab para laudos rápidos e precisos.",
},
 {
 icon: MapPin,
 title:"Localização Central",
 description:"Fácil acesso no Centro de Pirapemas-MA, com instalações climatizadas e acolhedoras.",
},
];

// Variantes do Framer Motion para animação em cascata (Stagger) de alta performance
const containerVariants = {
 hidden: { opacity: 0},
 show: {
 opacity: 1,
 transition: {
 staggerChildren: 0.12,
},
},
};

const cardVariants = {
 hidden: { opacity: 0, y: 20},
 show: { 
 opacity: 1, 
 y: 0,
 transition: {
 type:"spring",
 stiffness: 100,
 damping: 16
}
},
};

export function AboutSection() {
 return (
 <section className="relative w-full py-20 sm:py-28 bg-gradient-to-br from-[#0B1A3A] to-[#162B56] text-white overflow-hidden" id="sobre">
 {/* Detalhes abstratos de fundo para o degradê escuro */}
 <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
 <div className="absolute -top-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-[#D4AF37]/10 blur-[80px]"/>
 <div className="absolute -bottom-[10%] right-[20%] h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[90px]"/>
 <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"/>
 </div>

 <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
 
 {/* Cabeçalho da Seção */}
 <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
 <motion.div
 initial={{ opacity: 0, y: 10}}
 whileInView={{ opacity: 1, y: 0}}
 viewport={{ once: true}}
 transition={{ duration: 0.5}}
 className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#D4AF37] mb-4"
 >
 <Sparkles className="h-4 w-4 text-[#D4AF37]"/>
 <span>Sobre a Clínica</span>
 </motion.div>
 
 <motion.h2
 initial={{ opacity: 0, y: 15}}
 whileInView={{ opacity: 1, y: 0}}
 viewport={{ once: true}}
 transition={{ duration: 0.5, delay: 0.1}}
 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl"
 >
 Por que escolher a Med Odonto?
 </motion.h2>
 
 <motion.p
 initial={{ opacity: 0, y: 15}}
 whileInView={{ opacity: 1, y: 0}}
 viewport={{ once: true}}
 transition={{ duration: 0.5, delay: 0.2}}
 className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed font-light"
 >
 Somos uma clínica integrada em Pirapemas-MA, unindo diversas especialidades médicas e odontológicas em um ambiente moderno e acolhedor.
 </motion.p>
 </div>

 {/* Grade de Diferenciais com Stagger */}
 <motion.div
 variants={containerVariants}
 initial="hidden"
 whileInView="show"
 viewport={{ once: true, margin:"-50px"}}
 className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
 >
 {differentials.map((diff, index) => {
 const IconComponent = diff.icon;
 return (
 <motion.div
 key={index}
 variants={cardVariants}
 whileHover={{ scale: 1.03, y: -4}}
 className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden"
 >
 {/* Linha decorativa dourada superior no hover */}
 <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
 
 <div>
 {/* Container do Ícone */}
 <div className="h-10 w-10 rounded-xl bg-[#0B1A3A]/5 text-[#0B1A3A] flex items-center justify-center mb-5 group-hover:bg-[#0B1A3A] group-hover:text-white transition-colors duration-300 border border-[#0B1A3A]/5 shrink-0">
 <IconComponent className="h-5.5 w-5.5 text-[#D4AF37] group-hover:text-white transition-colors duration-300"/>
 </div>

 {/* Título do Diferencial */}
 <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-sans">
 {diff.title}
 </h3>

 {/* Descrição */}
 <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
 {diff.description}
 </p>
 </div>
 </motion.div>
);
})}
 </motion.div>

 {/* Chamada de Ação Final com alto contraste */}
 <motion.div
 initial={{ opacity: 0, y: 15}}
 whileInView={{ opacity: 1, y: 0}}
 viewport={{ once: true}}
 transition={{ duration: 0.5, delay: 0.5}}
 className="mt-16 text-center"
 >
 <Link
 href="/#contato"
 className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-white hover:text-[#D4AF37] transition-colors"
 >
 Quer saber mais sobre nossa equipe ou agendar uma visita?
 <span className="flex items-center gap-0.5 font-bold underline text-[#D4AF37]">
 Fale Conosco
 <ArrowUpRight className="h-4 w-4"/>
 </span>
 </Link>
 </motion.div>

 </div>
 </section>
);
}
