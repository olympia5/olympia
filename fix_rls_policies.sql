-- 1. Habilitar RLS en las tablas (por si no lo están)
ALTER TABLE public.diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines_templates ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (para evitar conflictos si ya intentaste crearlas)
DROP POLICY IF EXISTS "Lectura publica de dietas" ON public.diets;
DROP POLICY IF EXISTS "Gestion completa para admins en dietas" ON public.diets;
DROP POLICY IF EXISTS "Lectura publica de rutinas" ON public.routines_templates;
DROP POLICY IF EXISTS "Gestion completa para admins en rutinas" ON public.routines_templates;

-- 3. Crear Políticas para DIETAS
-- Permite que cualquier usuario vea las dietas
CREATE POLICY "Lectura publica de dietas" 
ON public.diets FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Permite solo a los que tienen rol 'admin' INSERTAR, ACTUALIZAR y BORRAR
CREATE POLICY "Gestion completa para admins en dietas" 
ON public.diets FOR ALL 
USING (EXISTS (SELECT 1 FROM public.clients WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.clients WHERE id = auth.uid() AND role = 'admin'));

-- 4. Crear Políticas para RUTINAS (Plantillas)
CREATE POLICY "Lectura publica de rutinas" 
ON public.routines_templates FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Gestion completa para admins en rutinas" 
ON public.routines_templates FOR ALL 
USING (EXISTS (SELECT 1 FROM public.clients WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.clients WHERE id = auth.uid() AND role = 'admin'));
