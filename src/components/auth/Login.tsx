import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error("Login failed", error);
    }
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
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg text-sm flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 group uppercase tracking-widest"
          >
            <svg className="w-5 h-5 text-indigo-200" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Entrar com Google
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
