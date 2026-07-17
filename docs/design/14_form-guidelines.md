# Diretrizes De Formulários

## Estrutura

1. Título da tarefa.
2. Explicação curta do resultado.
3. Campos agrupados por assunto.
4. Ajuda contextual antes da validação quando necessário.
5. Ação principal e alternativa clara.
6. Feedback de resultado próximo ao formulário.

## Campos

- Todo campo tem label visível.
- Marcar obrigatórios de forma consistente; opcional deve ser explícito quando útil.
- Usar o tipo de campo adequado ao dado.
- Informar formato esperado antes do envio.
- Não pedir informação que não participa do fluxo.
- Preservar dados digitados após erro.

## Validação

- Validar no momento apropriado, sem interromper a digitação.
- Mostrar erro junto ao campo e em resumo quando o formulário for longo.
- Mensagem nomeia o campo, explica o requisito e orienta correção.
- Não usar apenas borda vermelha ou ícone.
- Foco retorna ao primeiro erro relevante.

## Ajuda

- Ajuda explica por que o dado é necessário ou como formatá-lo.
- Placeholder é exemplo breve.
- Ajuda persistente não deve desaparecer no foco.
- Conteúdo sensível deve explicar uso sem alarmismo.

## Agrupamento

- Nome e contato ficam próximos.
- Data e horário ficam no mesmo contexto.
- Dados institucionais, branding e alertas ficam separados.
- Campos independentes não devem ser divididos em etapas só para aumentar sensação de progresso.

## Stepper

- Usar no agendamento público, que possui escolha de especialidade/horário e dados do paciente.
- Indicar etapa atual, concluída e o que falta.
- Permitir voltar sem perder dados.
- Não chamar solicitação enviada de consulta confirmada.

## Confirmação

- Ação primária descreve o resultado: “Finalizar solicitação”, “Salvar alterações”.
- Cancelar edição deve explicar perda de dados quando aplicável.
- Ações destrutivas têm confirmação explícita e consequência.
- Após sucesso, informar o que mudou e próximo passo.

## Acessibilidade

- Labels, descrições, erros e estados devem ser associados programaticamente.
- Campos e botões devem ser alcançáveis por teclado.
- Foco visível e ordem lógica.
- Não bloquear zoom ou ampliar texto.
