import React, { useState } from 'react';
import { User, NazarickRole, OperationalMode, CreatorFragment, SimulationState } from '../../types';
import { Shield, X, RefreshCw, BarChart, Eye, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { getLayoutTheme } from '../../lib/theme';

interface SupremeSimulatorProps {
  realUser: User;
  simulationState: SimulationState;
  onStartSimulation: (sim: Partial<User>) => void;
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
    karma: realUser.karma,
    levelLimitBreak: realUser.levelLimitBreak,
  });

  const modalTheme = getLayoutTheme(CreatorFragment.MOMONGA, isDarkMode);

  if (realUser.role !== NazarickRole.MOMONGA) return null;

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'USER_NEW':
        setDraft(prev => ({ ...prev, role: NazarickRole.PESTONYA, level: 1, rank: 'F', operationalMode: OperationalMode.EASY, xp: 0, karma: 0 }));
        break;
      case 'USER_CREATOR':
        setDraft(prev => ({ ...prev, role: NazarickRole.PLEIADES, level: 35, rank: 'C', operationalMode: OperationalMode.NORMAL, xp: 420, karma: 12 }));
        break;
      case 'USER_ADV':
        setDraft(prev => ({ ...prev, role: NazarickRole.DEMIURGE, level: 100, rank: 'A', operationalMode: OperationalMode.HARD, xp: 2400, karma: 55 }));
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cn(
          "w-full max-w-3xl rounded-lg border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]",
          isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-slate-200/70"
        )}
      >
        <div className={cn("p-6 border-b relative overflow-hidden", isDarkMode ? "bg-white/5 border-white/10" : "bg-white/35 border-white/50")}>
          <div className={cn("absolute inset-x-0 top-0 h-px", modalTheme.accentBg)} />
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className={cn("w-5 h-5", modalTheme.accentText)} />
                <h2 className={cn("font-black text-xl tracking-tighter uppercase", isDarkMode ? "text-white" : "text-slate-900")}>
                  Simulador dos Seres Supremos
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Testa cargos, ranks, XP e permissoes sem alterar foco operacional, perfis ou dados reais.
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div>
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Cenarios Prontos</label>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => applyPreset('USER_NEW')} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors", isDarkMode ? "bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600")}>Usuario Iniciante</button>
              <button onClick={() => applyPreset('USER_CREATOR')} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors", isDarkMode ? "bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600")}>Criador Intermediario</button>
              <button onClick={() => applyPreset('USER_ADV')} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors", isDarkMode ? "bg-slate-800 border-white/10 hover:bg-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600")}>Usuario Avancado</button>
            </div>
          </div>

          <div className={cn("p-4 rounded-lg border flex items-start gap-4 glass-control", isDarkMode ? "bg-white/5 border-white/10" : "bg-white/45 border-white/70")}>
            <Lock className={cn("w-5 h-5 mt-0.5", modalTheme.accentText)} />
            <div>
              <p className={cn("text-xs font-black uppercase tracking-widest", isDarkMode ? "text-white" : "text-slate-900")}>Foco real preservado</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                A simulacao nao troca o foco real da conta suprema. Ela existe apenas para testar mecanicas de usuario, cargo e permissao.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Cargo / Funcao</label>
              <select
                value={draft.role || ''}
                onChange={(e) => setDraft(prev => ({ ...prev, role: e.target.value as NazarickRole }))}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm font-bold border outline-none transition-colors glass-control",
                  isDarkMode ? cn("text-white", modalTheme.borderHoverBase) : cn("text-slate-900", modalTheme.borderHoverBase)
                )}
              >
                {Object.values(NazarickRole).filter(r => r !== NazarickRole.MOMONGA).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Modo Operacional</label>
              <select
                value={draft.operationalMode || OperationalMode.NORMAL}
                onChange={(e) => setDraft(prev => ({ ...prev, operationalMode: e.target.value as OperationalMode }))}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm font-bold border outline-none transition-colors glass-control",
                  isDarkMode ? cn("text-white", modalTheme.borderHoverBase) : cn("text-slate-900", modalTheme.borderHoverBase)
                )}
              >
                {Object.values(OperationalMode).map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Level</label>
              <input
                type="number"
                min={1}
                value={draft.level === Infinity ? 9999 : draft.level || 1}
                onChange={(e) => setDraft(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm font-bold border outline-none transition-colors font-mono",
                  isDarkMode ? cn("bg-white/10 border-white/10 text-white", modalTheme.borderHoverBase) : cn("bg-white/60 border-white/70 text-slate-900", modalTheme.borderHoverBase)
                )}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Rank</label>
              <select
                value={draft.rank || 'F'}
                onChange={(e) => setDraft(prev => ({ ...prev, rank: e.target.value }))}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm font-bold border outline-none transition-colors font-mono",
                  isDarkMode ? cn("bg-white/10 border-white/10 text-white", modalTheme.borderHoverBase) : cn("bg-white/60 border-white/70 text-slate-900", modalTheme.borderHoverBase)
                )}
              >
                {['F', 'E-', 'E', 'E+', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+', 'S', 'SS', 'SSS'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">XP</label>
              <input
                type="number"
                min={0}
                value={draft.xp || 0}
                onChange={(e) => setDraft(prev => ({ ...prev, xp: parseInt(e.target.value) || 0 }))}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm font-bold border outline-none transition-colors font-mono",
                  isDarkMode ? cn("bg-white/10 border-white/10 text-white", modalTheme.borderHoverBase) : cn("bg-white/60 border-white/70 text-slate-900", modalTheme.borderHoverBase)
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 block">Karma</label>
              <input
                type="number"
                value={draft.karma || 0}
                onChange={(e) => setDraft(prev => ({ ...prev, karma: parseInt(e.target.value) || 0 }))}
                className={cn(
                  "w-full px-4 py-3 rounded-lg text-sm font-bold border outline-none transition-colors font-mono",
                  isDarkMode ? cn("bg-white/10 border-white/10 text-white", modalTheme.borderHoverBase) : cn("bg-white/60 border-white/70 text-slate-900", modalTheme.borderHoverBase)
                )}
              />
            </div>
            <label className={cn("p-4 rounded-lg border flex items-center gap-3 cursor-pointer glass-control", isDarkMode ? "border-white/10" : "border-white/70")}>
              <input
                type="checkbox"
                checked={Boolean(draft.levelLimitBreak)}
                onChange={(e) => setDraft(prev => ({ ...prev, levelLimitBreak: e.target.checked }))}
                className="h-4 w-4"
              />
              <span className={cn("text-xs font-black uppercase tracking-widest", isDarkMode ? "text-white" : "text-slate-800")}>Liberar limite acima do level 999</span>
            </label>
          </div>

          <div className={cn("p-4 rounded-lg border flex items-center gap-4 glass-control", isDarkMode ? "bg-white/5 border-white/10" : "bg-white/45 border-white/70")}>
            <Eye className={cn("w-6 h-6", modalTheme.accentText)} />
            <div>
              <p className={cn("text-xs font-bold", isDarkMode ? "text-white" : "text-slate-900")}>Modo Admin / Testador Oficial</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ativa a interface especial para testar permissoes, botoes e restricoes pelo usuario escolhido.</p>
            </div>
          </div>
        </div>

        <div className={cn("p-6 border-t flex flex-col md:flex-row items-center justify-between gap-4", isDarkMode ? "bg-white/5 border-white/10" : "bg-white/35 border-white/50")}>
          <button
            onClick={onDiscard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Descartar Simulacao
          </button>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <button
              onClick={() => alert("A comparacao de cenarios sera conectada aos logs internos do YGN em uma etapa futura.")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-colors border",
                isDarkMode ? "bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              <BarChart className="w-4 h-4" />
              Comparar Cenarios
            </button>
            <button
              onClick={() => {
                onStartSimulation(draft);
                onClose();
              }}
              className={cn("flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-black uppercase tracking-widest transition-colors shadow-lg", modalTheme.accentBg)}
            >
              Ativar Simulacao
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
