# Sistema De Espaçamento

## Grid Base

O sistema usa uma unidade base de **4 px**, com ritmo preferencial de 8 px. Valores menores que 4 px ficam reservados a ajustes de ícone ou borda, nunca a espaçamento estrutural.

## Escala

| Token | Valor | Uso |
|---|---:|---|
| `space-1` | 4 px | Ajuste fino, ícone e texto auxiliar |
| `space-2` | 8 px | Label/campo, itens muito relacionados |
| `space-3` | 12 px | Conteúdo compacto e badge |
| `space-4` | 16 px | Campo, item de lista, gutter mobile |
| `space-5` | 20 px | Padding de card compacto |
| `space-6` | 24 px | Padding de card e separação de blocos |
| `space-8` | 32 px | Seções relacionadas |
| `space-10` | 40 px | Respiro de página |
| `space-12` | 48 px | Seções principais |
| `space-16` | 64 px | Hero e transições públicas |
| `space-20` | 80 px | Grandes blocos de marketing |

## Padding

- Controle pequeno: 8 px vertical, 12 px horizontal.
- Controle padrão: 10 a 12 px vertical, 16 px horizontal.
- Card compacto: 16 a 20 px.
- Card de conteúdo: 24 px.
- Modal: 24 px desktop, 20 px mobile.
- Página: seguir gutters do layout, nunca adicionar padding local que desalinhe o eixo.

## Margin E Gap

- Preferir `gap` e espaçamento de fluxo em vez de margens arbitrárias.
- `gap-2` para ícone + texto.
- `gap-3` para controles relacionados.
- `gap-4` para itens de formulário e ações.
- `gap-6` para grupos de conteúdo.
- `gap-8` para blocos de página.

## Containers

- Um container de página deve controlar gutter e largura máxima.
- Não aninhar containers com gutters duplicados.
- Cards internos não devem criar uma segunda moldura sem necessidade.
- Conteúdo wide deve preservar medida de leitura em parágrafos.

## Regras

- Espaçamento vertical maior que horizontal comunica mudança de seção.
- Repetição de elementos usa escala; não usar valores únicos para “encaixar”.
- Tabelas podem ter densidade compacta, mas não reduzir alvo interativo ou legibilidade.
- O sistema de espaçamento é independente do tema e do white label.
