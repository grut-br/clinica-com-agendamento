"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Calendar, Heart, ShieldCheck, Star, Users } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white py-16 sm:py-24 md:py-28">
      {/* Elementos de background luminosos e sutis */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Glow dourado suave no topo direito */}
        <div className="absolute -top-[10%] -right-[10%] h-[350px] sm:h-[450px] w-[350px] sm:w-[450px] rounded-full bg-secondary/10 blur-[90px] sm:blur-[110px]" />
        {/* Glow azul saúde no canto inferior esquerdo */}
        <div className="absolute -bottom-[10%] -left-[10%] h-[400px] sm:h-[500px] w-[400px] sm:w-[500px] rounded-full bg-primary/5 blur-[100px] sm:blur-[120px]" />
        
        {/* Grid sutil */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Esquerdo: Conteúdo em Contraste Escuro sobre Fundo Claro */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            
            {/* Badge de Credibilidade */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-sm mb-6"
            >
              <Heart className="h-4 w-4 fill-secondary text-secondary" />
              <span>Sua Saúde é Nossa Prioridade</span>
            </motion.div>

            {/* Headline Principal de Alta Autoridade */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7.5xl leading-[1.1]"
            >
              Excelência em Saúde <br className="hidden sm:inline" />
              e Odontologia <span className="text-secondary block sm:inline">no Coração de Pirapemas.</span>
            </motion.h1>

            {/* Subtítulo Persuasivo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-light"
            >
              Uma estrutura completa com corpo clínico especializado, laboratório próprio e atendimento humanizado para você e sua família.
            </motion.p>

            {/* Botões de Ação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto"
            >
              <Link
                href="/especialidades"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-secondary hover:bg-secondary-hover px-8 py-4 text-base font-bold text-primary transition-all duration-300 shadow-lg shadow-secondary/15 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
                Agendar Consulta
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-8 py-4 text-base font-bold text-primary transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Phone className="h-5 w-5 text-emerald-600 fill-emerald-600/10" />
                Falar no WhatsApp
              </Link>
            </motion.div>

            {/* Benefícios Rápidos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-6 w-full text-slate-750"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Estrutura Moderna</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Star className="h-5 w-5 text-secondary fill-secondary shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Equipe Especialista</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <Heart className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Atendimento Humanizado</span>
              </div>
            </motion.div>

          </div>
          
          {/* Lado Direito: Visual Humano */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-[480px] aspect-[4/3]"
            >
              <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-tr from-secondary/10 to-primary/10 blur-xl -z-10" />
              
              <div className="w-full h-full bg-slate-100 border-4 border-white rounded-[32px] overflow-hidden shadow-xl flex flex-col items-center justify-center p-6 text-center select-none relative">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex flex-col items-center gap-3.5">
                  <div className="h-16 w-16 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-secondary">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Foto da Equipe Médica</h3>
                    <p className="text-xs text-zinc-500 max-w-[240px] mt-1.5 leading-relaxed font-light">
                      Espaço reservado para a foto real da nossa equipe de especialistas da Med Odonto.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
