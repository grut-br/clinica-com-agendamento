# Linguagem Visual

## Direção

**Clinical operations minimal:** superfícies planas e luminosas, contraste controlado, cartões funcionais, linhas finas e uma cor de ação reconhecível.

Não é flat sem hierarquia e não é Soft UI com baixo contraste. É uma interface de camadas discretas, em que espaço, tipografia e sequência da agenda fazem a maior parte do trabalho.

## Superfícies

- Fundo de aplicação neutro e levemente quente/frio, sem textura.
- Cards com superfície própria, borda sutil e sombra mínima quando houver elevação real.
- Modais e drawers com superfície opaca para preservar legibilidade.
- Evitar transparência sobre conteúdo clínico ou tabelas.
- Usar raio consistente: médio em controles, maior em agrupamentos de conteúdo.

## Hierarquia

1. Título e contexto da tarefa.
2. Indicador ou informação que orienta a decisão.
3. Conteúdo principal: agenda, tabela, formulário ou lista.
4. Ação primária.
5. Ações secundárias e detalhes.

## Cores

- Cor primária identifica navegação, títulos de alta importância e elementos de marca.
- Accent identifica a ação principal ou foco da jornada, não decoração.
- Cores de estado aparecem com texto, ícone ou label além da cor.
- Superfícies neutras dominam a tela; cor saturada é exceção.
- Cada tema precisa de tokens próprios, nunca inversão automática sem checagem de contraste.

## Ícones

- Lucide React é a família oficial existente.
- Ícones outline, com stroke consistente e tamanho tokenizado.
- Ícone reforça o texto; nunca substitui label em ação crítica.
- Ícones decorativos não competem com o conteúdo.
- Botões somente com ícone precisam de nome acessível e área interativa mínima.

## Espaço Em Branco

Espaço é ferramenta de prioridade. Grupos relacionados ficam próximos; grupos distintos respiram. O painel não deve preencher cada área disponível apenas para parecer completo.

## Princípios Visuais

- Uma composição silenciosa permite que o estado da agenda seja o protagonista.
- Linhas e divisores devem explicar sequência, não criar uma grade burocrática.
- Sombra indica elevação ou sobreposição, não é acabamento padrão de todo card.
- Arredondamento comunica agrupamento, não deve transformar cada célula em um pill.
- A assinatura visual precisa sobreviver sem gradientes e sem imagens.
