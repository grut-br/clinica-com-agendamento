# Responsividade

## Princípio

Responsividade preserva prioridade, contexto e ação. Não é apenas reduzir colunas ou esconder conteúdo.

## Mobile: Até 767 px

- Menu lateral vira navegação acessível por abertura controlada.
- Conteúdo usa gutter de 16 px.
- Uma coluna é padrão.
- Ação primária pode ocupar largura total quando isso reduz erro.
- Filtros viram grupo expansível ou painel.
- Tabelas densas adotam lista de detalhes ou rolagem controlada com headers preservados.
- Agenda prioriza dia, próximo horário e estado.
- Dialogs ocupam quase toda a largura, sem perder título, fechamento e ação.
- Nenhuma ação crítica fica apenas em hover.

## Tablet: 768–1023 px

- Gutter de 24 px.
- Pode usar duas colunas para resumo e conteúdo.
- Sidebar pode permanecer compacta conforme espaço.
- Agenda e filtros dividem espaço somente quando a leitura continuar confortável.
- Formulários podem usar duas colunas apenas para campos independentes.

## Desktop: 1024–1439 px

- Sidebar persistente e Topbar contextual.
- Gutter de 32 px.
- Dashboard usa composição de conteúdo principal e apoio.
- Tabelas exibem colunas essenciais e ações em contexto.
- Drawer preserva parte visível do conteúdo de origem.

## Wide: 1440 px ou mais

- Aumentar respiro, não esticar texto ou cards sem limite.
- Conteúdo principal permanece centralizado.
- Relatórios podem ganhar área para comparação, sem transformar KPIs em decoração.
- Não criar uma segunda navegação apenas para preencher espaço.

## Breakpoints E Conteúdo

- Breakpoints são decisões de conteúdo, não apenas tamanhos técnicos.
- Elementos podem mudar de ordem se a prioridade justificar, mas a sequência deve continuar compreensível.
- Foco e leitura devem permanecer corretos após reflow.
- Testar pelo menos 375 px, 768 px, 1024 px e 1440 px.

## Orientação E Zoom

- Suportar portrait e landscape quando possível.
- Conteúdo não deve depender de uma altura fixa.
- Zoom de 200% deve manter ação e feedback acessíveis.
- Evitar rolagem horizontal da página; quando inevitável em tabela, limitar ao componente.
