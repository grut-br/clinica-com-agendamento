"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { SlotGeneratorForm } from "./slot-generator-form";

interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
}

interface ProfessionalItem {
  id: string;
  name: string;
  specialty_id: string;
}

interface SlotGeneratorDialogProps {
  specialties: SpecialtyItem[];
  professionals: ProfessionalItem[];
}

export function SlotGeneratorDialog({ specialties, professionals }: SlotGeneratorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm"
      >
        <Plus className="h-4 w-4 shrink-0" />
        Gerar Nova Grade
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <SlotGeneratorForm specialties={specialties} professionals={professionals} />
          </div>
        </div>
      )}
    </>
  );
}
