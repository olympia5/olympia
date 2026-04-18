import React, { useState, useEffect } from 'react';
import {
  Users, Settings, Image as ImageIcon, Key, BarChart3,
  UserCheck, UserX, Trash2, Save, Edit3,
  DoorOpen, Instagram, Phone, Link2, Clock,
  Plus, Check, X, Eye, EyeOff, AlertTriangle, Quote, UploadCloud, Award
} from 'lucide-react';
import { useAuth, getDaysRemaining } from '../../context/AuthContext';

// ========================
// Subcomponente de tab activo
// ========================
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
      active
        ? 'bg-olympia-red text-white shadow-[0_0_15px_rgba(220,38,38,0.35)]'
        : 'text-white/50 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    {label}
  </button>
);

// ========================
// Tab: Overview / Dashboard
// ========================
const OverviewTab = ({ clients }) => {
  const active = clients.filter(c => c.status === 'active').length;
  const expired = clients.filter(c => c.status === 'expired').length;

  const stats = [
    { label: 'Socios Activos', value: active, color: 'text-green-400', bg: 'border-green-500/20 bg-green-500/5' },
    { label: 'Cuotas Vencidas', value: expired, color: 'text-red-400', bg: 'border-red-500/20 bg-red-500/5' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">{s.label}</p>
            <p className={`text-4xl font-bebas tracking-widest ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Últimos registros */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bebas tracking-widest text-white mb-4">Últimos Socios Registrados</h3>
          <div className="space-y-2">
            {clients.slice(-5).reverse().map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white">{c.name || c.email} {c.surname || ''}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  c.status === 'active'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {c.status === 'active' ? 'Activo' : 'Vencido'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Podio de Guerreros (Placeholder) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bebas tracking-widest text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-olympia-red" />
              Podio de Guerreros (Asistencia)
            </h3>
            
            <div className="flex items-end justify-around h-40 gap-2 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 uppercase mb-2">Marcos R.</span>
                <div className="w-16 bg-white/10 border-t-2 border-white/20 h-20 flex items-center justify-center relative">
                  <span className="font-bebas text-2xl text-white/20">2</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <Award className="w-6 h-6 text-yellow-500 mb-1 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                <span className="text-xs font-bold text-white uppercase mb-2 underline decoration-olympia-red underline-offset-4">Julián G.</span>
                <div className="w-20 bg-olympia-red/20 border-t-2 border-olympia-red h-28 flex items-center justify-center relative">
                  <span className="font-bebas text-4xl text-white/40">1</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/40 uppercase mb-2">Elena V.</span>
                <div className="w-16 bg-white/5 border-t-2 border-white/10 h-14 flex items-center justify-center relative">
                  <span className="font-bebas text-xl text-white/20">3</span>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-center text-white/20 uppercase tracking-[0.2em] mt-6">Ranking del mes actual — Basado en check-ins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================
// Tab: Socios
// ========================
const MembersTab = ({ clients, updateClient, deleteClient }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingNumber, setEditingNumber] = useState(null);
  const [errorStatus, setErrorStatus] = useState({ id: null, msg: '' });

  const filtered = clients.filter(c => {
    const matchesSearch = `${c.name} ${c.email} ${c.surname} ${c.member_number}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateNumber = async (id, newValue) => {
    if (newValue === undefined || newValue === null || (newValue !== '' && isNaN(newValue))) return;
    const res = await updateClient(id, { member_number: newValue.toString() });
    if (res.success) {
      setEditingNumber(null);
      setErrorStatus({ id: null, msg: '' });
    } else {
      setErrorStatus({ id, msg: res.error });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Buscar por nombre, email o N° de socio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-olympia-red transition-all"
          />
        </div>
        
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'active', label: 'Activos' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'expired', label: 'Vencidos' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                statusFilter === f.id
                  ? 'bg-olympia-red text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-5 py-5">N°</th>
              <th className="px-5 py-5">Socio</th>
              <th className="px-5 py-5">Email</th>
              <th className="px-5 py-5">Estado</th>
              <th className="px-5 py-5">Vencimiento</th>
              <th className="px-5 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-5 py-4">
                  {editingNumber?.id === c.id ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <input 
                          type="number"
                          autoFocus
                          value={editingNumber.value}
                          onChange={e => setEditingNumber({ ...editingNumber, value: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleUpdateNumber(c.id, editingNumber.value);
                            if (e.key === 'Escape') setEditingNumber(null);
                          }}
                          className="w-16 bg-black/60 border border-olympia-red/50 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-olympia-red"
                        />
                        <button 
                          onClick={() => handleUpdateNumber(c.id, editingNumber.value)}
                          className="p-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                     <div onClick={() => setEditingNumber({ id: c.id, value: c.member_number })} className="flex items-center gap-2 cursor-pointer">
                       <span className="text-sm font-bold text-olympia-red font-bebas tracking-widest">{c.member_number || '—'}</span>
                       <Edit3 className="w-3 h-3 text-white/10 group-hover:text-white/40" />
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-white text-sm font-bold">{c.name || '—'} {c.surname || ''}</td>
                <td className="px-5 py-4 text-white/40 text-xs">{c.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border uppercase tracking-widest ${
                    c.status === 'active' ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'
                  }`}>
                    {c.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-5 py-4 text-white/50 text-xs">{(c.membership_end || c.membershipEnd) ? new Date(c.membership_end || c.membershipEnd).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => updateClient(c.id, { status: c.status === 'active' ? 'expired' : 'active' })} className="p-2 text-white/40 hover:text-white">
                      {c.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { if (confirm('¿Eliminar?')) deleteClient(c.id); }} className="p-2 text-white/20 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ========================
// Tab: Configuración del sitio
// ========================
const SettingsTab = ({ settings, updateSettings }) => {
  const [form, setForm] = useState({ 
    ...settings,
    motivationalPhrases: settings.motivationalPhrases || [],
    schedules: settings.schedules || [],
    socialLinks: settings.socialLinks || []
  });

  // Solo sincronizar con los settings cargados si el form está vacío (inicialización)
  useEffect(() => {
    if (settings && (form.socialLinks.length === 0 && settings.socialLinks?.length > 0)) {
       setForm(prev => ({ 
         ...prev, 
         ...settings,
         motivationalPhrases: settings.motivationalPhrases || prev.motivationalPhrases,
         schedules: settings.schedules || prev.schedules,
         socialLinks: settings.socialLinks || prev.socialLinks
       }));
    }
  }, [settings]);

  const [saved, setSaved] = useState(false);
  const [savedIdentity, setSavedIdentity] = useState(false);
  const [dragActive, setDragActive] = useState(null);

  const handleFile = (file, field) => {
    const reader = new FileReader();
    reader.onload = (e) => setForm(prev => ({ ...prev, [field]: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveIdentity = async () => {
    const res = await updateSettings({ gymName: form.gymName, gymLogo: form.gymLogo, appIcon: form.appIcon });
    if (res.success) {
      setSavedIdentity(true);
      setTimeout(() => setSavedIdentity(false), 2000);
    }
  };

  const handleSaveAll = async () => {
    const res = await updateSettings(form);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* SECCION IDENTIDAD */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-olympia-red" /> Identidad del Gimnasio
        </h3>
        
        <div className="space-y-4">
          {/* 1. Nombre */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Nombre del Gimnasio</label>
            <input
              value={form.gymName}
              onChange={e => setForm({ ...form, gymName: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-olympia-red outline-none"
            />
          </div>

          {/* 2. Logo */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Logo del Gimnasio</label>
            <div 
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${dragActive === 'logo' ? 'border-olympia-red bg-olympia-red/10' : 'border-white/10'}`}
              onDragOver={e => { e.preventDefault(); setDragActive('logo'); }}
              onDragLeave={() => setDragActive(null)}
              onDrop={e => { e.preventDefault(); setDragActive(null); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], 'gymLogo'); }}
            >
              <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleFile(e.target.files[0], 'gymLogo')} className="absolute inset-0 opacity-0 cursor-pointer" />
              {form.gymLogo ? (
                <img src={form.gymLogo} className="max-h-20 mx-auto" alt="Logo" />
              ) : (
                <div className="text-center text-white/20">
                  <UploadCloud className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs uppercase font-bold">Subir Logo</p>
                </div>
              )}
            </div>
            {form.gymLogo && <button onClick={() => setForm({...form, gymLogo: ''})} className="text-[10px] text-red-500 mt-1 uppercase">Eliminar Logo</button>}
          </div>

          {/* 3. Icono App (PWA) - ACA ESTA EL PROBLEMA? */}
          <div className="pt-2 border-t border-white/5">
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block font-bold text-olympia-red">Icono de la App (Cargar aquí para el celular)</label>
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${dragActive === 'appIcon' ? 'border-olympia-red bg-olympia-red/10' : 'border-white/10 bg-olympia-red/5'}`}
              onDragOver={e => { e.preventDefault(); setDragActive('appIcon'); }}
              onDragLeave={() => setDragActive(null)}
              onDrop={e => { e.preventDefault(); setDragActive(null); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], 'appIcon'); }}
            >
              <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleFile(e.target.files[0], 'appIcon')} className="absolute inset-0 opacity-0 cursor-pointer" />
              {form.appIcon ? (
                <img src={form.appIcon} className="max-h-20 mx-auto rounded-xl shadow-lg" alt="App Icon" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 text-olympia-red animate-pulse" />
                  <p className="text-sm text-white font-bold uppercase tracking-widest">Cargar Icono de la App</p>
                  <p className="text-[10px] text-white/40 mt-1">Este icono es el que se verá al instalar la app</p>
                </div>
              )}
            </div>
            {form.appIcon && <button onClick={() => setForm({...form, appIcon: ''})} className="text-[10px] text-red-500 mt-1 uppercase">Eliminar Icono</button>}
          </div>

          <button onClick={handleSaveIdentity} className="btn-spartan py-2.5 px-6">
            {savedIdentity ? '¡Guardado!' : 'Confirmar Identidad'}
          </button>
        </div>
      </div>

      {/* SECCIÓN REDES SOCIALES */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-olympia-red" /> Redes Sociales
          </h3>
          <button 
            onClick={() => setForm({ ...form, socialLinks: [...form.socialLinks, { name: '', url: '' }] })}
            className="text-xs text-olympia-red hover:text-white transition-colors flex items-center gap-1 uppercase font-bold"
          >
            <Plus className="w-3 h-3" /> Añadir Red
          </button>
        </div>
        
        <div className="space-y-3">
          {form.socialLinks.map((link, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 bg-black/20 p-3 rounded-xl border border-white/5 group">
              <div className="col-span-4">
                <input
                  placeholder="Nombre (Ej: Instagram)"
                  value={link.name}
                  onChange={e => {
                    const newL = [...form.socialLinks];
                    newL[idx].name = e.target.value;
                    setForm({ ...form, socialLinks: newL });
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div className="col-span-7">
                <input
                  placeholder="URL o Link"
                  value={link.url}
                  onChange={e => {
                    const newL = [...form.socialLinks];
                    newL[idx].url = e.target.value;
                    setForm({ ...form, socialLinks: newL });
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button 
                  onClick={() => {
                    const newL = form.socialLinks.filter((_, i) => i !== idx);
                    setForm({ ...form, socialLinks: newL });
                  }}
                  className="p-1.5 text-white/10 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {form.socialLinks.length === 0 && <p className="text-center py-4 text-white/20 text-xs italic">Carga tus redes sociales para que aparezcan en el contacto.</p>}
        </div>
      </div>

      {/* SECCIÓN HORARIOS */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-olympia-red" /> Horarios de Apertura
          </h3>
          <button 
            onClick={() => setForm({ ...form, schedules: [...form.schedules, { day: '', hours: '', activities: '' }] })}
            className="text-xs text-olympia-red hover:text-white transition-colors flex items-center gap-1 uppercase font-bold"
          >
            <Plus className="w-3 h-3" /> Añadir Horario
          </button>
        </div>
        
        <div className="space-y-3">
          {form.schedules.map((s, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 bg-black/20 p-3 rounded-xl border border-white/5 relative group">
              <div className="col-span-5">
                <input
                  placeholder="Día (Lun-Vie)"
                  value={s.day}
                  onChange={e => {
                    const newS = [...form.schedules];
                    newS[idx].day = e.target.value;
                    setForm({ ...form, schedules: newS });
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div className="col-span-6">
                <input
                  placeholder="Horas (08:00 - 22:00)"
                  value={s.hours}
                  onChange={e => {
                    const newS = [...form.schedules];
                    newS[idx].hours = e.target.value;
                    setForm({ ...form, schedules: newS });
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button 
                  onClick={() => {
                    const newS = form.schedules.filter((_, i) => i !== idx);
                    setForm({ ...form, schedules: newS });
                  }}
                  className="p-1.5 text-white/10 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {form.schedules.length === 0 && <p className="text-center py-4 text-white/20 text-xs italic">Carga los horarios para que los socios los vean en la app.</p>}
        </div>
      </div>

      {/* SECCIÓN FRASES */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-olympia-red" /> Frases Motivacionales
          </h3>
          <button 
            onClick={() => setForm({ ...form, motivationalPhrases: [...form.motivationalPhrases, ''] })}
            className="text-xs text-olympia-red hover:text-white transition-colors flex items-center gap-1 uppercase font-bold"
          >
            <Plus className="w-3 h-3" /> Añadir Frase
          </button>
        </div>
        
        <div className="space-y-3">
          {form.motivationalPhrases.map((phrase, idx) => (
            <div key={idx} className="flex gap-2 group">
              <input
                value={phrase}
                onChange={e => {
                  const newP = [...form.motivationalPhrases];
                  newP[idx] = e.target.value;
                  setForm({ ...form, motivationalPhrases: newP });
                }}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                placeholder="Escribe una frase guerrera..."
              />
              <button 
                onClick={() => {
                  const newP = form.motivationalPhrases.filter((_, i) => i !== idx);
                  setForm({ ...form, motivationalPhrases: newP });
                }}
                className="p-2 text-white/10 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {form.motivationalPhrases.length === 0 && <p className="text-center py-4 text-white/20 text-xs italic">Agrega frases para inspirar a tus socios cada día.</p>}
        </div>
      </div>

      {/* Otras secciones simplificadas */}
      <button onClick={handleSaveAll} className="btn-spartan w-full py-4 text-lg">
        {saved ? 'Cambios Guardados' : 'Guardar Todos los Cambios'}
      </button>
    </div>
  );
};

// ========================
// Tab: Control de Puerta
// ========================
const DoorTab = () => {
  const [status, setStatus] = useState('idle');
  const handleOpenDoor = () => { setStatus('opening'); setTimeout(() => setStatus('open'), 1500); setTimeout(() => setStatus('idle'), 4000); };

  return (
    <div className="max-w-sm mx-auto text-center space-y-6 pt-8">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 ${status === 'open' ? 'border-green-500' : 'border-white/20'}`}>
        <DoorOpen className="w-16 h-16 text-white/40" />
      </div>
      <button onClick={handleOpenDoor} disabled={status !== 'idle'} className="btn-spartan w-full py-4">Abrir Puerta</button>
    </div>
  );
};

const DashboardAdmin = () => {
  const { clients, settings, updateSettings, updateClient, deleteClient } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', icon: <BarChart3 className="w-4 h-4" />, label: 'Overview' },
    { id: 'members', icon: <Users className="w-4 h-4" />, label: 'Socios' },
    { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'Configuración' },
    { id: 'door', icon: <Key className="w-4 h-4" />, label: 'Puerta' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 min-h-screen">
      <h1 className="text-5xl font-bebas text-white tracking-widest">Panel de Control</h1>
      
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} label={tab.label} />
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab clients={clients} />}
        {activeTab === 'members' && <MembersTab clients={clients} updateClient={updateClient} deleteClient={deleteClient} />}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
             <SettingsTab settings={settings} updateSettings={updateSettings} />
          </div>
        )}
        {activeTab === 'door' && <DoorTab />}
      </div>
    </div>
  );
};

export default DashboardAdmin;
