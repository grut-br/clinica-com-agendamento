import { defaultBrandIdentity, type BrandIdentity } from "@/config/branding";
import type { CSSProperties } from "react";

export function resolveBrandIdentity(identity?: Partial<BrandIdentity>): BrandIdentity {
  return { ...defaultBrandIdentity, ...identity };
}

export function brandCssVariables(identity: BrandIdentity) {
  return {
    "--brand-name": identity.name,
    ...(identity.primaryColor ? { "--brand-primary": identity.primaryColor } : {}),
    ...(identity.accentColor ? { "--brand-accent": identity.accentColor } : {}),
  } as CSSProperties;
}
