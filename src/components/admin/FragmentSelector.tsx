import React from 'react';
import { CreatorFragment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { X, DollarSign, PenTool, Shield, Layers } from 'lucide-react';

interface FragmentSelectorProps {
  activeFragment: CreatorFragment;
  onSelect: (fragment: CreatorFragment) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function FragmentSelector({ activeFragment, onSelect, onClose, isDarkMode }: FragmentSelectorProps) {
  const fragments = [
    {
      id: CreatorFragment.MATHEUS,
      title: 'MATHEUS',
      subtitle: 'Comercio & Expansao',
      description: 'Foco operacional para vendas, afiliados, campanhas, produtos, links, comissoes, funis e analise comercial.',
      icon: DollarSign,
      color: 'from-white/70 to-slate-300/56',
      lightBg: 'glass-panel-light border-white/70',
      darkBg: 'glass-panel border-white/12',
      activeBorder: 'border-white/70 ring-1 ring-white/24'
    },
    {
      id: CreatorFragment.KOTARO,
      title: 'KOTARO',
      subtitle: 'Forja & Oficina',
      description: 'Foco operacional para ideias, roteiros, prompts, imagens, videos, edicao, audios, trends e identidade.',
      icon: PenTool,
      color: 'from-white/70 to-slate-300/56',
      lightBg: 'glass-panel-light border-white/70',
      darkBg: 'glass-panel border-white/12',
      activeBorder: 'border-white/70 ring-1 ring-white/24'
    },
    {
      id: CreatorFragment.MOMONGA,
      title: 'MOMONGA',
      subtitle: 'Autoridade & Regras',
      description: 'Foco operacional para cargos, permissoes, regras, Sistema de Evolucao, seguranca estrutural e governanca.',
      icon: Shield,
      color: 'from-white/70 to-slate-300/56',
      lightBg: 'glass-panel-light border-white/70',
      darkBg: 'glass-panel border-white/12',
      activeBorder: 'border-white/70 ring-1 ring-white/24'
    }
  ];

  const themeColor = "bg-white/60";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "w-full max-w-5xl rounded-lg border overflow-hidden flex flex-col",
          isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-slate-200/70"
        )}
      >
        <div className="p-8 relative overflow-hidden border-b border-white/12">
          <div className={cn("absolute inset-x-0 top-0 h-px pointer-events-none transition-colors", themeColor)} />
          <div className={cn("absolute inset-x-10 bottom-0 h-px pointer-events-none transition-colors opacity-40", themeColor)} />

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center border shadow-inner",
                  isDarkMode ? "bg-slate-800 border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                )}>
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className={cn("font-black text-2xl tracking-tighter uppercase", isDarkMode ? "text-white" : "text-slate-900")}>
                  Fragmentos Operacionais
                </h2>
              </div>
              <p className="text-sm text-slate-500 max-w-xl font-medium">
                Escolha o foco de trabalho da sua conta suprema. Fragmentos nao sao simulacao; eles controlam o setor real em foco no OS.
              </p>
            </div>
            <button onClick={onClose} className={cn("p-2 rounded-lg transition-colors", isDarkMode ? "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800")}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative z-10 flex items-center gap-2 border-b border-white/10 mt-4">
            <button
              className={cn(
                "px-6 py-3 text-xs font-black uppercase tracking-widest relative transition-colors",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
            >
              Foco Ativo
              <div className={cn("absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full", themeColor)} />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key="fragments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"
            >
              {fragments.map((frag) => {
                const isActive = activeFragment === frag.id;

                return (
                  <button
                    key={frag.id}
                    onClick={() => onSelect(frag.id)}
                    className={cn(
                      "relative group p-6 rounded-lg border text-left transition-colors duration-200 overflow-hidden flex flex-col",
                      isDarkMode ? frag.darkBg : frag.lightBg,
                      isActive ? frag.activeBorder : "hover:border-white/60"
                    )}
                  >
                    <div className={cn("absolute inset-x-4 top-0 h-px opacity-40 transition-opacity bg-gradient-to-r", frag.color)} />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className={cn(
                        "w-14 h-14 rounded-lg mb-6 flex items-center justify-center border bg-gradient-to-br text-slate-700 dark:text-white border-white/35",
                        frag.color
                      )}>
                        <frag.icon className="w-7 h-7" />
                      </div>

                      <h3 className={cn("text-xl font-black uppercase tracking-tighter mb-1", isDarkMode ? "text-white" : "text-slate-900")}>
                        {frag.title}
                      </h3>
                      <p className={cn("text-xs font-black uppercase tracking-widest mb-4", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                        {frag.subtitle}
                      </p>

                      <p className={cn("text-sm font-medium leading-relaxed flex-1", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        {frag.description}
                      </p>

                      <div className="mt-8 pt-4 border-t border-slate-500/20 flex justify-between items-center">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors",
                          isActive ? (isDarkMode ? "text-white" : "text-slate-900") : "text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300"
                        )}>
                          {isActive ? 'Foco Real Ativo' : 'Ativar Foco'}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
