import React from 'react';

const DashboardClient = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8 p-6 bg-olympia-card/30 backdrop-blur-md rounded-xl border border-olympia-border/50">
        <h2 className="text-5xl font-bebas text-white tracking-wider">Hola, Guerrero</h2>
        <p className="text-olympia-muted uppercase tracking-widest text-xs mt-1">Tu disciplina forja tu destino.</p>
      </header>

      {/* Cards de Información General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-olympia-card/40 backdrop-blur-md border border-olympia-border rounded-xl">
          <h3 className="text-olympia-muted text-xs font-semibold uppercase tracking-[0.2em] mb-3">Tu Cuota</h3>
          <p className="text-3xl font-bebas text-green-500 tracking-widest">ACTIVA / AL DÍA</p>
          <p className="text-[10px] text-olympia-muted mt-2 uppercase">Vence en 14 días</p>
        </div>

        <div className="p-6 bg-olympia-card/40 backdrop-blur-md border border-olympia-border rounded-xl">
          <h3 className="text-olympia-muted text-xs font-semibold uppercase tracking-[0.2em] mb-3">Constancia</h3>
          <p className="text-3xl font-bebas text-white tracking-widest">3 DÍAS / SEM</p>
          <p className="text-[10px] text-olympia-muted mt-2 uppercase">Objetivo: Hipertrofia</p>
        </div>
      </div>

      {/* Botón de Acción Rápida */}
      <div className="mt-8 p-8 bg-gradient-to-r from-olympia-card/60 to-olympia-dark/60 backdrop-blur-md border border-olympia-border rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bebas text-white tracking-widest">Tu Rutina de Hoy</h3>
          <p className="text-xs text-olympia-muted uppercase tracking-wider">Día 1: Empuje (Pecho, Hombros, Tríceps)</p>
        </div>
        <button className="btn-spartan px-10">
          Iniciar Entrenamiento
        </button>
      </div>
    </div>
  );
};

export default DashboardClient;
