export interface BrandIdentity {
  name: string;
  logoSrc?: string;
  iconSrc?: string;
  faviconSrc?: string;
  coverSrc?: string;
  institutionalText?: string;
  primaryColor?: string;
  accentColor?: string;
}

export const defaultBrandIdentity: BrandIdentity = {
  name: "Sistema Inteligente de Agendamento",
  institutionalText: "Uma central de agenda calma, precisa e humana.",
};

export const brandSlots = [
  "name",
  "logoSrc",
  "iconSrc",
  "faviconSrc",
  "coverSrc",
  "institutionalText",
  "primaryColor",
  "accentColor",
] as const;

export type BrandSlot = (typeof brandSlots)[number];
