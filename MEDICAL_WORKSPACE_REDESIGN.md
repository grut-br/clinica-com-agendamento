# Medical Workspace Redesign (Sprint 7)

## Estratégia
A refatoração da Área do Médico e Meus Atendimentos seguiu a premissa de aproximar a experiência do profissional clínico daquela já estabelecida para a Recepção. Em vez de simplesmente redirecionar o médico a uma listagem estática de prontuários, estruturamos uma central de acompanhamento clínico em tempo real.

## Melhorias Implementadas

### 1. Dashboard do Médico (`/dashboard`)
Criado o componente `DoctorDashboard` que atua como central operacional para o profissional:
- **Resumo rápido (KPIs)**: Estatísticas dinâmicas de atendimentos confirmados para o dia de hoje, número de evoluções concluídas, e evoluções pendentes.
- **Card Próximo Paciente**: Exibe em destaque as informações do próximo paciente na fila (nome, horário do slot, especialidade) com o botão de ação rápida "Atender Agora", que abre a evolução prontamente.
- **Fila de Atendimento do Dia**: Uma listagem ordenada por hora dos agendamentos confirmados do dia, permitindo iniciar o atendimento ou visualizar o prontuário diretamente.
- **Histórico Recente**: Atalho rápido para os últimos 5 prontuários evoluídos pelo médico.

### 2. Meus Atendimentos (`/dashboard/meus-atendimentos`)
O componente `DoctorAppointmentsList` foi completamente redesenhado:
- **Barra de Ferramentas (Toolbar)**: Adicionado campo de busca em tempo real pelo nome do paciente ou pela especialidade utilizando `TableToolbar` e `SearchInput`.
- **Filtro de Status**: Integração de um componente `Select` customizado para filtrar entre todos os atendimentos, pendentes de evolução ou concluídos (evoluídos).
- **Layout de Linha do Tempo (Timeline)**: Os atendimentos são expostos em uma estrutura visual de linha do tempo com dots indicadores verdes para evoluídos e amarelos (com pulsação) para pendentes.
- **Componentes Oficiais**: Utilização de `Card`, `StatusBadge`, `Button`, e `EmptyState`.

### 3. Perfil do Usuário (`/dashboard/perfil`)
Refatoração completa para padronizar e expor todos os dados necessários:
- **Avatar e Informações Pessoais**: Layout centralizado com avatar dinâmico (iniciais) e selos de acesso (RBAC).
- **Dados Clínicos**: Se o usuário logado for um profissional clínico, exibe um card com Especialidade Médica e CRM/CRO (Registration Number) do banco de dados.
- **Preferências**: Introduzidos seletores rápidos (`Switch`) do Design System para gerenciar preferências simuladas do painel (alertas sonoros e notificações por e-mail).
- **Formulário de Segurança**: Atualização de senha integrada.

## Componentes Utilizados
- `PageHeader` (cabeçalho oficial com eyebrow semântico).
- `TableToolbar` & `SearchInput` (ferramentas de busca).
- `Avatar` (iniciais do usuário).
- `StatusBadge` (estados e roles do sistema).
- `Switch` (preferências do painel).
- `Button` (ações e formulários).
- `Card` (agrupamento e estrutura visual).
- `EmptyState` (mensagens de busca vazia).
