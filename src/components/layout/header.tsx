"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Smile } from "lucide-react";
import { marketingNavigation } from "@/config/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo / Branding */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:scale-105 shadow-inner">
              <Smile className="h-5.5 w-5.5 text-secondary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary transition-colors">
              Med <span className="text-secondary">Odonto</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {marketingNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm font-semibold text-zinc-650 transition-colors hover:text-secondary group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/especialidades"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Agendar
              <ArrowUpRight className="h-4 w-4 text-secondary" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 text-primary hover:bg-slate-50 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-150 bg-white md:hidden shadow-lg"
          >
            <div className="space-y-3 px-6 py-6">
              {marketingNavigation.map((item) => (
                <Link
                  key={item.href}
                  onClick={() => setIsOpen(false)}
                  href={item.href}
                  className="block rounded-lg px-4 py-2.5 text-base font-semibold text-zinc-650 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/especialidades"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  Agendar
                  <ArrowUpRight className="h-4 w-4 text-secondary" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
