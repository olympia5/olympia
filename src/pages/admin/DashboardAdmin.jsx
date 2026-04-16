import React, { useState, useEffect } from 'react';
import {
  Users, Settings, Image, Key, BarChart3,
  UserCheck, UserX, Trash2, Save, Edit3,
  DoorOpen, Instagram, Phone, Link2, Clock,
  Plus, Check, X, Eye, EyeOff, AlertTriangle, Quote, UploadCloud
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
    </div>
  );
};

// ========================
// Tab: Socios
// ========================
const MembersTab = ({ clients, updateClient, deleteClient }) => {
  const [search, setSearch] = useState('');
  const [editingNumber, setEditingNumber] = useState(null); // { id, value }
  const [errorStatus, setErrorStatus] = useState({ id: null, msg: '' });

  const filtered = clients.filter(c =>
    `${c.name} ${c.email} ${c.surname} ${c.member_number || c.memberNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateNumber = async (id, newValue) => {
    // Permitir 0 o vacío, solo retornar si es undefined o NaN (no numérico)
    if (newValue === undefined || newValue === null || (newValue !== '' && isNaN(newValue))) return;
    
    // Convertir a string para la base de datos
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
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, email o N° de socio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-olympia-red transition-all"
        />
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
                          title="Confirmar"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setEditingNumber(null)}
                          className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40 transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {errorStatus.id === c.id && (
                        <p className="text-[8px] text-red-500 font-bold uppercase">{errorStatus.msg}</p>
                      )}
                    </div>
                  ) : (
                     <div 
                       onClick={() => setEditingNumber({ id: c.id, value: c.member_number })}
                       className="flex items-center gap-2 cursor-pointer group/num"
                     >
                       <span className="text-sm font-bold text-olympia-red font-bebas tracking-widest">{c.member_number || '—'}</span>
                      <Edit3 className="w-3 h-3 text-white/10 group-hover/num:text-white/40 transition-colors" />
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                   <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{c.name || '—'} {c.surname || ''}</span>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest">Registrado: {new Date(c.created_at || c.createdAt).toLocaleDateString()}</span>
                   </div>
                </td>
                <td className="px-5 py-4 text-white/40 text-xs font-mono">{c.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border uppercase tracking-widest ${
                    c.status === 'active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : c.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {c.status === 'active' ? 'Activo' : (c.status === 'pending' ? 'Pendiente' : 'Vencido')}
                  </span>
                </td>
                <td className="px-5 py-4 text-white/50 text-xs whitespace-nowrap">
                  {(c.membership_end || c.membershipEnd) ? (
                    <div className="flex flex-col">
                      <span>{new Date(c.membership_end || c.membershipEnd).toLocaleDateString('es-AR')}</span>
                      <span className="text-[9px] uppercase opacity-40">Quedan {getDaysRemaining(c.membership_end || c.membershipEnd)} días</span>
                    </div>
                  ) : '—'}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {c.status === 'pending' ? (
                      <button
                        onClick={() => updateClient(c.id, { 
                          status: 'active',
                          membership_start: new Date().toISOString(),
                          membership_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                        })}
                        className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 transition-all shadow-[0_0_10px_rgba(22,163,74,0.3)]"
                      >
                        <UserCheck className="w-3 h-3" /> Aceptar Solicitud
                      </button>
                    ) : (
                      <button
                        onClick={() => updateClient(c.id, { status: c.status === 'active' ? 'expired' : 'active' })}
                        className={`p-2 rounded-xl transition-all ${
                          c.status === 'active'
                            ? 'text-yellow-400 hover:bg-yellow-500/10'
                            : 'text-green-400 hover:bg-green-500/10'
                        }`}
                        title={c.status === 'active' ? 'Suspender' : 'Activar'}
                      >
                        {c.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => { if (confirm(`¿Eliminar definitivamente a ${c.email}?`)) deleteClient(c.id); }}
                      className="p-2 rounded-xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-20 text-center text-white/10 uppercase font-bebas text-2xl tracking-widest">Sin resultados encontrados</td></tr>
            )}
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
    schedules: settings.schedules || []
  });

  // Sincronizar el formulario si los settings cambian (ej: al cargar de Supabase)
  useEffect(() => {
    setForm({
      ...settings,
      motivationalPhrases: settings.motivationalPhrases || [],
      schedules: settings.schedules || []
    });
  }, [settings]);

  const [saved, setSaved] = useState(false);
  const [savedIdentity, setSavedIdentity] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm({ ...form, gymLogo: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const res = await updateSettings(form);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Error al guardar: " + res.error);
    }
  };

  const handleSaveIdentity = async () => {
    const res = await updateSettings({ 
      gymName: form.gymName, 
      gymLogo: form.gymLogo 
    });
    if (res.success) {
      setSavedIdentity(true);
      setTimeout(() => setSavedIdentity(false), 2000);
    } else {
      alert("Error al guardar identidad: " + res.error);
    }
  };

  const updateSchedule = (i, field, value) => {
    const updated = form.schedules.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setForm({ ...form, schedules: updated });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Identidad */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
          <Image className="w-5 h-5 text-olympia-red" /> Identidad del Gimnasio
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Nombre del Gimnasio</label>
            <input
              value={form.gymName}
              onChange={e => setForm({ ...form, gymName: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-olympia-red"
              placeholder="OLYMPIA"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Logo del Gimnasio (Opcional)</label>
            <div
              className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all overflow-hidden ${
                dragActive
                  ? 'border-olympia-red bg-olympia-red/10'
                  : 'border-white/20 bg-black/40 hover:border-white/40 hover:bg-white/5'
              } ${form.gymLogo ? 'min-h-[160px]' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {form.gymLogo ? (
                <div className="absolute inset-0 w-full h-full pointer-events-none p-4 flex items-center justify-center bg-black/40">
                  <img src={form.gymLogo} alt="Logo Previsto" className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity">
                    <p className="text-white text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                      <UploadCloud className="w-5 h-5" /> Cambiar Logo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <UploadCloud className={`w-8 h-8 mx-auto mb-2 transition-colors ${dragActive ? 'text-olympia-red' : 'text-white/30'}`} />
                  <p className="text-sm text-white/70 font-bold">Arrastrá y soltá una imagen acá</p>
                  <p className="text-xs text-white/40 mt-1">O hacé click para seleccionar un archivo</p>
                </div>
              )}
            </div>
            {form.gymLogo && (
              <button
                type="button"
                onClick={() => setForm({ ...form, gymLogo: '' })}
                className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest mt-2 block"
              >
                Quitar Logo
              </button>
            )}
          </div>
          <div>
            <button
              onClick={handleSaveIdentity}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all w-full sm:w-auto ${
                savedIdentity
                  ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {savedIdentity ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {savedIdentity ? 'Confirmado' : 'Confirmar Identidad'}
            </button>
          </div>
        </div>
      </div>
      {/* Membresía */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-olympia-red" /> Membresía y Pagos
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Precio mensual</label>
            <input
              value={form.membershipPrice}
              onChange={e => setForm({ ...form, membershipPrice: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-olympia-red"
              placeholder="15000"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Moneda</label>
            <input
              value={form.membershipCurrency}
              onChange={e => setForm({ ...form, membershipCurrency: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-olympia-red"
              placeholder="ARS"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Link de MercadoPago</label>
          <input
            value={form.mercadoPagoLink}
            onChange={e => setForm({ ...form, mercadoPagoLink: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-olympia-red"
            placeholder="https://mpago.la/..."
          />
        </div>
      </div>

      {/* Redes sociales */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
          <Quote className="w-5 h-5 text-olympia-red" /> Frases Motivacionales
        </h3>
        <div className="space-y-2">
          {form.motivationalPhrases?.map((phrase, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={phrase}
                onChange={e => {
                  const newPhrases = [...(form.motivationalPhrases || [])];
                  newPhrases[i] = e.target.value;
                  setForm({ ...form, motivationalPhrases: newPhrases });
                }}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-olympia-red"
                placeholder="Frase motivacional"
              />
              <button
                onClick={() => {
                  const newPhrases = form.motivationalPhrases.filter((_, idx) => idx !== i);
                  setForm({ ...form, motivationalPhrases: newPhrases });
                }}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar frase"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setForm({ ...form, motivationalPhrases: [...(form.motivationalPhrases || []), ''] })}
            className="flex items-center gap-2 text-olympia-red text-sm font-bold mt-2 hover:text-red-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> Cargar Nueva Frase
          </button>
        </div>
      </div>

      {/* Redes sociales */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
          <Instagram className="w-5 h-5 text-olympia-red" /> Redes Sociales
        </h3>
        {[
          { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
          { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/...' },
          { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">{label}</label>
            <input
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-olympia-red"
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      {/* Horarios */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bebas tracking-widest text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-olympia-red" /> Horarios del Gimnasio
        </h3>
        <div className="space-y-3">
          {form.schedules && form.schedules.map((s, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-black/30 rounded-xl relative">
                <input 
                  value={s.day} 
                  onChange={e => updateSchedule(i, 'day', e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-olympia-red"
                  placeholder="Ej: Lunes a Viernes"
                />
                <input 
                  value={s.hours} 
                  onChange={e => updateSchedule(i, 'hours', e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-olympia-red"
                  placeholder="Ej: 08:00 - 22:00"
                />
              </div>
              <button
                onClick={() => {
                  const newSchedules = form.schedules.filter((_, idx) => idx !== i);
                  setForm({ ...form, schedules: newSchedules });
                }}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors self-center"
                title="Eliminar horario"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setForm({ 
              ...form, 
              schedules: [...(form.schedules || []), { day: '', hours: '' }] 
            })}
            className="flex items-center gap-2 text-olympia-red text-sm font-bold mt-2 hover:text-red-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> Cargar Nuevo Horario
          </button>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`btn-spartan px-8 ${saved ? 'bg-green-600 hover:bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.4)]' : ''}`}
      >
        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Guardado!' : 'Guardar cambios'}
      </button>
    </div>
  );
};

// ========================
// Tab: Control de Puerta
// ========================
const DoorTab = () => {
  const [status, setStatus] = useState('idle');

  const handleOpenDoor = () => {
    setStatus('opening');
    setTimeout(() => setStatus('open'), 1500);
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <div className="max-w-sm mx-auto text-center space-y-6 pt-8">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 transition-all duration-500 ${
        status === 'open'
          ? 'border-green-500 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.4)]'
          : status === 'opening'
            ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.4)]'
            : 'border-white/20 bg-white/5'
      }`}>
        <DoorOpen className={`w-16 h-16 transition-colors ${
          status === 'open' ? 'text-green-400' : status === 'opening' ? 'text-yellow-400' : 'text-white/40'
        }`} />
      </div>

      <div>
        <h3 className="text-3xl font-bebas tracking-widest text-white">
          {status === 'open' ? 'PUERTA ABIERTA' : status === 'opening' ? 'ABRIENDO...' : 'PUERTA PRINCIPAL'}
        </h3>
        <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
          {status === 'open' ? 'Acceso concedido por 5 segundos' : 'Acceso remoto al coliseo'}
        </p>
      </div>

      <button
        onClick={handleOpenDoor}
        disabled={status !== 'idle'}
        className={`btn-spartan w-full py-4 text-lg uppercase tracking-widest ${
          status !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <DoorOpen className="w-5 h-5" />
        {status === 'open' ? 'Abierta' : status === 'opening' ? 'Procesando...' : 'Abrir Puerta'}
      </button>
    </div>
  );
};

// ========================
// Componente principal
// ========================
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
    <div className="p-4 md:p-8 space-y-6 min-h-full">
      {/* Page header */}
      <div>
        <h1 className="text-5xl font-bebas text-white tracking-widest">Panel de Control</h1>
        <p className="text-xs text-white/30 uppercase tracking-[0.2em] mt-1">Gestión completa del coliseo</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'overview' && <OverviewTab clients={clients} />}
        {activeTab === 'members' && <MembersTab clients={clients} updateClient={updateClient} deleteClient={deleteClient} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} />}
        {activeTab === 'door' && <DoorTab />}
      </div>
    </div>
  );
};

export default DashboardAdmin;
