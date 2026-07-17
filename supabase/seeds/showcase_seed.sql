--------------------------------------------------
-- SHOWCASE DATABASE SEED
--------------------------------------------------

-- ================================================
-- 1. Validações
-- ================================================
-- Este bloco é reservado para checar a integridade estrutural do banco.
-- Verifica se as tabelas fundamentais (specialties, professionals, clinic_settings, profiles)
-- possuem os registros mínimos obrigatórios para que os dados operacionais possam ser vinculados.
-- Caso algum dado institucional obrigatório esteja ausente, o script emite um alerta e aborta a execução
-- para prevenir violações de Chave Estrangeira (FK).

-- ================================================
-- 2. Limpeza dos dados operacionais
-- ================================================
-- Este bloco limpa de forma limpa e ordenada todas as tabelas operacionais da clínica.
-- As tabelas institucionais (specialties, professionals, exams, profiles, clinic_settings)
-- NUNCA devem ser limpas ou alteradas neste script, pois representam a configuração real do cliente.
-- A limpeza ocorre na seguinte ordem para respeitar restrições de integridade e FK:
--   1. public.appointments (remover consultas)
--   2. public.appointment_slots (remover slots de agendamento)
--   3. public.availability_blocks (remover blocos de horário dos profissionais)
--   4. public.patients (remover pacientes de demonstração)

-- ================================================
-- 3. Pacientes
-- ================================================
-- Inserção de pacientes de demonstração comercial.
-- Deve respeitar a estrutura da tabela public.patients (id, name, phone, birth_date, notes).
-- Os pacientes inseridos aqui serão utilizados para preencher a fila de triagem da recepção e
-- simular atendimentos passados (concluídos) e futuros (agendados).

INSERT INTO public.patients (id, name, phone, birth_date, notes, created_at, updated_at)
SELECT
  id, name, phone, birth_date, notes, NOW(), NOW()
