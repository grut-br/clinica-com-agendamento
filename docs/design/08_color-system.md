# Sistema De Cores

## Arquitetura De Tokens

O sistema segue três camadas:

1. **Primitivos:** valores de cor aprovados, sem uso direto em páginas.
2. **Semânticos:** significado como `background`, `foreground`, `success` e `danger`.
3. **Componente:** função local como `button-primary-background` ou `table-row-hover`.

Componentes usam tokens semânticos ou de componente. Cor física direta em tela é proibida.

## Primitivos De Referência

| Nome | Valor | Papel de origem |
|---|---|---|
| Ink navy | `#16324F` | Marca e textos de maior autoridade |
| Clinic teal | `#197C7A` | Ação e continuidade operacional |
| Mist | `#E8F1EF` | Superfície de apoio |
| Paper | `#F7F9F8` | Fundo claro |
| White | `#FFFFFF` | Superfície elevada |
| Graphite | `#1F2933` | Texto principal |
| Slate | `#52606D` | Texto secundário |
| Line | `#D7E1E0` | Bordas e divisores |
| Success green | `#277A52` | Concluído e confirmado |
| Warning amber | `#9A650F` | Atenção e pendência |
| Danger red | `#B43C45` | Cancelamento, erro e risco |
| Info blue | `#2D6F9F` | Informação e orientação |

Os valores são referência de fundação, não instrução para editar código nesta sprint. Cada combinação precisa ser validada no tema e no contexto de uso antes da implementação.

## Tokens Semânticos

| Token | Uso |
|---|---|
| `background` | Fundo geral da aplicação |
| `surface` | Superfície de seção ou painel |
| `card` | Conteúdo agrupado e elevado |
| `foreground` | Texto principal |
| `muted-foreground` | Texto secundário, nunca informação essencial isolada |
| `primary` | Navegação, marca e hierarquia principal |
| `primary-foreground` | Conteúdo sobre primary |
| `accent` | CTA, seleção e foco de jornada |
| `accent-foreground` | Conteúdo sobre accent |
| `border` | Separação estrutural |
| `muted` | Fundo de apoio e estado inativo |
| `success` | Confirmado, salvo, disponível concluído |
| `warning` | Pendente, atenção, revisão necessária |
| `danger` | Erro, cancelado, destrutivo |
| `info` | Informação sem urgência |
| `ring` | Foco de teclado |

## Regras De Uso

- Primary não é botão universal; sua função é estrutural e de marca.
- Accent aparece em uma ação principal por contexto, não em todos os links.
- Status sempre inclui texto ou ícone além da cor.
- Danger não deve ser usado como cor de destaque decorativo.
- Muted reduz ênfase, mas não deve esconder conteúdo essencial.
- Bordas precisam existir em claro e escuro; não depender apenas de sombra.
- Tema escuro define superfícies e contraste próprios; não basta inverter valores.
- White label pode mapear primary e accent aprovados, mas não redefine success, warning e danger.
- Toda cor sobre superfície deve ser testada para contraste WCAG AA, com maior rigor em texto pequeno.
