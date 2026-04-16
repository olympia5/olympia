import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  TrendingUp, Activity, BarChart3, Calendar, 
  ArrowLeft, ChevronRight, Scale, Dumbbell, 
  Target, Info, Timer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProgressDashboard = () => {
  const { user, getEvolutionHistory, getPerformanceLogs } = useAuth();
  const [activeTab, setActiveTab] = useState('Semanal');
  const [history, setHistory] = useState([]);
  const [perfLogs, setPerfLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hist, logs] = await Promise.all([
          getEvolutionHistory(),
          getPerformanceLogs()
        ]);
        setHistory(hist);
        setPerfLogs(logs);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  // --- LOGICA DE AGRUPACIÓN POR PERIODO ---
  const getFilteredLogs = () => {
    // Para simplificar, mostramos los últimos N registros según el tab
    if (activeTab === 'Diario') return perfLogs.slice(-7);
    if (activeTab === 'Semanal') return perfLogs.slice(-15);
    if (activeTab === 'Mensual') return perfLogs.slice(-30);
    return perfLogs;
  };

  const filteredLogs = getFilteredLogs();

  // Calcular Volumen Total
  const calculateVolume = (logs) => {
    return logs.reduce((acc, log) => acc + (log.weight_kg * log.reps * log.sets), 0);
  };

  const totalVolume = calculateVolume(perfLogs);

  // Obtener Récords Personales (Max peso por ejercicio)
  const getPRs = () => {
    const prs = {};
    perfLogs.forEach(log => {
      if (!prs[log.exercise_name] || log.weight_kg > prs[log.exercise_name].weight) {
        prs[log.exercise_name] = { weight: log.weight_kg, date: log.date };
      }
    });
    return Object.entries(prs).sort((a,b) => b[1].weight - a[1].weight).slice(0, 5);
  };

  const personalRecords = getPRs();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-olympia-red border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <NavLink to="/cliente" className="flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] items-center font-bold uppercase tracking-widest">Volver</span>
          </NavLink>
          <h1 className="text-6xl font-bebas text-white tracking-widest leading-none">
            Centro de <span className="text-olympia-red">Rendimiento</span>
          </h1>
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] mt-2">
            Análisis detallado de tu evolución en el coliseo
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-8 overflow-x-auto no-scrollbar gap-1">
        {['Diario', 'Semanal', 'Mensual', 'Anual'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[80px] py-3 rounded-xl font-bebas text-lg tracking-widest uppercase transition-all ${
              activeTab === tab 
                ? 'bg-olympia-red text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                : 'text-white/20 hover:text-white/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel Izquierdo: Resumen Rápido */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta Volumen */}
          <div className="bg-olympia-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <Activity className="w-20 h-20 text-white" />
             </div>
             <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Volumen Total Levantado</p>
             <h3 className="text-5xl font-bebas text-white">{totalVolume.toLocaleString()} <span className="text-xl text-olympia-red">KG</span></h3>
             <div className="h-1 w-full bg-white/5 mt-4 rounded-full overflow-hidden">
               <div className="h-full bg-olympia-red shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{width: '65%'}}></div>
             </div>
             <p className="text-[10px] text-white/20 uppercase tracking-widest mt-3 flex items-center gap-1.5">
               <TrendingUp className="w-3 h-3 text-green-500" /> +12% respecto al mes pasado
             </p>
          </div>

          {/* Récords Personales (PRs) */}
          <div className="bg-black/40 border border-white/5 rounded-3xl p-6">
            <h4 className="text-xl font-bebas text-white tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-olympia-red" /> Mis Récords
            </h4>
            <div className="space-y-4">
              {personalRecords.length > 0 ? personalRecords.map(([name, data]) => (
                <div key={name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">{name}</p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">{new Date(data.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bebas text-olympia-red">{data.weight} kg</span>
                  </div>
                </div>
              )) : (
                <p className="text-center py-8 text-white/20 text-xs uppercase tracking-widest">Aún no hay récords registrados</p>
              )}
            </div>
          </div>
        </div>

        {/* Panel Derecho: Gráficos Detallados */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gráfico 1: Rendimiento (Volumen) */}
          <div className="bg-olympia-card/30 backdrop-blur-xl border border-olympia-border rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bebas text-white tracking-widest">Progreso de Carga</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Basado en volumen total de entrenamiento</p>
              </div>
              <Activity className="w-6 h-6 text-olympia-red" />
            </div>

            <div className="h-64 w-full relative">
              {filteredLogs.length < 2 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-black/40 rounded-2xl border border-dashed border-white/10">
                  <Dumbbell className="w-8 h-8 text-white/10 mb-2" />
                  <p className="text-xs text-white/20 uppercase tracking-widest">Necesitás registrar al menos 2 entrenamientos para ver la curva de rendimiento</p>
                </div>
              ) : (
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map(p => (
                    <line key={p} x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="white" strokeOpacity="0.05" />
                  ))}
                  
                  {/* Performance Line */}
                  {(() => {
                    const volumes = filteredLogs.map(l => l.weight_kg * l.reps * l.sets);
                    const maxV = Math.max(...volumes) * 1.1;
                    const minV = Math.min(...volumes) * 0.9;
                    const range = maxV - minV || 1;

                    const points = filteredLogs.map((l, i) => {
                      const x = (i / (filteredLogs.length - 1)) * 100;
                      const y = 100 - (((l.weight_kg * l.reps * l.sets) - minV) / range) * 100;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <path 
                          d={`M ${points}`} 
                          fill="none" 
                          stroke="url(#grad2)" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#f87171', stopOpacity: 1}} />
                          </linearGradient>
                        </defs>
                        {/* Interactive dots */}
                        {filteredLogs.map((l, i) => {
                          const x = (i / (filteredLogs.length - 1)) * 100;
                          const y = 100 - (((l.weight_kg * l.reps * l.sets) - minV) / range) * 100;
                          return (
                            <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4" fill="#dc2626" className="drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              )}
            </div>
          </div>

          {/* Gráfico 2: Evolución Corporal (Peso) */}
          <div className="bg-olympia-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bebas text-white tracking-widest">Evolución del Peso</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Historial de peso corporal</p>
              </div>
              <Scale className="w-6 h-6 text-white/50" />
            </div>

            <div className="h-48 w-full relative">
              {history.length === 0 ? (
                <p className="text-center py-10 text-white/20 text-xs uppercase tracking-widest">Sin datos de peso</p>
              ) : (
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {history.length > 1 ? (() => {
                    const weights = history.map(h => Number(h.weight_kg));
                    const maxW = Math.max(...weights) + 2;
                    const minW = Math.min(...weights) - 2;
                    const range = maxW - minW || 1;
                    const points = history.map((h, i) => {
                      const x = (i / (history.length - 1)) * 100;
                      const y = 100 - ((Number(h.weight_kg) - minW) / range) * 100;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <path d={`M ${points}`} fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 4" />
                    );
                  })() : (
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" strokeOpacity="0.1" strokeDasharray="4 4" />
                  )}
                  {history.map((h, i) => {
                    const weights = history.map(item => Number(item.weight_kg));
                    const maxW = Math.max(...weights) + 2;
                    const minW = Math.min(...weights) - 2;
                    const range = maxW - minW || 1;
                    const x = history.length > 1 ? (i / (history.length - 1)) * 100 : 50;
                    const y = history.length > 1 
                      ? 100 - ((Number(h.weight_kg) - minW) / range) * 100
                      : 50;
                    return (
                      <g key={i}>
                        <circle cx={`${x}%`} cy={`${y}%`} r="4" fill="white" fillOpacity="0.3" />
                        <text x={`${x}%`} y={`${y}%`} dy="-10" textAnchor="middle" fill="white" fillOpacity="0.5" className="text-[8px] font-bold">
                          {h.weight_kg}kg
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
