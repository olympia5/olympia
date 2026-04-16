import React, { createContext, useContext, useState, useEffect } from 'react';
import { DIET_TEMPLATES, ROUTINE_TEMPLATES, processDietText } from '../lib/plansLibrary';

const AuthContext = createContext(null);

// ---- Administradores (mock) ----
const ADMIN_USERS = [
  { email: 'pepito@pepito', password: 'contraseña123456', name: 'Pepito Admin', role: 'admin', id: 'admin-1' }
];

// ---- Frases motivacionales iniciales ----
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

// ---- Config por defecto ----
const DEFAULT_SETTINGS = {
  gymName: 'OLYMPIA',
  gymLogo: '',
  membershipPrice: '15000',
  membershipCurrency: 'ARS',
  mercadoPagoLink: 'https://mpago.la/olympia',
  instagram: 'https://instagram.com/olympiagym',
  whatsapp: 'https://wa.me/5491100000000',
  tiktok: 'https://tiktok.com/@olympiagym',
  motivationalPhrases: INITIAL_PHRASES,
  schedules: [
    { day: 'Lunes a Viernes', hours: '8:00 - 22:00' },
    { day: 'Sábados', hours: '9:00 - 14:00' },
    { day: 'Domingos', hours: 'CERRADO' },
    { day: 'Feriados', hours: '9:00 - 14:00' },
  ]
};

// ---- Clientes de prueba ----
const INITIAL_CLIENTS = [
  {
    id: 'client-test-1',
    email: 'socio@test.com',
    password: '123456',
    name: 'Socio Test',
    role: 'client',
    status: 'active',
    membershipStart: new Date().toISOString(),
    membershipEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    profile: { weight: '80', sex: 'M', height: '175', age: '28', goal: 'musculo', dietPreference: 'carnivoro' },
    memberNumber: 1001,
    createdAt: new Date().toISOString(),
  }
];

