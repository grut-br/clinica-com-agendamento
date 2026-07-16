# Tipografia

## Famílias

- **Display e headings:** Figtree. Geométrica, clara e com presença controlada.
- **Texto e interface:** Noto Sans. Alta legibilidade para dados, labels e mensagens.
- **Dados monoespacados:** fonte de sistema monoespaciada somente para identificadores técnicos ou horários quando a comparação exigir.

Essas famílias são uma decisão de design para futuras implementações; esta Sprint não altera carregamento de fontes.

## Escala

| Papel | Tamanho | Peso | Line-height | Uso |
|---|---:|---:|---:|---|
| Display | 48/56 px | 700 | 1.1 | Hero público excepcional |
| H1 | 32/40 px | 700 | 1.2 | Título principal de página |
| H2 | 24/32 px | 700 | 1.25 | Seção principal |
| H3 | 20/28 px | 650 | 1.3 | Bloco ou card relevante |
| H4 | 16/24 px | 650 | 1.35 | Subgrupo e título de tabela |
| Body large | 18/28 px | 400 | 1.55 | Introdução e marketing |
| Body | 16/24 px | 400 | 1.5 | Texto padrão |
| Body small | 14/20 px | 400/500 | 1.45 | Dados secundários |
| Caption | 12/16 px | 400/500 | 1.35 | Ajuda e metadados |
| Label | 14/20 px | 600 | 1.4 | Campo e filtro |
| Badge | 12/16 px | 600 | 1.3 | Estado e classificação |
| Table | 14/20 px | 400/600 | 1.4 | Célula e valor |
| Button | 14/20 px | 600 | 1.35 | Ações |

## Regras

- Um H1 por página; níveis não saltam por motivo visual.
- Usar sentence case, não caixa alta como estrutura.
- Números de KPI podem usar peso 700, mas não devem dominar o conteúdo sem contexto.
- Body mínimo preferencial é 16 px em fluxos públicos e 14 px em tabelas densas.
- `line-height` não pode ser reduzido para caber mais dados em telas críticas.
- Texto secundário não deve virar cinza de baixo contraste.
- Truncamento só é permitido quando houver acesso ao conteúdo completo.
- Labels e mensagens devem permanecer legíveis com zoom de 200%.
