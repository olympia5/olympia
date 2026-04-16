import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DIET_TEMPLATES, ROUTINE_TEMPLATES, processDietText } from '../lib/plansLibrary';

// ---- Helper: calcular días restantes ----
export const getDaysRemaining = (membershipEnd) => {
  if (!membershipEnd) return 0;
  const diff = Math.ceil((new Date(membershipEnd) - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

// ---- Mapeo de Configuración (JS camelCase <-> DB snake_case) ----
const mapSettingsToDB = (js) => {
  const db = {};
  if (js.gymName !== undefined) db.gym_name = js.gymName;
  if (js.gymLogo !== undefined) db.gym_logo = js.gymLogo;
  if (js.membershipPrice !== undefined) db.membership_price = js.membershipPrice;
  if (js.membershipCurrency !== undefined) db.membership_currency = js.membershipCurrency;
  if (js.mercadoPagoLink !== undefined) db.mercado_pago_link = js.mercadoPagoLink;
  if (js.motivationalPhrases !== undefined) db.motivational_phrases = js.motivationalPhrases;
  if (js.schedules !== undefined) db.schedules = js.schedules;
  if (js.instagram !== undefined) db.instagram = js.instagram;
  if (js.whatsapp !== undefined) db.whatsapp = js.whatsapp;
  if (js.tiktok !== undefined) db.tiktok = js.tiktok;
  return db;
};

const mapSettingsFromDB = (db) => ({
  gymName: db.gym_name,
  gymLogo: db.gym_logo,
  membershipPrice: db.membership_price,
  membershipCurrency: db.membership_currency,
  mercadoPagoLink: db.mercado_pago_link,
  motivationalPhrases: db.motivational_phrases,
  schedules: db.schedules,
  instagram: db.instagram,
  whatsapp: db.whatsapp,
  tiktok: db.tiktok
});

const AuthContext = createContext(null);

// ---- Frases motivacionales iniciales (fallback) ----
const INITIAL_PHRASES = [
  "Hoy es día de guerra.",
  "La disciplina forja tu destino.",
  "El sudor de hoy es la victoria de mañana.",
  "No te detengas cuando te canses, detente cuando hayas terminado.",
  "La única competencia eres tú mismo.",
  "Forja tu cuerpo, fortalece tu mente.",
  "Lo imposible solo tarda un poco más.",
  "Entrena como un guerrero, vive como una leyenda.",
  "Tu cuerpo puede soportar casi cualquier cosa. Es a tu mente a quien tienes que convencer.",
  "El dolor es la debilidad abandonando el cuerpo."
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    gymName: 'OLYMPIA',
    membershipPrice: '15000',
    membershipCurrency: 'ARS',
    motivationalPhrases: INITIAL_PHRASES,
    schedules: [
      { day: 'Lunes a Viernes', hours: '08:00 - 22:00' },
      { day: 'Sábados', hours: '09:00 - 18:00' }
    ],
    instagram: '',
    whatsapp: '',
    tiktok: ''
  });
  const [clients, setClients] = useState([]);
  const [diets, setDiets] = useState([]);
  const [routines, setRoutines] = useState([]);

  // ---- 1. Listener de Sesión de Supabase ----
  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Cargar datos públicos (opcional, puedes hacerlo aquí o dentro de fetchUserData)
    fetchPublicData();

    // Escuchar cambios (login/logout/token refreshed)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserData(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---- 2. Obtener datos extra del usuario (rol, nombre, perfil) ----
  const fetchUserData = async (authUser) => {
    try {
      // 1. Obtener datos de la tabla 'clients'
      const { data: clientData, error: clientErr } = await supabase
        .from('clients')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (clientErr) throw clientErr;

      // 2. Obtener perfil y mapear a nombres de frontend
      const { data: rawProfile } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('client_id', authUser.id)
        .single();

      const profile = rawProfile ? {
        weight: rawProfile.weight_kg,
        height: rawProfile.height_cm,
        sex: rawProfile.sex,
        age: rawProfile.age,
        goal: rawProfile.goal,
        dietPreference: rawProfile.diet_preference,
        avatar: rawProfile.avatar
      } : {};

      // Combinar todo en el estado del usuario
      const userData = {
        ...authUser,
        ...clientData,
        profile,
        role: clientData.role || 'client'
      };

      setUser(userData);
      
      // Si es admin, cargar lista completa de clientes
      if (userData.role === 'admin') {
        fetchAllData();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- 3. Cargar datos globales para Admins y Public ----
  const fetchPublicData = async () => {
    const { data: dietList } = await supabase.from('diets').select('*');
    if (dietList) setDiets(dietList);

    const { data: routineList } = await supabase.from('routines_templates').select('*');
    if (routineList) setRoutines(routineList);

    const { data: gymSets } = await supabase.from('gym_settings').select('*').single();
    if (gymSets) {
      const mapped = mapSettingsFromDB(gymSets);
      setSettings(prev => ({ ...prev, ...mapped }));
    }
  };

  const fetchAllData = async () => {
    const { data: allClients } = await supabase
      .from('clients')
      .select('*, client_profiles(*)')
      .order('created_at', { ascending: true });
    
    if (allClients) setClients(allClients);
    fetchPublicData();
  };

  // ---- 4. ACCIONES DE AUTH ----

  const registerClient = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    if (error) return { success: false, error: error.message };

    // Insertar en tabla public.clients
    const { error: insError } = await supabase.from('clients').insert({
      id: data.user.id,
      name: email.split('@')[0],
      email: email,
      role: 'client',
      status: 'pending'
    });

    if (insError) return { success: false, error: insError.message };

    // Crear perfil vacío
    await supabase.from('client_profiles').insert({ client_id: data.user.id });

    return { success: true };
  };

  const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ---- 5. GESTIÓN DE PERFIL Y MEMBRESÍA ----

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    // Construir objeto solo con lo que existe seguro en la DB según schema.sql
    const dbData = {};
    if (profileData.weight) dbData.weight_kg = Number(profileData.weight);
    if (profileData.height) dbData.height_cm = Number(profileData.height);
    if (profileData.age) dbData.age = Number(profileData.age);
    if (profileData.goal) dbData.goal = profileData.goal;
    
    // Estos campos podrían no existir todavía, los mandamos con cuidado
    // Si fallan, reintaremos solo con los básicos
    const extendedData = {
      client_id: user.id, // Aseguramos que el ID esté presente para upsert
      ...dbData,
      sex: profileData.sex,
      diet_preference: profileData.dietPreference,
      avatar: profileData.avatar
    };

    console.log("Intentando upsert de perfil:", extendedData);

    // USAMOS UPSERT: Si no existe, lo crea. Si existe, lo actualiza.
    const { error: firstError } = await supabase
      .from('client_profiles')
      .upsert(extendedData, { onConflict: 'client_id' });
    
    let finalError = firstError;

    // Si falló por columnas inexistentes, reintentar solo con los campos básicos
    if (firstError) {
      console.warn("Fallo guardado extendido, reintentando con campos básicos...", firstError.message);
      const { error: secondError } = await supabase
        .from('client_profiles')
        .upsert({ 
          client_id: user.id,
          ...dbData 
        }, { onConflict: 'client_id' });
      finalError = secondError;
    }
    
    if (!finalError) {
      // Registrar snapshot en el historial de evolución si hay peso
      if (dbData.weight_kg) {
        await supabase.from('physical_evolution').upsert({
          client_id: user.id,
          weight_kg: dbData.weight_kg,
          date: new Date().toISOString().split('T')[0]
        }, { onConflict: 'client_id, date' });
      }
      await fetchUserData(user); // Refrescar estado local
      return { success: true };
    }

    console.error("Error final al guardar perfil:", finalError.message);
    return { success: false, error: finalError.message };
  };

  const getEvolutionHistory = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('physical_evolution')
      .select('*')
      .eq('client_id', user.id)
      .order('date', { ascending: true });
    
    return error ? [] : data;
  };

  const activateMembership = async () => {
    if (!user) return;
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30);

    const { error } = await supabase
      .from('clients')
      .update({
        status: 'active',
        membership_start: now.toISOString(),
        membership_end: end.toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error("Error activating membership:", error);
      return { success: false, error: error.message };
    }

    // Intentar actualizar el perfil también si no existe
    await supabase.from('client_profiles').upsert({ client_id: user.id });
    fetchUserData(user);
    
    return { success: true, membershipEnd: end.toISOString() };
  };

  // ---- 6. ACCIONES ADMIN ----

  const updateClient = async (id, updates) => {
    const { error } = await supabase.from('clients').update(updates).eq('id', id);
    if (!error) fetchAllData();
    return { success: !error, error: error?.message };
  };

  const deleteClient = async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (!error) fetchAllData();
  };

  const updateSettings = async (newSettings) => {
    try {
      const dbData = mapSettingsToDB(newSettings);
      // Usamos upsert para que si la fila 1 no existe, se cree automáticamente
      const { error } = await supabase
        .from('gym_settings')
        .upsert({ id: 1, ...dbData });
      
      if (error) throw error;
      
      setSettings(prev => ({ ...prev, ...newSettings }));
      return { success: true };
    } catch (error) {
      console.error("Error updating settings:", error);
      return { success: false, error: error.message };
    }
  };

  const addDiet = async (dietData) => {
    const { error } = await supabase.from('diets').insert([dietData]);
    if (!error) fetchPublicData();
    return { success: !error, error: error?.message };
  };

  const updateDiet = async (id, updatedData) => {
    const { error } = await supabase.from('diets').update(updatedData).eq('id', id);
    if (!error) fetchPublicData();
    return { success: !error, error: error?.message };
  };

  const deleteDiet = async (id) => {
    const { error } = await supabase.from('diets').delete().eq('id', id);
    if (!error) fetchPublicData();
    return { success: !error, error: error?.message };
  };

  const addRoutine = async (routineData) => {
    const { error } = await supabase.from('routines_templates').insert([routineData]);
    if (!error) fetchPublicData();
    return { success: !error, error: error?.message };
  };

  const updateRoutine = async (id, updatedData) => {
    const { error } = await supabase.from('routines_templates').update(updatedData).eq('id', id);
    if (!error) fetchPublicData();
    return { success: !error, error: error?.message };
  };

  const deleteRoutine = async (id) => {
    const { error } = await supabase.from('routines_templates').delete().eq('id', id);
    if (!error) fetchPublicData();
    return { success: !error, error: error?.message };
  };

  // ---- 7. LÓGICA DE DIETAS Y RUTINAS (Templates) ----

  const getSuggestedDiet = (profile) => {
    if (!profile?.goal || !profile?.diet_preference) return null;
    const goalPlans = DIET_TEMPLATES[profile.goal];
    if (!goalPlans) return null;
    
    const basePlan = goalPlans[profile.diet_preference] || goalPlans['carnivoro'];
    if (!basePlan) return null;

    return {
      ...basePlan,
      title: goalPlans.title || "Plan Sugerido",
      isSuggested: true,
      desayuno: processDietText(basePlan.desayuno, profile),
      almuerzo: processDietText(basePlan.almuerzo, profile),
      merienda: processDietText(basePlan.merienda, profile),
      cena: processDietText(basePlan.cena, profile)
    };
  };

  const getSuggestedRoutine = (profile) => {
    if (!profile?.goal) return null;
    const routine = ROUTINE_TEMPLATES[profile.goal] || ROUTINE_TEMPLATES['musculo'];
    if (!routine) return null;
    return { ...routine, isSuggested: true };
  };

  const openDoor = async () => {
    // Simular llamada a API de control de acceso
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Puerta abierta remotamente");
        resolve({ success: true });
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, settings, clients, diets, routines,
      registerClient, loginWithEmail, logout,
      updateProfile, activateMembership,
      updateClient, deleteClient,
      updateSettings,
      addDiet, updateDiet, deleteDiet,
      addRoutine, updateRoutine, deleteRoutine,
      getSuggestedDiet, getSuggestedRoutine,
      openDoor, getEvolutionHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
