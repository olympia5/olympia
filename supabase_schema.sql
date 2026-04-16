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


-- ===============================================================
-- FUNCION RECOMENDADA PARA ADMINS
-- (Bypass simple: Si necesitas reglas para los admin, puedes 
-- verificar si el auth.uid() no está en la tabla de clientes o
-- si tienen un claim de 'admin' en el JWT).
-- ===============================================================
