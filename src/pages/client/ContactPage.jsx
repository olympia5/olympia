import React from 'react';
import { Instagram, Phone, Music2, ExternalLink, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ContactPage = () => {
  const { settings } = useAuth();

  const contacts = [
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-500',
      shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      cta: 'Seguinos',
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-green-600 to-green-400',
      shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
      cta: 'Escribinos',
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      icon: <Music2 className="w-6 h-6" />,
      color: 'from-zinc-800 to-zinc-600',
      shadow: 'shadow-[0_0_20px_rgba(255,255,255,0.1)]',
      cta: 'Ver videos',
    },
  ];

  return (
    <div className="min-h-screen pt-8 px-4 md:px-8 lg:px-16 pb-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 p-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl">
          <h1 className="text-6xl font-bebas text-white tracking-widest flex items-center gap-3">
            <Phone className="w-10 h-10 text-olympia-red" />
            Contacto
          </h1>
          <p className="text-xs text-white/30 uppercase tracking-[0.3em] mt-2">Seguinos y contactanos</p>
        </div>

        {/* Social media cards */}
        <div className="grid gap-4">
          {settings?.socialLinks?.map((c, idx) => {
            if (!c?.name || !c?.url) return null;
            return (
              <a
                key={idx}
                href={c.url.startsWith('http') ? c.url : `https://${c.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-olympia-red/10 hover:border-olympia-red/30 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-olympia-red/10 flex items-center justify-center text-olympia-red">
                    {c.name.toLowerCase().includes('insta') ? <Instagram className="w-6 h-6" /> : 
                     c.name.toLowerCase().includes('tik') ? <Music2 className="w-6 h-6" /> : 
                     c.name.toLowerCase().includes('whatsapp') ? <MessageCircle className="w-6 h-6" /> : 
                     <ExternalLink className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-2xl font-bebas tracking-widest text-white">{c.name}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{c.url.replace('https://', '').replace('http://', '')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 group-hover:bg-olympia-red text-white px-4 py-2 rounded-xl transition-all">
                  <span className="text-xs font-bold uppercase tracking-widest">Seguir</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}

          {/* Placeholder if no contacts configured */}
          {(!settings.socialLinks || settings.socialLinks.length === 0) && (
            <div className="text-center py-16 text-white/20">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm uppercase tracking-widest">Sin contactos configurados</p>
              <p className="text-xs mt-1">El administrador debe cargarlos desde el panel</p>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-sm text-white/50">
            Seguinos en redes sociales para ver rutinas, consejos de entrenamiento y novedades del coliseo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
