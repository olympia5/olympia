import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn, AlertCircle, Swords, Mail, Lock, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccessPortal = () => {
  const navigate = useNavigate();
  const { loginWithEmail, registerClient, user, loading, settings } = useAuth();

  // 'login' | 'register'
  const [view, setView] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Reset al cambiar de vista
  useEffect(() => {
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [view]);

  // Redirigir si ya está autenticado (después de todos los hooks)
  if (!loading && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/cliente'} replace />;
  }

  // ---- Submit Login ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const result = await loginWithEmail(cleanEmail, password);
    setSubmitting(false);
    if (result.success) {
      window.location.href = '/'; 
    } else {
      setError(result.error);
    }
  };

  // ---- Submit Registro ----
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setSubmitting(true);
    const result = await registerClient(email.trim(), password);
    setSubmitting(false);
    if (result.success) {
      navigate('/cliente');
    } else {
      setError(result.error);
    }
  };

  // ---- Shared input class ----
  const inputClass = "w-full bg-black/40 border border-olympia-border rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-olympia-red focus:ring-1 focus:ring-olympia-red/40 transition-all text-sm";

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="relative bg-olympia-card/60 backdrop-blur-xl w-full max-w-md rounded-2xl border border-olympia-border shadow-2xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-olympia-red via-red-400 to-olympia-red" />

        <div className="p-8">

          {/* ==== LOGO ==== */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {settings?.gymLogo ? (
                <img src={settings.gymLogo} alt={settings?.gymName || 'Gimnasio'} className="h-24 max-w-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
              ) : (
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-olympia-red/10 border border-olympia-red/30 animate-pulse" />
                  <Swords className="w-8 h-8 text-olympia-red drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                </div>
              )}
            </div>
            {(!settings?.gymLogo || settings?.gymName) && (
              <h1 className="text-6xl font-bebas uppercase tracking-widest text-white">{settings?.gymName || 'Olympia'}</h1>
            )}
            <p className="text-xs text-olympia-muted tracking-[0.4em] font-light mt-1 uppercase">Santuario del Guerrero</p>
          </div>

          {/* ==== TAB SWITCHER ==== */}
          <div className="flex rounded-xl bg-black/40 border border-olympia-border/30 p-1 mb-6">
            <button
              onClick={() => setView('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                view === 'login'
                  ? 'bg-olympia-red text-white shadow-[0_0_12px_rgba(220,38,38,0.35)]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Ingresar
            </button>
            <button
              onClick={() => setView('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                view === 'register'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Hacete Socio
            </button>
          </div>

          {/* ==== ERROR ==== */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ==== LOGIN FORM ==== */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-olympia-muted ml-1 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input
                  type="email" required autoFocus
                  className={inputClass}
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-olympia-muted ml-1 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    className={inputClass + ' pr-12'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={submitting}
                className="btn-spartan w-full py-4 text-sm uppercase tracking-[0.2em] mt-2"
              >
                <LogIn className="w-4 h-4" />
                {submitting ? 'Verificando...' : 'Ingresar al Coliseo'}
              </button>

              <p className="text-center text-xs text-white/30 pt-2">
                ¿Aún no sos socio?{' '}
                <button type="button" onClick={() => setView('register')} className="text-olympia-red hover:text-red-400 font-bold transition-colors">
                  Registrate gratis
                </button>
              </p>
            </form>
          )}

          {/* ==== REGISTER FORM ==== */}
          {view === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-olympia-red/5 border border-olympia-red/20 rounded-xl px-4 py-3 mb-2">
                <p className="text-xs text-white/60 leading-relaxed">
                  Creá tu cuenta con email y contraseña. Luego completás tu perfil y activás tu membresía para acceder a todos los beneficios.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-olympia-muted ml-1 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input
                  type="email" required autoFocus
                  className={inputClass}
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-olympia-muted ml-1 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required minLength={6}
                    className={inputClass + ' pr-12'}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-olympia-muted ml-1 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Confirmá tu contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'} required
                  className={inputClass + (confirmPassword && confirmPassword !== password ? ' border-red-500/50' : '')}
                  placeholder="Repetí la contraseña"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[10px] text-red-400 ml-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <button
                type="submit" disabled={submitting || (confirmPassword && confirmPassword !== password)}
                className="btn-spartan w-full py-4 text-sm uppercase tracking-[0.2em] mt-2"
              >
                <UserPlus className="w-4 h-4" />
                {submitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
              </button>

              <p className="text-center text-xs text-white/30 pt-2">
                ¿Ya tenés cuenta?{' '}
                <button type="button" onClick={() => setView('login')} className="text-olympia-red hover:text-red-400 font-bold transition-colors">
                  Iniciá sesión
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessPortal;
