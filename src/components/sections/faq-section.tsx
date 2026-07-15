import React from"react";
import { HelpCircle, ChevronDown} from"lucide-react";

export function FaqSection() {
 const faqs = [
 {
 question:"Como realizar o agendamento de uma consulta ou exame?",
 answer:"Você pode agendar diretamente pelo nosso site acessando a seção de Especialidades, escolhendo a área e o melhor dia/horário disponível. Em seguida, preencha os seus dados de contato e envie a solicitação. Nossa recepção entrará em contato com você pelo WhatsApp para a confirmação final.",
},
 {
 question:"Quais convênios e planos de saúde a policlínica aceita?",
 answer:"Atendemos diversos planos de saúde como Unimed, Bradesco Saúde, SulAmérica, Cassi, Golden Cross e Geap. Além disso, oferecemos preços populares para consultas particulares e pacotes integrados com exames do laboratório Ultralab.",
},
 {
 question:"O laboratório Ultralab realiza exames sem agendamento?",
 answer:"Sim! Para exames laboratoriais básicos (como sangue, urina e fezes), você pode comparecer diretamente à clínica no período da manhã com os documentos necessários e o pedido médico. Já os exames de imagem (como ultrassonografias e eletrocardiogramas) necessitam de pré-agendamento no site ou WhatsApp.",
},
 {
 question:"Como funciona a política de retorno das consultas médicas?",
 answer:"O paciente tem direito a um retorno de consulta gratuito dentro do período de até 15 dias corridos após o atendimento inicial, para apresentação de exames solicitados e orientações terapêuticas de acompanhamento.",
},
 ];

 return (
 <section className="relative w-full py-20 sm:py-28 bg-gradient-to-br from-[#0B1A3A] to-[#162B56] text-white overflow-hidden" id="faq">
 
 {/* Elementos de background premium */}
 <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[20%] right-[-10%] h-[300px] w-[300px] rounded-full bg-[#D4AF37]/10 blur-[80px]"/>
 <div className="absolute bottom-[20%] left-[-10%] h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[90px]"/>
 <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]"/>
 </div>

 <div className="container relative z-10 mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
 
 {/* Cabeçalho da Seção */}
 <div className="max-w-3xl mx-auto mb-16 text-center">
 <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#D4AF37] mb-4">
 <HelpCircle className="h-4 w-4 text-[#D4AF37]"/>
 <span>Suporte ao Paciente</span>
 </div>
 <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
 Dúvidas Frequentes
 </h2>
 <p className="mt-4 text-base sm:text-lg text-white/80 font-light leading-relaxed">
 Esclareça as principais dúvidas sobre o atendimento da Clínica Med Odonto e o laboratório Ultralab.
 </p>
 </div>

 {/* Lista de FAQ com Accordion Semântico Details/Summary */}
 <div className="space-y-4 w-full">
 {faqs.map((faq, index) => (
 <details
 key={index}
 className="group border border-slate-100 rounded-2xl bg-white p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all duration-300 shadow-lg hover:scale-[1.01]"
 >
 <summary className="flex items-center justify-between gap-4 text-slate-900 font-bold text-base sm:text-lg select-none">
 <span>{faq.question}</span>
 <ChevronDown className="h-5 w-5 text-[#D4AF37] shrink-0 transition-transform duration-300 group-open:-rotate-180"/>
 </summary>
 <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
 {faq.answer}
 </p>
 </details>
))}
 </div>

 </div>
 </section>
);
}
