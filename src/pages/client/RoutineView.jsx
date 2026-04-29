import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Video, Dumbbell, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const RoutineView = () => {
  const { user, routines, logPerformance } = useAuth();
  
  // Detectar día actual para el valor por defecto
  const todayIndex = new Date().getDay(); // 0-6 (Dom-Sab)
  const initialDay = todayIndex >= 1 && todayIndex <= 6 ? DAYS[todayIndex - 1] : 'Lunes';
  
  const [activeDay, setActiveDay] = useState(initialDay);
  const [activeExercise, setActiveExercise] = useState(null);
  const [logForm, setLogForm] = useState({ weight: '', reps: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Timer State (en milisegundos para precisión de cronómetro)
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime(t => t + 10);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const goal = user?.profile?.goal;
  
  const normalize = (str) => String(str || '').toLowerCase().trim().replace(/_/g, ' ');

  const goalNorm = normalize(goal);

  // 1. Buscar en la lista de rutinas del admin la que coincida con el Objetivo
  const matchedRoutine = routines?.find(r => 
    normalize(r.goal) === goalNorm
  );

  const exercises = matchedRoutine?.days?.[activeDay] || [];

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/20" />
        </div>
        <h2 className="text-2xl font-bebas text-white tracking-widest uppercase">Perfil Incompleto</h2>
        <p className="text-white/40 max-w-xs text-sm">
          Por favor, seleccioná un <strong>Objetivo</strong> en tu perfil para poder cargar tu rutina de entrenamiento.
        </p>
      </div>
    );
  }

  if (!matchedRoutine) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-olympia-red/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-olympia-red animate-spin" />
        </div>
        <h2 className="text-2xl font-bebas text-white tracking-widest uppercase">¡Tu entrenador esta preparando un plan para vos!</h2>
        <p className="text-white/40 max-w-xs text-sm">
          Estamos buscando en la base de datos una rutina orientada a <strong>{goal?.replace('_', ' ')}</strong>.
          Si no ves tu plan, contactá a tu entrenador para que lo asigne.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-8 p-6 bg-olympia-card/30 backdrop-blur-xl rounded-2xl border border-olympia-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-olympia-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              {goal?.replace('_', ' ')}
            </span>
            <h2 className="text-4xl font-bebas text-white tracking-widest leading-none">Mi Rutina Semanal</h2>
          </div>
          <p className="text-olympia-muted uppercase tracking-[0.2em] text-xs mt-1">
            Entrenamiento asignado: <span className="text-white">{matchedRoutine.title || 'General'}</span>
          </p>
        </div>

        {/* --- CRONÓMETRO REAL (TIEMPO DE DESCANSO) --- */}
        <div className="bg-black/40 px-6 py-4 rounded-2xl border border-olympia-border flex flex-col items-center justify-center gap-3 shadow-inner min-w-[220px]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-olympia-red font-bold uppercase tracking-widest mb-1">Tiempo de descanso</span>
            <span className="font-mono text-4xl font-bold text-white tracking-widest text-center">
              {formatTime(time)}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 w-full mt-1">
            {/* Botón Play / Pause */}
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-3 rounded-xl transition-all flex items-center justify-center w-16 ${
                isActive 
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' 
                  : 'bg-green-500/10 text-green-500 border border-green-500/30'
              }`}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            {/* Botón Reset */}
            <button
              onClick={handleReset}
              className="p-3 bg-white/5 text-white/40 border border-white/10 rounded-xl hover:text-white transition-all flex items-center justify-center w-16"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* --- SELECTOR DE DÍAS --- */}
      <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar gap-2">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 min-w-[100px] py-4 rounded-xl font-bebas text-lg tracking-widest uppercase transition-all ${
              activeDay === day 
                ? 'bg-olympia-red text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                : 'text-white/20 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {exercises.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
             <Dumbbell className="w-12 h-12 text-white/5 mx-auto mb-4" />
             <p className="text-white/20 uppercase tracking-widest font-bebas text-xl">Día de recuperación o sin cargar</p>
             <p className="text-[10px] text-white/10 uppercase tracking-widest mt-1">Hoy no tenés ejercicios asignados por el momento.</p>
          </div>
        ) : (
          exercises.map((ex) => (
            <div key={ex.id} className="bg-olympia-card/40 backdrop-blur-md border border-olympia-border rounded-2xl overflow-hidden transition-all hover:bg-olympia-card/60">
              <div className="flex flex-col md:flex-row">
                
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-olympia-red/10 border border-olympia-red/20 flex items-center justify-center text-olympia-red">
                          <Dumbbell className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-3xl font-bebas text-white tracking-widest leading-none">{ex.name}</h3>
                          {ex.muscle && (
                            <span className="text-[10px] text-olympia-red font-bold uppercase tracking-widest mt-1">
                              {ex.muscle}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-olympia-red/10 text-olympia-red text-[10px] font-bold px-3 py-1.5 rounded-lg border border-olympia-red/20 uppercase tracking-widest">
                        {ex.rest || '-'} Descanso
                      </div>
                    </div>
                    <p className="text-sm text-olympia-muted italic mb-6">"{matchedRoutine.title} - {activeDay}"</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Series</span>
                        <span className="text-2xl font-bebas text-white">{ex.series || '-'}</span>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-white/30 uppercase tracking-widest mb-1">Repes</span>
                        <span className="text-2xl font-bebas text-white">{ex.reps || '-'}</span>
                      </div>
                    </div>

                    {/* --- LOG FORM --- */}
                    {activeExercise === ex.id && (
                      <div className="mt-6 p-4 bg-olympia-red/5 border border-olympia-red/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col sm:flex-row items-end gap-3">
                          <div className="flex-1 space-y-2">
                            <label className="text-[10px] text-olympia-red font-bold uppercase tracking-widest ml-1">Kilos cargados hoy</label>
                            <input 
                              type="number" 
                              placeholder="Ej: 60"
                              value={logForm.weight}
                              onChange={(e) => setLogForm(f => ({ ...f, weight: e.target.value }))}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-olympia-red transition-all"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="text-[10px] text-olympia-red font-bold uppercase tracking-widest ml-1">Repeticiones reales</label>
                            <input 
                              type="number" 
                              placeholder={`Ej: ${ex.reps?.split('-')[0] || 12}`}
                              value={logForm.reps}
                              onChange={(e) => setLogForm(f => ({ ...f, reps: e.target.value }))}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-olympia-red transition-all"
                            />
                          </div>
                          <button 
                            disabled={!logForm.weight || !logForm.reps || isSaving}
                            onClick={async () => {
                              setIsSaving(true);
                              try {
                                await logPerformance({
                                  exercise_name: ex.name,
                                  weight_kg: Number(logForm.weight),
                                  reps: Number(logForm.reps),
                                  sets: Number(ex.series || 4)
                                });
                                setActiveExercise(null);
                                setLogForm({ weight: '', reps: '' });
                                alert('¡Récord guardado!');
                              } catch (err) {
                                console.error(err);
                              } finally {
                                setIsSaving(false);
                              }
                            }}
                            className="bg-olympia-red hover:bg-red-700 disabled:opacity-30 text-white font-bold h-[50px] px-6 rounded-xl uppercase tracking-widest text-[10px] transition-all"
                          >
                            {isSaving ? 'Guardando...' : 'Guardar Récord'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all border text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                        activeExercise === ex.id 
                          ? 'bg-olympia-red/80 text-white border-olympia-red shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                      }`}
                      onClick={() => {
                        if (activeExercise === ex.id) {
                          setActiveExercise(null);
                        } else {
                          setActiveExercise(ex.id);
                          setLogForm({ weight: '', reps: '' });
                        }
                      }}
                    >
                      {activeExercise === ex.id ? 'Cancelar Carga' : 'Cargar Peso / Completar'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoutineView;
