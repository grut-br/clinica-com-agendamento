# Auditoria Da Interface Atual

Classificação: **Alta** bloqueia ou ameaça tarefa crítica; **Média** gera atrito ou inconsistência relevante; **Baixa** é refinamento ou dívida visual.

## Alta

| Área | Problema observado | Impacto |
|---|---|---|
| Navegação | A rota `/dashboard/agenda` não aparece no `SidebarNav` desktop, embora exista e apareça no menu mobile. | Recepção pode não descobrir a gestão de agenda. |
| Navegação | `config/navigation.ts` e `SidebarNav.tsx` mantêm listas de navegação diferentes. | Risco de inconsistência de rótulos e acessos. |
| Fluxo público | O texto de sucesso precisa reforçar continuamente que o pedido aguarda confirmação da clínica. | Paciente pode interpretar reserva como consulta confirmada. |
| Acessibilidade | O overlay de `ClinicalNotesSheet` recebe `onClick` em `div` não interativo. | Barreira para semântica, teclado e leitores de tela. |
| Acessibilidade | `ClinicalNotesSheet` usa `role="dialog"`, mas não evidencia gerenciamento de foco, `aria-labelledby` ou fechamento por Escape. | Experiência incompleta em modal/drawer. |
| Responsividade | Tabelas administrativas e agenda têm alta densidade e não há evidência de estratégia consistente para mobile. | Uso difícil em telas estreitas. |
| Consistência | Acesso por perfil é filtrado visualmente no menu, mas páginas possuem regras próprias e nem sempre usam o mesmo comportamento de redirecionamento/negação. | Usuário pode encontrar respostas diferentes para o mesmo acesso. |

## Média

| Área | Problema observado | Impacto |
|---|---|---|
| UI | Uso simultâneo de tokens semânticos e cores físicas como `#0B1A3A`, `#D4AF37`, `zinc` e `slate`. | Dificulta consistência e manutenção do white label. |
| UI | Perfil e prontuário ainda contêm blocos claros/escuros codificados localmente, diferentes do sistema de tokens. | Possíveis divergências entre temas. |
| Tipografia | Escalas locais incluem `text-2xs` e `text-3xs`, pesos variados e uppercase frequente sem uma escala documentada. | Hierarquia e legibilidade podem variar entre módulos. |
| Espaçamento | Há combinações de `space-y-8`, cards `rounded-3xl`, paddings e gaps definidos por tela, sem uma escala central evidente. | Ritmo visual inconsistente. |
| Hierarquia | O dashboard reúne triagem, calendário e geração de slot na mesma composição de abas e ações. | Pode exigir mais leitura para localizar a tarefa. |
| Densidade | Listas de solicitações, catálogos e usuários concentram dados e ações por linha. | Aumenta esforço de varredura e risco de ação errada. |
| Feedback | Loading, sucesso e erro são implementados localmente, com mensagens e animações diferentes. | O usuário aprende padrões diferentes por módulo. |
| UX writing | Rótulos alternam “Painel”, “Dashboard”, “CMS”, “Corpo Clínico” e “Estatísticas da Operação”. | Vocabulário do produto fica menos previsível. |
| UX writing | Mensagens incluem linguagem interna como RBAC, CMS e “triagem operacional”. | Pode dificultar compreensão para recepção. |
| Acessibilidade | Vários botões de ícone têm labels, mas o inventário não mostra um padrão compartilhado para todos os controles locais. | Risco de nomes acessíveis desiguais. |
| Acessibilidade | Tabs locais não evidenciam roles ARIA de tablist/tab ou `aria-selected`. | Leitura e navegação assistiva podem ficar incompletas. |
| Acessibilidade | Alguns focos usam `focus:outline-none` e anéis locais, sem uma regra visual única. | Foco pode variar ou perder contraste. |
| Navegação | Menu mobile possui itens e organização diferentes do menu desktop. | Modelo mental muda conforme dispositivo. |
| Responsividade | Header público e área restrita têm soluções diferentes de navegação móvel. | Curva de aprendizado adicional. |
| Tema | O modo escuro neutraliza a marca e o white label é aplicado principalmente no claro. | Marca pode perder continuidade entre temas. |
| Performance percebida | Gráfico é carregado dinamicamente com loading genérico. | A tela pode parecer vazia até o módulo carregar. |

## Baixa

| Área | Problema observado | Impacto |
|---|---|---|
| UI | Há animações como pulse, bounce, slide e scale espalhadas por fluxos. | Pode gerar distração ou desconforto. |
| UI | Alguns estados usam sombras, bordas e raios muito diferentes entre si. | Reduz unidade visual. |
| Tipografia | O body usa stack do sistema sem papéis tipográficos documentados. | Personalidade e consistência dependem de decisões locais. |
| Espaçamento | Breadcrumbs, headers e seções públicas têm alinhamentos distintos entre páginas. | Percepção de ritmo menos uniforme. |
| Empty states | Ícones e tons de vazio variam entre módulos, mesmo para situações semelhantes. | Estados sem conteúdo parecem partes de produtos diferentes. |
| Acessibilidade | Alguns controles de fechar exibem somente ícone e dependem do contexto visual. | Pode reduzir clareza para usuários assistivos. |
| Conteúdo | Metadados e títulos ainda exibem referências de “Devio Console” e “Med Odonto” em pontos diferentes. | Marca e contexto podem parecer inconsistentes. |

## Limites Da Auditoria

Esta auditoria foi feita por leitura estática dos arquivos existentes. Não inclui teste com usuários, navegação real em navegador, medição Lighthouse ou validação com NVDA/VoiceOver. As observações não alteram componentes nem regras.
