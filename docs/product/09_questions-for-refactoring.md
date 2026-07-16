# Perguntas Para A Refatoração

## Produto E Operação

- Qual é o volume médio de solicitações por dia e em horários de pico?
- Qual é o tempo esperado entre solicitação e confirmação pela recepção?
- Quais estados de agendamento precisam ser exibidos explicitamente na interface?
- A reserva expira automaticamente em algum cenário ou permanece até decisão da recepção?
- Quais ações são mais frequentes para cada perfil durante um turno?
- A recepção trabalha principalmente em desktop, tablet ou celular?
- Médicos usam a agenda em computador da clínica ou em dispositivo próprio?

## Perfis E Permissões

- O conjunto oficial de papéis é Administrador, Recepção e Médico, ou existe também o estado Pendente como papel operacional?
- Quais permissões exatas cada perfil possui em catálogo, agenda, relatórios e configurações?
- Recepção deve acessar Usuários e Relatórios ou apenas visualizar rotas quando autorizado?
- A configuração white label pertence somente ao Administrador?
- O médico pode consultar histórico além da agenda do dia?
- O que deve acontecer visualmente quando o usuário acessa uma rota sem permissão: bloquear, redirecionar ou explicar?

## Navegação

- Qual lista é a fonte oficial da navegação: `config/navigation.ts`, `SidebarNav` ou `MobileSidebar`?
- “Gerenciar Agenda” deve ser item permanente no menu desktop?
- Dashboard, Agenda e Calendário devem ser uma única superfície ou entradas distintas?
- “Corpo Clínico” é a nomenclatura final para recepção e administrador?
- “Relatórios” é o termo preferido ou “Indicadores” representa melhor a tarefa?
- O menu deve mostrar itens desabilitados ou somente itens acessíveis ao perfil?

## Agendamento Público

- O paciente pode escolher profissional ou apenas especialidade e horário?
- O WhatsApp é sempre o canal oficial de confirmação?
- Quais informações são obrigatórias para a solicitação além de nome e telefone?
- Existem orientações de preparo que precisam aparecer antes ou depois do pedido?
- Como o produto deve comunicar um horário já ocupado entre carregamento e envio?
- O paciente precisa receber algum identificador da solicitação?
- Deve existir uma tela específica de cancelamento ou todo cancelamento é tratado pela clínica?

## Conteúdo E Linguagem

- A marca final é Med Odonto, Policlínica ou outra denominação white label?
- “Paciente”, “cliente” ou outro termo deve ser usado em toda a interface?
- O produto deve usar linguagem formal, acolhedora ou operacional para cada perfil?
- Quais termos técnicos, como RBAC, CMS e “triagem”, devem ser evitados na interface?
- Há textos legais, consentimentos ou avisos de privacidade necessários no agendamento?

## Visual E Tema

- Quais são as cores oficiais e limites de personalização do white label?
- O modo escuro é necessário para todos os perfis ou apenas preferência do usuário?
- Existe logotipo, tipografia ou guia de marca oficial fora do repositório?
- Quais componentes precisam suportar contraste elevado?
- A clínica deseja uma aparência mais institucional, clínica, premium ou operacional?

## Acessibilidade E Responsividade

- Qual nível de conformidade WCAG será aceito como critério de entrega?
- Quais leitores de tela e navegadores serão usados na validação?
- Há usuários com baixa visão, daltonismo ou limitações motoras conhecidos?
- Tabelas devem manter estrutura tabular no mobile ou possuir apresentação alternativa?
- Qual é o menor viewport oficialmente suportado?
- Animações precisam ser reduzidas por preferência do sistema em todos os fluxos?

## Validação

- Quais indicadores definirão sucesso da refatoração: tempo de triagem, erros, cliques ou satisfação?
- Haverá testes com recepção e médicos antes da Sprint 6?
- Existe ambiente de staging com dados representativos para validar telas?
- Quais rotas e perfis devem compor o checklist de regressão visual?
