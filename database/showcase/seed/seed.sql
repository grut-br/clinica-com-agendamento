-- Seed de População do Banco de Dados Med Odonto (Showcase)
-- Este script insere dados clínicos fictícios ricos para a demonstração comercial.
-- Todos os IDs são estáticos para garantir integridade referencial.
-- Datas são geradas dinamicamente usando CURRENT_DATE para manter o sistema sempre ativo.

BEGIN;

-- 1. Dados da Clínica (clinic_settings)
INSERT INTO public.clinic_settings (id, clinic_name, phone, whatsapp, address, created_at, updated_at)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'OdontoClinic Premium',
  '(98) 3221-4000',
  '5598981234567',
  'Av. dos Holandeses, 1000 - Edifício Corporate, Sala 405 - Ponta d''Areia, São Luís - MA, 65071-380',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 2. Especialidades (specialties)
INSERT INTO public.specialties (id, name, slug, description, duration_minutes, is_active, show_on_site, category, created_at, updated_at)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Clínica Geral Odontológica',
    'clinica-geral-odonto',
    'Check-ups, limpezas profundas, restaurações estéticas de resina e prevenção.',
    30,
    true,
    true,
    'Odontologia',
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Odontologia Estética',
    'odontologia-estetica',
    'Clareamento dental a laser, facetas de resina, lentes de contato ultrafinas e restaurações estéticas.',
    40,
    true,
    true,
    'Odontologia',
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Implantodontia',
    'implantodontia',
    'Implantes dentários nacionais e importados de titânio e cerâmica, com enxertos ósseos.',
    60,
    true,
    true,
    'Odontologia',
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Cardiologia Clínica',
    'cardiologia-clinica',
    'Avaliação de risco cirúrgico, eletrocardiograma e prevenção cardiovascular.',
    30,
    true,
    true,
    'Medicina',
    NOW(),
    NOW()
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Dermatologia Estética & Clínica',
    'dermatologia',
    'Aplicação de botox, preenchimento com ácido hialurônico, peelings químicos e tratamento de pele.',
    45,
    true,
    true,
    'Medicina',
    NOW(),
    NOW()
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Pediatria e Hebiatria',
    'pediatria',
    'Acompanhamento do desenvolvimento infanto-juvenil de forma humanizada e personalizada.',
    30,
    true,
    true,
    'Medicina',
    NOW(),
    NOW()
  ) ON CONFLICT DO NOTHING;

-- 3. Exames (exams)
INSERT INTO public.exams (id, name, slug, description, requires_scheduling, is_active, price, category, created_at, updated_at)
VALUES
  (
    'f1111111-1111-1111-1111-111111111111',
    'Radiografia Panorâmica Digital',
    'radiografia-panoramica',
    'Exame radiográfico completo da arcada dentária para diagnóstico rápido. Feito por ordem de chegada.',
    false,
    true,
    120.00,
    'Imagem',
    NOW(),
    NOW()
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    'Tomografia Computadorizada Cone Beam',
    'tomografia-cone-beam',
    'Reconstrução 3D de alta precisão da maxila e mandíbula para planejamentos cirúrgicos.',
    true,
    true,
    380.00,
    'Imagem',
    NOW(),
    NOW()
  ),
  (
    'f3333333-3333-3333-3333-333333333333',
    'Eletrocardiograma de Alta Resolução',
    'eletrocardiograma',
    'Avaliação detalhada da atividade elétrica do coração em repouso com laudo do cardiologista.',
    true,
    true,
    150.00,
    'Cardiológico',
    NOW(),
    NOW()
  ),
  (
    'f4444444-4444-4444-4444-444444444444',
    'Hemograma Completo com Plaquetas',
    'hemograma-completo',
    'Contagem geral de glóbulos vermelhos, brancos e plaquetas para triagem clínica básica. Jejum recomendado.',
    false,
    true,
    60.00,
    'Análises Clínicas',
    NOW(),
    NOW()
  ),
  (
    'f5555555-5555-5555-5555-555555555555',
    'Perfil Lipídico Completo (Colesterol)',
    'perfil-lipidico',
    'Dosagem de Colesterol Total, HDL, LDL, VLDL e Triglicerídeos. Requer jejum absoluto de 12 horas.',
    false,
    true,
    80.00,
    'Análises Clínicas',
    NOW(),
    NOW()
  ) ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price;

-- 4. Profissionais (professionals)
INSERT INTO public.professionals (id, name, slug, specialty_id, bio, registration_number, is_active, created_at, updated_at)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Dr. Carlos Eduardo Menezes',
    'dr-carlos-eduardo',
    '33333333-3333-3333-3333-333333333333',
    'Especialista em Implantodontia e Cirurgia Bucomaxilofacial, com mais de 12 anos de experiência em reabilitação oral.',
    'CRO/MA 4821',
    true,
    NOW(),
    NOW()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Dra. Marina Costa Pinto',
    'dra-marina-costa',
    '22222222-2222-2222-2222-222222222222',
    'Especialista em Ortodontia e Odontologia Estética, apaixonada por transformar sorrisos com alinhadores invisíveis e resinas.',
    'CRO/MA 5912',
    true,
    NOW(),
    NOW()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Dr. Renato Abreu de Castro',
    'dr-renato-abreu',
    '44444444-4444-4444-4444-444444444444',
    'Médico Cardiologista pós-graduado pela USP, com foco em prevenção cardiovascular e reabilitação pós-infarto.',
    'CRM/MA 12940',
    true,
    NOW(),
    NOW()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Dra. Letícia Neves Silveira',
    'dra-leticia-neves',
    '55555555-5555-5555-5555-555555555555',
    'Médica Dermatologista titular da SBD, especialista em procedimentos de harmonização facial, toxina botulínica e laser.',
    'CRM/MA 15480',
    true,
    NOW(),
    NOW()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Dra. Amanda Silveira Ramos',
    'dra-amanda-silveira',
    '22222222-2222-2222-2222-222222222222',
    'Odontopediatra e especialista em atendimento odontológico preventivo para crianças e adolescentes de forma humanizada.',
    'CRO/MA 6023',
    true,
    NOW(),
    NOW()
  ) ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, bio = EXCLUDED.bio, registration_number = EXCLUDED.registration_number;

