# Sprint 0 Concluída

## Arquivos Criados

- `docs/product/01_product-vision.md`
- `docs/product/02_ux-principles.md`
- `docs/product/03_navigation-map.md`
- `docs/product/04_screen-inventory.md`
- `docs/product/05_component-inventory.md`
- `docs/product/06_ui-problems.md`
- `docs/product/07_refactoring-roadmap.md`
- `docs/product/08_frontend-technical-report.md`
- `docs/product/09_questions-for-refactoring.md`
- `SPRINT_0_COMPLETED.md`

## Resumo Executivo

A Sprint 0 documentou o produto como um Sistema Inteligente de Agendamento para Clínicas, preservando o fluxo existente: paciente sem login solicita um horário, a recepção confirma ou cancela e cadastro definitivo e pagamento acontecem presencialmente. Foram mapeados perfis, jornadas, navegação, telas, componentes, problemas de interface, arquitetura frontend, roadmap e perguntas para as próximas decisões.

## Principais Descobertas

- O produto tem três perfis operacionais internos: administrador, recepção e médico; paciente é usuário público sem login.
- Foram identificadas 18 páginas de rota entre marketing, autenticação e área restrita.
- A área restrita usa Sidebar, Topbar, layouts por route group e componentes de feature.
- A agenda aparece no dashboard e em `/dashboard/agenda`, com calendário, lista e geração de slots.
- `recharts`, `react-day-picker`, `lucide-react`, `framer-motion`, `next-themes` e Tailwind v4 já fazem parte do frontend.
- Existe suporte de tema claro/escuro e white label.
- A navegação desktop, mobile e a configuração centralizada não são idênticas.
- Componentes atômicos como Button, Card e Dialog não formam um catálogo compartilhado em `src/components/ui`; muitos padrões são locais.
- As maiores oportunidades de UX estão na triagem, agenda, fluxo público de solicitação e consistência entre perfis.

## Riscos Encontrados

- Usuários podem não encontrar a gestão de agenda no menu desktop.
- Diferenças entre menus e regras por página podem gerar confusão de acesso.
- Mistura de tokens e cores físicas pode reduzir consistência do white label e dos temas.
- Componentes locais de modal, tabs, feedback e tabela podem divergir em acessibilidade e comportamento.
- Densidade de tabelas e agenda pode comprometer uso em telas menores.
- A comunicação de solicitação pendente precisa evitar expectativa de confirmação imediata.

## Recomendações Para Sprint 1

- Usar este inventário como baseline antes de definir tokens.
- Resolver primeiro a linguagem de status de agendamento, erro, vazio, sucesso e carregamento.
- Definir escala visual de cor, tipografia, espaçamento, foco e densidade.
- Estabelecer vocabulário oficial para os três perfis e para o fluxo do paciente.
- Documentar estados acessíveis para botões, inputs, tabs, dialogs, sheets, tabelas e calendários.
- Validar o Design System nos quatro pontos críticos: solicitação pública, dashboard, agenda e meus atendimentos.

## Escopo E Integridade

Esta sprint alterou somente documentação. Nenhum componente, página, feature, Server Action, migration, configuração do Supabase ou regra de negócio foi modificado.
