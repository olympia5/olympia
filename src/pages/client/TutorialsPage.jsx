import React, { useState } from 'react';
import { Play, Search, Dumbbell, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'piernas', name: 'Piernas', icon: '🦵', count: 12 },
  { id: 'pecho', name: 'Pecho', icon: '💪', count: 8 },
  { id: 'hombro', name: 'Hombro', icon: '👤', count: 10 },
  { id: 'espalda', name: 'Espalda', icon: '👐', count: 9 },
  { id: 'brazos', name: 'Brazos', icon: '💪', count: 15 },
  { id: 'trapecio', name: 'Trapecio', icon: '🔺', count: 5 },
  { id: 'abs', name: 'Core / Abs', icon: '🛡️', count: 7 },
];

const TutorialsPage = () => {
  const [activeCategory, setActiveCategory] = useState('piernas');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-widest leading-none mb-2">MasterClass Olympia</h1>
          <p className="text-olympia-muted uppercase tracking-[0.2em] text-xs">Aprende la técnica perfecta de cada ejercicio</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar ejercicio..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-olympia-red transition-all"
          />
        </div>
      </header>

      {/* Categorías */}
      <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-none px-6 py-4 rounded-xl font-bebas text-lg tracking-widest uppercase transition-all flex items-center gap-3 ${
              activeCategory === cat.id 
                ? 'bg-olympia-red text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                : 'text-white/20 hover:text-white/50 hover:bg-white/5'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de Ejercicios (Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="group bg-olympia-card/40 backdrop-blur-md border border-olympia-border rounded-2xl overflow-hidden hover:border-olympia-red/50 transition-all cursor-pointer">
            <div className="aspect-video bg-black/60 relative overflow-hidden">
               {/* Aquí iría la miniatura del video */}
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-olympia-red flex items-center justify-center text-white shadow-lg">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
               </div>
               <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-tighter">0:45</span>
            </div>
            <div className="p-5">
              <span className="text-[10px] text-olympia-red font-bold uppercase tracking-widest mb-1 block">
                {CATEGORIES.find(c => c.id === activeCategory)?.name}
              </span>
              <h3 className="text-xl font-bebas text-white tracking-widest group-hover:text-olympia-red transition-colors">
                Ejercicio Pro # {i}
              </h3>
              <p className="text-white/40 text-xs mt-2 line-clamp-2 leading-relaxed">
                Una breve descripción de la técnica y los puntos claves para maximizar el estímulo muscular.
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] text-white/20 uppercase font-bold">
                  <Dumbbell className="w-3 h-3" /> Avanzado
                </span>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-olympia-red group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / Not found */}
      {searchQuery && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
           <p className="text-white/20 uppercase tracking-widest font-bebas text-xl">No se encontraron resultados para "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default TutorialsPage;
