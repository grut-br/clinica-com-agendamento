# Roadmap De Refatoração

O roadmap organiza futuras entregas visuais e de experiência. Ele não autoriza mudanças de backend, regras, banco, Server Actions ou features.

## Sprint 1: Design System

### Objetivo

Estabelecer linguagem visual única para a clínica e para o sistema de agendamento.

### Escopo

- Tokens semânticos de cor, superfície, borda, foco e status.
- Escala de tipografia e espaçamento.
- Estados de interação, loading, erro, vazio e sucesso.
- Regras de contraste, foco e movimento reduzido.
- Vocabulário visual e UX writing base.
- Critérios de compatibilidade com modo claro, escuro e white label.

### Fora do escopo

Regras de negócio, banco, autenticação e novas funcionalidades.

## Sprint 2: Layout Base

### Objetivo

Organizar a moldura de navegação pública, autenticação e painel.

### Escopo

- Sidebar, Topbar, menu mobile e Page Header.
- Hierarquia de navegação por perfil.
- Responsividade e áreas de conteúdo.
- Breadcrumbs, títulos e contexto de página.
- Padrões de foco e navegação por teclado.

## Sprint 3: Dashboard

### Objetivo

Reduzir o tempo de triagem e tornar a operação diária imediatamente compreensível.

### Escopo

- Priorização de solicitações pendentes.
- Lista/tabela de agendamentos.
- Ações de confirmação e cancelamento.
- Calendário e visão operacional.
- Estados vazios, feedback e densidade de informação.

## Sprint 4: Agenda

### Objetivo

Tornar criação e consulta de disponibilidade previsíveis para recepção e administrador.

### Escopo

- Fluxo de geração de slots.
- Calendário, filtros e seleção de profissional/especialidade.
- Visualização de conflitos e estados de disponibilidade.
- Responsividade para uso em balcão.
- Consistência entre agenda no dashboard e rota de gerenciamento.

## Sprint 5: Módulos Administrativos

### Objetivo

Unificar catálogo, corpo clínico, usuários, relatórios, configurações e perfil.

### Escopo

- Tabelas e formulários administrativos.
- Dialogs, drawers, tabs, badges e confirmações.
- Organização de configurações e white label.
- Relatórios e leitura dos gráficos.
- Estados de permissão, acesso negado e vínculo clínico.

## Sprint 6: Polimento Final

### Objetivo

Validar a experiência completa e remover inconsistências residuais.

### Escopo

- Auditoria visual entre rotas e perfis.
- Acessibilidade de teclado e leitor de tela.
- Responsividade em breakpoints principais.
- Performance percebida e estabilidade visual.
- Revisão de microcopy e estados de erro.
- Checklist de regressão visual.

## Dependências Entre Sprints

- Sprint 1 precede todas as demais.
- Sprint 2 define a moldura usada por Dashboard e módulos.
- Sprint 3 e Sprint 4 dependem da linguagem do Design System.
- Sprint 5 depende dos padrões de tabelas, formulários e overlays.
- Sprint 6 depende da conclusão das superfícies críticas.

## Critérios De Preservação

- Nenhuma sprint deve alterar o fluxo público de solicitação.
- Nenhuma sprint deve criar login para pacientes.
- Nenhuma sprint deve mover cadastro definitivo ou pagamento para o digital.
- Nenhuma sprint deve modificar regras de acesso, dados, Server Actions ou Supabase sem escopo explícito futuro.
