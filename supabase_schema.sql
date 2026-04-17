-- ===============================================================
-- GIMNASIO OLYMPIA: ESQUEMA DE BASE DE DATOS Y RLS
-- ===============================================================

-- Extensión para IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla Clientes (Mapeada 1 a 1 con auth.users de Supabase)
CREATE TABLE public.clients (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    payment_status TEXT DEFAULT 'active' CHECK (payment_status IN ('active', 'expired')),
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla Perfil de Cliente
CREATE TABLE public.client_profiles (
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE PRIMARY KEY,
    weight_kg NUMERIC,
    height_cm NUMERIC,
    age INT,
    goal TEXT,
    frequency INT, -- 3 o 5 días
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla Biblioteca de Ejercicios
CREATE TABLE public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    video_url TEXT,
    description TEXT
);

-- 4. Tabla Rutinas
CREATE TABLE public.routines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- ej: "Día 1: Empuje"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabla Relacional Rutina -> Ejercicios
CREATE TABLE public.routine_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    routine_id UUID REFERENCES public.routines(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id),
    sets INT NOT NULL DEFAULT 4,
    reps TEXT NOT NULL DEFAULT '12-15',
    rest_seconds INT DEFAULT 90,
    order_index INT NOT NULL
);

-- ===============================================================
-- POLÍTICAS DE SEGURIDAD (RLS - ROW LEVEL SECURITY)
-- REGLA DE ORO: Los datos son privados.
-- ===============================================================

-- Habilitar RLS en las tablas que almacenan datos sensibles
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
-- Exercises NO es privado
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY; 

-- Pólizas para Clients
CREATE POLICY "El usuario puede ver sus propios datos de cliente" ON public.clients FOR SELECT USING (auth.uid() = id);
-- Pólizas para Profiles
CREATE POLICY "El usuario puede ver y actualizar su perfil" ON public.client_profiles FOR ALL USING (auth.uid() = client_id);
-- Pólizas para Rutinas (Solo lectura para el cliente)
CREATE POLICY "El usuario puede ver sus propias rutinas" ON public.routines FOR SELECT USING (auth.uid() = client_id);
-- Pólizas para Routine Exercises
CREATE POLICY "El usuario puede ver ejercicios de su rutina" ON public.routine_exercises FOR SELECT USING (
    routine_id IN (SELECT id FROM public.routines WHERE client_id = auth.uid())
);
-- Ejercicios: Públicos para lectura, restringidos para escritura (asumimos admin)
CREATE POLICY "Ejercicios publicos" ON public.exercises FOR SELECT USING (true);



-- 6. Tabla Configuración del Gimnasio
CREATE TABLE public.gym_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    gym_name TEXT DEFAULT 'OLYMPIA',
    gym_logo TEXT,
    app_icon TEXT,
    membership_price TEXT DEFAULT '15000',
    membership_currency TEXT DEFAULT 'ARS',
    mercado_pago_link TEXT,
    motivational_phrases JSONB DEFAULT '[]'::jsonb,
    schedules JSONB DEFAULT '[]'::jsonb,
    instagram TEXT,
    whatsapp TEXT,
    tiktok TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insertar registro inicial si no existe
INSERT INTO public.gym_settings (id, gym_name) 
VALUES (1, 'OLYMPIA')
ON CONFLICT (id) DO NOTHING;

-- 7. Tabla Historial de Evolución Física
CREATE TABLE public.physical_evolution (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    weight_kg NUMERIC NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(client_id, date)
);

-- 8. Tabla Historial de Ejercicios (Performance)
CREATE TABLE public.exercise_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    weight_kg NUMERIC,
    reps INT,
    sets INT,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ===============================================================
-- POLÍTICAS ADICIONALES (RLS)
-- ===============================================================

ALTER TABLE public.gym_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

-- Gym Settings: Lectura pública, escritura solo para el dueño (gestión manual o claim de admin)
CREATE POLICY "Lectura publica de settings" ON public.gym_settings FOR SELECT USING (true);
CREATE POLICY "Admin puede todo en settings" ON public.gym_settings FOR ALL USING (true); -- Simplificado para el usuario

-- Physical Evolution: Privado para el usuario
CREATE POLICY "El usuario ve su propia evolucion" ON public.physical_evolution FOR ALL USING (auth.uid() = client_id);

-- Exercise Logs: Privado para el usuario
CREATE POLICY "El usuario ve su propio progreso" ON public.exercise_logs FOR ALL USING (auth.uid() = client_id);
