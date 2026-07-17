# Visual Foundation

## Escopo

Fundação visual implementada na Sprint 2 para o Sistema Inteligente de Agendamento para Clínicas. Esta camada é reutilizável e não altera a composição das telas existentes.

## Arquitetura De Tokens

O contrato visual segue três camadas em `src/app/globals.css`:

```text
Primitive tokens
      ↓
Semantic tokens
      ↓
Component tokens
```

### Primitive tokens

Paleta base com ink navy, clinic teal, mist, paper, graphite, slate, line, success, warning, danger, info e black. Primitivos não devem ser consumidos diretamente por páginas ou componentes.

### Semantic tokens

Papéis de produto: `background`, `foreground`, `surface`, `card`, `border`, `primary`, `accent`, `muted`, `success`, `warning`, `danger`, `info`, `ring` e respectivos foregrounds.

O tema `.dark` redefine os tokens semânticos para preservar contraste e hierarquia. Branding pode influenciar primary e accent aprovados, mas não substitui a semântica de status.

### Component tokens

Papéis estáveis para altura de controle, raios, sombras, foco e overlays:

- `--component-control-height`
- `--component-control-radius`
- `--component-card-radius`
- `--component-card-shadow`
- `--component-overlay-shadow`
- `--component-focus-width`
- `--component-focus-offset`

## Tipografia

`src/app/globals.css` define Figtree para headings e Noto Sans para interface, dados e corpo, com fallbacks locais. O carregamento de assets de fonte fica separado para uma etapa futura que possa alterar o layout sem violar o escopo desta Sprint.

## Componentes Criados

### Primitives

- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/checkbox.tsx`
- `src/components/ui/switch.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/status-badge.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/divider.tsx`
- `src/components/ui/tooltip.tsx`

### Estados E Conteúdo

- `src/components/ui/empty-state.tsx`
- `src/components/ui/loading-state.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/stat-card.tsx`

### Estrutura De Página

- `src/components/ui/page-container.tsx`
- `src/components/ui/page-header.tsx`
- `src/components/ui/page-toolbar.tsx`
- `src/components/ui/search-input.tsx`

### Infraestrutura De Tabela

- `src/components/ui/table-toolbar.tsx`
- `src/components/ui/pagination.tsx`
- Filtros, bulk actions e ações de tabela são slots composáveis do toolbar, evitando duplicação e mantendo a infraestrutura desacoplada.

## App Shell

`src/components/layout/app-shell.tsx` fornece:

- `AppShell`
- `AppShellSidebar`
- `AppShellTopbar`
- `AppShellContent`
- `AppShellFooter`

O shell é uma infraestrutura isolada. Os layouts existentes não foram migrados nesta Sprint, portanto nenhuma tela existente teve sua aparência ou fluxo alterado.

## Branding

- `src/config/branding.ts` define `BrandIdentity`, identidade padrão e slots de branding.
- `src/lib/branding.ts` resolve identidade e prepara variáveis de marca.

Slots previstos: nome, logo, ícone, favicon, capa, texto institucional, primary e accent. Não existe editor livre de cores e não há alteração no fluxo atual de configurações.

## Motion

`src/components/motion/presets.tsx` oferece presets para:

- Fade
- Scale
- Page transition
- Dialog
- Tooltip
- Accordion
- Tabs
- Hover scale

Os presets usam apenas opacity, transform, scale, x e y. Não animam width, height, top, left, margin ou padding. A regra global de `prefers-reduced-motion` foi adicionada ao CSS.

## Acessibilidade

- Foco visual compartilhado por `.ui-focus-ring`.
- Botões, inputs, select e textarea com alvos mínimos de 44 px.
- Switch com `role="switch"` e `aria-checked`.
- Loading com `role="status"` e `aria-live`.
- Tooltip com `role="tooltip"` e suporte a focus-within.
- Avatar sem imagem possui nome acessível.
- Imagens do Avatar usam `next/image` com dimensões fixas.
- Componentes não criam pseudo-botões com elementos não interativos.

## Estado Da Integração

Os novos componentes ainda não foram conectados às páginas existentes. A integração visual de telas, layouts e módulos permanece para as próximas Sprints.
