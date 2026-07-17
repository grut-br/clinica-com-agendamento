# Diretrizes De Motion

## Princípio

Motion orienta atenção, confirma mudança e preserva continuidade. Nunca deve transformar uma operação simples em espetáculo.

## Duração

| Uso | Duração alvo |
|---|---:|
| Hover, foco e estado local | 120–180 ms |
| Pressed e feedback curto | 80–150 ms |
| Fade de conteúdo | 160–220 ms |
| Dialog e drawer | 180–260 ms |
| Accordion e tabs | 180–240 ms |
| Loading contínuo | ciclo discreto, sem duração fixa de entrada |

Não usar transições acima de 300 ms em operações frequentes sem motivo claro.

## Easing

- Entrada: ease-out, rápida no início e suave no fim.
- Saída: ease-in, libera o espaço sem prolongar despedida.
- Estado contínuo: linear somente quando o movimento representa progresso contínuo.
- Evitar bounce em contexto clínico e operacional.

## Uso Por Padrão

- Hover: mudança de cor, sombra ou opacidade sem deslocar layout.
- Loading: skeleton ou indicador discreto que preserve espaço.
- Fade: troca de conteúdo equivalente.
- Dialog: entrada com opacidade e pequena escala; saída mais rápida.
- Drawer: entrada por transform e opacidade, mantendo scrim legível.
- Accordion: mudança de visibilidade sem reordenar conteúdo inesperadamente.
- Tabs: transição curta de seleção e conteúdo, sem animar dimensões físicas.

## Regras Técnicas Para Futura Implementação

- Preferir `transform` e `opacity`.
- Não animar width, height, margin, padding, top, left ou font-size.
- Evitar layout shift, especialmente em agenda, tabela e dashboard.
- Respeitar `prefers-reduced-motion`; reduzir a transição a mudança instantânea ou mínima.
- Não usar motion para comunicar status crítico sem alternativa textual.
- Não animar cada card de uma lista longa individualmente.
