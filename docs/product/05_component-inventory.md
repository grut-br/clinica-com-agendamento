# Inventário de Componentes

## Componentes Compartilhados

### Layout e Navegação

| Componente | Arquivo | Uso | Estado |
|---|---|---|---|
| Header | `src/components/layout/header.tsx` | Cabeçalho público | Compartilhado no marketing |
| Footer | `src/components/layout/footer.tsx` | Rodapé público | Compartilhado no marketing |
| Sidebar | `src/components/layout/Sidebar.tsx` | Navegação restrita desktop | Compartilhado no app |
| SidebarNav | `src/components/layout/SidebarNav.tsx` | Itens por papel | Compartilhado no app |
| MobileSidebar | `src/components/layout/MobileSidebar.tsx` | Navegação restrita mobile | Compartilhado no app |
| MobileMenuTrigger | `src/components/layout/MobileMenuTrigger.tsx` | Abertura do menu mobile | Compartilhado no app |
| Topbar | `src/components/layout/Topbar.tsx` | Barra superior restrita | Compartilhado no app |
| PageHeader | `src/components/layout/PageHeader.tsx` | Título, descrição e ação | Compartilhado no app |
| ThemeToggle / client | `src/components/layout/ThemeToggle.tsx` | Alternância claro/escuro | Compartilhado |
| ThemeProvider | `src/components/theme-provider.tsx` | Provedor de tema | Global |
| WhiteLabelInjector | `src/components/layout/WhiteLabelInjector.tsx` | Injeção de identidade visual | Global no app |

### Formulários e Seções

| Componente | Arquivo | Uso |
|---|---|---|
| BaseInput | `src/components/forms/BaseInput.tsx` | Input base |
| Hero | `src/components/sections/hero.tsx` | Hero público |
| SpecialtiesSection | `src/components/sections/specialties-section.tsx` | Seção de especialidades |
| ExamsSection | `src/components/sections/exams-section.tsx` | Seção de exames |
| AgreementsSection | `src/components/sections/agreements-section.tsx` | Convênios |
| AboutSection | `src/components/sections/about-section.tsx` | Sobre a clínica |
| TeamSection | `src/components/sections/team-section.tsx` | Equipe |
| FaqSection | `src/components/sections/faq-section.tsx` | FAQ |
| LocationSection | `src/components/sections/location-section.tsx` | Localização |

## Componentes De Feature

### Agendamento e operação

- `SchedulingForm`: fluxo público em etapas.
- `DashboardTabsView`: abas de triagem e calendário.
- `DashboardAppointmentsList`: tabela/lista de solicitações.
- `DashboardCalendarView`: calendário e slots.
- `DoctorAppointmentsList`: agenda do médico.
- `InternalAppointmentDialog`: agendamento interno.
- `ClinicalNotesSheet`: drawer de evolução clínica.
- `SlotGeneratorForm` e `SlotGeneratorDialog`: geração de disponibilidade.
- `DoctorSelector`: seleção de profissional.

### Catálogos e administração

- `CatalogoTabs`, `SpecialtiesCatalog`, `ExamsCatalog`.
- `SpecialtiesManager`, `SpecialtyFormDialog`.
- `ExamsManager`, `ExamFormDialog`.
- `ProfessionalsManager`, `ProfessionalFormDialog`.
- `UsersManager`, `CreateUserDialog`, `UserProfileDialog`.
- `ClinicSettingsForm`.

### Relatórios

- `MetricsGrid`.
- `AppointmentsChart` e `AppointmentsChartClient`.
- `PopularSpecialties`.

### Autenticação

- `LoginForm`.
- `ForgotPasswordForm`.
- `NewPasswordForm`.
- `UpdatePasswordForm`.

## Catálogo De Padrões UI Observados

| Padrão | Implementação observada |
|---|---|
| Buttons | Botões nativos estilizados localmente; sem componente `Button` em `src/components/ui` |
| Inputs | Inputs nativos; `BaseInput` existe, mas há inputs locais em vários componentes |
| Cards | Containers `div` estilizados por página/componente |
| Tables | Tabelas nativas em listas administrativas |
| Dialogs | Componentes próprios com overlay e estado local |
| Sheet/Drawer | `ClinicalNotesSheet` próprio |
| Dropdowns/Selects | `select` nativo em formulários específicos |
| Badges | `span` estilizado localmente para papéis/status |
| Tabs | Botões e estado local em `DashboardTabsView` e `CatalogoTabs` |
| Empty states | Estados locais em dashboard, agendamento e médico |
| Charts | Recharts via `AppointmentsChart` |
| Calendário | `react-day-picker` em `DashboardCalendarView` |
| Toast | Estado local e toast em `ClinicSettingsForm` |
| Ícones | Lucide React |
| Page Header | `PageHeader` compartilhado no app |

## Compartilhados x Duplicados

### Compartilhados

- Estrutura de layout público e restrito.
- Page Header do painel.
- Tema e injeção white label.
- Ícones Lucide e Tailwind v4.
- Componentes de relatório usados pela tela de relatórios.

### Duplicados ou localmente repetidos

- Botões, inputs, cards, tabelas, badges e overlays são estilizados individualmente.
- Formulários de diálogo repetem cabeçalho, fechar, salvar e feedback.
- Estados de erro, loading, vazio e sucesso têm marcação e linguagem próprias por componente.
- Há dois caminhos de navegação de dashboard: `config/navigation.ts` e `SidebarNav.tsx`.
- O perfil usa tokens semânticos em parte da página, mas também cores físicas locais.

## Lacunas De Reuso

`src/components/ui/README.md` descreve uma área para componentes atômicos, porém não há catálogo implementado nela no inventário auditado. Isso é um registro do estado atual, não uma proposta de implementação nesta sprint.
