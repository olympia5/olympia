import React from 'react';
import { Apple, Trophy, UtensilsCrossed, Zap, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DietView = () => {
  const { user, diets } = useAuth();
  
  const goal = user?.profile?.goal;
  const preference = user?.profile?.dietPreference;

  const normalize = (str) => String(str || '').toLowerCase().trim().replace(/_/g, ' ');

  const goalNorm = normalize(goal);
  const prefNorm = normalize(preference);

  // 1. Buscar en la lista de dietas del admin una que coincida con Objetivo y Preferencia
  const matchedDiet = diets?.find(d => 
    normalize(d.goal) === goalNorm && 
    normalize(d.dietPreference) === prefNorm
  );

  const getGoalIcon = (currentGoal) => {
    switch(currentGoal) {
      case 'perder_peso': return <Zap className="w-6 h-6 text-orange-500" />;
      case 'musculo': return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'mantener': return <Heart className="w-6 h-6 text-blue-500" />;
      default: return <Apple className="w-6 h-6 text-green-500" />;
    }
  };

  const getPreferenceBadge = (currentPref) => {
    const labels = {
      carnivoro: { text: 'Carnívoro', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
      celiaco: { text: 'Celíaco', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      vegetariano: { text: 'Vegetariano', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
      vegano: { text: 'Vegano', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      omnivoro: { text: 'Omnívoro', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
    };

    const label = labels[currentPref] || labels.omnivoro;
    return (
      <span className={`${label.color} text-[10px] font-bold px-2 py-0.5 rounded border uppercase`}>
        {label.text}
      </span>
    );
  };

  if (!goal || !preference) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/20" />
        </div>
        <h2 className="text-2xl font-bebas text-white tracking-widest uppercase">Perfil Incompleto</h2>
        <p className="text-white/40 max-w-xs text-sm">
          Por favor, completá tus datos de <strong>Objetivo</strong> y <strong>Preferencia Alimenticia</strong> en tu perfil para poder ver tu plan nutricional.
        </p>
      </div>
    );
  }

  if (!matchedDiet) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl">
        <div className="w-16 h-16 rounded-full bg-olympia-red/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-olympia-red animate-spin" />
        </div>
        <h2 className="text-2xl font-bebas text-white tracking-widest uppercase">¡Tu entrenador esta preparando un plan para vos!</h2>
        <p className="text-white/40 max-w-xs text-sm">
          Estamos buscando en la base de datos una dieta que coincida con tu objetivo (<strong>{goal?.replace('_', ' ')}</strong>) y preferencia (<strong>{preference}</strong>). 
          Si no ves tu plan, contactá a tu entrenador para que lo asigne.
        </p>
      </div>
    );
  }

  const meals = [
    { id: 'desayuno', name: 'Desayuno', items: matchedDiet.desayuno, icon: <Apple className="w-5 h-5" /> },
    { id: 'almuerzo', name: 'Almuerzo', items: matchedDiet.almuerzo, icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'merienda', name: 'Merienda', items: matchedDiet.merienda, icon: <Zap className="w-5 h-5" /> },
    { id: 'cena', name: 'Cena', items: matchedDiet.cena, icon: <Heart className="w-5 h-5" /> }
  ].filter(m => m.items); // Mostrar solo las que tengan contenido cargado

  return (
    <div className="space-y-6">
      <header className="mb-8 p-6 bg-olympia-card/30 backdrop-blur-xl rounded-2xl border border-olympia-border/50 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getPreferenceBadge(preference)}
            <h2 className="text-5xl font-bebas text-white tracking-widest leading-none">Plan Nutricional</h2>
          </div>
          <p className="text-olympia-muted uppercase tracking-[0.2em] text-xs mt-1">
            Personalizado para: <span className="text-white">{goal?.replace('_', ' ')}</span>
          </p>
        </div>
        <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-3">
          {getGoalIcon(goal)}
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-white/30 uppercase tracking-widest leading-none mb-1">Tu Objetivo actual</p>
            <p className="text-sm font-bold text-white uppercase tracking-wider">{goal?.replace('_', ' ')}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {meals.map((meal, index) => (
          <div key={meal.id} className="bg-olympia-card/40 backdrop-blur-md border border-olympia-border rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl font-bebas text-white/5 uppercase tracking-widest">{meal.id.slice(0,3)}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-olympia-red/10 border border-olympia-red/20 flex items-center justify-center text-olympia-red">
                {meal.icon}
              </div>
              <h3 className="text-2xl font-bebas text-white uppercase tracking-widest">{meal.name}</h3>
            </div>
            
            <p className="text-white/80 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5 min-h-[140px] flex items-center italic">
              "{meal.items}"
            </p>
          </div>
        ))}
      </div>

      <footer className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
        <Heart className="w-8 h-8 text-olympia-red shrink-0" />
        <p className="text-xs text-white/40 uppercase tracking-[0.2em] leading-relaxed">
          Plan personalizado asignado por el equipo de Olympia. Identificador: {matchedDiet.title}.
        </p>
      </footer>
    </div>
  );
};

export default DietView;
