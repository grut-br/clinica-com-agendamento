# Mapa de Navegação

Mapa baseado nas rotas e componentes encontrados em `src/app`, `src/config` e `src/components`. Não representa proposta de alteração.

## Estrutura Global

### Público / Marketing

- `/`
  - Seções: início, especialidades, exames, convênios, sobre, equipe, FAQ e localização.
- `/especialidades`
  - Catálogo de especialidades.
  - `/especialidades/[slug]`: detalhe da especialidade e entrada para agendamento.
- `/exames`
  - Catálogo de exames.
  - `/exames/[slug]`: detalhe do exame e entrada para agendamento.
- `/agendar/[especialidade]`
  - Fluxo público de solicitação de agendamento.

### Acesso

- `/login`
  - Entrada para usuários internos.
- `/esqueci-senha`
  - Solicitação de recuperação.
- `/nova-senha`
  - Definição de nova senha.

### Área Restrita

- Layout: `Sidebar` + `Topbar` + conteúdo principal.
- `/dashboard`
  - Painel de agendamentos.
- `/dashboard/agenda`
  - Gerenciamento de agenda e geração de slots.
- `/dashboard/catalogo`
  - Especialidades e exames.
- `/dashboard/profissionais`
  - Corpo clínico e profissionais.
- `/dashboard/meus-atendimentos`
  - Lista do médico logado e evolução clínica.
- `/dashboard/usuarios`
  - Usuários e permissões.
- `/dashboard/relatorios`
  - Métricas e gráficos.
- `/dashboard/configuracoes`
  - Dados, aparência e configurações da clínica.
- `/dashboard/perfil`
  - Perfil, papel e atualização de senha.

## Administrador

### Menu observado

- Dashboard
- Catálogo
- Corpo Clínico
- Usuários
- Relatórios
- Configurações
- Meu Perfil
- Voltar para Home
- Sair do Painel

### Acessos e fluxos

- Dashboard → triagem de solicitações → confirmar/cancelar.
- Dashboard → calendário → consultar slots por profissional/especialidade.
- Dashboard → agendamento interno → criar solicitação em nome de paciente.
- Dashboard → calendário → gerar slots.
- Catálogo → aba Especialidades ou Exames → criar/editar conteúdo.
- Corpo Clínico → criar/editar profissional → associar especialidade e disponibilidade.
- Usuários → criar/editar usuário → atribuir papel e vínculo clínico.
- Relatórios → KPIs → gráfico de agendamentos → distribuição por especialidade.
- Configurações → dados institucionais, aparência white label e alertas.
- Perfil → consultar papel → atualizar senha.

### Dependências observadas

- Dashboard depende de perfil, especialidades e profissionais.
- Geração de slots depende de especialidades e profissionais.
- Usuário médico depende de vínculo com profissional.
- Catálogo público depende de especialidades e exames ativos.
- Relatórios dependem dos dados consolidados da operação.

## Recepção

### Menu observado

- Dashboard
- Catálogo
- Corpo Clínico
- Usuários
- Relatórios
- Meu Perfil
- Voltar para Home
- Sair do Painel

O filtro de `SidebarNav` remove Configurações e Meus Atendimentos para `receptionist`. As páginas e regras de acesso devem ser consideradas a fonte efetiva do comportamento, não este mapa visual isolado.

### Acessos e fluxos

- Dashboard → triagem → confirmar/cancelar solicitações.
- Dashboard → calendário → visualizar disponibilidade.
- Dashboard → agendamento interno → registrar agendamento.
- Agenda → gerar blocos e horários disponíveis.
- Catálogo → consultar e gerenciar especialidades/exames conforme acesso existente.
- Corpo Clínico → consultar e gerenciar profissionais conforme acesso existente.
- Relatórios → acesso conforme regra de página existente.
- Perfil → atualizar senha.

### Dependências observadas

- Triagem depende de slots, paciente, especialidade e profissional.
- Agenda depende de cadastro de profissionais e especialidades.
- Catálogo público depende de itens ativos.

## Médico

### Menu observado

- Dashboard, que redireciona para Meus Atendimentos.
- Meus Atendimentos.
- Meu Perfil.
- Voltar para Home.
- Sair do Painel.

### Acessos e fluxos

- Login → Dashboard → redirecionamento para `/dashboard/meus-atendimentos`.
- Meus Atendimentos → agenda do dia → abrir prontuário → salvar evolução clínica.
- Perfil → consultar dados de acesso → atualizar senha.

### Dependências observadas

- Meus Atendimentos depende de `professional_id` vinculado ao perfil.
- A lista depende de atendimentos confirmados do profissional.
- Evolução clínica depende de um agendamento selecionado.

## Divergências de Navegação Registradas

- `src/config/navigation.ts` contém uma lista de dashboard resumida com links para âncoras, enquanto `SidebarNav.tsx` monta outra lista com rotas concretas.
- A rota `/dashboard/agenda` existe e aparece no menu mobile, mas não aparece na lista principal de `SidebarNav` observada.
- O filtro de recepção inclui `Relatórios` e `Usuários` no menu, embora páginas específicas tenham regras próprias de acesso.
- O documento registra essas diferenças para orientar decisões futuras; não propõe correção nesta sprint.