// ---- Helper: calcular días restantes ----
export const getDaysRemaining = (membershipEnd) => {
  if (!membershipEnd) return 0;
  const diff = Math.ceil((new Date(membershipEnd) - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

// ---- Helper: check si membresía expiró ----
const checkAndUpdateExpiredMemberships = (clients) => {
  const now = new Date();
  return clients.map(c => {
    if (c.status === 'active' && c.membershipEnd && new Date(c.membershipEnd) < now) {
      return { ...c, status: 'expired' };
    }
    return c;
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('olympia_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('olympia_clients');
      const parsed = saved ? JSON.parse(saved) : INITIAL_CLIENTS;
      return checkAndUpdateExpiredMemberships(parsed);
    } catch { return INITIAL_CLIENTS; }
  });

  const [diets, setDiets] = useState(() => {
    try {
      const saved = localStorage.getItem('olympia_diets');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [routines, setRoutines] = useState(() => {
    try {
      const saved = localStorage.getItem('olympia_routines');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ---- Cargar sesión guardada ----
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('olympia_auth');
      if (savedAuth) {
        const savedUser = JSON.parse(savedAuth);
        if (savedUser.role === 'client') {
          const fresh = clients.find(c => c.id === savedUser.id);
          if (fresh) {
            const { password: _, ...safeClient } = fresh;
            setUser(safeClient);
          } else {
            setUser(savedUser);
          }
        } else {
          setUser(savedUser);
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // ---- Migración: Asegurar números de socio a existentes ----
  useEffect(() => {
    if (clients.length > 0 && clients.some(c => !c.memberNumber)) {
      let maxNum = Math.max(1000, ...clients.filter(c => c.memberNumber).map(c => c.memberNumber));
      const updated = clients.map(c => {
        if (!c.memberNumber) {
          maxNum++;
          return { ...c, memberNumber: maxNum };
        }
        return c;
      });
      saveClients(updated);
    }
  }, [clients]);

  // ---- Sincronizar clientes a localStorage ----
  const saveClients = (updated) => {
    setClients(updated);
    localStorage.setItem('olympia_clients', JSON.stringify(updated));
  };

  const saveDiets = (updatedDiets) => {
    setDiets(updatedDiets);
    localStorage.setItem('olympia_diets', JSON.stringify(updatedDiets));
  };

  const saveRoutines = (updatedRoutines) => {
    setRoutines(updatedRoutines);
    localStorage.setItem('olympia_routines', JSON.stringify(updatedRoutines));
  };

  // ---- REGISTRO de nuevo socio ----
  const registerClient = (email, password) => {
    if (!email.trim() || !password.trim()) return { success: false, error: 'Email y contraseña requeridos' };
    if (password.length < 6) return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    if (clients.find(c => c.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Ya existe una cuenta con ese email' };
    }
    const newClient = {
      id: `client-${Date.now()}`,
      email: email.trim().toLowerCase(),
      password: password,
      name: email.split('@')[0],
      role: 'client',
      status: 'pending',
      membershipStart: null,
      membershipEnd: null,
      profile: { weight: '', sex: '', height: '', age: '', goal: '', dietPreference: 'carnivoro' },
      memberNumber: Math.max(1000, ...clients.map(c => c.memberNumber || 0)) + 1,
      createdAt: new Date().toISOString(),
    };
    const updated = [...clients, newClient];
    saveClients(updated);
    const { password: _, ...safeClient } = newClient;
    setUser(safeClient);
    localStorage.setItem('olympia_auth', JSON.stringify(safeClient));
    return { success: true };
  };

  // ---- LOGIN por email+contraseña ----
  const loginWithEmail = (email, password) => {
    const admin = ADMIN_USERS.find(u => u.email === email && u.password === password);
    if (admin) {
      const { password: _, ...safeAdmin } = admin;
      setUser(safeAdmin);
      localStorage.setItem('olympia_auth', JSON.stringify(safeAdmin));
      return { success: true, role: 'admin' };
    }
    const client = clients.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
    if (client) {
      const { password: _, ...safeClient } = client;
      setUser(safeClient);
      localStorage.setItem('olympia_auth', JSON.stringify(safeClient));
      return { success: true, role: 'client' };
    }
    return { success: false, error: 'Email o contraseña incorrectos' };
  };

  // ---- LOGOUT ----
  const logout = () => {
    setUser(null);
    localStorage.removeItem('olympia_auth');
  };

  // ---- Actualizar perfil ----
  const updateProfile = (profileData) => {
    if (!user || user.role !== 'client') return;
    const updated = clients.map(c =>
      c.id === user.id ? { ...c, profile: { ...c.profile, ...profileData } } : c
    );
    saveClients(updated);
    const fresh = updated.find(c => c.id === user.id);
    const { password: _, ...safeClient } = fresh;
    setUser(safeClient);
    localStorage.setItem('olympia_auth', JSON.stringify(safeClient));
  };

  // ---- Activar membresía ----
  const activateMembership = () => {
    if (!user || user.role !== 'client') return;
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    const updated = clients.map(c =>
      c.id === user.id
        ? { ...c, status: 'active', membershipStart: now.toISOString(), membershipEnd: end.toISOString() }
        : c
    );
    saveClients(updated);
    const fresh = updated.find(c => c.id === user.id);
    const { password: _, ...safeClient } = fresh;
    setUser(safeClient);
    localStorage.setItem('olympia_auth', JSON.stringify(safeClient));
    return { membershipEnd: end.toISOString() };
  };

  // ---- Admin: gestión ----
  const updateClient = (id, updates) => {
    // Si se está intentando cambiar el número de socio, validar unicidad
    if (updates.memberNumber) {
      const num = parseInt(updates.memberNumber);
      const exists = clients.find(c => c.memberNumber === num && c.id !== id);
      if (exists) return { success: false, error: 'Ese número de socio ya está asignado' };
      updates.memberNumber = num;
    }

    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c);
    saveClients(updated);
    return { success: true };
  };

  const deleteClient = (id) => {
    saveClients(clients.filter(c => c.id !== id));
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('olympia_settings', JSON.stringify(updated));
  };

  const addDiet = (dietData) => {
    const newDiet = { ...dietData, id: Date.now() };
    saveDiets([...diets, newDiet]);
  };

  const deleteDiet = (id) => {
    saveDiets(diets.filter(d => d.id !== id));
  };

  const updateDiet = (id, updatedData) => {
    const updated = diets.map(d => d.id === id ? { ...d, ...updatedData } : d);
    saveDiets(updated);
  };

  const addRoutine = (routineData) => {
    const newRoutine = { ...routineData, id: Date.now() };
    saveRoutines([...routines, newRoutine]);
  };

  const deleteRoutine = (id) => {
    saveRoutines(routines.filter(r => r.id !== id));
  };

  const updateRoutine = (id, updatedData) => {
    const updated = routines.map(r => r.id === id ? { ...r, ...updatedData } : r);
    saveRoutines(updated);
  };

  const getSuggestedDiet = (profile) => {
    if (!profile?.goal || !profile?.dietPreference) return null;
    const goalPlans = DIET_TEMPLATES[profile.goal];
    if (!goalPlans) return null;
    
    const basePlan = goalPlans[profile.dietPreference] || goalPlans['carnivoro'];
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
      updateSettings, addDiet, deleteDiet, updateDiet,
      addRoutine, deleteRoutine, updateRoutine,
      getSuggestedDiet, getSuggestedRoutine,
      openDoor
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
