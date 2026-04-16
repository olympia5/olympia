import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, ShoppingCart, Timer, Zap } from 'lucide-react';
import { useAuth, getDaysRemaining } from '../../context/AuthContext';

const MembershipPage = () => {
  const { user, settings, activateMembership } = useAuth();
  const [activating, setActivating] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  const daysLeft = getDaysRemaining(user?.membership_end || user?.membershipEnd);
  const isActive = user?.status === 'active' && daysLeft > 0;

  // Porcentaje de tiempo restante (de 30 días)
  const progressPercent = isActive ? Math.round((daysLeft / 30) * 100) : 0;

  const urgencyColor = daysLeft <= 3 ? '#ef4444' : daysLeft <= 7 ? '#eab308' : '#22c55e';

  const handleActivate = () => {
    if (settings.mercadoPagoLink) {
      // Abrir link de pago en nueva tab
      window.open(settings.mercadoPagoLink, '_blank', 'noopener,noreferrer');
    }
    // Activamos automáticamente para simulación (en producción esperarías webhook de MP)
    setActivating(true);
    setTimeout(() => {
      activateMembership();
      setActivating(false);
      setJustActivated(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-8 px-4 md:px-8 lg:px-16 pb-16">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="p-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl">
          <h1 className="text-6xl font-bebas text-white tracking-widest flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-olympia-red" />
            Membresía
          </h1>
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] mt-2">Estado de tu cuota mensual</p>
        </div>

        {/* Status card */}
        <div className={`rounded-2xl p-6 border ${
          justActivated || isActive
            ? 'bg-green-500/5 border-green-500/20'
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Estado</p>
              <div className={`text-3xl font-bebas tracking-widest flex items-center gap-2 ${
                isActive || justActivated ? 'text-green-400' : 'text-red-400'
              }`}>
                {isActive || justActivated
                  ? <><CheckCircle className="w-7 h-7" /> ACTIVA</>
                  : <><AlertCircle className="w-7 h-7" /> {user?.status === 'expired' ? 'VENCIDA' : 'INACTIVA'}</>
                }
              </div>
            </div>
            {isActive && (
              <div className="text-right">
                <p className="text-xs text-white/30 uppercase tracking-widest">Vence</p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {new Date(user?.membership_end || user?.membershipEnd).toLocaleDateString('es-AR', { day: '2-digit', month: 'long' })}
                </p>
              </div>
            )}
          </div>

          {/* Días restantes con progress bar */}
          {isActive && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" style={{ color: urgencyColor }} />
                  <span className="text-xs text-white/50 uppercase tracking-wider">Días restantes</span>
                </div>
                <span className="text-2xl font-bebas tracking-widest" style={{ color: urgencyColor }}>
                  {daysLeft} / 30
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%`, backgroundColor: urgencyColor }}
                />
              </div>
              {daysLeft <= 7 && (
                <p className="text-xs text-yellow-400/60 mt-2">
                  ⚠️ Tu membresía vence pronto. Renovate para no perder acceso.
                </p>
              )}
            </div>
          )}

          {justActivated && (
            <p className="text-sm text-green-400 mt-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ¡Membresía activada! Tenés 30 días de acceso completo.
            </p>
          )}
        </div>

        {/* Price card */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Cuota mensual</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bebas text-white tracking-wider">
                  ${Number(settings.membershipPrice || 0).toLocaleString('es-AR')}
                </span>
                <span className="text-sm text-white/40 uppercase">{settings.membershipCurrency || 'ARS'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/30 uppercase tracking-widest">30 días</p>
              <p className="text-xs text-white/20 mt-0.5">de acceso completo</p>
            </div>
          </div>

          {/* Benefits */}
          <ul className="space-y-2.5 mb-8">
            {[
              'Acceso ilimitado a musculación',
              'Clases de cardio y funcional',
              'Plan de entrenamiento personalizado',
              'Seguimiento de progreso',
              'Acceso a Galería del coliseo',
            ].map(b => (
              <li key={b} className="flex items-center gap-3 text-sm text-white/50">
                <CheckCircle className="w-4 h-4 text-olympia-red shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* Pay button */}
          <button
            onClick={handleActivate}
            disabled={activating}
            className={`btn-spartan w-full py-4 text-base uppercase tracking-widest transition-all ${
              activating ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {activating ? (
              <><Zap className="w-5 h-5 animate-pulse" /> Procesando pago...</>
            ) : isActive ? (
              <><ShoppingCart className="w-5 h-5" /> Renovar membresía<ExternalLink className="w-4 h-4 ml-auto opacity-60" /></>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> Pagar con MercadoPago<ExternalLink className="w-4 h-4 ml-auto opacity-60" /></>
            )}
          </button>
        </div>

        <p className="text-xs text-white/15 text-center uppercase tracking-widest leading-relaxed">
          El pago se procesa de forma segura a través de MercadoPago.
          <br />Tu membresía se activa automáticamente tras la acreditación.
        </p>
      </div>
    </div>
  );
};

export default MembershipPage;
