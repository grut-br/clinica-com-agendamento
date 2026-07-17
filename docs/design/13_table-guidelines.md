# Diretrizes De Tabelas

## Objetivo

Permitir leitura rápida, comparação e ação segura sobre coleções administrativas.

## Estrutura

- Título e descrição devem explicar a coleção.
- Toolbar reúne pesquisa, filtros, período e ação principal.
- Cabeçalho identifica cada coluna com clareza.
- Coluna principal contém o identificador reconhecível da entidade.
- Ações ficam agrupadas na última coluna ou em menu explicitamente rotulado.

## Pesquisa E Filtros

- Pesquisa usa label e exemplo contextual.
- Filtros mostram quantidade ou resumo dos filtros ativos.
- Deve existir forma clara de limpar filtros.
- Não remover resultados silenciosamente ao alterar filtro.
- Filtros críticos precisam ser preservados ao paginar.

## Ordenação

- Cabeçalho ordenável comunica estado, direção e teclado.
- Ordenação padrão privilegia urgência ou leitura operacional.
- Não ordenar por coluna sem indicar que a mudança ocorreu.

## Paginação

- Mostrar posição, quantidade ou intervalo compreensível.
- Primeira, anterior, próxima e última página devem ter nomes acessíveis.
- Preservar pesquisa, filtros e ordenação.
- Coleções pequenas não precisam de paginação artificial.

## Status E Badges

- Status tem label textual consistente.
- Cores seguem tokens `success`, `warning`, `danger`, `info` e `muted`.
- Solicitação, reserva, confirmação e cancelamento são estados distintos.
- Não usar badge para todo texto curto; reservar para classificação.

## Ações

- Ação primária da linha deve ser visível quando frequente.
- Cancelamento e exclusão ficam separados de edição e consulta.
- Ação destrutiva pede confirmação com consequência.
- Ações indisponíveis explicam o motivo ou não aparecem.

## Estados

- Loading preserva cabeçalho e forma das linhas.
- Vazio inicial orienta cadastro ou primeiro agendamento.
- Sem resultados orienta limpar filtros ou pesquisar novamente.
- Erro informa falha e recuperação sem apagar filtros.

## Mobile E Acessibilidade

- Usar tabela quando a comparação exigir estrutura tabular.
- Em mobile, reduzir colunas secundárias, permitir leitura por linha ou apresentar detalhes sem perder headers.
- Nunca depender de hover para revelar valor ou ação.
- Manter associação semântica entre cabeçalho e célula.
