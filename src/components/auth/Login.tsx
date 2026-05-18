import React from 'react';
import { Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleLogin = () => {
    setIsSigningIn(true);
    window.setTimeout(() => {
      onLogin();
      setIsSigningIn(false);
    }, 250);
  };

  // Simulated poster grid for background
  const posters = Array.from({ length: 48 }).map((_, i) => (
    <div 
      key={i} 
      className="aspect-[2/3] bg-slate-900 rounded-sm overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute inset-0 flex items-end p-2">
        <div className="h-1 w-full bg-indigo-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-1/3" />
        </div>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Poster Grid */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1 opacity-20 scale-110 pointer-events-none rotate-2">
        {posters}
      </div>
      
      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-lg p-10 md:p-16 text-center relative z-10 shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-10 shadow-[0_0_50px_rgba(79,70,229,0.4)]"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
        
        <h1 className="font-sans font-black text-4xl text-white mb-2 tracking-tighter uppercase">CREA.OS</h1>
        <p className="text-zinc-500 mb-12 text-[10px] uppercase font-black tracking-[0.4em]">Protocolo de Governança</p>
        
        <div className="space-y-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={isSigningIn}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg text-sm flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 group uppercase tracking-widest disabled:opacity-60 disabled:cursor-wait"
          >
            <LogIn className="w-5 h-5 text-indigo-200" />
            {isSigningIn ? 'Entrando...' : 'Entrar no sistema'}
          </motion.button>

          <p className="text-[10px] text-zinc-500 font-medium">
            Sistema de gestão avançada para a elite de Nazarick.
          </p>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-500/50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Sincronia Criptografada</span>
          </div>
          <p className="text-[8px] text-zinc-600 uppercase tracking-widest max-w-[200px] mx-auto">
            Ao entrar você aceita os termos de serviço e os protocolos de segurança.
          </p>
        </div>
      </motion.div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] text-zinc-700 font-bold tracking-[0.5em] uppercase">MOMONGA INTEGRATED SYSTEMS</p>
      </div>
    </div>
  );
}
