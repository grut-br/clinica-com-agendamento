import React from "react";
import Link from "next/link";
import { Phone, MapPin, Smile, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";
import { marketingNavigation } from "@/config/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800 bg-primary text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-16">
          
          {/* Coluna 1: Brand & Descrição com alto contraste */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-transform group-hover:scale-105 shadow-inner">
                <Smile className="h-5.5 w-5.5 text-secondary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white transition-colors">
                Med <span className="text-secondary">Odonto</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-white/80 font-light">
              {siteConfig.description}
            </p>
          </div>

          {/* Coluna 2: Navegação com alto contraste e micro-interação */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Navegação</h3>
            <ul className="space-y-2.5 text-sm font-medium">
              {marketingNavigation.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="inline-block text-white/80 hover:text-secondary hover:translate-x-1 transition-all duration-300 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contatos Oficiais */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Contato</h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-white/90 leading-normal">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-secondary shrink-0" />
                <a 
                  href={`tel:${siteConfig.phone.replace(/[^0-9]/g, "")}`} 
                  className="text-white/90 hover:text-white hover:underline transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="h-4.5 w-4.5 text-secondary shrink-0" />
                <a 
                  href={`https://wa.me/${siteConfig.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/90 hover:text-white hover:underline transition-colors"
                >
                  WhatsApp: (98) 92003-3319
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Créditos */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-light">
          <p>© {currentYear} Clínica Med Odonto. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Desenvolvido por</span>
            <Link
              href="https://devio.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 hover:text-secondary transition-colors"
            >
              Devio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
