import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, Save, Trash2, Dumbbell, Edit3, ChevronRight, ChevronDown } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const RoutinesAdmin = () => {
  const { routines, addRoutine, deleteRoutine, updateRoutine } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    title: '',
    goal: 'musculo',
    days: DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  };

  const [form, setForm] = useState(initialForm);
  const [activeDay, setActiveDay] = useState('Lunes');

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Por favor ingresa un título para esta rutina.");
      return;
    }

    if (editingId) {
      updateRoutine(editingId, form);
    } else {
      addRoutine(form);
    }

    handleCancel();
  };

  const handleEdit = (routine) => {
    setForm({
      title: routine.title,
      goal: routine.goal,
      days: routine.days || initialForm.days
    });
    setEditingId(routine.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setActiveDay('Lunes');
  };

  const addExercise = (day) => {
    const newExercise = { id: Date.now(), name: '', muscle: '', series: '', reps: '', rest: '' };
    setForm({
      ...form,
      days: {
        ...form.days,
        [day]: [...form.days[day], newExercise]
      }
    });
  };

  const updateExercise = (day, id, field, value) => {
    const updatedDayExercises = form.days[day].map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    );
    setForm({
      ...form,
      days: {
        ...form.days,
        [day]: updatedDayExercises
      }
    });
  };

  const removeExercise = (day, id) => {
    setForm({
      ...form,
      days: {
        ...form.days,
        [day]: form.days[day].filter(ex => ex.id !== id)
      }
    });
  };

  return (
    <div className="p-4 md:p-8 min-h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-widest">Gestión de Rutinas</h1>
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] mt-1">
            Administración Deportiva ( Entrenamiento Personalizado )
          </p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-spartan flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Plus className="w-4 h-4" /> Cargar Rutina
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bebas tracking-widest text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-olympia-red" /> 
              {editingId ? 'Editar Rutina' : 'Nueva Rutina'}
            </h2>
            <button onClick={handleCancel} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Título identificador</label>
                <input 
                  required 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" 
                  placeholder="Ej: Rutina Hipertrofia Nivel 1" 
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Objetivo</label>
                <select 
                  value={form.goal} 
                  onChange={e => setForm({...form, goal: e.target.value})} 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="perder_peso">Perder peso</option>
                  <option value="resistencia">Resistencia</option>
                  <option value="rendimiento">Alto rendimiento (competencia)</option>
                  <option value="mantener">Mantener el peso</option>
                  <option value="musculo">Ganar músculo</option>
                </select>
              </div>
            </div>

            <hr className="border-white/10 my-6" />

            {/* Selector de Días */}
            <div className="flex flex-wrap gap-2 mb-4">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeDay === day 
                    ? 'bg-olympia-red text-white' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Lista de Ejercicios por Día */}
            <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  Ejercicios del {activeDay}
                </h3>
                <button 
                  type="button"
                  onClick={() => addExercise(activeDay)}
                  className="text-xs text-olympia-red hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Añadir Ejercicio
                </button>
              </div>

              {form.days[activeDay].length === 0 ? (
                <p className="text-xs text-white/20 italic text-center py-4">Sin ejercicios asignados para este día.</p>
              ) : (
                <div className="space-y-3">
                  {form.days[activeDay].map((ex, idx) => (
                    <div key={ex.id} className="grid grid-cols-12 gap-2 items-end bg-white/5 p-3 rounded-lg border border-white/5 group">
                      <div className="col-span-12 md:col-span-3">
                        <label className="text-[10px] text-white/30 uppercase block mb-1">Nombre</label>
                        <input 
                          value={ex.name} 
                          onChange={(e) => updateExercise(activeDay, ex.id, 'name', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" 
                          placeholder="Ej: Press de Banca"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="text-[10px] text-white/30 uppercase block mb-1">Músculo</label>
                        <input 
                          value={ex.muscle} 
                          onChange={(e) => updateExercise(activeDay, ex.id, 'muscle', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" 
                          placeholder="Ej: Pecho"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-1">
                        <label className="text-[10px] text-white/30 uppercase block mb-1">Series</label>
                        <input 
                          value={ex.series} 
                          onChange={(e) => updateExercise(activeDay, ex.id, 'series', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" 
                          placeholder="4"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <label className="text-[10px] text-white/30 uppercase block mb-1">Reps</label>
                        <input 
                          value={ex.reps} 
                          onChange={(e) => updateExercise(activeDay, ex.id, 'reps', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" 
                          placeholder="12"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-3">
                        <label className="text-[10px] text-white/30 uppercase block mb-1">Descanso</label>
                        <input 
                          value={ex.rest} 
                          onChange={(e) => updateExercise(activeDay, ex.id, 'rest', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" 
                          placeholder="60-90s"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-end">
                        <button 
                          type="button"
                          onClick={() => removeExercise(activeDay, ex.id)}
                          className="p-1.5 text-white/20 hover:text-olympia-red rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-spartan px-8 py-3 text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> {editingId ? 'Actualizar Rutina' : 'Guardar Rutina'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de rutinas cargadas */}
      {!showForm && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {(!routines || routines.length === 0) ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-white/40">
              No hay rutinas cargadas aún. Usa el botón "Cargar Rutina" para empezar.
            </div>
          ) : (
            routines.map(routine => (
              <div key={routine.id} className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-olympia-red/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-bebas text-white uppercase tracking-widest">{routine.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Obj: {routine.goal.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(routine)} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteRoutine(routine.id)} className="p-2 text-white/20 hover:text-olympia-red hover:bg-white/5 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Resumen de días */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
                  {DAYS.map(day => {
                    const exerciseCount = routine.days[day]?.length || 0;
                    return (
                      <div key={day} className="bg-white/5 rounded-lg p-3 text-center">
                        <span className="text-[10px] text-white/40 uppercase block mb-1">{day}</span>
                        <span className={`text-sm font-bold ${exerciseCount > 0 ? 'text-olympia-red' : 'text-white/10'}`}>
                          {exerciseCount} ej.
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RoutinesAdmin;
