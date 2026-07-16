-- Reset/Limpeza do Banco de Dados Med Odonto (Showcase)
-- Este script limpa com segurança todas as tabelas públicas da clínica.

BEGIN;

-- Desabilita triggers temporariamente para evitar conflito de constraints de chave estrangeira
ALTER TABLE IF EXISTS public.appointments DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.appointment_slots DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.availability_blocks DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.patients DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.professionals DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.specialties DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.exams DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.clinic_settings DISABLE TRIGGER ALL;

-- TRUNCATE deleta os registros mantendo a estrutura intacta
TRUNCATE TABLE public.appointments CASCADE;
TRUNCATE TABLE public.appointment_slots CASCADE;
TRUNCATE TABLE public.availability_blocks CASCADE;
TRUNCATE TABLE public.patients CASCADE;
TRUNCATE TABLE public.professionals CASCADE;
TRUNCATE TABLE public.specialties CASCADE;
TRUNCATE TABLE public.exams CASCADE;
TRUNCATE TABLE public.clinic_settings CASCADE;

-- Reabilita os triggers
ALTER TABLE IF EXISTS public.appointments ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.appointment_slots ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.availability_blocks ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.patients ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.professionals ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.specialties ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.exams ENABLE TRIGGER ALL;
ALTER TABLE IF EXISTS public.clinic_settings ENABLE TRIGGER ALL;

COMMIT;
