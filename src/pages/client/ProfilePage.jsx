import React, { useState } from 'react';
import { Save, Check, User, Weight, Ruler, Calendar, Target, UploadCloud, Camera, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

const GOALS = [
  { value: 'perder_peso', label: 'Perder Peso', icon: '🔥', desc: 'Quema de grasa y definición' },
  { value: 'musculo', label: 'Ganar Músculo', icon: '💪', desc: 'Hipertrofia y volumen' },
  { value: 'resistencia', label: 'Resistencia', icon: '⚡', desc: 'Cardio y resistencia física' },
  { value: 'mantener', label: 'Mantener Peso', icon: '⚖️', desc: 'Mantenimiento y salud' },
  { value: 'rendimiento', label: 'Alto Rendimiento', icon: '🏆', desc: 'Competición y performance' },
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    weight: user?.profile?.weight || '',
    sex: user?.profile?.sex || '',
    height: user?.profile?.height || '',
    age: user?.profile?.age || '',
    goal: user?.profile?.goal || '',
    dietPreference: user?.profile?.dietPreference || 'carnivoro',
    avatar: user?.profile?.avatar || '',
  });

  const handleAvatarFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => setForm(f => ({ ...f, avatar: e.target.result }));
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarFile(e.target.files[0]);
    }
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-olympia-red focus:ring-1 focus:ring-olympia-red/40 transition-all text-sm";

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await updateProfile(form);
      if (res.success) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          navigate('/cliente');
        }, 1500);
      } else {
        setError(res.error || 'Ocurrió un error al guardar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 px-4 md:px-8 lg:px-16 pb-16">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8 p-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl">
          <div className="flex items-center gap-4 mb-2">
            {/* Avatar Upload */}
            <div className="relative group cursor-pointer w-20 h-20 shrink-0 rounded-full bg-black/40 border border-white/20 flex items-center justify-center overflow-hidden">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-olympia-red" />
              )}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-5xl font-bebas text-white tracking-widest leading-none">
                Mi Perfil
              </h1>
              
              <NavLink 
                to="/cliente/progreso"
                className="flex items-center gap-2 px-4 py-2 bg-olympia-red/10 border border-olympia-red/30 rounded-xl text-olympia-red text-[10px] font-bold uppercase tracking-widest hover:bg-olympia-red/20 transition-all group"
              >
                <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Ver Rendimiento Gráfico
              </NavLink>
            </div>
          </div>
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] mt-2">
            {user?.email} — Completá tus datos físicos para personalizar tu experiencia
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Preferencia Alimenticia */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bebas tracking-widest text-white">Preferencia Alimenticia</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { v: 'carnivoro', l: 'Carnívoro' },
                { v: 'celiaco', l: 'Celíaco' },
                { v: 'vegetariano', l: 'Vegetariano' },
                { v: 'vegano', l: 'Vegano' }
              ].map(d => (
                <button
                  key={d.v} type="button"
                  onClick={() => setForm(f => ({ ...f, dietPreference: d.v }))}
                  className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                    form.dietPreference === d.v
                      ? 'bg-olympia-red/10 border-olympia-red text-olympia-red shadow-[0_0_12px_rgba(220,38,38,0.2)]'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {d.l}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest text-center">
              Ajustaremos tus planes de comida según tu elección
            </p>
          </div>

          {/* Datos físicos */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bebas tracking-widest text-white">Datos físicos</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Sexo */}
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Sexo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: 'M', l: 'Masculino' }, { v: 'F', l: 'Femenino' }, { v: 'otro', l: 'Otro' }].map(s => (
                    <button
                      key={s.v} type="button"
                      onClick={() => setForm(f => ({ ...f, sex: s.v }))}
                      className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                        form.sex === s.v
                          ? 'bg-olympia-red/10 border-olympia-red text-olympia-red shadow-[0_0_12px_rgba(220,38,38,0.2)]'
                          : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {s.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Peso */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Weight className="w-3 h-3" /> Peso (kg)
                </label>
                <input
                  type="number" min="30" max="300" placeholder="Ej: 75"
                  value={form.weight}
                  onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Altura */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Ruler className="w-3 h-3" /> Altura (cm)
                </label>
                <input
                  type="number" min="100" max="250" placeholder="Ej: 175"
                  value={form.height}
                  onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Edad */}
              <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Edad (años)
                </label>
                <input
                  type="number" min="14" max="100" placeholder="Ej: 28"
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bebas tracking-widest text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-olympia-red" /> Mi Objetivo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map(g => (
                <button
                  key={g.value} type="button"
                  onClick={() => setForm(f => ({ ...f, goal: g.value }))}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    form.goal === g.value
                      ? 'bg-olympia-red/10 border-olympia-red shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${form.goal === g.value ? 'text-olympia-red' : 'text-white'}`}>
                      {g.label}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{g.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* IMC Preview */}
          {form.weight && form.height && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              {/* FORCE UPDATE 17:54 */}
              <p className="text-xs text-white uppercase tracking-widest mb-1 font-bold">Tu IMC (Índice de Masa Corporal) ESTIMADO</p>
              {(() => {
                const imc = (Number(form.weight) / Math.pow(Number(form.height) / 100, 2)).toFixed(1);
                const cat = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Normal ✓' : imc < 30 ? 'Sobrepeso' : 'Obesidad';
                return (
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bebas text-white">{imc}</span>
                    <span className="text-sm text-white/50">{cat}</span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Error alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={loading || saved}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${
              saved
                ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]'
                : loading
                  ? 'bg-white/5 text-white/40 cursor-wait'
                  : 'btn-spartan'
            }`}
          >
            {saved ? (
              <><Check className="w-4 h-4" /> Guardado!</>
            ) : loading ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Guardando...</>
            ) : (
              <><Save className="w-4 h-4" /> Guardar perfil</>
            )}
          </button>

          {!saved && !loading && (
            <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
              Se generará un registro histórico de tu evolución hoy
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
