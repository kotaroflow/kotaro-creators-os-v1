import React from 'react';
import { motion } from 'motion/react';
import { Activity, AlertTriangle, ChevronDown, Crown, Eye, FileText, Shield, SlidersHorizontal, X } from 'lucide-react';
import { NazarickRole, OperationalMode, Profile, User, getEffectiveRank } from '../../types';
import { cn } from '../../lib/utils';

interface SimulationSpaceProps {
  realUser: User;
  simulatedUser: User;
  activeProfile?: Profile | null;
  isDarkMode: boolean;
  onExit: () => void;
  onAdjust: () => void;
  onQuickApply: (patch: Partial<User>) => void;
  onSaveReport: () => void;
  onQueueApproval: () => void;
  onApplyToReal: () => void;
}

const simulationChecks = [
  'Permissoes de usuario',
  'Rank e nivel',
  'Modo operacional',
  'Acesso a perfis',
  'Acoes administrativas',
  'Limites de XP e karma',
];

export default function SimulationSpace({
  realUser,
  simulatedUser,
  activeProfile,
  isDarkMode,
  onExit,
  onAdjust,
  onQuickApply,
  onSaveReport,
  onQueueApproval,
  onApplyToReal,
}: SimulationSpaceProps) {
  const rank = getEffectiveRank(simulatedUser);
  const managedCount = simulatedUser.managedProfileIds?.length || 0;
  const quickPresets: Array<{ label: string; hint: string; patch: Partial<User> }> = [
    {
      label: 'Iniciante',
      hint: 'F / Easy',
      patch: { role: NazarickRole.PESTONYA, level: 1, rank: 'F', xp: 0, karma: 0, operationalMode: OperationalMode.EASY },
    },
    {
      label: 'Criador',
      hint: 'C / Normal',
      patch: { role: NazarickRole.PLEIADES, level: 35, rank: 'C', xp: 420, karma: 12, operationalMode: OperationalMode.NORMAL },
    },
    {
      label: 'Avancado',
      hint: 'A / Hard',
      patch: { role: NazarickRole.DEMIURGE, level: 100, rank: 'A', xp: 2400, karma: 55, operationalMode: OperationalMode.HARD },
    },
  ];
  const quickRoles = [NazarickRole.PESTONYA, NazarickRole.PLEIADES, NazarickRole.DEMIURGE, NazarickRole.ALBEDO];
  const quickRanks = ['F', 'C', 'A', 'S', 'SSS'];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-lg px-6 py-8",
        isDarkMode ? "text-white" : "text-slate-950"
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <div className={cn(
          "absolute inset-0",
          isDarkMode
            ? "bg-[radial-gradient(circle_at_20%_15%,rgba(148,163,184,0.18),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_30%)]"
            : "bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(148,163,184,0.14),transparent_32%)]"
        )} />
        <div className="absolute inset-0 ygn-glass-grid" />
      </div>

      <div
        className={cn(
          "ygn-sim-dock fixed left-1/2 top-20 z-[96] w-[min(64rem,calc(100vw-2rem))] rounded-b-lg border px-4 pb-3 pt-4 shadow-2xl",
          isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
        )}
      >
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.8fr]">
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.32em] text-slate-500">Troca rapida</p>
              <div className="grid grid-cols-3 gap-2">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onQuickApply(preset.patch)}
                    className="glass-control rounded-lg border border-white/10 px-3 py-2 text-left transition-colors hover:bg-white/14"
                  >
                    <span className="block text-[10px] font-black uppercase tracking-widest">{preset.label}</span>
                    <span className="mt-1 block text-[9px] font-bold uppercase tracking-widest text-slate-500">{preset.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.32em] text-slate-500">Cargo</p>
              <div className="grid grid-cols-2 gap-2">
                {quickRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onQuickApply({ role })}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-colors",
                      simulatedUser.role === role
                        ? "bg-white text-slate-950 border-white"
                        : "glass-control border-white/10 text-slate-500 hover:text-slate-950 dark:hover:text-white"
                    )}
                  >
                    {role.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.32em] text-slate-500">Rank / modo</p>
              <div className="flex flex-wrap gap-2">
                {quickRanks.map((quickRank) => (
                  <button
                    key={quickRank}
                    type="button"
                    onClick={() => onQuickApply({ rank: quickRank })}
                    className={cn(
                      "min-w-10 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                      simulatedUser.rank === quickRank ? "bg-white text-slate-950 border-white" : "glass-control border-white/10 text-slate-500 hover:text-slate-950 dark:hover:text-white"
                    )}
                  >
                    {quickRank}
                  </button>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onQuickApply({ operationalMode: mode })}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-colors",
                      simulatedUser.operationalMode === mode
                        ? "bg-white text-slate-950 border-white"
                        : "glass-control border-white/10 text-slate-500 hover:text-slate-950 dark:hover:text-white"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-white/12 pt-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                <ChevronDown className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em]">Painel rapido do sandbox</p>
                <p className="text-[10px] font-bold text-slate-500">Passe o mouse aqui para editar sem abrir modal.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onAdjust}
                className="rounded-lg border border-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/10"
              >
                <SlidersHorizontal className="mr-2 inline h-4 w-4" />
                Painel completo
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-lg border border-red-300/35 bg-red-500/12 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-100 transition-colors hover:bg-red-500/22"
              >
                <X className="mr-2 inline h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center gap-8 pt-8">
        <div className={cn(
          "rounded-lg border p-6 md:p-8 shadow-2xl",
          isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
        )}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/25 bg-white/12 text-slate-300 shadow-inner">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.42em] text-slate-400">Perfil fixo</p>
                  <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">YGN Sandbox</h1>
                </div>
              </div>
              <p className={cn("max-w-2xl text-sm leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                Ambiente isolado para testar usuario, cargo, rank, permissoes e relacao com perfis sem tocar no estado real do OS.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={onSaveReport} className="glass-control rounded-lg border border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-widest">
                <FileText className="mr-2 inline h-4 w-4" />
                Salvar relatorio
              </button>
              <button onClick={onAdjust} className="glass-control rounded-lg border border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-widest">
                <SlidersHorizontal className="mr-2 inline h-4 w-4" />
                Ajustar
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className={cn(
            "rounded-lg border p-6 shadow-xl",
            isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
          )}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-slate-500">Usuario simulado</p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight">{simulatedUser.name}</h2>
              </div>
              <div className="rounded-lg border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                Isolado
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Cargo', simulatedUser.role],
                ['Rank efetivo', rank],
                ['Level', simulatedUser.level === Infinity ? 'Sem limite' : String(simulatedUser.level || 1)],
                ['XP', String(simulatedUser.xp || 0)],
                ['Karma', String(simulatedUser.karma || 0)],
                ['Modo', simulatedUser.operationalMode],
              ].map(([label, value]) => (
                <div key={label} className="glass-control rounded-lg border border-white/10 p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                  <p className="mt-2 text-sm font-black uppercase leading-snug">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-white/15 bg-white/8 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-slate-300" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-300">Protecao do estado real</p>
                  <p className={cn("mt-1 text-xs leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                    Nada aplicado aqui muda o usuario real ate voce acionar aplicacao manual. Campos internos de teste tambem sao removidos antes de qualquer gravacao.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={cn(
              "rounded-lg border p-6 shadow-xl",
              isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
            )}>
              <div className="mb-5 flex items-center gap-3">
                <Crown className="h-5 w-5 text-slate-300" />
                <h3 className="text-sm font-black uppercase tracking-widest">Vinculo com perfis</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Perfil aberto</span>
                  <strong className="text-right">{activeProfile?.name || 'Nenhum'}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Usuario real</span>
                  <strong className="text-right">{realUser.name}</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Perfis gerenciaveis</span>
                  <strong>{managedCount}</strong>
                </div>
              </div>
            </div>

            <div className={cn(
              "rounded-lg border p-6 shadow-xl",
              isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
            )}>
              <div className="mb-5 flex items-center gap-3">
                <Activity className="h-5 w-5 text-emerald-300" />
                <h3 className="text-sm font-black uppercase tracking-widest">Checklist mecanico</h3>
              </div>
              <div className="space-y-2">
                {simulationChecks.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs font-bold">
                    <span>{item}</span>
                    <Eye className="h-3.5 w-3.5 text-emerald-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={cn(
          "sticky bottom-4 z-[92] rounded-lg border p-3 shadow-2xl md:self-center",
          isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
        )}>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={onQueueApproval} className="rounded-lg border border-white/15 px-5 py-3 text-[10px] font-black uppercase tracking-widest transition hover:bg-white/10">
              Enviar para aprovacao
            </button>
            <button onClick={onApplyToReal} className="rounded-lg border border-red-300/40 bg-red-500/15 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-red-100 transition hover:bg-red-500/25">
              Aplicar ao real
            </button>
            <button onClick={onAdjust} className="rounded-lg bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-lg transition hover:bg-slate-100">
              Painel completo
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
