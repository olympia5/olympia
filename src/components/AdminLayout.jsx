import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Settings, Image, LogOut,
  Shield, ChevronRight, Menu, X, Utensils, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', end: true },
  { to: '/admin/dietas', icon: <Utensils className="w-4 h-4" />, label: 'Dietas', end: false },
  { to: '/admin/rutinas', icon: <Activity className="w-4 h-4" />, label: 'Rutinas', end: false },
];

const AdminLayout = () => {
  const { user, settings, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/acceso');
  };

  return (
    <div className="flex h-screen bg-black/80 text-white overflow-hidden">

      {/* ===== ADMIN SIDEBAR (desktop) ===== */}
      <aside className="hidden md:flex flex-col w-60 bg-black/70 backdrop-blur-xl border-r border-white/10 shrink-0">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            {settings?.gymLogo ? (
              <img src={settings.gymLogo} alt="Logo" className="h-10 max-w-[140px] object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            ) : (
              <Shield className="w-6 h-6 text-olympia-red drop-shadow-[0_0_6px_rgba(220,38,38,0.6)]" />
            )}
            {(!settings?.gymLogo || settings?.gymName) && (
              <span className="text-2xl font-bebas text-white tracking-widest">{settings?.gymName || 'OLYMPIA'}</span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-olympia-red font-bold">Panel Admin</span>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-wider">Conectado como</p>
          <p className="text-sm font-bold text-white mt-0.5">{user?.name}</p>
        </div>

        {/* Navigation (links pass as tabs in DashboardAdmin) */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-olympia-red/10 text-olympia-red border border-olympia-red/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.icon}
              {link.label}
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ===== MOBILE TOPBAR ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          {settings?.gymLogo ? (
            <img src={settings.gymLogo} alt="Logo" className="h-6 object-contain" />
          ) : (
            <Shield className="w-4 h-4 text-olympia-red" />
          )}
          <span className="text-xl font-bebas tracking-widest">{settings?.gymName || 'ADMIN'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 pt-14 px-4 py-4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/50 hover:text-white mt-4">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
