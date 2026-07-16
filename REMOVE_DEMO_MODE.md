# Remoção do Modo de Demonstração (Demo Mode)

Este documento registra a descontinuação e remoção completa da infraestrutura de simulação em memória (**Demo Mode**) do sistema Med Odonto. A partir desta atualização, o banco de dados Supabase passa a ser a única fonte de verdade da aplicação, e dados demonstrativos residem exclusivamente na camada de banco de dados por meio de Seed SQL.

---

## 1. Arquivos Removidos
Excluímos o arquivo central de dados e lógica em memória:
- **`src/lib/demo-data.ts`**: Removido por completo. Continha todos os arrays estáticos, geradores de datas relativas dinâmicas e o controle `DEMO_MODE = true`.

---

## 2. Arquivos Alterados
Para restaurar a dependência exclusiva do Supabase e remover quaisquer condicionais de mock:

1. **`src/features/clinic/queries.ts`**
   - Removido o import de `demo-data.ts` e a condicional `if (DEMO_MODE)` de `getClinicSettings`. Agora ela consulta exclusivamente a tabela `public.clinic_settings`.

2. **`src/features/reports/actions.ts`**
   - Removida a intercepção de métricas de faturamento em `getDashboardMetricsAction`. Agora calcula métricas e contagens diretamente no Supabase.

3. **`src/features/auth/components/login-form.tsx`**
   - Removido por completo o painel de **Acesso Rápido** de preenchimento de credenciais, além da importação de `DEMO_MODE`.

4. **`src/features/appointments/queries.ts`**
   - Limpeza integral de todas as intercepções condicionais baseadas em `DEMO_MODE` e remoção dos dados de mock importados para:
     - `getRecentAppointments`
     - `getActiveSpecialties`
     - `fetchAvailableSlots`
     - `getActiveExams`
     - `getAllSpecialties`
     - `getAllExams`
     - `getAllProfessionals`
     - `getDoctorAppointments`
     - `getAvailableSlots`
     - `getUserProfile`
     - `getAllProfiles`
     - `fetchDashboardCalendarSlots`
     - `getExamBySlug`

5. **`src/app/(marketing)/page.tsx`**
   - Adicionada a instrução `export const revalidate = 0` no topo para indicar explicitamente ao compilador do Next.js que a página inicial lê cookies do Supabase de forma dinâmica, evitando avisos de compilação estática durante o processo de build.

---

## 3. Nova Arquitetura de Demonstração (Showcase)
Para apoiar apresentações comerciais do sistema sem depender de mocks no código, estruturamos os scripts de banco sob o diretório:
`database/showcase/`

- **`reset/reset.sql`**: Limpa de forma ordenada e segura todas as tabelas públicas da clínica, respeitando a integridade de chaves estrangeiras.
- **`seed/seed.sql`**: Popula o catálogo de especialidades, exames, profissionais, pacientes, e gera slots físicos e agendamentos relativos ao dia atual de acesso (`CURRENT_DATE` do PostgreSQL).
- **`README.md`**: Guia passo a passo descrevendo como resetar, semear o banco, e configurar as contas de acesso (Admin, Recepção e Médicos) com seus respectivos papéis de controle de acesso (RBAC).
