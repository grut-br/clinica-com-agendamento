# Diretrizes De Acessibilidade

## Meta

Projetar para WCAG 2.2 AA como piso, com atenção reforçada a fluxos de agenda, formulários e dados clínicos. Acessibilidade faz parte da fundação visual e não é uma etapa posterior.

## Contraste

- Texto normal: alvo mínimo de 4.5:1.
- Texto grande e elementos gráficos relevantes: alvo mínimo de 3:1 quando aplicável.
- Foco, borda de campo e estado selecionado precisam ser distinguíveis.
- Não usar cor como único sinal de status, erro, disponibilidade ou seleção.
- Validar cada combinação em claro, escuro e white label.

## Focus

- Usar foco visível com `:focus-visible`.
- Não remover outline sem substituto forte.
- Foco precisa contrastar com a superfície e permanecer visível em overlays.
- Após fechar dialog/drawer, retornar foco ao acionador.

## Keyboard

- Todos os fluxos funcionam com Tab, Shift+Tab, Enter, Space e setas quando o padrão exigir.
- Ordem de foco segue ordem visual e lógica.
- Escape fecha overlay não destrutivo.
- Tabs, menus, comboboxes e calendários seguem padrões WAI-ARIA.
- Não prender foco em elemento sem forma clara de saída.

## Leitores De Tela

- Um H1 por página e headings sem saltos.
- Links descrevem o destino; botões descrevem a ação.
- Botões somente com ícone têm `aria-label` descritivo.
- Mudanças de status, sucesso e erro são anunciadas sem depender de cor.
- Dialog, drawer, tabs, accordion e tabela têm nome, estado e relação adequados.

## Tamanho E Interação

- Alvo interativo mínimo de 44 × 44 px.
- Não criar ações somente por hover.
- Espaçamento entre controles reduz toque acidental.
- Zoom de 200% não deve ocultar ação ou gerar rolagem indevida.

## Conteúdo

- Linguagem simples e frases curtas.
- Labels persistentes e ajuda contextual.
- Mensagens de erro específicas e acionáveis.
- Resumo textual para gráficos e informações visuais.
- Imagens significativas têm alternativa; decorativas são ignoradas por assistive tech.

## Movimento E Tema

- Respeitar redução de movimento.
- Não piscar conteúdo.
- Contraste e estados de interação devem existir nos dois temas.
- Dados clínicos usam superfícies opacas e leitura estável.

## Critério De Aceite

Nenhuma tela será considerada pronta apenas por parecer correta visualmente: ela precisa ser operável, compreensível e anunciada em tecnologia assistiva.
