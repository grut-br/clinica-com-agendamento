# Diretrizes De Layout

## Estrutura Oficial De Página

Todas as páginas internas devem seguir esta ordem conceitual:

1. Contexto de navegação: breadcrumb ou identificação da seção quando necessário.
2. Cabeçalho: H1, descrição curta e ação primária contextual.
3. Toolbar: pesquisa, filtros, seleção de período e ações secundárias.
4. Conteúdo principal: tabela, calendário, formulário, cards ou lista.
5. Feedback contextual: sucesso, erro, vazio ou carregamento.
6. Paginação ou navegação de continuidade quando houver coleção.

Em telas públicas, a ordem equivalente é: marca, proposta, conteúdo, prova/contexto e ação de agendamento.

## Containers

- Mobile: gutters de 16 px.
- Tablet: gutters de 24 px.
- Desktop: gutters de 32 px.
- Wide: conteúdo centralizado com largura máxima documentada por tipo de página.
- Texto corrido deve ter medida confortável, sem ocupar toda a largura wide.
- Tabelas podem usar a largura disponível, mas não devem forçar texto ilegível.

## Grid

- Usar grid de 4 colunas no mobile, 8 no tablet e 12 no desktop como referência mental.
- Cards de KPI ocupam unidades iguais apenas quando possuem importância equivalente.
- Dashboard começa por uma coluna principal de agenda e uma coluna secundária de contexto.
- Formulários longos usam uma coluna; dividir só quando os campos são independentes.
- Conteúdo de alta prioridade não deve ficar em uma coluna estreita por decoração.

## Espaçamentos De Estrutura

- Entre H1 e descrição: 8 a 12 px.
- Entre cabeçalho e toolbar: 24 px.
- Entre toolbar e conteúdo: 16 a 24 px.
- Entre seções principais: 32 a 48 px.
- Dentro de card: 20 a 24 px.
- Entre label e campo: 8 px.
- Entre campos relacionados: 16 px.

## Larguras E Alturas

- Controles de ação devem acomodar label sem truncar.
- Campos de texto devem ter largura suficiente para seu formato.
- Modal de confirmação é compacto; formulário complexo usa modal amplo ou página.
- Drawer preserva uma faixa de contexto e não deve cobrir toda a tela no desktop.
- Header e topbar têm altura estável para evitar mudança de layout.
- Listas e tabelas devem reservar espaço para loading, vazio e erro.

## Alinhamento

- Títulos, controles e conteúdo compartilham o mesmo eixo horizontal.
- Números em tabelas e KPIs alinham pela leitura, não pelo centro automático.
- Ícones acompanham a linha de base do texto.
- Ações de linha ficam agrupadas e previsíveis.

## Regra De Responsividade

O conteúdo muda de composição, não de prioridade. Em mobile, filtros podem virar painel, tabelas podem virar lista de detalhes e ações secundárias podem ser agrupadas, mas confirmação, cancelamento e próximo passo continuam fáceis de encontrar.
