# Diretrizes De Componentes

Estas são regras de uso e intenção, não desenhos, APIs ou implementação de componentes.

## Buttons

- Objetivo: executar uma ação clara.
- Usar: ação primária, secundária, destrutiva ou de baixo destaque.
- Não usar: para navegação, quando link é semanticamente correto, ou para texto informativo.
- Label com verbo e objeto; foco visível; estado disabled verdadeiro.

## Inputs

- Objetivo: coletar um valor.
- Usar: com label persistente, ajuda quando necessário e erro associado.
- Não usar: placeholder como único rótulo ou campo sem formato informado.
- Não apagar valor ao validar e preservar contexto do erro.

## Cards

- Objetivo: agrupar conteúdo relacionado.
- Usar: KPI, resumo, bloco de formulário ou estado independente.
- Não usar: cada linha de uma tabela ou para criar caixas dentro de caixas.
- Card não deve esconder a ação principal nem substituir hierarquia.

## Tables

- Objetivo: comparar ou operar coleções estruturadas.
- Usar: entidades com colunas comparáveis.
- Não usar: no mobile quando uma lista de detalhes comunica melhor.
- Cabeçalho, ordenação, estado, ação e responsividade precisam ser previsíveis.

## Dialogs

- Objetivo: decisão ou tarefa curta que exige foco.
- Usar: confirmação de cancelamento, edição pequena e criação contextual.
- Não usar: páginas inteiras ou formulários longos sem necessidade.
- Gerenciar foco, Escape, título, descrição e retorno ao acionador.

## Badges

- Objetivo: indicar estado, categoria ou papel.
- Usar: labels curtos e persistentes.
- Não usar: texto longo ou informação que exige interpretação de cor.
- Combinar texto e, quando útil, ícone.

## Tabs

- Objetivo: alternar conteúdos do mesmo nível e contexto.
- Usar: triagem/calendário ou especialidades/exames quando a relação for direta.
- Não usar: navegação entre módulos independentes.
- Indicar selecionada, foco e relação com painel.

## Dropdown

- Objetivo: escolher entre opções ou abrir ações secundárias.
- Usar: quando opções são conhecidas e espaço é limitado.
- Não usar: esconder ação crítica ou substituir navegação primária.
- Nomear o controle e preservar a opção atual.

## Calendar

- Objetivo: navegar e selecionar datas/horários.
- Usar: disponibilidade, agenda e seleção temporal.
- Não usar: para representar uma lista simples de horários.
- Exibir data atual, seleção, indisponibilidade e teclado.

## Charts

- Objetivo: revelar tendência ou comparação.
- Usar: após KPIs e com leitura textual complementar.
- Não usar: para dados que uma tabela curta comunica melhor.
- Legenda, unidade, período, estado vazio e alternativa acessível são obrigatórios.

## Toast

- Objetivo: confirmar resultado não bloqueante.
- Usar: salvar, atualizar ou concluir ação simples.
- Não usar: erro crítico, confirmação destrutiva ou conteúdo que precisa permanecer.
- Deve ser anunciado e ter duração suficiente para leitura.

## Tooltip

- Objetivo: explicar ícone ou conceito secundário.
- Usar: ajuda curta em elemento já rotulado.
- Não usar: esconder instrução essencial ou label de campo.
- Deve funcionar com teclado e não conter ação indispensável.

## Empty State

- Objetivo: explicar ausência de conteúdo e orientar próximo passo.
- Usar: primeira utilização, busca sem resultado, lista limpa ou indisponibilidade.
- Não usar: como mensagem vaga de erro.
- Texto deve informar motivo e ação quando houver.

## Skeleton E Loading

- Objetivo: comunicar espera e preservar a forma do conteúdo.
- Usar: carregamentos previsíveis de listas, cards, gráficos e agenda.
- Não usar: para mascarar erro ou em espera instantânea.
- Não deslocar o layout ao trocar skeleton por conteúdo.

## Stepper

- Objetivo: mostrar progresso de um fluxo sequencial.
- Usar: solicitação pública e formulários realmente multi-etapa.
- Não usar: para decorar formulários curtos.
- Indicar etapa atual, concluída, disponível e bloqueada.

## Timeline

- Objetivo: representar sequência temporal.
- Usar: jornada da solicitação, histórico e evolução de atendimento.
- Não usar: como decoração para uma lista sem ordem temporal.
- Data, evento e estado devem ser legíveis sem depender da linha.
