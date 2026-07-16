# Banco de Dados de Showcase (Demonstração Comercial)

Este diretório contém os scripts SQL e as instruções operacionais para preparar, resetar e popular o banco de dados do **Med Odonto** com dados de demonstração comercial realistas.

A partir da versão **Release 2.5**, o sistema não utiliza mais dados em memória (*mocks*), sendo o banco de dados Supabase a única fonte de verdade de todas as telas.

---

## 1. Estrutura de Pastas
- `seed/seed.sql`: Script para popular todas as tabelas com especialidades, exames, profissionais, pacientes, slots e agendamentos dinâmicos (calculados em relação à data atual).
- `reset/reset.sql`: Script para limpar (limpeza profunda) todas as tabelas públicas da clínica de forma segura e ordenada.

---

## 2. Como Limpar o Banco de Dados (Reset)
Para remover todos os agendamentos, pacientes, médicos e especialidades inseridos em demonstrações anteriores, execute o conteúdo do arquivo `reset/reset.sql` no painel SQL do Supabase.

### Instruções no Console do Supabase:
1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/).
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New Query** (ou abra uma existente).
4. Copie todo o conteúdo do arquivo [reset.sql](file:///C:/Users/lucas/Projetos/devio%20templates/clinicas/clinica-com-agendamento/database/showcase/reset/reset.sql) e cole no editor.
5. Clique em **Run** (ou pressione `Ctrl + Enter` / `Cmd + Enter`).

---

## 3. Como Popular o Banco de Dados (Seed)
Para inserir os médicos da clínica, as especialidades de demonstração e agendamentos realistas para Hoje, Ontem e Amanhã, execute o conteúdo do arquivo `seed/seed.sql`.

### Instruções no Console do Supabase:
1. Acesse o painel do seu projeto no **SQL Editor** do Supabase.
2. Crie uma nova query (**New Query**).
3. Copie todo o conteúdo do arquivo [seed.sql](file:///C:/Users/lucas/Projetos/devio%20templates/clinicas/clinica-com-agendamento/database/showcase/seed/seed.sql) e cole no editor.
4. Clique em **Run**.

---

## 4. Configuração de Contas de Acesso (RBAC)
No sistema físico de autenticação do Supabase, o trigger `handle_new_user` cria automaticamente um perfil na tabela `public.profiles` com a permissão inicial `pending` sempre que um usuário se cadastra.

Para fins de demonstração, as seguintes contas pré-configuradas no banco de dados devem ter suas permissões ajustadas na tabela `profiles`:

### 1. Administrador (Acesso Geral)
* **E-mail**: `admin@medodonto.com`
* **Permissão**: `admin`
* **Query SQL para atualizar**:
  ```sql
  UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@medodonto.com';
  ```

### 2. Recepcionista (Central de Agenda)
* **E-mail**: `recepcao@medodonto.com`
* **Permissão**: `receptionist`
* **Query SQL para atualizar**:
  ```sql
  UPDATE public.profiles SET role = 'receptionist' WHERE email = 'recepcao@medodonto.com';
  ```

### 3. Médico (Dr. Carlos Eduardo)
* **E-mail**: `carlos@medodonto.com`
* **Permissão**: `doctor`
* **Profissional Vinculado**: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`
* **Query SQL para atualizar**:
  ```sql
  UPDATE public.profiles 
  SET role = 'doctor', professional_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' 
  WHERE email = 'carlos@medodonto.com';
  ```

---

## 5. Cuidados Importantes
- **Datas Dinâmicas**: O script de seed utiliza o comando `CURRENT_DATE` do PostgreSQL. Isso significa que, independentemente do dia em que você executar o script, os agendamentos sempre estarão agendados para a data de **Hoje**, **Amanhã** e **Ontem**, mantendo o sistema com aparência ativa.
- **Segurança**: Nunca execute o script de `reset.sql` em ambientes de produção com dados reais de pacientes ativos.
