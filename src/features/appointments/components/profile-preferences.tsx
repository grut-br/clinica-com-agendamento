"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { UserCheck } from "lucide-react";

export function ProfilePreferences() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <h3 className="text-base font-bold text-foreground flex items-center gap-2 border-b border-border pb-4">
        <UserCheck className="h-5 w-5 text-secondary" />
        Preferências
      </h3>

      <div className="space-y-4">
        {/* Notificação por E-mail */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground">Alertas por E-mail</span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Lembretes diários de consultas.</p>
          </div>
          <Switch 
            checked={emailAlerts} 
            onCheckedChange={setEmailAlerts} 
            aria-label="Ativar alertas por e-mail" 
          />
        </div>

        {/* Alertas Sonoros */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground">Notificações Sonoras</span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Sons ao atualizar status na fila.</p>
          </div>
          <Switch 
            checked={soundNotifications} 
            onCheckedChange={setSoundNotifications} 
            aria-label="Ativar notificações sonoras" 
          />
        </div>
      </div>
    </Card>
  );
}
