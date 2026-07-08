export interface NavItem {
  title?: string;
  label?: string;
  href: string;
  disabled?: boolean;
}

export const marketingNavigation: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Especialidades", href: "/especialidades" },
  { label: "Exames", href: "/exames" },
  { label: "Sobre a Clínica", href: "/#sobre" },
];

// Alias para compatibilidade retrógrada com referências a marketingNav
export const marketingNav: NavItem[] = marketingNavigation;

export const dashboardNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Usuários", href: "#usuarios" },
  { title: "Relatórios", href: "#relatorios" },
  { title: "Configurações", href: "#configuracoes" },
];
