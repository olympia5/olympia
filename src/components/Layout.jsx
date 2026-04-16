import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Activity, Utensils, Video, LogOut, Users, Key } from 'lucide-react';

const Layout = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí limpiaremos los datos persistentes
    localStorage.removeItem('olympia_client_token');
    navigate('/acceso');
  };

  const clientLinks = [
    { to: "/cliente", icon: <Home className="w-6 h-6" />, label: "Inicio" },
    { to: "/cliente/rutina", icon: <Activity className="w-6 h-6" />, label: "Rutina" },
    { to: "/cliente/dieta", icon: <Utensils className="w-6 h-6" />, label: "Dieta" },
  ];

  const adminLinks = [
    { to: "/admin", icon: <Users className="w-6 h-6" />, label: "Usuarios" },
    { to: "/admin/puerta", icon: <Key className="w-6 h-6" />, label: "Apertura" },
    { to: "/admin/galeria", icon: <Video className="w-6 h-6" />, label: "Galería" },
  ];

  const links = role === 'admin' ? adminLinks : clientLinks;

  return (
    <div className="flex h-screen bg-transparent text-olympia-text overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-olympia-border bg-olympia-card/40 backdrop-blur-md">
        <div className="p-6">
          <h1 className="text-3xl font-bebas text-olympia-red tracking-wider uppercase">Olympia</h1>
          <p className="text-xs text-olympia-muted uppercase tracking-widest mt-1">Santuario Fitness</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/cliente' || link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? "bg-olympia-red/10 text-olympia-red border border-olympia-red/20" 
                    : "text-olympia-muted hover:bg-olympia-border hover:text-white"
                }`
              }
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-olympia-border">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-olympia-muted hover:text-white hover:bg-olympia-border rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 relative overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-olympia-card/90 backdrop-blur-md border-t border-olympia-border z-50">
        <div className="flex justify-around p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/cliente' || link.to === '/admin'}
              className={({ isActive }) =>
                `flex flex-col items-center flex-1 p-2 ${
                  isActive ? "text-olympia-red" : "text-olympia-muted"
                }`
              }
            >
              {link.icon}
              <span className="text-[10px] uppercase font-bold mt-1 max-w-[60px] truncate">{link.label}</span>
            </NavLink>
          ))}
          <button onClick={handleLogout} className="flex flex-col items-center flex-1 p-2 text-olympia-muted">
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold mt-1">Salir</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
