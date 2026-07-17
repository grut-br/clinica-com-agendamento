# Demo Experience - Estratégia de Demonstração Comercial

Este documento descreve a estratégia e a arquitetura adotadas para implementar o **Modo de Demonstração (DEMO MODE)** no sistema Med Odonto. O objetivo principal é fornecer uma experiência comercial rica e realista para potenciais clientes, simulando uma clínica médica/odontológica real em plena atividade sem alterar dados persistentes e permitindo a fácil desativação ou remoção futura.

---

## 1. Estratégia do DEMO MODE
Para atender aos critérios de aceitação e restrições estritas do projeto (não alterar banco, políticas, Supabase RLS ou Server Actions de mutação), implementamos o **DEMO MODE na camada de leitura das Server Queries (Server-side Queries Interception)**.

### Benefícios dessa abordagem:
- **Zero Efeito Colateral no Banco**: O banco de dados físico permanece totalmente intacto e limpo.
- **Removível e Desativável**: A lógica está condicionada a uma constante booleana `DEMO_MODE` centralizada no arquivo `src/lib/demo-data.ts`. Para desativar ou remover, basta alterar esta flag ou retirar as condicionais da camada de leitura.
- **Independência de Conexão**: Mesmo se as tabelas estiverem totalmente vazias, o sistema responderá com dados ricos de simulação, evitando telas brancas, mensagens de "nenhum registro encontrado" ou comportamentos estéreos de CRUD inicial.

---

## 2. A Clínica Fictícia: "OdontoClinic Premium"
Criamos um branding consistente e humanizado para a clínica modelo de demonstração:
- **Nome**: OdontoClinic Premium
- **Descrição**: Clínica médica e odontológica de alta performance, referência em tratamentos estéticos, reabilitação oral e cardiologia preventiva.
- **Endereço**: Av. dos Holandeses, 1000 - Edifício Corporate, Sala 405 - Ponta d'Areia, São Luís - MA, 65071-380.
- **Telefone de Contato**: (98) 3221-4000
- **WhatsApp de Atendimento**: (98) 98123-4567
- **Horário de Funcionamento**: Segunda a Sexta: 08:00 às 18:00 • Sábado: 08:00 às 12:00.

---

## 3. Dados Dinâmicos e Realistas Simulados
Para simular que a clínica já opera há meses, o arquivo `src/lib/demo-data.ts` gera dados dinâmicos baseados no dia atual de acesso do avaliador.

### Especialidades de Destaque:
1. **Clínica Geral Odontológica**: Check-ups, limpezas profundas e restaurações.
2. **Odontologia Estética**: Clareamento dental a laser, facetas de resina e lentes de contato.
3. **Implantodontia**: Implantes dentários nacionais/importados e enxertos ósseos.
4. **Cardiologia Clínica**: Avaliação de risco cirúrgico e prevenção cardiovascular.
5. **Dermatologia Estética & Clínica**: Botox, preenchedores, peelings e cuidados com a pele.
6. **Pediatria e Hebiatria**: Acompanhamento infanto-juvenil de forma humanizada.

### Corpo Clínico (Profissionais):
- **Dr. Carlos Eduardo Menezes** (CRO/MA 4821 - Implantodontia)
- **Dra. Marina Costa Pinto** (CRO/MA 5912 - Ortodontia/Estética)
- **Dr. Renato Abreu de Castro** (CRM/MA 12940 - Cardiologia)
- **Dra. Letícia Neves Silveira** (CRM/MA 15480 - Dermatologia)
- **Dra. Amanda Silveira Ramos** (CRO/MA 6023 - Odontologia Estética)

### Catálogo de Exames Realistas:
- **Radiografia Panorâmica Digital**: R$ 120,00 (Ordem de chegada)
- **Tomografia Computadorizada Cone Beam**: R$ 380,00 (Requer agendamento)
- **Eletrocardiograma de Alta Resolução**: R$ 150,00 (Requer agendamento)
- **Hemograma Completo com Plaquetas**: R$ 60,00 (Ordem de chegada)
- **Perfil Lipídico Completo (Colesterol)**: R$ 80,00 (Ordem de chegada)

---

## 4. Cenários Simulados & Acesso Rápido
Adicionamos um painel de **Acesso Rápido** no rodapé do formulário de login (visível apenas em Modo Demo) que permite ao avaliador alternar instantaneamente entre três perfis de simulação de controle de acesso (RBAC):

### Cenário A: Administrador Geral (`admin@medodonto.com`)
- **Foco de Demonstração**: Permite ver a Central Operacional completa, triar consultas da recepção, acessar o CMS administrativo de Exames, Especialidades, Profissionais, gerenciar Usuários e Permissões do sistema e configurar dados de Branding.
- **Métricas e KPIs Reais exibidos**:
  - 184 Consultas Realizadas no Mês
  - Taxa de Cancelamento de apenas 4% (indicador verde de queda de 15% no absenteísmo)
  - 38 Novos Pacientes Cadastrados
  - Receita Estimada de R$ 28.450,00 (+14% em relação ao mês anterior)

### Cenário B: Recepcionista / Recepção (`recepcao@medodonto.com`)
- **Foco de Demonstração**: Focado no fluxo diário de triagem de pacientes, controle e geração da grade de horários da clínica, controle de horários e agendamento manual.

### Cenário C: Corpo Clínico / Médico (`carlos@medodonto.com` - Dr. Carlos Eduardo)
- **Foco de Demonstração**: A tela inicial do Dashboard é substituída automaticamente pela **Área do Médico**.
  - **Fila de Atendimento do Dia**: Mostra a listagem cronológica exata das consultas confirmadas de hoje do Dr. Carlos (exemplo: João Pedro Silva agendado para Implantodontia).
  - **Prontuário e Histórico**: Permite visualizar as notas clínicas detalhadas de atendimentos anteriores dos pacientes e lançar novas evoluções.

---

## 5. Experiência de Primeira Impressão (Wow Factor)
- **Zero Placeholders**: Substituímos qualquer ocorrência de `Lorem Ipsum` por descrições clínicas reais, nomes e conselhos de especialidades.
- **Interface Viva**: Ao entrar no painel, a Central Operacional exibe a lista de pacientes de "Hoje" com status diversificados (Pendente, Confirmado, Cancelado), dando a impressão imediata de uma clínica em ritmo real de trabalho.
- **Branding Coerente**: O tema, informações de contato (WhatsApp realístico) e endereços estão sincronizados entre o fluxo de agendamento do paciente e o painel de configurações internas.
