import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, ChevronRight, Swords, User, AlertTriangle, Timer, Camera, X, DoorOpen, CheckCircle2, Scan, TrendingUp, Scale, Plus } from 'lucide-react';
import { useAuth, getDaysRemaining } from '../../context/AuthContext';



const HomePage = () => {
  const { user, settings, openDoor, getEvolutionHistory } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      getEvolutionHistory().then(setHistory);
    }
  }, [user]);

  // Seleccionar frase random de manera diaria o en cada carga
  const [currentPhrase, setCurrentPhrase] = React.useState(null);

  React.useEffect(() => {
    const phrases = settings?.motivationalPhrases || ["Hoy es día de guerra."];
    setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, [settings?.motivationalPhrases]);

  if (!currentPhrase) return null;

  const daysLeft = getDaysRemaining(user?.membership_end || user?.membershipEnd);
  const isActive = user?.status === 'active' && daysLeft > 0;
  const profileComplete = user?.profile?.weight && user?.profile?.goal;

  // Urgency level for days remaining
  const urgencyColor = daysLeft <= 3 ? 'text-red-400 border-red-500/30 bg-red-500/5'
    : daysLeft <= 7 ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5'
    : 'text-green-400 border-green-500/30 bg-green-500/5';

  return (
    <div className="min-h-screen">

      {/* ==== MEMBERSHIP ALERT BANNERS ==== */}
      <div className="px-4 md:px-8 lg:px-16 pt-6 pb-0 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Membresía pendiente / vencida → CTA para pagar */}
        {!isActive && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-olympia-red/10 border border-olympia-red/30 relative overflow-hidden group">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-olympia-red shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">
                  {user?.status === 'expired' ? 'Tu membresía venció' : 'Membresía inactiva'}
                </p>
                <p className="text-xs text-white/50">Activá tu cuota para acceder a todos los beneficios del coliseo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Botón Cámara Deshabilitado */}
              <button 
                disabled 
                title="Activá tu membresía para usar el acceso QR"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
              </button>
              
              <NavLink to="/cliente/membresia"
                className="btn-spartan px-4 py-2 text-xs whitespace-nowrap group-hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all"
              >
                Pagar cuota →
              </NavLink>
            </div>
          </div>
        )}

        {/* Activo con días restantes */}
        {isActive && (
          <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${urgencyColor}`}>
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Membresía activa</p>
                <p className="text-xs opacity-70">
                  {daysLeft <= 3
                    ? `⚠️ Solo te quedan ${daysLeft} día${daysLeft !== 1 ? 's' : ''} — renovar pronto`
                    : `Te quedan ${daysLeft} días — vence el ${new Date(user?.membership_end || user?.membershipEnd).toLocaleDateString('es-AR')}`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* BOTÓN CÁMARA QR */}
              <button 
                onClick={() => setShowScanner(true)}
                className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-olympia-red hover:border-olympia-red transition-all shadow-lg active:scale-95"
                title="Escanear QR para entrar"
              >
                <Camera className="w-5 h-5" />
              </button>

              <NavLink to="/cliente/membresia"
                className="text-xs border border-current rounded-lg px-3 py-2 font-bold uppercase tracking-wider hover:opacity-80 transition-all"
              >
                Ver
              </NavLink>
            </div>
          </div>
        )}

        {/* Completar perfil */}
        {!profileComplete && (
          <NavLink to="/cliente/perfil"
            className={`flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${(!isActive && !isActive) ? '' : ''}`}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-white/50 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tight">Completá tu perfil</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest leading-tight">Cargá tus datos físicos y objetivos</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
          </NavLink>
        )}
      </div>

      {/* ==== HERO ==== */}
      <section className="flex flex-col justify-center items-center text-center min-h-[55vh] px-4 md:px-8 lg:px-12 py-12">
        <div className="w-full">
          <p className="text-olympia-red text-xs uppercase tracking-[0.4em] font-bold mb-4 flex items-center justify-center gap-2">
            <Swords className="w-4 h-4" />
            Bienvenido al Coliseo
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bebas text-white leading-none tracking-wider mb-1">
            {currentPhrase.split(' ').slice(0, -1).join(' ').toUpperCase()}
          </h1>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bebas text-olympia-red leading-none tracking-wider drop-shadow-[0_0_30px_rgba(220,38,38,0.4)] mb-8">
            {currentPhrase.split(' ').slice(-1)[0].toUpperCase()}
          </h2>

          {/* Profile summary if complete */}
          {profileComplete && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {user?.profile?.weight && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 uppercase tracking-wider">
                  {user.profile.weight} kg
                </span>
              )}
              {user?.profile?.height && (
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 uppercase tracking-wider">
                  {user.profile.height} cm
                </span>
              )}
              {user?.profile?.goal && (
                <span className="px-3 py-1 bg-olympia-red/10 border border-olympia-red/20 rounded-full text-xs text-olympia-red uppercase tracking-wider">
                  🎯 {user.profile.goal.replace('_', ' ')}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-center w-full">
            <NavLink to="/cliente/rutina" className="btn-spartan px-10 py-5 text-sm uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <Activity className="w-5 h-5" />
              Iniciar Entrenamiento
            </NavLink>
          </div>
        </div>
      </section>
      
      {/* ==== EVOLUCIÓN FÍSICA ==== */}
      {profileComplete && (
        <section className="px-4 md:px-8 lg:px-16 py-12 bg-black/50 border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bebas tracking-wider text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-olympia-red" />
                  Evolución Física
                </h2>
                <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Historial de tu progreso en el tiempo</p>
              </div>
              <NavLink to="/cliente/perfil" className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white transition-all" title="Actualizar peso">
                <Plus className="w-5 h-5" />
              </NavLink>
            </div>

            {history.length < 2 ? (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl text-center">
                <Scale className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 text-sm">Necesitás al menos dos registros para ver el gráfico. Actualizá tu peso en el perfil periódicamente para ver tu progreso.</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
                <div className="h-64 w-full relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(p => (
                      <line key={p} x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="white" strokeOpacity="0.05" />
                    ))}
                    
                    {/* Points & Lines */}
                    {(() => {
                      const maxW = Math.max(...history.map(h => Number(h.weight_kg))) * 1.05;
                      const minW = Math.min(...history.map(h => Number(h.weight_kg))) * 0.95;
                      const range = maxW - minW || 1;
                      
                      const points = history.map((h, i) => {
                        const x = (i / (history.length - 1)) * 100;
                        const y = 100 - ((Number(h.weight_kg) - minW) / range) * 100;
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <>
                          <polyline
                            points={points.split(' ').map(p => {
                              const [x, y] = p.split(',');
                              return `${x}% ${y}%`;
                            }).join(' ')}
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                          />
                          {history.map((h, i) => {
                            const x = (i / (history.length - 1)) * 100;
                            const y = 100 - ((Number(h.weight_kg) - minW) / range) * 100;
                            return (
                              <g key={i}>
                                <circle cx={`${x}%`} cy={`${y}%`} r="4" fill="#dc2626" />
                                <text x={`${x}%`} y={`${y}%`} dy="-12" textAnchor="middle" fill="#fff" fontSize="10" className="font-bold">
                                  {h.weight_kg}kg
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="flex justify-between mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-olympia-red" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Peso corporal (kg)</span>
                  </div>
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">
                    {new Date(history[0].date).toLocaleDateString()} — {new Date(history[history.length-1].date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==== QR SCANNER MODAL ==== */}
      {showScanner && (
        <QRScannerModal 
          onClose={() => setShowScanner(false)} 
          onOpenDoor={openDoor}
        />
      )}

    </div>
  );
};

// Componente Interno: QRScannerModal
const QRScannerModal = ({ onClose, onOpenDoor }) => {
  const [status, setStatus] = useState('initializing'); // initializing, scanning, success, opening, open
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus('scanning');
        
        // Simular escaneo de QR después de 3 segundos
        setTimeout(() => {
          setStatus('success');
        }, 3000);

      } catch (err) {
        console.error("Error acceso cámara:", err);
        setStatus('error');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAction = async () => {
    setStatus('opening');
    await onOpenDoor();
    setStatus('open');
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-olympia-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-2xl font-bebas text-white tracking-widest uppercase italic">Acceso por QR</h2>
            <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
            
            {/* Viewfinder Area */}
            <div className="relative w-full aspect-[4/3] bg-black rounded-2xl border border-white/10 overflow-hidden mb-8 group">
                {status === 'initializing' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 space-y-4">
                        <div className="w-12 h-12 border-4 border-t-olympia-red border-white/10 rounded-full animate-spin" />
                        <p className="text-xs uppercase tracking-widest">Iniciando cámara...</p>
                    </div>
                )}

                {(status === 'scanning' || status === 'success') && (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className={`w-full h-full object-cover transition-opacity duration-500 ${status === 'success' ? 'opacity-40 grayscale' : 'opacity-100'}`}
                    />
                )}

                {status === 'scanning' && (
                    <>
                        <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none" />
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-olympia-red shadow-[0_0_15px_rgba(220,38,38,1)] animate-[scan_2s_linear_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-48 border-2 border-white/20 rounded-3xl" />
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 bg-green-500/10 animate-in fade-in zoom-in">
                        <CheckCircle2 className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                        <p className="text-2xl font-bebas tracking-widest uppercase">QR Detectado</p>
                    </div>
                )}

                {status === 'opening' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500 bg-yellow-500/10">
                        <div className="w-20 h-20 border-4 border-t-yellow-500 border-white/10 rounded-full animate-spin mb-4" />
                        <p className="text-2xl font-bebas tracking-widest uppercase animate-pulse">Abriendo Molinete...</p>
                    </div>
                )}

                {status === 'open' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-green-500 bg-green-500/10">
                        <DoorOpen className="w-20 h-20 mb-4 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
                        <p className="text-2xl font-bebas tracking-widest uppercase">PUERTA ABIERTA</p>
                        <p className="text-xs tracking-widest mt-1 opacity-70">¡BIENVENIDO GUERRERO!</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-8 text-center">
                        <AlertTriangle className="w-12 h-12 mb-4" />
                        <p className="text-sm font-bold uppercase mb-2">Error de Cámara</p>
                        <p className="text-xs opacity-60">Asegúrate de dar permisos de cámara a la aplicación para poder escanear el QR.</p>
                    </div>
                )}
            </div>

            {/* Footer Text / Status Description */}
            <div className="text-center space-y-2 mb-8">
                {status === 'scanning' && (
                    <p className="text-xs text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                        Apuntá al código QR ubicado en el molinete para validar tu ingreso
                    </p>
                )}
                {status === 'success' && (
                    <p className="text-xs text-green-500/80 uppercase tracking-[0.2em] font-bold">
                        Acceso validado. Presioná para activar el molinete.
                    </p>
                )}
            </div>

            {/* CTA Button */}
            <button
                disabled={status !== 'success'}
                onClick={handleAction}
                className={`w-full py-4 rounded-2xl font-bebas text-2xl tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
                    status === 'success' 
                    ? 'btn-spartan shadow-[0_0_30px_rgba(220,38,38,0.4)]' 
                    : 'bg-white/5 border border-white/10 text-white/20'
                }`}
            >
                <Scan className="w-6 h-6" />
                {status === 'open' ? 'Acceso Concedido' : 'Escaneando...'}
                {status === 'success' && 'Activar Entrada'}
            </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
      `}</style>
    </div>
  );
};


export default HomePage;
