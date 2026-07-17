# Relatório Técnico De Frontend

Relatório descritivo do estado encontrado no repositório. Não contém recomendações de alteração.

## Bibliotecas Utilizadas

- `next`: framework e App Router.
- `react` e `react-dom`: camada de renderização.
- `@supabase/ssr` e `@supabase/supabase-js`: integração SSR e cliente Supabase.
- `zod`: validação de schemas e ambiente.
- `date-fns`: manipulação de datas.
- `framer-motion`: transições e animações.
- `lucide-react`: biblioteca de ícones.
- `react-day-picker`: calendário.
- `recharts`: gráficos.
- `next-themes`: alternância de tema.

## Frameworks E Base

- Next.js `16.2.9`.
- React `19.2.4`.
- TypeScript `5`.
- Tailwind CSS `4` via `@tailwindcss/postcss`.
- ESLint `9` com configuração Next.

## Sistema De Tema

`src/app/globals.css` define variáveis HSL para background, foreground, card, border, primary, accent, muted e textos secundários. O bloco `.dark` substitui os valores para modo escuro. Tailwind v4 mapeia essas variáveis no bloco `@theme inline`.

`ThemeProvider`, `ThemeToggle` e `theme-toggle-client` usam `next-themes`. A transição global de cores está no body.

## Sistema White Label

`WhiteLabelInjector` aplica configurações persistidas de identidade visual no modo claro e remove propriedades inline no modo escuro. `ClinicSettingsForm` expõe preview local e campos de cores. O relatório existente `white-label-architecture-report.md` detalha a implementação e os tokens envolvidos.

## Biblioteca De Tabelas

Não há biblioteca de tabelas dedicada identificada no `package.json`. As tabelas são elementos HTML nativos estilizados localmente, principalmente em gerenciadores e listas de agendamentos.

## Biblioteca De Gráficos

`recharts` é usado em `src/features/reports/components/appointments-chart.tsx`, com `AppointmentsChartClient` usando importação dinâmica e `ssr: false`.

## Biblioteca De Ícones

`lucide-react` é usado em layouts, formulários, estados, navegação, calendário, relatórios e componentes de marketing.

## Calendário

`react-day-picker` fornece `DayPicker` em `DashboardCalendarView`. O sistema também usa ícones e campos nativos de data em outros fluxos.

## Estrutura Dos Layouts

- `src/app/layout.tsx`: root layout, provedores e estrutura HTML global.
- `src/app/(marketing)/layout.tsx`: injeta Header e Footer para páginas públicas.
- `src/app/(auth)/layout.tsx`: centraliza telas de acesso em viewport mínimo.
- `src/app/(app)/layout.tsx`: compõe Sidebar, Topbar, WhiteLabelInjector e área principal protegida.

## Componentes Compartilhados

Os principais são Header, Footer, Sidebar, SidebarNav, MobileSidebar, MobileMenuTrigger, Topbar, PageHeader, ThemeProvider, ThemeToggle, WhiteLabelInjector e BaseInput. As seções institucionais também são compartilhadas pela Home.

## Estrutura FSD

- `src/app`: rotas e layouts do App Router.
- `src/features/auth`: formulários, schemas e actions de autenticação.
- `src/features/appointments`: queries, schemas, actions e componentes de agendamento, catálogo, profissionais, usuários e atendimento.
- `src/features/clinic`: queries, actions e formulário de configurações da clínica.
- `src/features/reports`: actions e componentes de métricas, gráficos e especialidades.
- `src/components`: componentes de layout, forms, sections e tema.
- `src/config`: site, navegação, permissões e dados.
- `src/lib`: Supabase, ambiente, mocks, constantes e utilitários.

## Pontos Fortes Da Arquitetura

- Uso de App Router e route groups para separar contextos públicos, de acesso e restritos.
- Separação de lógica de negócio em `features`.
- Server Components nas páginas para carregamento de dados no servidor.
- Supabase SSR com cookies de sessão.
- Validação com Zod.
- Layout restrito compartilhado para Sidebar e Topbar.
- Componentes de relatório carregados de forma dinâmica.
- Tokens de tema e injeção white label já presentes.

## Pontos De Atenção

- A navegação declarada em `config/navigation.ts` diverge da navegação efetivamente montada em `SidebarNav` e `MobileSidebar`.
- A pasta `src/components/ui` contém apenas README, enquanto padrões atômicos aparecem implementados localmente.
- Há mistura de tokens semânticos com cores físicas em componentes e páginas.
- Dialogs, sheets, tabs, feedbacks, tabelas e estados vazios são implementados por feature, sem uma camada atômica única identificada.
- A aplicação possui vários perfis, mas `permissions.ts` documenta apenas `admin` e `user`, enquanto componentes usam `doctor`, `receptionist` e `pending`.
- O layout e componentes têm diferentes tratamentos de tema e responsividade.
- A auditoria deste relatório é estática; não representa validação funcional em navegador.
