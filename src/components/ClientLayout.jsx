import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Activity, Utensils, Clock, Image, Phone, CreditCard, Menu, X, LogOut, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/cliente', icon: <Home className="w-4 h-4" />, label: 'Inicio', end: true },
  { to: '/cliente/rutina', icon: <Activity className="w-4 h-4" />, label: 'Rutina' },
  { to: '/cliente/dieta', icon: <Utensils className="w-4 h-4" />, label: 'Dieta' },
  { to: '/cliente/horarios', icon: <Clock className="w-4 h-4" />, label: 'Horarios' },
  { to: '/cliente/contacto', icon: <Phone className="w-4 h-4" />, label: 'Contacto' },
  { to: '/cliente/tutoriales', icon: <Video className="w-4 h-4" />, label: 'Tutoriales' },
];

const ClientLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, settings, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/acceso');
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* ===== TOP NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink to="/cliente" className="flex items-center gap-2 text-3xl font-bebas text-olympia-red tracking-widest uppercase leading-none">
              {settings?.gymLogo ? (
                <img src={settings.gymLogo} alt={settings.gymName} className="h-8 max-w-[120px] object-contain" />
              ) : null}
              {(!settings?.gymLogo || settings?.gymName) && <span>{settings?.gymName || 'OLYMPIA'}</span>}
            </NavLink>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-olympia-red drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]'
                        : 'text-white/70 hover:text-white'
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <NavLink to="/cliente/perfil" className="flex items-center gap-2 text-xs text-white/40 hover:text-white uppercase tracking-wider hidden lg:flex transition-colors">
                {user?.profile?.avatar ? (
                  <img src={user.profile.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-white/20" />
                ) : null}
                <span>{user?.name}</span>
              </NavLink>
              <NavLink
                to="/cliente/membresia"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'bg-olympia-red text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                      : 'btn-spartan py-2'
                  }`
                }
              >
                <CreditCard className="w-3.5 h-3.5" />
                Membresía
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-white/30 hover:text-white/80 transition-colors p-1"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-3">
              <NavLink to="/cliente/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-7 h-7 rounded-full bg-white/95 p-0.5 border border-white/20 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  {settings?.gymLogo ? (
                    <img src={settings.gymLogo} alt="Avatar" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-black font-bold">O</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em]">{user?.name?.split(' ')[0] || 'Socio'}</span>
              </NavLink>

              <button
                className="text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-olympia-red/10 text-olympia-red border border-olympia-red/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/cliente/membresia"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-spartan w-full mt-3 text-sm uppercase tracking-widest"
            >
              <CreditCard className="w-4 h-4" />
              Membresía
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm text-white/40 hover:text-white transition-colors mt-2 border-t border-white/10 pt-4"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
