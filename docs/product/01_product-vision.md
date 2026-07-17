# Visão do Produto

**Produto:** Sistema Inteligente de Agendamento para Clínicas  
**Escopo desta visão:** UX, UI e organização visual; regras de negócio e arquitetura permanecem inalteradas.

## Objetivo

Ajudar clínicas a substituir a organização manual de consultas no WhatsApp por uma operação centralizada, clara e rápida. O produto conecta solicitação pública, triagem da recepção, agenda clínica e atendimento médico em um único fluxo.

O paciente não possui login. Ele solicita um horário, o sistema reserva o slot, a recepção confirma ou cancela e o atendimento, cadastro definitivo e pagamento acontecem presencialmente.

## Problema Que Resolve

- Solicitações dispersas em conversas de WhatsApp.
- Falta de visibilidade sobre horários reservados, pendentes e confirmados.
- Retrabalho da recepção ao conciliar profissionais, especialidades e horários.
- Dificuldade do médico para localizar a agenda do dia e registrar evolução clínica.
- Risco de perda de contexto entre solicitação, confirmação e comparecimento.

## Público-Alvo

Clínicas de pequeno e médio porte, especialmente operações com recepção enxuta, múltiplas especialidades e profissionais que precisam de uma agenda compartilhada sem a complexidade de um ERP.

## Personas

### Administrador

Responsável pela operação e pelas permissões do sistema. Configura identidade da clínica, catálogo, profissionais, usuários e acompanha indicadores. Precisa de controle, segurança e visão consolidada, mas usa diariamente sobretudo agenda e relatórios.

### Recepção

Pessoa que atende o telefone, WhatsApp e pacientes presenciais. Faz triagem de solicitações, confirma ou cancela horários, cria agendamentos internos e consulta a agenda. Precisa concluir tarefas rapidamente, com poucos cliques e baixo risco de erro.

### Médico

Profissional que acompanha os próprios atendimentos confirmados. Precisa saber quem será atendido, quando e em qual especialidade, além de registrar a evolução clínica. Não precisa acessar módulos administrativos.

### Paciente

Pessoa que busca uma especialidade ou exame e quer solicitar um horário sem criar conta. Precisa entender disponibilidade, fornecer contato e saber claramente que a clínica ainda fará a confirmação.

## Jornada Completa do Paciente

1. Acessa o site público da clínica.
2. Consulta especialidades ou exames.
3. Escolhe uma especialidade e inicia o agendamento.
4. Seleciona especialidade, horário disponível e profissional quando aplicável.
5. Informa nome, WhatsApp e dados opcionais.
6. Envia a solicitação.
7. O horário fica reservado e a solicitação assume estado pendente.
8. Recebe a confirmação de envio na tela.
9. Aguarda contato da recepção via WhatsApp.
10. Recebe confirmação ou cancelamento da clínica.
11. Comparece presencialmente.
12. Faz cadastro definitivo e pagamento presencialmente.

## Jornada Completa da Recepção

1. Faz login na área restrita.
2. Visualiza o painel com solicitações pendentes e agenda.
3. Analisa paciente, especialidade, profissional, data e horário.
4. Confirma ou cancela a solicitação.
5. Consulta a agenda por calendário ou lista.
6. Cria um agendamento interno quando necessário.
7. Gerencia disponibilidade e geração de slots, conforme permissão existente.
8. Consulta e atualiza catálogo e corpo clínico quando autorizado.
9. Usa a visão diária para orientar atendimento e recepção presencial.
10. Retorna ao painel para acompanhar novas solicitações.

## Jornada Completa do Médico

1. Faz login.
2. É direcionado para “Meus Atendimentos”.
3. Consulta os atendimentos confirmados do dia.
4. Abre os dados essenciais do paciente.
5. Realiza o atendimento presencial.
6. Registra a evolução clínica no prontuário.
7. Salva o registro e retorna à lista.

## Princípios do Produto

- **Simplicidade:** cada tela deve servir a uma tarefa principal.
- **Rapidez:** reduzir leitura, decisão e cliques nas tarefas recorrentes.
- **Clareza:** estados, próximos passos e responsabilidades devem ser explícitos.
- **Baixa curva de aprendizado:** usar linguagem conhecida por clínica, recepção e pacientes.
- **Aparência profissional:** transmitir confiança sem parecer um ERP genérico.
- **Poucos cliques:** favorecer ações no contexto da informação consultada.
- **Operação sem ruído:** priorizar agenda, solicitações e atendimento.
- **Separação por perfil:** mostrar para cada papel somente o que é relevante.
- **Confirmação responsável:** deixar claro que solicitação não equivale a consulta confirmada.

## Limites de Produto

- Pacientes não têm conta ou área logada.
- Cadastro definitivo e pagamento não são digitais neste fluxo.
- O sistema não será tratado como ERP.
- Esta visão não altera regras de negócio, autenticação, permissões ou persistência.
