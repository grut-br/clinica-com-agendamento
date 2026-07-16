"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { SlotGeneratorForm } from "./slot-generator-form";
import { Button } from "@/components/ui/button";

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
      <Button 
        onClick={() => setIsOpen(true)}
        variant="primary"
      >
        <Plus className="h-4 w-4 shrink-0" />
        Gerar Nova Grade
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </Button>
            <SlotGeneratorForm specialties={specialties} professionals={professionals} />
          </div>
        </div>
      )}
    </>
  );
}
