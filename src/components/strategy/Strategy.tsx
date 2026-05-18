import React from 'react';
import { User, Profile, OperationalMode, NazarickRole } from '../../types';
import { Target, TrendingUp, Users, Search, ChevronRight, Globe, Zap, Info, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { getLayoutTheme } from '../../lib/theme';

export default function Strategy({ user, profile, isDarkMode, currentFragment = 'MOMONGA' }: { user: User, profile: Profile, isDarkMode?: boolean, currentFragment?: string }) {
  const insights = [
    { id: 1, title: 'Tendência: Minimalismo Digital', strength: '95%', trend: 'up' },
    { id: 2, title: 'Público: Micro-influenciadores', strength: '88%', trend: 'up' },
    { id: 3, title: 'Formato: Vídeos de 15s', strength: '92%', trend: 'up' },
  ];

  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode || false);

  const isSupreme = user.role === NazarickRole.MOMONGA;
  const isHighLevel = isSupreme || user.role === NazarickRole.ALBEDO || user.role === NazarickRole.DEMIURGE;
  const isSimplified = (user.operationalMode === OperationalMode.EASY || user.operationalMode === OperationalMode.NORMAL) && !isSupreme;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className={cn("flex items-center justify-between border-b pb-8 transition-colors", layoutTheme.border)}>
        <div className="flex items-center gap-4">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors text-white", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h2 className={cn("font-bold text-3xl tracking-tight uppercase transition-colors", layoutTheme.textPrimary)}>
              {isHighLevel ? 'Núcleo de Estratégia Supra' : 'Núcleo de Estratégia'}
            </h2>
            <p className={cn("text-[10px] uppercase font-black tracking-widest leading-none mt-1", layoutTheme.textSecondary)}>Análise de Mercado para {profile.niche}</p>
          </div>
        </div>
        {isSimplified ? (
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest animate-pulse whitespace-nowrap transition-colors bg-amber-500/10 text-amber-500 border-amber-500/20")}>
            <Info className="w-3 h-3" /> Modo Simples Ativo
          </div>
        ) : isSupreme && (
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-[0.2em] shadow-lg", layoutTheme.bgDim, layoutTheme.accentText, layoutTheme.border)}>
            <ShieldAlert className="w-3 h-3" /> Acesso de Criador
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cn(
          "p-10 border rounded-3xl transition-all duration-500",
          isDarkMode ? "bg-slate-900 shadow-2xl" : "bg-white shadow-sm",
          layoutTheme.border
        )}>
          <h3 className={cn("font-black mb-8 flex items-center gap-3 uppercase text-[11px] tracking-widest transition-colors", layoutTheme.textPrimary)}>
            <Globe className={cn("w-4 h-4", layoutTheme.accentText)} /> Insights de Mercado
          </h3>
          <div className="space-y-4">
            {insights.map(i => (
              <div key={i.id} className={cn("flex items-center justify-between p-6 border rounded-3xl group transition-all", isDarkMode ? "bg-black/20" : "bg-slate-50", layoutTheme.borderHoverBase, layoutTheme.border)}>
                <div className="flex items-center gap-5">
                   <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", layoutTheme.bgDim, layoutTheme.accentText)}>
                     <TrendingUp className="w-6 h-6" />
                   </div>
                   <div>
                     <p className={cn("text-sm font-black transition-colors", layoutTheme.textPrimary)}>{i.title}</p>
                     <p className={cn("text-[10px] uppercase font-bold tracking-widest", layoutTheme.textSecondary)}>Sinergia: {i.strength}</p>
                   </div>
                </div>
                {!isSimplified && <ChevronRight className={cn("w-5 h-5 transition-colors", layoutTheme.textSecondary, layoutTheme.accentTextGroupHover)} />}
              </div>
            ))}
          </div>
        </div>

        <div className={cn("p-10 text-white border-none shadow-2xl rounded-3xl relative overflow-hidden group", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-[80px] pointer-events-none"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-6 h-6 text-white/70" />
              <h3 className="font-black uppercase tracking-widest text-[11px] text-white/90">
                {isHighLevel ? 'Otimizador GAIA — Protocolo Supremo' : 'Otimizador GAIA'}
              </h3>
            </div>
            <p className="text-2xl font-bold mb-8 leading-tight tracking-tight text-white drop-shadow-md">"Seu nicho ({profile.niche}) está em alta nos domingos à noite."</p>
            <div className="p-8 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md mb-10 shadow-inner">
               <p className="text-[10px] uppercase font-black tracking-widest mb-3 opacity-70 text-white/80">
                 {isSupreme ? 'Sinal Supra-Ajustado' : 'Sinergia Sugerida'}
               </p>
               <p className="text-base italic font-medium leading-relaxed text-white">"Foque em conteúdos de 'Bastidores' para aumentar sua retenção orgânica."</p>
            </div>
            {!isSimplified && (
              <button className={cn("w-full py-5 bg-white font-black rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all shadow-xl shadow-black/20", layoutTheme.accentText)}>
                Executar Análise Profunda
              </button>
            )}
            {isSimplified && (
              <div className="text-[10px] text-white/80 font-black text-center p-3 border border-white/10 rounded-2xl bg-white/5 uppercase tracking-widest">
                Análise Profunda Limitada {isHighLevel ? 'no modo atual' : 'para seu cargo'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
