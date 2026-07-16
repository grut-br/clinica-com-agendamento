# Inventário de Telas

Inventário baseado nas páginas `page.tsx` existentes. Frequência e prioridade são avaliações de produto para orientar refatoração visual, não alterações de negócio.

## Telas Públicas

| Tela | Objetivo | Perfil | Frequência | Complexidade | Prioridade |
|---|---|---|---|---|---|
| Home `/` | Apresentar a clínica e direcionar para serviços/agendamento | Paciente | Alta | Média | Alta |
| Especialidades | Explorar especialidades | Paciente | Alta | Média | Alta |
| Detalhe de especialidade | Explicar serviço e iniciar agendamento | Paciente | Alta | Média | Alta |
| Exames | Explorar exames | Paciente | Média | Média | Média |
| Detalhe de exame | Exibir detalhes e entrada de agendamento | Paciente | Média | Média | Média |
| Solicitação de agendamento | Escolher horário e enviar dados | Paciente | Alta | Alta | Crítica |

## Telas De Acesso

| Tela | Objetivo | Perfil | Frequência | Complexidade | Prioridade |
|---|---|---|---|---|---|
| Login | Entrar na área restrita | Admin, recepção, médico | Alta | Baixa | Alta |
| Esqueci a senha | Solicitar recuperação | Usuário interno | Baixa | Baixa | Média |
| Nova senha | Definir credencial nova | Usuário interno | Baixa | Baixa | Média |

## Telas Da Área Restrita

| Tela | Objetivo | Perfil | Frequência | Complexidade | Prioridade |
|---|---|---|---|---|---|
| Dashboard | Triar solicitações e acessar calendário | Admin, recepção | Muito alta | Alta | Crítica |
| Gerenciar agenda | Configurar disponibilidade e slots | Admin, recepção | Alta | Alta | Crítica |
| Catálogo | Gerenciar especialidades e exames | Admin, recepção | Média | Alta | Alta |
| Corpo clínico | Gerenciar profissionais | Admin, recepção | Média | Alta | Alta |
| Meus atendimentos | Consultar agenda do médico e prontuário | Médico | Muito alta | Alta | Crítica |
| Usuários e acessos | Gerenciar perfis e papéis | Admin | Baixa | Alta | Média |
| Relatórios | Consultar KPIs e gráficos | Admin | Média | Média | Média |
| Configurações da clínica | Gerenciar dados e aparência | Admin | Baixa | Alta | Média |
| Meu perfil | Consultar perfil e alterar senha | Todos os usuários internos | Baixa | Média | Baixa |

## Telas Críticas

- Solicitação de agendamento: principal conversão pública e ponto de reserva do horário.
- Dashboard: centro da operação de recepção.
- Gerenciar agenda: controla a disponibilidade apresentada ao paciente.
- Meus atendimentos: única superfície operacional do médico.

## Telas Secundárias

- Esqueci a senha.
- Nova senha.
- Usuários e acessos.
- Relatórios.
- Configurações da clínica.
- Meu perfil.
- Catálogos públicos de exames e detalhes de baixa demanda.

## Observações

- O dashboard do médico redireciona para Meus Atendimentos.
- Usuários, Relatórios e Configurações possuem restrições específicas no código.
- Não foi encontrado um inventário separado de telas de erro, loading ou sucesso; esses estados aparecem dentro de telas e componentes.
