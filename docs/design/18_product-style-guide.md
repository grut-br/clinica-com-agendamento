# Product Style Guide

## Status

Este é o documento consolidado da identidade visual do Sistema Inteligente de Agendamento para Clínicas. Em caso de conflito entre documentos de design, este documento representa a decisão de maior nível; detalhes específicos devem continuar respeitando os documentos 01 a 17.

## Direção Em Uma Frase

**Uma central de agenda calma, precisa e humana, que transforma pendências em decisões claras.**

## Personalidade

Clara, confiável, serena, precisa, profissional, acessível e rápida.

## Linguagem Visual

- Clinical operations minimal.
- Superfícies neutras e opacas.
- Cards funcionais, bordas discretas e sombra somente quando houver elevação.
- Linha de continuidade da agenda como assinatura visual.
- Ícones Lucide outline, sem mistura de famílias.
- Accent usado com parcimônia para CTA, seleção e foco.

## Tipografia

- Figtree para display e headings.
- Noto Sans para corpo, controles, labels e dados.
- Body padrão de 16 px; tabela pode usar 14 px quando a leitura continuar confortável.
- Sentence case, um H1, line-height generoso e pesos que expressem hierarquia.

## Espaçamento

- Grid base de 4 px, ritmo preferencial de 8 px.
- `space-4` como unidade comum de campo e lista.
- `space-6` para cards.
- `space-8` a `space-12` para blocos de página.
- Gutter: 16 px mobile, 24 px tablet, 32 px desktop.

## Cores E Tokens

- Tokens semânticos são a única interface de cor dos componentes.
- Primary estrutura marca e navegação.
- Accent concentra ação e foco.
- Success, warning, danger e info são semânticos e não são substituídos pelo branding.
- Contraste é validado por tema e por white label.

## Layout

Página interna: contexto → H1/descrição → toolbar → conteúdo → feedback → paginação.  
Dashboard: atenção imediata → agenda → ações rápidas → indicadores.  
Formulário: tarefa → ajuda → campos agrupados → ação → feedback.

## Componentes

Cada componente deve ter objetivo único, estados completos, nome acessível, foco, comportamento mobile e mensagem consistente. Não criar variantes apenas por preferência de uma tela.

## Navegação

Sidebar para módulos, Topbar para contexto global, pesquisa quando houver volume, perfil com papel explícito e notificações acionáveis. Desktop e mobile compartilham hierarquia.

## Motion

- Microinterações de 120–180 ms.
- Dialog/drawer de 180–260 ms.
- Somente transform e opacity para movimento.
- Redução de movimento respeitada.

## Acessibilidade

WCAG 2.2 AA como piso; foco visível, teclado completo, semântica correta, contraste, targets de 44 × 44 px, labels persistentes e estados anunciados.

## White Label

Branding permite nome, logo, ícone, favicon, capa, texto institucional, primary e accent aprovados. Não permite editar semântica, status, contraste, foco, tipografia funcional ou família de ícones.

## Não Negociáveis

- Não parecer ERP, Bootstrap ou legado.
- Não usar cor física diretamente.
- Não esconder ação crítica.
- Não chamar solicitação de consulta confirmada.
- Não usar animação como decoração operacional.
- Não sacrificar acessibilidade por aparência.
- Não alterar regras de negócio para resolver uma decisão visual.

## Checklist Antes De Qualquer Sprint Visual

- A tela tem uma ação principal clara?
- A ordem de informação corresponde à prioridade do perfil?
- Os tokens semânticos cobrem todos os estados?
- O conteúdo funciona no mobile e no zoom?
- O foco e o teclado foram considerados?
- O texto explica ação, resultado e recuperação?
- O white label preserva contraste e semântica?
- A solução parece parte da mesma central de agenda?
