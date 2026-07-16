"use client";

import React, { useState, useTransition, useEffect } from "react";
import { 
  Settings, 
  Palette, 
  Bell, 
  Save, 
  CheckCircle, 
  ShieldAlert,
  Loader2,
  Building,
  Phone,
  MapPin,
  Image as ImageIcon,
  Clock,
  Globe,
  Link,
  FileText
} from "lucide-react";
import { updateClinicSettingsAction } from "../actions";
import { ClinicSettings } from "../queries";
import { hexToHslString } from "@/lib/color-utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ClinicSettingsFormProps {
  initialSettings: ClinicSettings | null;
}

export function ClinicSettingsForm({ initialSettings }: ClinicSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"geral" | "aparencia" | "notificacoes">("geral");
  const [isPending, startTransition] = useTransition();

  // Estados da Aba Geral
  const [clinicName, setClinicName] = useState(initialSettings?.clinic_name || "");
  const [whatsapp, setWhatsapp] = useState(initialSettings?.whatsapp || "");
  const [address, setAddress] = useState(initialSettings?.address || "");
  const [phone, setPhone] = useState(initialSettings?.phone || "(98) 3221-4000");
  const [instagram, setInstagram] = useState("@odontoclinic.premium");
  const [facebook, setFacebook] = useState("fb.com/odontoclinic.premium");
  const [businessHours, setBusinessHours] = useState("Segunda a Sexta: 08:00 às 18:00 • Sábado: 08:00 às 12:00");
  const [institutionalMessage, setInstitutionalMessage] = useState("Clínica médica e odontológica de alta performance, referência em tratamentos estéticos e reabilitação oral.");
  
  // Estados da Aba Aparência (Provisórios / White-label)
  const [logoUrl, setLogoUrl] = useState("https://medodonto.com/logo.png");
  const [primaryColor, setPrimaryColor] = useState("#0f172a");
  const [accentColor, setAccentColor] = useState("#d97706");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPrimary = localStorage.getItem("clinic_primary_color");
      const savedAccent = localStorage.getItem("clinic_accent_color");
      const savedBg = localStorage.getItem("clinic_background_color");
      
      setTimeout(() => {
        if (savedPrimary) setPrimaryColor(savedPrimary);
        if (savedAccent) setAccentColor(savedAccent);
        if (savedBg) setBackgroundColor(savedBg);
      }, 0);
    }
  }, []);

  // Preview dinâmico em tempo real
  useEffect(() => {
    if (typeof document === "undefined") return;
    // Só atualiza preview se estiver no Light mode
    if (document.documentElement.classList.contains("dark")) return;
    
    document.documentElement.style.setProperty("--primary", hexToHslString(primaryColor));
    document.documentElement.style.setProperty("--primary-foreground", "210 40% 98%");
    
    document.documentElement.style.setProperty("--accent", hexToHslString(accentColor));
    document.documentElement.style.setProperty("--accent-foreground", "210 40% 98%");
    
    document.documentElement.style.setProperty("--background", hexToHslString(backgroundColor));
    document.documentElement.style.setProperty("--card", hexToHslString(backgroundColor));
  }, [primaryColor, accentColor, backgroundColor]);

  // Estados da Aba Notificações (Simulado)
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [reminder24h, setReminder24h] = useState(true);

  // Estados de feedback
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Efeito para sumir com o toast automaticamente
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Salvar Aba Geral (Persistência Real)
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!clinicName) {
      setError("O nome da clínica é obrigatório.");
      return;
    }

    const formData = new FormData();
    formData.append("clinicName", clinicName);
    formData.append("whatsapp", whatsapp);
    formData.append("address", address);

    startTransition(async () => {
      try {
        const result = await updateClinicSettingsAction({ success: false, message: "" }, formData);
        
        if (!result.success) {
          setError(result.message || "Ocorreu um erro ao salvar as configurações.");
          return;
        }

        setSuccessMessage("Configurações gerais atualizadas com sucesso!");
        setShowToast(true);
      } catch (err) {
        console.error(err);
        setError("Erro crítico ao salvar alterações.");
      }
    });
  };

  // Salvar Aba Aparência (Simulado / LocalStorage)
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    startTransition(async () => {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem("clinic_logo_url", logoUrl);
      localStorage.setItem("clinic_primary_color", primaryColor);
      localStorage.setItem("clinic_primary_color_hsl", hexToHslString(primaryColor));
      localStorage.setItem("clinic_accent_color", accentColor);
      localStorage.setItem("clinic_accent_color_hsl", hexToHslString(accentColor));
      localStorage.setItem("clinic_background_color", backgroundColor);
      localStorage.setItem("clinic_background_color_hsl", hexToHslString(backgroundColor));
      setSuccessMessage("Identidade visual salva com sucesso!");
      setShowToast(true);
    });
  };

  // Salvar Aba Notificações (Simulado)
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    startTransition(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMessage("Preferências de notificação atualizadas!");
      setShowToast(true);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Navegação Lateral Interna (Estilo shadcn/ui settings) */}
      <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-border md:pr-4 select-none shrink-0 scrollbar-none">
        
        {/* Aba Geral */}
        <button
          type="button"
          onClick={() => { setActiveTab("geral"); setError(""); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left whitespace-nowrap md:w-full ${
            activeTab === "geral"
              ? "bg-muted text-foreground border border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Settings className={`h-4.5 w-4.5 ${activeTab === "geral" ? "text-secondary" : "text-muted-foreground/80"}`} />
          Geral
        </button>

        {/* Aba Aparência */}
        <button
          type="button"
          onClick={() => { setActiveTab("aparencia"); setError(""); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left whitespace-nowrap md:w-full ${
            activeTab === "aparencia"
              ? "bg-muted text-foreground border border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Palette className={`h-4.5 w-4.5 ${activeTab === "aparencia" ? "text-secondary" : "text-muted-foreground/80"}`} />
          Aparência
        </button>

        {/* Aba Notificações */}
        <button
          type="button"
          onClick={() => { setActiveTab("notificacoes"); setError(""); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left whitespace-nowrap md:w-full ${
            activeTab === "notificacoes"
              ? "bg-muted text-foreground border border-border shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Bell className={`h-4.5 w-4.5 ${activeTab === "notificacoes" ? "text-secondary" : "text-muted-foreground/80"}`} />
          Notificações
        </button>

      </div>

      {/* Conteúdo Principal (Lado Direito) */}
      <div className="md:col-span-3">
        
        {/* Alerta de erro geral */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-start gap-3 text-red-750 dark:text-red-300 text-sm animate-in fade-in" role="alert">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
            <p className="leading-relaxed font-semibold">{error}</p>
          </div>
        )}

        {/* --- ABA GERAL --- */}
        {activeTab === "geral" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            
            {/* Bloco 1: Identidade da Clínica */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-colors duration-300">
              <div className="px-6 py-5 border-b border-border bg-muted/20">
                <h2 className="text-base font-bold text-card-foreground flex items-center gap-2">
                  <Building className="h-5 w-5 text-secondary" />
                  Identidade da Clínica
                </h2>
                <p className="text-xs text-muted-foreground font-light mt-1">
                  Configure o nome, logotipo e descrição institucional da marca da clínica.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nome da Clínica */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="clinicName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Nome da Clínica *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="clinicName"
                        type="text"
                        required
                        disabled={isPending}
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        placeholder="Ex: OdontoClinic Premium"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Logo URL (Movido para cá para unificar a Identidade) */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="logoUrl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      URL do Logotipo
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="logoUrl"
                        type="text"
                        disabled={isPending}
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://sua-clinica.com/logo.png"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Mensagem Institucional / Slogan */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="institutionalMessage" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Mensagem Institucional (Slogan / Missão)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                    <textarea
                      id="institutionalMessage"
                      disabled={isPending}
                      rows={3}
                      value={institutionalMessage}
                      onChange={(e) => setInstitutionalMessage(e.target.value)}
                      placeholder="Descreva resumidamente a missão e diferenciais da clínica..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Contato & Localização */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-colors duration-300">
              <div className="px-6 py-5 border-b border-border bg-muted/20">
                <h2 className="text-base font-bold text-card-foreground flex items-center gap-2">
                  <Phone className="h-5 w-5 text-secondary" />
                  Canais de Contato & Localização
                </h2>
                <p className="text-xs text-muted-foreground font-light mt-1">
                  Configure os telefones, endereços, redes sociais e horários de funcionamento da clínica.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Telefone de Contato */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Telefone Fixo / Principal
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="phone"
                        type="tel"
                        disabled={isPending}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (98) 3221-4000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* WhatsApp de Atendimento */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      WhatsApp de Atendimento
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="whatsapp"
                        type="tel"
                        disabled={isPending}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Ex: (98) 98123-4567"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Horário de Funcionamento */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="businessHours" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Horário de Funcionamento
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="businessHours"
                        type="text"
                        disabled={isPending}
                        value={businessHours}
                        onChange={(e) => setBusinessHours(e.target.value)}
                        placeholder="Ex: Segunda a Sexta: 08:00 às 18:00"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Endereço Completo */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Endereço da Sede
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="address"
                        type="text"
                        disabled={isPending}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ex: Av. dos Holandeses, 1000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="instagram" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Instagram da Clínica
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="instagram"
                        type="text"
                        disabled={isPending}
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="Ex: @odontoclinic.premium"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="facebook" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Facebook da Clínica
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground/60" />
                      <input
                        id="facebook"
                        type="text"
                        disabled={isPending}
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="Ex: fb.com/odontoclinic"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder-muted-foreground/50 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/5 focus:border-primary/50 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé de Ação Geral */}
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
                <Button type="submit" variant="primary" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* --- ABA APARÊNCIA --- */}
        {activeTab === "aparencia" && (
          <form onSubmit={handleSaveAppearance} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-colors duration-300">
            
            {/* Header do Card */}
            <div className="px-6 py-5 border-b border-border bg-muted/20">
              <h2 className="text-base font-bold text-card-foreground flex items-center gap-2">
                <Palette className="h-5 w-5 text-secondary animate-pulse" />
                Identidade Visual (White-Label)
              </h2>
              <p className="text-xs text-muted-foreground font-light mt-1">
                Personalize o visual do agendador e do painel com as cores e logotipo oficiais da clínica.
              </p>
            </div>

            {/* Campos do Card */}
            <div className="p-6 space-y-6">
              
              {/* Cor Primária */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="primaryColor" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Cor Primária do Sistema
                </label>
                <div className="flex items-center gap-4">
                  {/* Color Picker */}
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border cursor-pointer shrink-0">
                    <input
                      id="primaryColor"
                      type="color"
                      disabled={isPending}
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 h-full w-full border-none p-0 cursor-pointer scale-150"
                    />
                  </div>
                  {/* Hexadecimal Display & Preview Box */}
                  <div className="flex-1 flex items-center justify-between px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-mono text-muted-foreground">
                    <span>{primaryColor.toUpperCase()}</span>
                    <div 
                      className="h-5 w-12 rounded-lg shadow-sm border border-black/10" 
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Cor Secundária / Accent */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="accentColor" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  COR SECUNDÁRIA / BOTÕES (Accent)
                </label>
                <div className="flex items-center gap-4">
                  {/* Color Picker */}
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border cursor-pointer shrink-0">
                    <input
                      id="accentColor"
                      type="color"
                      disabled={isPending}
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="absolute inset-0 h-full w-full border-none p-0 cursor-pointer scale-150"
                    />
                  </div>
                  {/* Hexadecimal Display & Preview Box */}
                  <div className="flex-1 flex items-center justify-between px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-mono text-muted-foreground">
                    <span>{accentColor.toUpperCase()}</span>
                    <div 
                      className="h-5 w-12 rounded-lg shadow-sm border border-black/10" 
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Cor de Fundo */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="backgroundColor" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  COR DE FUNDO DO SISTEMA
                </label>
                <div className="flex items-center gap-4">
                  {/* Color Picker */}
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border cursor-pointer shrink-0">
                    <input
                      id="backgroundColor"
                      type="color"
                      disabled={isPending}
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="absolute inset-0 h-full w-full border-none p-0 cursor-pointer scale-150"
                    />
                  </div>
                  {/* Hexadecimal Display & Preview Box */}
                  <div className="flex-1 flex items-center justify-between px-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-mono text-muted-foreground">
                    <span>{backgroundColor.toUpperCase()}</span>
                    <div 
                      className="h-5 w-12 rounded-lg shadow-sm border border-black/10" 
                      style={{ backgroundColor: backgroundColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Gráfico da Identidade Visual */}
              <div className="pt-4 border-t border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Visualização do Layout do Botão
                </span>
                <div className="p-6 bg-muted/30 rounded-2xl border border-border flex justify-center items-center">
                  <button
                    type="button"
                    style={{ backgroundColor: accentColor }}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md cursor-default pointer-events-none transition-all"
                  >
                    Exemplo de Botão Clínico
                  </button>
                </div>
              </div>

            </div>

            {/* Rodapé do Card com Ações */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Aparência
                  </>
                )}
              </Button>
            </div>

          </form>
        )}

        {/* --- ABA NOTIFICAÇÕES --- */}
        {activeTab === "notificacoes" && (
          <form onSubmit={handleSaveNotifications} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden text-card-foreground transition-colors duration-300">
            
            {/* Header do Card */}
            <div className="px-6 py-5 border-b border-border bg-muted/20">
              <h2 className="text-base font-bold text-card-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-secondary animate-pulse" />
                Disparos & Alertas Automatizados
              </h2>
              <p className="text-xs text-muted-foreground font-light mt-1">
                Escolha os canais e regras para o envio de mensagens de confirmação e lembretes para os pacientes.
              </p>
            </div>

            {/* Campos do Card */}
            <div className="p-6 space-y-5">
              
              {/* Opção WhatsApp */}
              <div className="flex items-start justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5 max-w-sm sm:max-w-md">
                  <div className="font-bold text-sm text-foreground">Confirmar Agendamento via WhatsApp</div>
                  <div className="text-xs text-muted-foreground font-light leading-relaxed">
                    Dispara uma mensagem de confirmação instantânea para o celular do paciente quando o status mudar para &quot;Confirmado&quot;.
                  </div>
                </div>
                <Switch
                  disabled={isPending}
                  checked={notifyWhatsapp}
                  onCheckedChange={setNotifyWhatsapp}
                  aria-label="Ativar notificações via WhatsApp"
                />
              </div>

              {/* Opção Lembrete 24h */}
              <div className="flex items-start justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors border-t border-border">
                <div className="space-y-0.5 max-w-sm sm:max-w-md">
                  <div className="font-bold text-sm text-foreground">Lembrete de Consulta 24h antes</div>
                  <div className="text-xs text-muted-foreground font-light leading-relaxed">
                    Envia um alerta automático de lembrete com a data, horário e instruções de acesso um dia antes do atendimento do paciente.
                  </div>
                </div>
                <Switch
                  disabled={isPending}
                  checked={reminder24h}
                  onCheckedChange={setReminder24h}
                  aria-label="Ativar lembrete 24h"
                />
              </div>

              {/* Opção Notificação por E-mail Admin */}
              <div className="flex items-start justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors border-t border-border">
                <div className="space-y-0.5 max-w-sm sm:max-w-md">
                  <div className="font-bold text-sm text-foreground">Alertar novos agendamentos por e-mail</div>
                  <div className="text-xs text-muted-foreground font-light leading-relaxed">
                    Notifica a equipe administrativa por e-mail sempre que um paciente realizar uma nova solicitação através do portal.
                  </div>
                </div>
                <Switch
                  disabled={isPending}
                  checked={notifyEmail}
                  onCheckedChange={setNotifyEmail}
                  aria-label="Ativar notificações por e-mail"
                />
              </div>

            </div>

            {/* Rodapé do Card com Ações */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Preferências
                  </>
                )}
              </Button>
            </div>

          </form>
        )}

      </div>

      {/* Toast flutuante de sucesso */}
      {showToast && (
        <div
          className="fixed bottom-5 right-5 z-[100] bg-card border border-border text-card-foreground px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300"
          role="status"
        >
          <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
          <span className="text-sm font-bold">{successMessage}</span>
        </div>
      )}

    </div>
  );
}
