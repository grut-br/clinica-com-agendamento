"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  ArrowRight,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { siteConfig } from "@/config/site";

// Ícone personalizado do Instagram em SVG inline
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function LocationSection() {
  // URL de embed pública do Google Maps
  const mapsEmbedUrl = "https://maps.google.com/maps?q=Rua%20Lu%C3%ADs%20Soares,%20Centro,%20Pirapemas-MA&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="relative w-full py-20 sm:py-28 bg-white text-primary overflow-hidden" id="localizacao">
      
      {/* Detalhes de background para o fundo claro */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-primary/5 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          
          {/* Coluna da Esquerda: Mapa Interativo Responsivo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="relative w-full aspect-video sm:aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
              <iframe
                title="Localização da Clínica Med Odonto no Google Maps"
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                className="absolute inset-0 border-none"
                allowFullScreen={true}
                loading="lazy"
              />
            </div>
          </motion.div>
          
          {/* Coluna da Direita: Textos de Impacto e Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-start text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary mb-5">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Onde Estamos</span>
            </div>

            {/* Título Principal */}
            <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-5xl leading-tight">
              Venha cuidar do seu <br className="hidden sm:inline" />
              <span className="text-secondary bg-clip-text">sorriso e da sua saúde</span>
            </h2>

            {/* Subtítulo */}
            <p className="mt-6 text-base sm:text-lg text-zinc-550 leading-relaxed font-light">
              Nossa estrutura completa está pronta para receber você e sua família no coração de Pirapemas-MA. Agende uma visita ou venha direto nos conhecer!
            </p>

            {/* Informações de Contato Detalhes em Preto/Azul Claro */}
            <ul className="mt-8 space-y-5 w-full">
              
              {/* Endereço */}
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/5 shrink-0 mt-0.5">
                  <MapPin className="h-5.5 w-5.5 text-secondary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Endereço</h4>
                  <p className="text-sm text-zinc-650 font-light mt-0.5">{siteConfig.address}</p>
                </div>
              </li>

              {/* Telefone / WhatsApp */}
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/5 shrink-0 mt-0.5">
                  <MessageSquare className="h-5.5 w-5.5 text-secondary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Telefone & WhatsApp</h4>
                  <div className="flex flex-col text-sm text-zinc-650 font-light mt-0.5">
                    <a href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`} className="hover:text-primary transition-colors font-medium">
                      {siteConfig.phone}
                    </a>
                    <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                      WhatsApp: (98) 92003-3319
                    </a>
                  </div>
                </div>
              </li>

              {/* Redes Sociais */}
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/5 shrink-0 mt-0.5">
                  <InstagramIcon className="h-5.5 w-5.5 text-secondary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Instagram</h4>
                  <a 
                    href="https://instagram.com/med.odonto1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-650 hover:text-primary transition-colors font-light mt-0.5 block"
                  >
                    @med.odonto1
                  </a>
                </div>
              </li>

            </ul>

            {/* CTA Final */}
            <div className="mt-10 w-full sm:w-auto">
              <Link
                href="/especialidades"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-secondary hover:bg-secondary-hover px-8 py-4 text-base font-bold text-primary transition-all duration-300 shadow-xl shadow-secondary/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="h-5 w-5" />
                Agendar Consulta
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