-- 5. Blocos de Disponibilidade (availability_blocks)
INSERT INTO public.availability_blocks (id, specialty_id, professional_id, date, weekday, start_time, end_time, slot_duration, type, active, created_at, updated_at)
VALUES
  -- Dr. Carlos (Implantodontia)
  ('10000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null, 1, '08:00:00', '12:00:00', 60, 'recurring', true, NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null, 3, '14:00:00', '18:00:00', 60, 'recurring', true, NOW(), NOW()),
  -- Dra. Marina (Estética)
  ('10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', null, 2, '08:00:00', '12:00:00', 40, 'recurring', true, NOW(), NOW()),
  -- Dr. Renato (Cardio)
  ('10000000-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', null, 4, '09:00:00', '12:00:00', 30, 'recurring', true, NOW(), NOW())
  ON CONFLICT DO NOTHING;

-- 6. Slots Físicos de Agendamento (appointment_slots)
-- Cadastrando slots para Hoje, Ontem, Amanhã e Depois de Amanhã
INSERT INTO public.appointment_slots (id, availability_block_id, date, start_time, end_time, status, professional_id, created_at, updated_at)
VALUES
  -- Hoje (Dr. Carlos)
  ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', CURRENT_DATE, '08:00:00', '09:00:00', 'available', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:00:00', '10:00:00', 'reserved', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', CURRENT_DATE, '10:00:00', '11:00:00', 'available', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
  -- Hoje (Dra. Marina)
  ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', CURRENT_DATE, '08:30:00', '09:10:00', 'available', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', CURRENT_DATE, '09:30:00', '10:10:00', 'reserved', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
  -- Hoje (Dr. Renato)
  ('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', CURRENT_DATE, '10:00:00', '10:30:00', 'available', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW()),
  -- Amanhã (Dr. Carlos)
  ('50000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '08:00:00', '09:00:00', 'available', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:00:00', 'available', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
  -- Amanhã (Dra. Marina)
  ('50000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '1 day', '08:30:00', '09:10:00', 'available', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
  -- Ontem (Dr. Carlos - Passado / Já Concluído)
  ('50000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', '10:00:00', '11:00:00', 'reserved', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW())
  ON CONFLICT DO NOTHING;

-- 7. Cadastro de Pacientes (patients)
INSERT INTO public.patients (id, name, phone, birth_date, notes, created_at, updated_at)
VALUES
  (
    '90000000-0000-0000-0000-000000000001',
    'João Pedro Silva',
    '(98) 99123-4567',
    '1990-05-15',
    'Paciente com sensibilidade a anestésicos comuns.',
    NOW(),
    NOW()
  ),
  (
    '90000000-0000-0000-0000-000000000002',
    'Maria Eduarda Santos',
    '(98) 98234-5678',
    '1985-11-20',
    'Faz uso de aparelho ortodôntico estético.',
    NOW(),
    NOW()
  ),
  (
    '90000000-0000-0000-0000-000000000003',
    'Carlos Henrique Lima',
    '(98) 98765-4321',
    '1978-08-05',
    'Paciente hipertenso sob controle.',
    NOW(),
    NOW()
  ) ON CONFLICT DO NOTHING;

-- 8. Consultas e Agendamentos (appointments)
INSERT INTO public.appointments (id, patient_id, specialty_id, professional_id, slot_id, status, notes, clinical_notes, created_at, updated_at)
VALUES
  -- Consulta do Dr. Carlos hoje (Implantodontia)
  (
    'a0000000-0000-0000-0000-000000000001',
    '90000000-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '50000000-0000-0000-0000-000000000002',
    'confirmed',
    'Paciente solicita check-up do implante superior.',
    null,
    NOW(),
    NOW()
  ),
  -- Consulta da Dra. Marina hoje (Ortodontia)
  (
    'a0000000-0000-0000-0000-000000000002',
    '90000000-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '50000000-0000-0000-0000-000000000005',
    'confirmed',
    'Manutenção mensal do aparelho ortodôntico.',
    null,
    NOW(),
    NOW()
  ),
  -- Consulta de ontem (Dr. Carlos - Já Concluída com Notas Clínicas)
  (
    'a0000000-0000-0000-0000-000000000003',
    '90000000-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '50000000-0000-0000-0000-000000000011',
    'completed',
    'Retorno pós-cirúrgico.',
    'Procedimento de enxerto ósseo e colocação de implante de titânio cicatrizado com sucesso. Retorno agendado para manutenção periódica.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ) ON CONFLICT DO NOTHING;

COMMIT;
