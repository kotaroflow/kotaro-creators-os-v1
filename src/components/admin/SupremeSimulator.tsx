import React, { useState } from 'react';
import { User, NazarickRole, OperationalMode, CreatorFragment } from '../../types';
import { Shield, Settings, X, RefreshCw, BarChart, Eye, Infinity as InfinityIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

import { SimulationState } from '../../types';

interface SupremeSimulatorProps {
  realUser: User;
  simulationState: SimulationState;
  onStartSimulation: (sim: Partial<User>, targetFragment?: CreatorFragment) => void;
  onDiscard: () => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export default function SupremeSimulator({ realUser, simulationState, onStartSimulation, onDiscard, onClose, isDarkMode }: SupremeSimulatorProps) {
  const [draft, setDraft] = useState<Partial<User>>(simulationState.marioneteNazarick || {
    role: realUser.role,
    rank: realUser.rank,
    level: realUser.level,
    operationalMode: realUser.operationalMode,
    xp: realUser.xp,
    karma: realUser.karma
  });
  
  const [draftFragment, setDraftFragment] = useState<CreatorFragment>(simulationState.isActive && simulationState.simulatedFragment ? simulationState.simulatedFragment : CreatorFragment.MOMONGA);

  if (realUser.role !== NazarickRole.MOMONGA) return null;

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'USER_NEW':
        setDraft(prev => ({ ...prev, role: NazarickRole.PESTONYA, level: 1, rank: 'F', operationalMode: OperationalMode.EASY }));
        break;
      case 'USER_ADV':
        setDraft(prev => ({ ...prev, role: NazarickRole.DEMIURGE, level: 100, rank: 'A', operationalMode: OperationalMode.HARD }));
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "w-full max-w-2xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]",
          isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
        )}
      >
        <div className={cn("p-6 border-b relative overflow-hidden", isDarkMode ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-200")}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
           <div className="relative z-10 flex justify-between items-start">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <Shield className="w-5 h-5 text-indigo-500" />
                 <h2 className={cn("font-black text-xl tracking-tighter uppercase", isDarkMode ? "text-white" : "text-slate-900")}>
                   Simulador dos Seres Supremos
                 </h2>
               </div>
               <p className="text-xs text-slate-500 max-w-sm italic">
                “Alterne entre níveis, ranks e permissões para testar o destino de cada usuário antes que a ordem seja enviada ao mundo real.”
               </p>
             </div>
             <button onClick={onClose} className="p-2 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 transition-colors">
               <X className="w-5 h-5" />
             </button>
           </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Cenários Rápidos */}
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Cenários Prontos</label>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => applyPreset('USER_NEW')} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors", isDarkMode ? "bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600")}>Usuário Iniciante</button>
              <button onClick={() => applyPreset('USER_ADV')} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors", isDarkMode ? "bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600")}>Usuário Avançado</button>
            </div>
          </div>

          <div className="h-px bg-slate-500/20 w-full" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Cargo / Função</label>
              <select
                value={draft.role || ''}
                onChange={(e) => setDraft(prev => ({ ...prev, role: e.target.value as NazarickRole }))}
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none transition-all",
                  isDarkMode ? "bg-slate-800 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                )}
              >
                {Object.values(NazarickRole).filter(r => r !== NazarickRole.MOMONGA).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Level do Usuário</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={draft.level === Infinity ? 9999 : draft.level || 1}
                  onChange={(e) => setDraft(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none transition-all font-mono",
                    isDarkMode ? "bg-slate-800 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Rank de Nazarick</label>
              <select
                value={draft.rank || 'F'}
                onChange={(e) => setDraft(prev => ({ ...prev, rank: e.target.value }))}
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none transition-all font-mono",
                  isDarkMode ? "bg-slate-800 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                )}
              >
                {['F', 'E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'SS', 'SSS'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Cenário de XP</label>
              <input
                type="number"
                value={draft.xp || 0}
                onChange={(e) => setDraft(prev => ({ ...prev, xp: parseInt(e.target.value) || 0 }))}
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm font-bold border outline-none transition-all font-mono",
                  isDarkMode ? "bg-slate-800 border-white/10 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500"
                )}
              />
            </div>
          </div>
          
          <div className={cn("p-4 rounded-xl border flex items-center gap-4", isDarkMode ? "bg-white/5 border-white/10" : "bg-indigo-50 border-indigo-100")}>
             <Eye className={cn("w-6 h-6", isDarkMode ? "text-indigo-400" : "text-indigo-600")} />
             <div>
                <p className={cn("text-xs font-bold", isDarkMode ? "text-white" : "text-slate-900")}>Modo Admin / Testador Oficial</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Ativa a interface especial para testar permissões, botões e restrições pelo perfil escolhido.</p>
             </div>
          </div>
        </div>

        <div className={cn("p-6 border-t flex flex-col md:flex-row items-center justify-between gap-4", isDarkMode ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-200")}>
          <div className="flex items-center gap-2">
             <button
               onClick={onDiscard}
               className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
             >
               <RefreshCw className="w-4 h-4" />
               Descartar Simulação
             </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3">
             <button
               onClick={() => alert("Janela de comparação será aberta na próxima atualização de sistema.")}
               className={cn(
                 "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-colors border",
                 isDarkMode ? "bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
               )}
             >
               <BarChart className="w-4 h-4" />
               Comparar Cenários
             </button>
             <button
               onClick={() => onStartSimulation(draft, draftFragment)}
               className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
             >
               Ativar Simulação
               <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
