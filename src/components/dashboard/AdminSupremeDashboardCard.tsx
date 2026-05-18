import React from 'react';
import { User, CreatorFragment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Infinity as InfinityIcon, Shield, Zap, Sparkles } from 'lucide-react';

interface AdminSupremeDashboardCardProps {
  user: User;
  isDarkMode?: boolean;
  activeFragment?: CreatorFragment;
}

export default function AdminSupremeDashboardCard({ user, isDarkMode, activeFragment }: AdminSupremeDashboardCardProps) {
  const getFragmentStyle = () => {
    switch (activeFragment) {
      case CreatorFragment.MATHEUS:
        return {
          bg: isDarkMode ? "from-[#0a0804] via-[#1a1406] to-[#0a0804]" : "from-[#fffcf5] via-[#fcf0d4] to-[#f7dfa3]",
          border: "border-[#C9A227]/40",
          ring: "ring-[#C9A227]/20",
          textPrimary: isDarkMode ? "text-[#ffd700]" : "text-[#b8860b]",
          textSecondary: isDarkMode ? "text-[#C9A227]" : "text-[#8a5a12]",
          textHighlight: isDarkMode ? "text-[#ffea99]" : "text-[#5e4101]",
          glow: "shadow-[0_0_100px_rgba(201,162,39,0.3)]",
          glowText: "",
          accent: "text-[#C9A227]",
          particle: "bg-[#C9A227]"
        };
      case CreatorFragment.KOTARO:
        return {
          bg: isDarkMode ? "from-[#020612] via-[#051029] to-[#020612]" : "from-[#f5f8ff] via-[#d6e4fc] to-[#baccf2]",
          border: "border-[#3b82f6]/40",
          ring: "ring-[#3b82f6]/20",
          textPrimary: isDarkMode ? "text-[#60a5fa]" : "text-[#1d4ed8]",
          textSecondary: isDarkMode ? "text-[#3b82f6]" : "text-[#1e3a8a]",
          textHighlight: isDarkMode ? "text-[#dbeafe]" : "text-[#1e40af]",
          glow: "shadow-[0_0_100px_rgba(59,130,246,0.3)]",
          glowText: "",
          accent: "text-[#3b82f6]",
          particle: "bg-[#3b82f6]"
        };
      case CreatorFragment.MOMONGA:
      default:
        return {
          bg: isDarkMode ? "from-[#05040A] via-[#1d1606] to-[#05040A]" : "from-[#fffaf0] via-[#f7e8ba] to-[#e7c86a]",
          border: "border-[#D4AF37]/40",
          ring: "ring-[#D4AF37]/20",
          textPrimary: isDarkMode ? "text-[#D4AF37]" : "text-[#A67C00]", // Dourado do título Momonga
          textSecondary: isDarkMode ? "text-[#f3d277]" : "text-[#7c4f00]",
          textHighlight: isDarkMode ? "text-[#f5d97f]" : "text-[#4d3900]",
          glow: "shadow-[0_24px_70px_rgba(120,84,12,0.20)]",
          glowText: "",
          accent: "text-[#D4AF37]",
          particle: "bg-[#D4AF37]"
        };
    }
  };

  const theme = getFragmentStyle();

  return (
    <div className="w-full relative group">
      <div className={cn("absolute inset-x-8 top-0 h-px opacity-70 transition-all duration-1000", theme.particle)} />
      
      <motion.div
        key={activeFragment || 'default'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative overflow-hidden rounded-[3rem] w-full border transition-all duration-1000 ring-1",
          "bg-gradient-to-br",
          theme.bg,
          theme.border,
          theme.ring,
          theme.glow
        )}
      >
        {/* Decorative Yggdrasil Tree Base Background Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <svg className="absolute inset-x-0 bottom-0 w-full h-[120%] opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
             {/* Abstract Yggdrasil roots and branches */}
             <path d="M50,100 Q45,70 30,50 T10,20 M50,100 Q55,70 70,50 T90,20 M50,100 Q50,60 50,20" stroke="currentColor" fill="none" strokeWidth="0.5" className={theme.accent} />
             <path d="M48,80 Q35,65 20,55 M52,80 Q65,65 80,55" stroke="currentColor" fill="none" strokeWidth="0.2" className={theme.accent} />
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_80%)]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between h-full p-8 md:p-12 gap-8 md:gap-12">
          
          {/* Left Column - Titles and Authority */}
          <div className="flex flex-col justify-between flex-1 gap-10">
            {/* Header */}
            <div className="flex flex-col items-start gap-4">
               <div className="relative inline-flex px-4 py-1.5 rounded-full border border-current bg-current/10 glass-control overflow-hidden">
                 <div className="absolute -inset-1 opacity-40 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 animate-pulse" />
                 <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] relative z-10", theme.textHighlight)}>Admin Real</span>
               </div>
               <h2 className={cn("text-3xl md:text-5xl font-black uppercase tracking-tighter font-serif leading-tight relative", theme.textPrimary, theme.glowText)}>
                 {activeFragment || CreatorFragment.MOMONGA}<br/><span className={cn("text-xl md:text-3xl tracking-widest block mt-1", theme.textSecondary)}>Criador Supremo</span>
               </h2>
            </div>
            
            {/* Badges/Seals */}
            <div className="flex flex-col gap-4">
               <div className={cn("flex items-center gap-3 w-max p-3 px-5 rounded-2xl bg-black/20 dark:bg-black/60 border glass-control", theme.border)}>
                 <Shield className={cn("w-4 h-4", theme.textHighlight)} />
                 <span className={cn("text-xs md:text-sm font-bold tracking-widest uppercase", theme.textSecondary)}>Selo Ainz Ooal Gown</span>
               </div>
            </div>
          </div>

          {/* Center Column - Yggdrasil Core and Infinity */}
          <div className="flex flex-col items-center justify-center flex-1 relative min-h-[300px]">
             <div className={cn("absolute inset-x-12 top-1/2 h-px opacity-60 transition-opacity duration-700", theme.particle)} />
             
             {/* Runic Orbits */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
               className={cn("absolute w-[280px] h-[280px] rounded-full border-[1.5px] border-dashed opacity-30", theme.border)}
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
               className={cn("absolute w-[240px] h-[240px] rounded-full border border-dotted opacity-40", theme.border)}
             />
             
             <div className="relative z-10 flex flex-col items-center">
                <span className={cn("text-[12px] md:text-[14px] font-black uppercase tracking-[0.5em] mb-2", theme.textSecondary, theme.glowText)}>
                  Level
                </span>
                <span className={cn("text-[100px] md:text-[140px] leading-[0.8] font-bold select-none", theme.textPrimary, theme.glowText)}>
                  ∞
                </span>
                
                <div className={cn("text-lg md:text-xl font-bold uppercase tracking-[0.4em] font-serif mt-6", theme.textHighlight)}>
                  Yggdrasil Core
                </div>
             </div>
          </div>

          {/* Right Column - System Authority & Stats */}
          <div className="flex flex-col justify-end flex-1 gap-4">
             <div className={cn("flex flex-col p-5 rounded-2xl bg-black/20 dark:bg-black/60 border glass-control relative overflow-hidden", theme.border)}>
               <div className={cn("absolute inset-0 opacity-15 bg-gradient-to-r from-transparent via-current to-transparent", theme.particle)} />
               <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80", theme.textPrimary)}>Governância Systema</span>
               <span className={cn("text-sm md:text-base font-bold tracking-widest", theme.textSecondary)}>Permissões Absolutas</span>
             </div>

             <div className={cn("flex flex-col p-5 rounded-2xl bg-black/20 dark:bg-black/60 border glass-control", theme.border)}>
               <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80", theme.textPrimary)}>Desempenho</span>
               <span className={cn("text-sm md:text-base font-bold tracking-widest", theme.textSecondary)}>XP: Não Limitado</span>
             </div>

             <div className={cn("flex flex-col p-5 rounded-2xl bg-black/20 dark:bg-black/60 border glass-control relative overflow-hidden mt-2", theme.border)}>
               <div className="absolute top-0 right-4 w-2 h-[1px] bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
               <div className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 rounded-full bg-red-900/40 border border-red-500/30 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
               </div>
               
               <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-80", theme.textPrimary)}>Karma do Soberano</span>
               <span className={cn("text-sm md:text-base font-bold tracking-[0.1em]", theme.textHighlight, theme.glowText)}>Autoridade Suprema</span>
               <span className={cn("text-[10px] font-medium tracking-wide mt-2 opacity-70", theme.textPrimary)}>Grande Tumba de Nazarick: Controle Total</span>
             </div>
             
             {/* Fragment Identifier */}
             <div className={cn("flex items-center gap-2 mt-2", theme.textSecondary)}>
               <Zap className="w-3 h-3" />
               <span className="text-[9px] font-black uppercase tracking-widest">
                 Corrente: {activeFragment || CreatorFragment.MOMONGA}
               </span>
             </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