FROM (
  VALUES
    -- Faixa: 0 a 12 anos (Crianças)
    ('90000000-0000-0000-0000-000000000001'::uuid, 'Pedro Souza Alves', '(98) 98111-1234', '2018-04-12'::date, 'Necessita atendimento preferencial.'),
    ('90000000-0000-0000-0000-000000000002'::uuid, 'Sofia Costa Neves', '(98) 98111-1235', '2020-09-22'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000003'::uuid, 'Arthur Ribeiro Lima', '(98) 98111-1236', '2015-01-30'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000004'::uuid, 'Alice Ferreira Pinto', '(98) 98111-1237', '2022-11-05'::date, 'Alergia informada na recepção.'),
    ('90000000-0000-0000-0000-000000000005'::uuid, 'Manuela Santos Barros', '(98) 98111-1238', '2017-06-15'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000006'::uuid, 'Gabriel Silveira Melo', '(98) 98111-1239', '2019-02-28'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000007'::uuid, 'Bernardo Gomes Ramos', '(98) 98111-1240', '2021-07-04'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000008'::uuid, 'Valentina Cunha Martins', '(98) 98111-1241', '2016-10-18'::date, 'Acompanhado pela mãe.'),

    -- Faixa: 13 a 18 anos (Adolescentes)
    ('90000000-0000-0000-0000-000000000009'::uuid, 'Lucas Cardoso Reis', '(98) 98222-2345', '2009-08-11'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000010'::uuid, 'Julia Carvalho Dias', '(98) 98222-2346', '2011-03-19'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000011'::uuid, 'Enzo Teixeira Cruz', '(98) 98222-2347', '2008-05-25'::date, 'Uso de aparelho ortodôntico.'),
    ('90000000-0000-0000-0000-000000000012'::uuid, 'Maria Clara Fonseca', '(98) 98222-2348', '2012-12-01'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000013'::uuid, 'Gustavo Marques Rocha', '(98) 98222-2349', '2010-07-14'::date, 'Encaminhado por outro profissional.'),
    ('90000000-0000-0000-0000-000000000014'::uuid, 'Leticia Moreira Neres', '(98) 98222-2350', '2009-02-05'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000015'::uuid, 'Matheus Vieira Souza', '(98) 98222-2351', '2013-04-20'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000016'::uuid, 'Beatriz Araujo Lima', '(98) 98222-2352', '2011-10-09'::date, 'Sem observações.'),

    -- Faixa: 19 a 40 anos (Jovens Adultos)
    ('90000000-0000-0000-0000-000000000017'::uuid, 'Rafael Silva Castro', '(98) 98333-3456', '1994-07-22'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000018'::uuid, 'Isabella Costa Ramos', '(98) 98333-3457', '1999-11-03'::date, 'Alergia a penicilina.'),
    ('90000000-0000-0000-0000-000000000019'::uuid, 'Thiago Santos Lopes', '(98) 98333-3458', '1988-03-15'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000020'::uuid, 'Mariana Almeida Paz', '(98) 98333-3459', '1996-05-28'::date, 'Gestante - 2º trimestre.'),
    ('90000000-0000-0000-0000-000000000021'::uuid, 'Felipe Oliveira Melo', '(98) 98333-3460', '2002-12-19'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000022'::uuid, 'Gabriela Rocha Lima', '(98) 98333-3461', '1991-01-25'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000023'::uuid, 'Bruno Cunha Cardoso', '(98) 98333-3462', '1987-08-30'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000024'::uuid, 'Amanda Nunes Costa', '(98) 98333-3463', '2000-04-14'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000025'::uuid, 'Leonardo Pereira Silva', '(98) 98333-3464', '1993-09-08'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000026'::uuid, 'Carolina Araujo Pinto', '(98) 98333-3465', '1997-06-12'::date, 'Alergia a anti-inflamatórios.'),
    ('90000000-0000-0000-0000-000000000027'::uuid, 'Rodrigo Barros Santos', '(98) 98333-3466', '1989-10-31'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000028'::uuid, 'Larissa Mendes Souza', '(98) 98333-3467', '2005-02-18'::date, 'Uso de aparelho ortodôntico.'),
    ('90000000-0000-0000-0000-000000000029'::uuid, 'Caio Farias Neves', '(98) 98333-3468', '1992-04-07'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000030'::uuid, 'Camila Silveira Cruz', '(98) 98333-3469', '1998-08-24'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000031'::uuid, 'Daniel Ribeiro Martins', '(98) 98333-3470', '1995-12-14'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000032'::uuid, 'Vanessa Martins Rocha', '(98) 98333-3471', '2001-07-09'::date, 'Encaminhado por outro profissional.'),
    ('90000000-0000-0000-0000-000000000033'::uuid, 'Igor Ferreira Lima', '(98) 98333-3472', '1990-11-20'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000034'::uuid, 'Leticia Gomes Alves', '(98) 98333-3473', '2004-03-27'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000035'::uuid, 'Murilo Souza Borges', '(98) 98333-3474', '1993-05-15'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000036'::uuid, 'Nicole Ramos Pinto', '(98) 98333-3475', '1996-09-22'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000037'::uuid, 'Guilherme Lima Santos', '(98) 98333-3476', '1986-06-30'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000038'::uuid, 'Bianca Fonseca Neves', '(98) 98333-3477', '2003-10-12'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000039'::uuid, 'Victor Barbosa Reis', '(98) 98333-3478', '1991-02-08'::date, 'Alergia informada na recepção.'),
    ('90000000-0000-0000-0000-000000000040'::uuid, 'Julia Cardoso Neres', '(98) 98333-3479', '1999-04-19'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000041'::uuid, 'Arthur Costa Ferreira', '(98) 98333-3480', '1994-11-05'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000042'::uuid, 'Giovanna Araujo Dias', '(98) 98333-3481', '1997-03-24'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000043'::uuid, 'Gabriel Rocha Cunha', '(98) 98333-3482', '1988-08-14'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000044'::uuid, 'Sarah Vieira Lima', '(98) 98333-3483', '2006-12-05'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000045'::uuid, 'Vinicius Santos Melo', '(98) 98333-3484', '1992-05-30'::date, 'Encaminhado por outro profissional.'),
    ('90000000-0000-0000-0000-000000000046'::uuid, 'Amanda Rocha Gomes', '(98) 98333-3485', '2000-07-15'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000047'::uuid, 'Matheus Araujo Silva', '(98) 98333-3486', '1995-10-09'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000048'::uuid, 'Clara Barbosa Lima', '(98) 98333-3487', '1998-01-25'::date, 'Sem observações.'),

    -- Faixa: 41 a 60 anos (Adultos)
    ('90000000-0000-0000-0000-000000000049'::uuid, 'Marcelo Oliveira Dias', '(98) 98444-4567', '1974-03-12'::date, 'Hipertenso sob controle.'),
    ('90000000-0000-0000-0000-000000000050'::uuid, 'Patricia Costa Ramos', '(98) 98444-4568', '1981-06-25'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000051'::uuid, 'Roberto Silva Lopes', '(98) 98444-4569', '1968-09-18'::date, 'Uso de anticoagulante.'),
    ('90000000-0000-0000-0000-000000000052'::uuid, 'Sandra Santos Farias', '(98) 98444-4570', '1977-11-05'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000053'::uuid, 'Fernando Ribeiro Lima', '(98) 98444-4571', '1985-02-14'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000054'::uuid, 'Adriana Pereira Araujo', '(98) 98444-4572', '1972-12-30'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000055'::uuid, 'Carlos Alberto Souza', '(98) 98444-4573', '1966-07-20'::date, 'Cardiopata.'),
    ('90000000-0000-0000-0000-000000000056'::uuid, 'Luciana Gomes Neves', '(98) 98444-4574', '1979-05-09'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000057'::uuid, 'Ricardo Cardoso Melo', '(98) 98444-4575', '1983-10-22'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000058'::uuid, 'Regina Araujo Cruz', '(98) 98444-4576', '1970-08-15'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000059'::uuid, 'André Luis Fonseca', '(98) 98444-4577', '1975-01-11'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000060'::uuid, 'Marcia Ferreira Dias', '(98) 98444-4578', '1982-04-18'::date, 'Alergia a dipirona.'),
    ('90000000-0000-0000-0000-000000000061'::uuid, 'Eduardo Santos Costa', '(98) 98444-4579', '1969-11-30'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000062'::uuid, 'Claudia Rocha Lima', '(98) 98444-4580', '1976-03-24'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000063'::uuid, 'Sergio Ramos Borges', '(98) 98444-4581', '1971-08-04'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000064'::uuid, 'Tania Barbosa Silva', '(98) 98444-4582', '1984-06-15'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000065'::uuid, 'Jose Augusto Neves', '(98) 98444-4583', '1967-10-09'::date, 'Necessita atendimento preferencial.'),
    ('90000000-0000-0000-0000-000000000066'::uuid, 'Simone Silveira Cruz', '(98) 98444-4584', '1980-02-28'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000067'::uuid, 'Fabio Costa Reis', '(98) 98444-4585', '1973-05-15'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000068'::uuid, 'Cristiane Rocha Gomes', '(98) 98444-4586', '1978-09-22'::date, 'Sem observações.'),

    -- Faixa: 60+ anos (Idosos)
    ('90000000-0000-0000-0000-000000000069'::uuid, 'Antonio Carlos Silva', '(98) 98555-5678', '1958-04-12'::date, 'Necessita atendimento preferencial.'),
    ('90000000-0000-0000-0000-000000000070'::uuid, 'Maria Jose Santos', '(98) 98555-5679', '1951-09-22'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000071'::uuid, 'Francisco Jose Lima', '(98) 98555-5680', '1945-01-30'::date, 'Hipertenso e diabético.'),
    ('90000000-0000-0000-0000-000000000072'::uuid, 'Ana Maria Ferreira', '(98) 98555-5681', '1962-11-05'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000073'::uuid, 'Geraldo Santos Barros', '(98) 98555-5682', '1955-06-15'::date, 'Uso de marcapasso.'),
    ('90000000-0000-0000-0000-000000000074'::uuid, 'Helena Silveira Melo', '(98) 98555-5683', '1959-02-28'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000075'::uuid, 'Luiz Gonzaga Ramos', '(98) 98555-5684', '1948-07-04'::date, 'Retorno em 30 dias.'),
    ('90000000-0000-0000-0000-000000000076'::uuid, 'Teresa Cunha Martins', '(98) 98555-5685', '1953-10-18'::date, 'Necessita atendimento preferencial.'),
    ('90000000-0000-0000-0000-000000000077'::uuid, 'Wilson Cardoso Reis', '(98) 98555-5686', '1960-08-11'::date, 'Sem observações.'),
    ('90000000-0000-0000-0000-000000000078'::uuid, 'Ivone Carvalho Dias', '(98) 98555-5687', '1952-03-19'::date, 'Primeira consulta.'),
    ('90000000-0000-0000-0000-000000000079'::uuid, 'Raimundo Teixeira Cruz', '(98) 98555-5688', '1946-05-25'::date, 'Necessita atendimento preferencial.'),
    ('90000000-0000-0000-0000-000000000080'::uuid, 'Alzira Maria Fonseca', '(98) 98555-5689', '1964-12-01'::date, 'Sem observações.')
) AS v(id, name, phone, birth_date, notes)
WHERE (SELECT COUNT(*) FROM public.patients) < 80
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 4. Availability Blocks
-- ================================================
-- Configuração dos blocos de horário dos profissionais cadastrados no banco.
-- Deve fazer referência a IDs válidos das tabelas public.professionals e public.specialties.
-- Define a jornada de atendimento do médico/odontólogo (ex: recorrência semanal ou ocasional),
-- especificando dias de atendimento, horários de início/fim e duração estimada de cada slot.

INSERT INTO public.availability_blocks (id, specialty_id, professional_id, date, weekday, start_time, end_time, slot_duration, type, active, created_at, updated_at)
SELECT
  extensions.uuid_generate_v5(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    p.id::text || '-' || COALESCE(v.weekday::text, '') || '-' || COALESCE(v.date::text, '') || '-' || v.start_time
  ) AS id,
  p.specialty_id,
  p.id,
  v.date,
  v.weekday,
  v.start_time::time,
  v.end_time::time,
  v.slot_duration,
  v.type,
  true AS active,
  NOW(),
  NOW()
FROM public.professionals p
CROSS JOIN (
  VALUES
    -- Segunda-feira: Manhã (08:00 - 12:00) e Tarde (14:00 - 18:00)
    (null::date, 1, '08:00:00', '12:00:00', 30, 'recurring'),
    (null::date, 1, '14:00:00', '18:00:00', 30, 'recurring'),
    
    -- Terça-feira: Manhã (08:00 - 12:00)
    (null::date, 2, '08:00:00', '12:00:00', 30, 'recurring'),
    
    -- Quarta-feira: Manhã (08:00 - 12:00) e Tarde (14:00 - 17:00)
    (null::date, 3, '08:00:00', '12:00:00', 30, 'recurring'),
    (null::date, 3, '14:00:00', '17:00:00', 30, 'recurring'),
    
    -- Quinta-feira: Manhã (08:00 - 12:00)
    (null::date, 4, '08:00:00', '12:00:00', 30, 'recurring'),
    
    -- Sexta-feira: Manhã (08:00 - 12:00)
    (null::date, 5, '08:00:00', '12:00:00', 30, 'recurring'),
    
    -- Bloco Ocasional: Daqui a 2 dias (14:00 - 16:00)
    ((CURRENT_DATE + INTERVAL '2 days')::date, null, '14:00:00', '16:00:00', 30, 'occasional')
) AS v(date, weekday, start_time, end_time, slot_duration, type)
WHERE p.is_active = true
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 5. Appointment Slots
-- ================================================
-- Geração dos slots individuais de horários a partir dos blocos definidos acima.
-- Deve fazer referência direta a public.availability_blocks e public.professionals.
-- As datas devem ser calculadas dinamicamente usando a função CURRENT_DATE do PostgreSQL
-- (ex: CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day') para que a grade de horários da demonstração
-- pareça sempre ativa independente do dia de acesso.
-- Os slots são gerados com status inicial 'available' (70%), 'reserved' (20%) ou 'blocked' (10%).

INSERT INTO public.appointment_slots (id, availability_block_id, date, start_time, end_time, status, professional_id, created_at, updated_at)
SELECT
  extensions.uuid_generate_v5(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    b.professional_id::text || '-' || d.date::text || '-' || slot_start::time::text
  ) AS id,
  b.id AS availability_block_id,
  d.date,
  slot_start::time AS start_time,
  (slot_start + (b.slot_duration || ' minutes')::interval)::time AS end_time,
  CASE
    WHEN (ascii(substring(md5(b.professional_id::text || '-' || d.date::text || '-' || slot_start::time::text) from 1 for 1)) % 10) < 7 THEN 'available'::text
    WHEN (ascii(substring(md5(b.professional_id::text || '-' || d.date::text || '-' || slot_start::time::text) from 1 for 1)) % 10) < 9 THEN 'reserved'::text
    ELSE 'blocked'::text
  END AS status,
  b.professional_id,
  NOW(),
  NOW()
FROM (
  SELECT (CURRENT_DATE + g.offset * INTERVAL '1 day')::date AS date
  FROM generate_series(-5, 20) AS g(offset)
) d
INNER JOIN public.availability_blocks b ON (
  (b.type = 'recurring' AND EXTRACT(dow FROM d.date)::integer = b.weekday) OR
  (b.type = 'occasional' AND d.date = b.date)
)
CROSS JOIN LATERAL generate_series(
  (d.date + b.start_time)::timestamp,
  (d.date + b.end_time - (b.slot_duration || ' minutes')::interval)::timestamp,
  (b.slot_duration || ' minutes')::interval
) AS slot_start
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 6. Appointments
-- ================================================
-- Criação dos agendamentos de demonstração (fila de triagem e histórico clínico).
-- Deve vincular os pacientes criados na etapa 3 aos slots criados na etapa 5.
-- Deve utilizar status diversificados ('pending', 'confirmed', 'completed', 'cancelled')
-- para preencher o Kanban da recepção e simular atendimentos médicos diários de forma realista.
-- As consultas passadas (completed) devem conter textos ricos na coluna clinical_notes.

-- Inserção de agendamentos em 60% dos slots não bloqueados de forma determinística
INSERT INTO public.appointments (id, patient_id, specialty_id, professional_id, slot_id, status, notes, clinical_notes, created_at, updated_at)
SELECT
  extensions.uuid_generate_v5(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid,
    s.id::text
  ) AS id,
  ('90000000-0000-0000-0000-0000000000' || lpad(((ascii(substring(md5(s.id::text) from 2 for 2)) % 80) + 1)::text, 2, '0'))::uuid AS patient_id,
  p.specialty_id,
  s.professional_id,
  s.id AS slot_id,
  CASE
    WHEN (ascii(substring(md5(s.id::text) from 4 for 1)) % 100) < 45 THEN 'pending'::text
    WHEN (ascii(substring(md5(s.id::text) from 4 for 1)) % 100) < 75 THEN 'confirmed'::text
    WHEN (ascii(substring(md5(s.id::text) from 4 for 1)) % 100) < 95 THEN 'completed'::text
    ELSE 'cancelled'::text
  END AS status,
  CASE (ascii(substring(md5(s.id::text) from 5 for 1)) % 6)
    WHEN 0 THEN 'Primeira consulta.'
    WHEN 1 THEN 'Retorno solicitado.'
    WHEN 2 THEN 'Paciente encaminhado.'
    WHEN 3 THEN 'Consulta preventiva.'
    WHEN 4 THEN 'Retorno anual.'
    ELSE 'Avaliação clínica.'
  END AS notes,
  CASE 
    WHEN (ascii(substring(md5(s.id::text) from 4 for 1)) % 100) >= 75 AND (ascii(substring(md5(s.id::text) from 4 for 1)) % 100) < 95 THEN
      CASE (ascii(substring(md5(s.id::text) from 6 for 1)) % 4)
        WHEN 0 THEN 'Procedimento de rotina realizado com sucesso total. Paciente orientado sobre cuidados de higiene.'
        WHEN 1 THEN 'Avaliação clínica geral concluída. Exames adicionais solicitados para o próximo retorno.'
        WHEN 2 THEN 'Retorno de check-up ortodôntico/clínico finalizado. Excelente progresso de saúde bucal.'
        ELSE 'Ajustes no plano de tratamento executados. Retorno preventivo recomendado em 6 meses.'
      END
    ELSE null
  END AS clinical_notes,
  NOW(),
  NOW()
FROM public.appointment_slots s
INNER JOIN public.professionals p ON p.id = s.professional_id
WHERE s.status != 'blocked'
  AND (ascii(substring(md5(s.id::text) from 1 for 1)) % 10) < 6
ON CONFLICT (id) DO NOTHING;

-- Sincronização dos Slots:
-- 1. Garante que todos os slots com appointments criados fiquem marcados como 'reserved'
UPDATE public.appointment_slots
SET status = 'reserved'
WHERE id IN (SELECT slot_id FROM public.appointments);

-- 2. Garante que todos os slots marcados como 'reserved' que NÃO possuam appointments voltem a ser 'available'
UPDATE public.appointment_slots
SET status = 'available'
WHERE status = 'reserved'
  AND id NOT IN (SELECT slot_id FROM public.appointments);

-- ================================================
-- 7. Dashboard
-- ================================================
-- Simulação de métricas e evolução de faturamento/triagem.
-- Este bloco valida que os dados inseridos nas etapas de pacientes e consultas estejam integrados
-- de forma que as views e queries do dashboard calculem KPIs de faturamento estimado,
-- absenteísmo, novos cadastros e evolução histórica sem a necessidade de tabelas de log dedicadas.

-- ================================================
-- 8. Finalização
-- ================================================
-- Confirmação e encerramento da transação.
-- Executa o COMMIT caso todas as etapas tenham sido concluídas com sucesso,
-- garantindo a persistência limpa e segura dos dados demonstrativos no Supabase.

COMMIT;

-- Relatório Informativo de Validação Pós-Seed
SELECT 
  (SELECT COUNT(*) FROM public.patients) AS total_pacientes,
  (SELECT COUNT(*) FROM public.professionals) AS total_profissionais,
  (SELECT COUNT(*) FROM public.availability_blocks) AS total_blocos,
  (SELECT COUNT(*) FROM public.appointment_slots) AS total_slots,
  (SELECT COUNT(*) FROM public.appointments) AS total_consultas,
  (SELECT COUNT(*) FROM public.appointment_slots WHERE status = 'available') AS slots_available,
  (SELECT COUNT(*) FROM public.appointment_slots WHERE status = 'reserved') AS slots_reserved,
  (SELECT COUNT(*) FROM public.appointment_slots WHERE status = 'blocked') AS slots_blocked,
  (SELECT COUNT(*) FROM public.appointments WHERE status = 'pending') AS consultas_pending,
  (SELECT COUNT(*) FROM public.appointments WHERE status = 'confirmed') AS consultas_confirmed,
  (SELECT COUNT(*) FROM public.appointments WHERE status = 'completed') AS consultas_completed,
  (SELECT COUNT(*) FROM public.appointments WHERE status = 'cancelled') AS consultas_cancelled;
