import React from 'react';
import { CreatorFragment, User } from '../../types';
import { motion } from 'motion/react';
import { Infinity as InfinityIcon, Shield, Sparkles, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminSupremeDashboardCardProps {
  user: User;
  isDarkMode?: boolean;
  activeFragment?: CreatorFragment;
}

export default function AdminSupremeDashboardCard({ user, isDarkMode, activeFragment }: AdminSupremeDashboardCardProps) {
  const theme = {
    bg: isDarkMode ? 'from-slate-950/72 via-slate-900/58 to-slate-800/40' : 'from-white/78 via-slate-100/62 to-slate-200/48',
    border: isDarkMode ? 'border-white/12' : 'border-white/70',
    ring: isDarkMode ? 'ring-white/10' : 'ring-white/60',
    textPrimary: isDarkMode ? 'text-white' : 'text-slate-950',
    textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
    textHighlight: isDarkMode ? 'text-slate-100' : 'text-slate-800',
    glow: isDarkMode ? 'shadow-[0_18px_48px_rgba(0,0,0,0.24)]' : 'shadow-[0_16px_40px_rgba(15,23,42,0.10)]',
    particle: isDarkMode ? 'bg-white/35' : 'bg-slate-500/35',
  };

  return (
    <div className="relative w-full">
      <div className={cn('absolute inset-x-8 top-0 h-px opacity-60', theme.particle)} />

      <motion.div
        key={activeFragment || 'default'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, ease: 'easeOut' }}
        className={cn(
          'relative w-full overflow-hidden rounded-lg border bg-gradient-to-br ring-1',
          theme.bg,
          theme.border,
          theme.ring,
          theme.glow,
          isDarkMode ? 'glass-panel' : 'glass-panel-light'
        )}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <svg className="absolute inset-x-0 bottom-0 h-[120%] w-full opacity-14" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,100 Q45,70 30,50 T10,20 M50,100 Q55,70 70,50 T90,20 M50,100 Q50,60 50,20" stroke="currentColor" fill="none" strokeWidth="0.5" className={theme.textSecondary} />
            <path d="M48,80 Q35,65 20,55 M52,80 Q65,65 80,55" stroke="currentColor" fill="none" strokeWidth="0.2" className={theme.textSecondary} />
          </svg>
        </div>

        <div className="relative z-10 grid gap-8 p-8 md:grid-cols-[1fr_0.9fr_1fr] md:p-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="glass-control mb-4 inline-flex rounded-lg border border-white/20 px-4 py-2">
                <span className={cn('text-[9px] font-black uppercase tracking-[0.34em]', theme.textHighlight)}>Admin real</span>
              </div>
              <h2 className={cn('text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl', theme.textPrimary)}>
                {activeFragment || CreatorFragment.MOMONGA}
                <span className={cn('mt-2 block text-lg tracking-widest md:text-2xl', theme.textSecondary)}>Criador Supremo</span>
              </h2>
            </div>

            <div className={cn('glass-control flex w-max items-center gap-3 rounded-lg border px-4 py-3', theme.border)}>
              <Shield className={cn('h-4 w-4', theme.textHighlight)} />
              <span className={cn('text-xs font-bold uppercase tracking-widest', theme.textSecondary)}>Governanca YGN</span>
            </div>
          </div>

          <div className="relative flex min-h-[260px] flex-col items-center justify-center">
            <div className={cn('absolute h-[240px] w-[240px] rounded-full border border-dashed opacity-25', theme.border)} />
            <div className={cn('absolute h-[200px] w-[200px] rounded-full border opacity-30', theme.border)} />

            <span className={cn('mb-2 text-[12px] font-black uppercase tracking-[0.46em]', theme.textSecondary)}>Level</span>
            <InfinityIcon className={cn('h-28 w-28 md:h-36 md:w-36', theme.textPrimary)} />
            <div className={cn('mt-6 text-sm font-black uppercase tracking-[0.34em]', theme.textHighlight)}>YGN Core</div>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <InfoGlass label="Usuario" value={user.name} theme={theme} />
            <InfoGlass label="Autoridade" value="Permissoes absolutas" theme={theme} />
            <InfoGlass label="XP" value="Nao limitado" theme={theme} />

            <div className={cn('mt-2 flex items-center gap-2', theme.textSecondary)}>
              <Zap className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Foco real: {activeFragment || CreatorFragment.MOMONGA}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 top-6 opacity-20">
          <Sparkles className={cn('h-8 w-8', theme.textSecondary)} />
        </div>
      </motion.div>
    </div>
  );
}

function InfoGlass({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: { border: string; textPrimary: string; textSecondary: string };
}) {
  return (
    <div className={cn('glass-control rounded-lg border p-4', theme.border)}>
      <span className={cn('mb-1 block text-[9px] font-black uppercase tracking-[0.22em]', theme.textSecondary)}>{label}</span>
      <span className={cn('text-sm font-bold tracking-wide', theme.textPrimary)}>{value}</span>
    </div>
  );
}
