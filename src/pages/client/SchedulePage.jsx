import React from 'react';
import { Clock, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SchedulePage = () => {
  const { settings } = useAuth();
  const { schedules = [] } = settings;

  return (
    <div className="min-h-screen pt-8 px-4 md:px-8 lg:px-16 pb-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 p-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl">
          <h1 className="text-6xl font-bebas text-white tracking-widest flex items-center gap-3">
            <Clock className="w-12 h-12 text-olympia-red" />
            Horarios
          </h1>
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] mt-2">Abertura del Coliseo</p>
        </div>

        {/* Schedule cards */}
        <div className="grid gap-4">
          {schedules.map((s, i) => (
            <div
              key={i}
              className="group bg-black/30 hover:bg-olympia-red/5 backdrop-blur-md border border-white/10 hover:border-olympia-red/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-olympia-red/10 border border-olympia-red/20 flex items-center justify-center group-hover:bg-olympia-red/20 transition-colors">
                  <Dumbbell className="w-5 h-5 text-olympia-red" />
                </div>
                <div>
                  <h2 className="text-2xl font-bebas text-white tracking-wider">{s.day}</h2>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{s.activities}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bebas text-olympia-red tracking-wider">{s.hours}</p>
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm uppercase tracking-widest">Horarios pendientes de configuración</p>
              <p className="text-xs mt-1">El administrador debe cargarlos desde el panel</p>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-8 p-5 bg-olympia-red/5 border border-olympia-red/20 rounded-2xl">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Importante</p>
          <p className="text-sm text-white/70">
            Los horarios pueden variar en feriados. Consultá nuestras redes sociales para novedades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
