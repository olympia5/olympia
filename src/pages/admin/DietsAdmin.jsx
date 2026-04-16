import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, Save, Trash2, Utensils, Edit3 } from 'lucide-react';

const DietsAdmin = () => {
  const { diets, addDiet, deleteDiet, updateDiet } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    goal: 'perder_peso',
    dietPreference: 'carnivoro',
    sex: 'M',
    height: '',
    weight: '',
    age: '',
    desayuno: '',
    almuerzo: '',
    merienda: '',
    cena: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Por favor ingresa un título para esta dieta.");
      return;
    }
    
    if (editingId) {
      updateDiet(editingId, form);
    } else {
      addDiet(form);
    }
    
    setShowForm(false);
    setEditingId(null);
    setForm({
      title: '', goal: 'perder_peso', dietPreference: 'carnivoro', sex: 'M', 
      height: '', weight: '', age: '',
      desayuno: '', almuerzo: '', merienda: '', cena: ''
    });
  };

  const handleEdit = (diet) => {
    setForm({
      title: diet.title,
      goal: diet.goal,
      dietPreference: diet.dietPreference,
      sex: diet.sex,
      height: diet.height,
      weight: diet.weight,
      age: diet.age,
      desayuno: diet.desayuno,
      almuerzo: diet.almuerzo,
      merienda: diet.merienda,
      cena: diet.cena
    });
    setEditingId(diet.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      title: '', goal: 'perder_peso', dietPreference: 'carnivoro', sex: 'M', 
      height: '', weight: '', age: '',
      desayuno: '', almuerzo: '', merienda: '', cena: ''
    });
  };

  return (
    <div className="p-4 md:p-8 min-h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-widest">Gestión de Dietas</h1>
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] mt-1">
            Administración Nutricional ( sin alcohol, sin aderezos, sin azucar, sin harina )
          </p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-spartan flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Plus className="w-4 h-4" /> Cargar Dieta
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bebas tracking-widest text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-olympia-red" /> 
              {editingId ? 'Editar Dieta' : 'Nueva Dieta'}
            </h2>
            <button onClick={handleCancel} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Título identificador</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: Dieta estricta perdida hombre 80kg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Objetivo</label>
                <select value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="perder_peso">Perder peso</option>
                  <option value="resistencia">Resistencia</option>
                  <option value="rendimiento">Alto rendimiento (competencia)</option>
                  <option value="mantener">Mantener el peso</option>
                  <option value="musculo">Ganar músculo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Preferencia Alimenticia</label>
                <select value={form.dietPreference} onChange={e => setForm({...form, dietPreference: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="celiaco">Celíaco</option>
                  <option value="carnivoro">Carnívoro</option>
                  <option value="vegano">Vegano</option>
                  <option value="vegetariano">Vegetariano</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Sexo</label>
                <select value={form.sex} onChange={e => setForm({...form, sex: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Altura (cm)</label>
                <input value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: 175" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Peso (kg)</label>
                <input value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: 80" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Edad</label>
                <input value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: 25-35" />
              </div>
            </div>

            <hr className="border-white/10 my-6" />
            <h3 className="text-lg font-bebas text-olympia-red tracking-widest">Comidas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Desayuno</label>
                <textarea rows="3" value={form.desayuno} onChange={e => setForm({...form, desayuno: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: 4 huevos, avena..." />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Almuerzo</label>
                <textarea rows="3" value={form.almuerzo} onChange={e => setForm({...form, almuerzo: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: 200g pollo, arroz..." />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Merienda</label>
                <textarea rows="3" value={form.merienda} onChange={e => setForm({...form, merienda: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: Batido de proteína..." />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest mb-1 block">Cena</label>
                <textarea rows="3" value={form.cena} onChange={e => setForm({...form, cena: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Ej: Pescado con vegetales..." />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-spartan px-8 py-3 text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> {editingId ? 'Actualizar Dieta' : 'Guardar Dieta'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de dietas cargadas */}
      {!showForm && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {(!diets || diets.length === 0) ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-white/40">
              No hay dietas cargadas aún. Usa el botón "Cargar Dieta" para empezar.
            </div>
          ) : (
            diets.map(diet => (
              <div key={diet.id} className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-olympia-red/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-bebas text-white uppercase tracking-widest">{diet.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Obj: {diet.goal.replace('_', ' ')}</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Dieta: {diet.dietPreference}</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Sexo: {diet.sex === 'M' ? 'Masculino' : diet.sex === 'F' ? 'Femenino' : diet.sex}</span>
                      {diet.height && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Alt: {diet.height}cm</span>}
                      {diet.weight && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Peso: {diet.weight}kg</span>}
                      {diet.age && <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/50 uppercase">Edad: {diet.age}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(diet)} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteDiet(diet.id)} className="p-2 text-white/20 hover:text-olympia-red hover:bg-white/5 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-white/5 p-4 rounded-lg">
                  <div>
                    <span className="text-[10px] text-olympia-red uppercase tracking-widest block mb-1">Desayuno</span>
                    <p className="text-xs text-white/70 whitespace-pre-line">{diet.desayuno || '-'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-olympia-red uppercase tracking-widest block mb-1">Almuerzo</span>
                    <p className="text-xs text-white/70 whitespace-pre-line">{diet.almuerzo || '-'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-olympia-red uppercase tracking-widest block mb-1">Merienda</span>
                    <p className="text-xs text-white/70 whitespace-pre-line">{diet.merienda || '-'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-olympia-red uppercase tracking-widest block mb-1">Cena</span>
                    <p className="text-xs text-white/70 whitespace-pre-line">{diet.cena || '-'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DietsAdmin;
