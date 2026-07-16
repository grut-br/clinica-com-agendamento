# Smart Calendar Redesign - Sprint 4

## Decisões Arquiteturais e de Design
A transformação da Agenda em núcleo operacional foi pautada pelo conceito de **"Clinical Operations Minimal"**. A agenda agora transmite organização, rapidez, clareza, leveza e controle absoluto, desvencilhando-se da aparência de "planilha" ou de clones de calendários convencionais.

### Timeline Cronológica Moderna
- A visualização foi transformada em uma linha do tempo vertical (timeline), com o eixo de horários fluindo à esquerda e os cartões de atendimento (slots) ancorados à direita.
- Os cards foram limpos visualmente. O foco é na hierarquia da informação: **Profissional**, seguido por **Especialidade** e informações adicionais do **Paciente** e **Duração**.

### Reposicionamento de Filtros
- Os filtros saíram de uma barra horizontal amontoada para uma **Sidebar Esquerda** (em telas grandes), que permanece fixa (`sticky`) durante a rolagem. Isso atende ao requisito de "filtros devem permanecer visíveis e evitar navegação escondida".
- Os filtros foram padronizados, com tipografia *uppercase tracking-wider* em seus rótulos, passando um aspecto operacional e técnico sem abrir mão da estética.

### Empty e Loading States Ricos
- Implementação rigorosa da diretriz de não utilizar "mensagens genéricas".
- Cada Empty State agora possui um título, descrição e ícone contextual adequados para a situação:
  - Escolha de profissional pendente.
  - Grade vazia por ausência de processamento.
  - Resultados não encontrados na pesquisa textural ou no status específico.
- Loading states evitam o *Layout Shift* utilizando componentes `Skeleton` que mimetizam a estrutura dos cards da timeline.

## Componentes Utilizados
- `Card`: Para encapsulamento das informações dos slots e do formulário de geração.
- `PageToolbar`: Utilizado em layout de coluna para comportar os filtros na Sidebar.
- `StatusBadge`: Cores semânticas para estados (Disponível, Reservado, Confirmado, Cancelado, Bloqueado).
- `EmptyState`: Componente para interações de ausência de dados contextuais.
- `LoadingState` e `Skeleton`: Feedback visual imediato durante transições e requisições.
- Ícones Lucide (`Clock3`, `UserRound`, `CalendarDays`, `LayoutGrid`, `Search`, `Filter`).
- Componentes unificados da `ui` (Select, Input, Button).
- `Fade`: Presets de animação para as transições de slots na timeline.

## Problemas Encontrados e Estratégia Adotada
- **Desafio do Componente Compartilhado**: Os componentes existentes utilizavam os filtros de maneira aglomerada. A separação exigiu uma estrutura de `flex-col xl:flex-row` na página, com os filtros agindo com barra lateral.
- **Limitações de Dados do Paciente**: A API atual (Server Action) não traz atrelada a query completa com as informações do paciente para a rota de `available slots` (uma vez que os horários podem estar livres e sem paciente atrelado). A interface foi desenhada considerando um placeholder elegante ("Sem paciente") até que a lógica backend seja evoluída em Sprints futuras.
- **Evitar o uso de "Google Calendar"**: Tabelas e grades horizontais foram ignoradas em prol de listas elegantes (Timelines verticais) com tipografia limpa, resolvendo o problema crônico de UX em dispositivos móveis (que agora rolam naturalmente).

## Melhorias
- Uso amplo de *tokens semânticos* do Tailwind e classes como `text-muted-foreground` e `bg-surface`.
- Melhor tratamento no fluxo visual da "Geração de Grade". Adicionada a instrução visual com ícones dedicados, botões secundários em *dashed borders*, e status explícitos para sucessos e falhas (mantendo a resiliência original).
- Foco explícito nas heurísticas de acessibilidade (ícones ocultos para leitores de tela com `aria-hidden="true"`, botões contendo `aria-label`).
