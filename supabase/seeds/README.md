# Infraestrutura de Seed de Demonstração (Showcase Seed)

Este diretório contém os scripts de seed oficiais da aplicação para popular o banco de dados do **Med Odonto** com dados operacionais de demonstração comercial.

---

## 1. Objetivo da Seed
O objetivo principal da `showcase_seed.sql` é preparar uma demonstração do sistema simulando uma clínica com atividade real. Ela gera agendamentos, triagens de recepção e históricos de pacientes de forma dinâmica em relação ao dia do acesso, permitindo que o avaliador comercial veja o painel principal "vibrante" e com registros do dia atual.

---

## 2. Quando Utilizar
* **Apresentações Comerciais (Sales Demos)**: Para apresentar a plataforma Med Odonto a médicos, gerentes e proprietários de clínicas de forma realista.
* **Ambientes de Teste e Homologação (Staging)**: Para validar o comportamento de filtros, gráficos e relatórios com dados reais sem precisar preenchê-los manualmente um por um.
* **Validação de Bugs em Rotas Operacionais**: Para testar a responsividade e a paginação das grades de consultas.

> [!WARNING]
> **Nunca execute este script em ambientes de produção com dados reais de pacientes ativos.** O script realiza a limpeza ordenada de tabelas operacionais.

---

## 3. Como Executar pelo SQL Editor do Supabase
Para executar a seed oficial da aplicação:
1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/).
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New Query**.
4. Copie todo o conteúdo do arquivo [showcase_seed.sql](file:///C:/Users/lucas/Projetos/devio%20templates/clinicas/clinica-com-agendamento/supabase/seeds/showcase_seed.sql) e cole no editor.
5. Clique em **Run** (ou pressione `Ctrl + Enter` / `Cmd + Enter`).

---

## 4. Tabelas Populadas (Dados Operacionais)
O script de demonstração altera e popula exclusivamente as seguintes tabelas operacionais da clínica:
* `public.patients`: Cadastro de pacientes fictícios para triagem.
* `public.availability_blocks`: Blocos de disponibilidade dos profissionais.
* `public.appointment_slots`: Slots de horários individuais gerados a partir dos blocos.
* `public.appointments`: Consultas agendadas (pendentes, confirmadas, concluídas e canceladas).

---

## 5. Tabelas NÃO Alteradas (Dados Institucionais Preservados)
Para evitar quebras nas configurações reais da clínica contratante, o script de demonstração **nunca altera ou remove dados das seguintes tabelas institucionais e estruturais**:
* `public.specialties`: Especialidades médicas.
* `public.exams`: Catálogo de exames.
* `public.professionals`: Cadastro oficial de médicos/odontólogos.
* `public.profiles`: Perfis de usuários de controle de acesso (RBAC).
* `public.clinic_settings`: Nome, WhatsApp, logotipo e preferências gerais da clínica.
