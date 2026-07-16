# Redesign Da Central Operacional Da Recepção

## Direção

O Dashboard deixou de ser tratado como painel executivo e passou a ser uma central operacional. A primeira pergunta da tela é “o que precisa de decisão agora?”, não “qual é o desempenho histórico da clínica?”.

A composição usa a linguagem clinical operations minimal: superfícies calmas, uma hierarquia de atenção, accent restrito à ação e status textual. Não há gráfico, ranking ou decoração de dashboard genérico.

## Decisões

- Título orientado ao turno: “Bom trabalho. Vamos organizar o dia.”
- Contexto explícito: “Central operacional”.
- Visão de hoje com data e indicadores de operação.
- Pendências como primeira superfície de trabalho depois dos KPIs.
- Filtro inicial em Pendentes, pois é a decisão mais urgente da recepção.
- Pesquisa por paciente, especialidade e profissional.
- Status representado por `StatusBadge`, texto e cor semântica.
- Tabela desktop com leitura comparável e cards mobile.
- Ações de confirmar, cancelar e abrir WhatsApp com labels acessíveis.
- Agenda e geração de horários mantidas como atalhos, sem duplicar a ação principal.
- Acesso à agenda preservado por link explícito para `/dashboard/agenda`.

## KPIs Operacionais

- **Pendências:** solicitações aguardando decisão.
- **Confirmadas hoje:** consultas confirmadas para a data atual.
- **Na agenda de hoje:** todos os registros com horário hoje.
- **Próximas consultas:** consultas confirmadas a partir de hoje.

Os valores são derivados do mesmo conjunto de agendamentos já carregado pela página. Nenhuma query, regra ou estado de negócio foi criado.

## Triagem

### Desktop

- Toolbar com pesquisa e filtros rápidos.
- Tabela com paciente, atendimento, horário, status e próxima ação.
- Notas do paciente aparecem como informação auxiliar, sem dominar a linha.
- Ações ficam no fim da linha e têm nomes acessíveis.

### Tablet E Mobile

- A tabela vira uma coleção de cards para evitar rolagem horizontal.
- Cada card mantém paciente, atendimento, horário, status e ação.
- O CTA de WhatsApp só aparece quando existe telefone.
- Targets de ação mantêm no mínimo 44 px.

## Componentes Utilizados

- `AppShellContent`
- `PageHeader`
- `PageToolbar` via `TableToolbar`
- `PageContainer` indiretamente pelo App Shell
- `StatCard`
- `Card`
- `Button`
- `StatusBadge`
- `EmptyState`
- `TableToolbar`
- `ReceptionTriage`
- Presets de tokens e focus ring
- `InternalAppointmentDialog` e `SlotGeneratorDialog` existentes apenas como pontos de ação de domínio

## Melhorias

- Separação visual entre contexto, visão do dia, triagem e atalhos.
- Redução de filtros concorrentes e remoção de tabs que escondiam a tarefa principal.
- Filtro inicial orientado à pendência.
- Pesquisa contextual.
- Status consistente e sem cores físicas locais na nova composição.
- Ação primária e atalhos sem duplicação desnecessária.
- Empty state específico para ausência de pendências e ausência de resultados.
- Loading operacional refletido pela opacidade da área durante a transição da Server Action.
- Tabela com caption, headers com `scope` e ações nomeadas.
- Preservação da experiência mobile por cards.

## Problemas Encontrados E Limites

- A lista legada em `src/features/appointments/components/dashboard-appointments-list.tsx` continua existente e não foi alterada, conforme a restrição de não modificar Features.
- A ação de confirmação/cancelamento ainda usa a confirmação nativa existente via nova camada de composição; o domínio não foi alterado.
- Os dialogs de agendamento interno e geração de grade continuam sendo componentes existentes, portanto suas aparências internas pertencem a uma Sprint futura de integração.
- O App Shell global existente não foi migrado; o Dashboard utiliza `AppShellContent` sem tocar nos demais layouts.
- A rota ainda depende de dados Supabase reais para revisão visual completa.
