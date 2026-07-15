# Relatório do Sistema de Agendamento - Boilerplate Clínica

Este relatório descreve a arquitetura, as telas e a lógica de funcionamento do sistema de agendamento do projeto, bem como a sua integração com o Supabase.

## 1. Telas de Agendamento (Marketing / Público)

As telas voltadas para o usuário final, onde os pacientes podem realizar seus agendamentos públicos, estão localizadas no diretório `src/app/(marketing)`.

- **Página Principal de Agendamento (`src/app/(marketing)/agendar/[especialidade]/page.tsx`)**:
  - **Objetivo**: Fornecer uma interface amigável (pública) para o paciente selecionar um profissional, data e horário da consulta.
  - **Funcionamento**: A página faz uma requisição inicial ao Supabase (via Server Components) para buscar todas as especialidades ativas (`is_active = true`) ordenadas alfabeticamente. 
  - **Componente Central**: Utiliza o componente interativo `<SchedulingForm />` (localizado em `src/features/appointments/components/scheduling-form.tsx`), que recebe os dados da especialidade selecionada através da URL (slug) e gerencia os passos do formulário no lado do cliente.

## 2. Telas Internas e Dashboard (App)

A área restrita (painel administrativo e de profissionais) fica na rota `src/app/(app)/dashboard`.

- **Agenda (`/dashboard/agenda`)**: Tela para os administradores ou recepcionistas visualizarem e gerenciarem as consultas. Possui visões em formato de calendário (`dashboard-calendar-view.tsx`) e em formato de lista (`dashboard-appointments-list.tsx`).
- **Meus Atendimentos (`/dashboard/meus-atendimentos`)**: Interface para o profissional visualizar sua própria lista de pacientes e consultas (`doctor-appointments-list.tsx`).
- **Gerenciamento de Catálogo (`/dashboard/catalogo`)**: Telas para administrar o catálogo da clínica, incluindo cadastro e gestão de especialidades (`specialties-manager.tsx`) e de exames (`exams-manager.tsx`).
- **Gerenciamento de Profissionais e Slots (`/dashboard/profissionais`)**: Onde os médicos/profissionais são cadastrados. Existe a funcionalidade de geração de horários disponíveis (slots) através do `<SlotGeneratorDialog />`.

## 3. Lógica de Funcionamento do Agendamento (Server Actions)

A lógica central de agendamento está encapsulada em arquivos na pasta `src/features/appointments`, garantindo a separação de responsabilidades (Clean Architecture):

- **Validação (`schema.ts`)**: Todo input do usuário passa por uma validação rigorosa utilizando a biblioteca **Zod**. São validados: nome, telefone (WhatsApp), data de nascimento, notas, slug da especialidade e o slot de horário selecionado.
- **Ação de Agendamento (`actions.ts` -> `createAppointmentAction`)**:
  1. **Validação**: Verifica os dados enviados pelo FormData com o Zod.
  2. **Especialidade**: Busca o ID da especialidade no Supabase com base no *slug* da URL.
  3. **Paciente**: Faz uma busca do paciente na tabela `patients` através do telefone (WhatsApp apenas com dígitos). Se não existir, cria um novo registro para o paciente automaticamente.
  4. **Gerenciamento de Slots Inteligente**:
     - **Slots Físicos (UUID)**: Se o paciente selecionou um horário já cadastrado pelo sistema (um UUID real), o sistema marca o status desse slot (`appointment_slots`) como `"reserved"` para evitar concorrência.
     - **Slots Virtuais (YYYY-MM-DD - HH:MM)**: Caso seja uma solicitação dinâmica de horário, a lógica cria um bloco de disponibilidade fictício (`availability_blocks`) e cria dinamicamente o slot de horário para registrar a intenção do paciente.
  5. **Finalização**: O agendamento é então inserido na tabela `appointments` com o status inicial `"pending"`, associando o Paciente, a Especialidade e o Slot de horário.

## 4. Conexão e Integração com o Supabase

A infraestrutura de banco de dados e autenticação depende completamente do **Supabase**. 

- **Configuração (`src/lib/supabase`)**: O projeto utiliza o pacote oficial `@supabase/ssr` nativamente integrado com o Next.js 14+ (App Router).
- **Server Client (`server.ts`)**: Expõe a função `createClient()` que instancia a conexão com o Supabase utilizando as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Gerenciamento de Sessão (Cookies)**: O `createServerClient` recebe injetada a API `cookies()` nativa do Next.js (`next/headers`). Isso significa que a leitura e gravação de cookies (para autenticação de usuários, sessão, e controle de RLS) é feita automaticamente e com segurança diretamente pelo servidor.
- **Uso nas Server Actions**: Todas as consultas ao banco de dados (inserção de agendamentos, verificação de especialidades, criação de pacientes) invocam a função `createClient()`, garantindo que a conexão instanciada tenha o contexto da requisição atual, protegendo os dados se necessário (via RLS - Row Level Security, se configurado).
