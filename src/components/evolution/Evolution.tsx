import React from 'react';
import { User, Profile, getEffectiveRank, NazarickRole, CreatorFragment } from '../../types';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import {
  Atom,
  BookOpen,
  Compass,
  Crown,
  Eye,
  Flame,
  Ghost,
  Hourglass,
  Lock,
  Monitor,
  Shield,
  Sparkles,
  Star,
  Sword,
  Target,
  Unlock,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type EvolutionTone = 'ash' | 'ember' | 'jade' | 'aqua' | 'violet' | 'gold' | 'rose' | 'void';

interface EvolutionTier {
  rank: string;
  title: string;
  kanji: string;
  concept: string;
  archetype: string;
  xpRequired: number;
  minLevel: number;
  minKarma: number;
  requirement: string;
  benefit: string;
  icon: LucideIcon;
  tone: EvolutionTone;
}

const toneStyles: Record<EvolutionTone, {
  surface: string;
  border: string;
  text: string;
  muted: string;
  fill: string;
  glow: string;
}> = {
  ash: {
    surface: 'from-slate-50/88 via-white/74 to-slate-100/62 dark:from-slate-950/82 dark:via-slate-900/64 dark:to-slate-950/82',
    border: 'border-slate-200/70 dark:border-white/10',
    text: 'text-slate-900 dark:text-slate-100',
    muted: 'text-slate-500 dark:text-slate-400',
    fill: 'bg-slate-700 dark:bg-slate-200',
    glow: 'shadow-[0_18px_60px_rgba(15,23,42,0.16)]',
  },
  ember: {
    surface: 'from-orange-50/88 via-white/74 to-amber-100/62 dark:from-[#1d0d05]/82 dark:via-[#2b1608]/62 dark:to-slate-950/82',
    border: 'border-orange-200/70 dark:border-orange-400/18',
    text: 'text-orange-950 dark:text-orange-100',
    muted: 'text-orange-700/75 dark:text-orange-300/75',
    fill: 'bg-orange-500',
    glow: 'shadow-[0_18px_64px_rgba(249,115,22,0.18)]',
  },
  jade: {
    surface: 'from-emerald-50/88 via-white/74 to-teal-100/62 dark:from-[#051812]/84 dark:via-[#09251c]/62 dark:to-slate-950/82',
    border: 'border-emerald-200/70 dark:border-emerald-300/18',
    text: 'text-emerald-950 dark:text-emerald-100',
    muted: 'text-emerald-700/75 dark:text-emerald-300/75',
    fill: 'bg-emerald-500',
    glow: 'shadow-[0_18px_64px_rgba(16,185,129,0.16)]',
  },
  aqua: {
    surface: 'from-cyan-50/88 via-white/74 to-sky-100/62 dark:from-[#061722]/84 dark:via-[#082637]/62 dark:to-slate-950/82',
    border: 'border-cyan-200/70 dark:border-cyan-300/18',
    text: 'text-cyan-950 dark:text-cyan-100',
    muted: 'text-cyan-700/75 dark:text-cyan-300/75',
    fill: 'bg-cyan-500',
    glow: 'shadow-[0_18px_64px_rgba(6,182,212,0.16)]',
  },
  violet: {
    surface: 'from-violet-50/88 via-white/74 to-indigo-100/62 dark:from-[#100820]/84 dark:via-[#19103c]/62 dark:to-slate-950/82',
    border: 'border-violet-200/70 dark:border-violet-300/18',
    text: 'text-violet-950 dark:text-violet-100',
    muted: 'text-violet-700/75 dark:text-violet-300/75',
    fill: 'bg-violet-500',
    glow: 'shadow-[0_18px_64px_rgba(139,92,246,0.18)]',
  },
  gold: {
    surface: 'from-amber-50/92 via-white/76 to-yellow-100/66 dark:from-[#1f1705]/86 dark:via-[#2e2308]/64 dark:to-slate-950/86',
    border: 'border-amber-200/80 dark:border-amber-300/22',
    text: 'text-amber-950 dark:text-amber-100',
    muted: 'text-amber-700/75 dark:text-amber-300/75',
    fill: 'bg-amber-500',
    glow: 'shadow-[0_20px_72px_rgba(217,119,6,0.22)]',
  },
  rose: {
    surface: 'from-rose-50/88 via-white/74 to-red-100/62 dark:from-[#240811]/84 dark:via-[#330d18]/62 dark:to-slate-950/82',
    border: 'border-rose-200/70 dark:border-rose-300/18',
    text: 'text-rose-950 dark:text-rose-100',
    muted: 'text-rose-700/75 dark:text-rose-300/75',
    fill: 'bg-rose-500',
    glow: 'shadow-[0_18px_64px_rgba(244,63,94,0.18)]',
  },
  void: {
    surface: 'from-slate-950 via-slate-900 to-black dark:from-black dark:via-[#0b0714] dark:to-black',
    border: 'border-amber-300/28 dark:border-amber-300/26',
    text: 'text-amber-100',
    muted: 'text-amber-300/72',
    fill: 'bg-amber-400',
    glow: 'shadow-[0_24px_90px_rgba(245,158,11,0.24)]',
  },
};

type ToneStyle = (typeof toneStyles)[EvolutionTone];

export const YGN_EVOLUTION_TIERS: EvolutionTier[] = [
  { rank: 'F', title: 'Iniciado do Selo', kanji: '芽', concept: 'Mebae', archetype: 'primeira chama', xpRequired: 0, minLevel: 1, minKarma: 0, requirement: 'Comecar a jornada no YGGNAROK.', benefit: 'Acesso ao painel central e aos rituais basicos.', icon: Flame, tone: 'ember' },
  { rank: 'E-', title: 'Estrategista Silencioso', kanji: '策', concept: 'Saku', archetype: 'analise inicial', xpRequired: 500, minLevel: 2, minKarma: 20, requirement: 'Concluir o primeiro plano util para um perfil.', benefit: 'Desbloqueia leitura estrategica de tarefas.', icon: BookOpen, tone: 'ash' },
  { rank: 'E', title: 'Vigia Desperto', kanji: '眼', concept: 'Manako', archetype: 'observacao', xpRequired: 1500, minLevel: 3, minKarma: 50, requirement: 'Registrar aprendizados e evitar repeticao de erros.', benefit: 'Melhor leitura de risco e prioridade.', icon: Eye, tone: 'rose' },
  { rank: 'E+', title: 'Executor Noturno', kanji: '刃', concept: 'Yaiba', archetype: 'acao rapida', xpRequired: 3000, minLevel: 5, minKarma: 100, requirement: 'Eliminar gargalos pequenos com consistencia.', benefit: 'Acoes rapidas e foco operacional.', icon: Sword, tone: 'rose' },
  { rank: 'D-', title: 'Linker Digital', kanji: '結', concept: 'Musubi', archetype: 'conexao', xpRequired: 5000, minLevel: 7, minKarma: 150, requirement: 'Conectar perfis, conteudos e metas.', benefit: 'Melhor organizacao de ativos e ideias.', icon: Monitor, tone: 'aqua' },
  { rank: 'D', title: 'Mago da Ordem', kanji: '律', concept: 'Ritsu', archetype: 'disciplina', xpRequired: 8000, minLevel: 10, minKarma: 200, requirement: 'Manter rotina semanal de criacao.', benefit: 'Fluxos simultaneos com menos atrito.', icon: Sparkles, tone: 'jade' },
  { rank: 'D+', title: 'Guardiao da Guilda', kanji: '盟', concept: 'Mei', archetype: 'colaboracao', xpRequired: 12000, minLevel: 15, minKarma: 300, requirement: 'Ajudar outro perfil ou membro confiavel.', benefit: 'Bonus de XP por colaboracao real.', icon: Shield, tone: 'ember' },
  { rank: 'C-', title: 'Respiracao Total', kanji: '水', concept: 'Mizu', archetype: 'ritmo', xpRequired: 18000, minLevel: 20, minKarma: 450, requirement: 'Concluir uma sequencia de conteudos planejada.', benefit: 'Cronograma interno mais confiavel.', icon: Waves, tone: 'aqua' },
  { rank: 'C', title: 'Alquimista de Ativos', kanji: '錬', concept: 'Ren', archetype: 'transformacao', xpRequired: 25000, minLevel: 25, minKarma: 600, requirement: 'Transformar ideias em ativos reutilizaveis.', benefit: 'Biblioteca de prompts, roteiros e variacoes.', icon: Atom, tone: 'gold' },
  { rank: 'C+', title: 'Ego de Conversao', kanji: '的', concept: 'Mato', archetype: 'precisao', xpRequired: 35000, minLevel: 30, minKarma: 800, requirement: 'Melhorar metricas de um conteudo anterior.', benefit: 'Analise de conversao e testes por perfil.', icon: Target, tone: 'aqua' },
  { rank: 'B-', title: 'Explorador Licenciado', kanji: '巡', concept: 'Meguri', archetype: 'descoberta', xpRequired: 50000, minLevel: 35, minKarma: 1000, requirement: 'Mapear um nicho com dados reais.', benefit: 'Radar de oportunidades e lacunas.', icon: Compass, tone: 'jade' },
  { rank: 'B', title: 'Operador Cromado', kanji: '機', concept: 'Kikai', archetype: 'velocidade', xpRequired: 75000, minLevel: 40, minKarma: 1500, requirement: 'Reduzir tempo de execucao sem cair qualidade.', benefit: 'Orquestracao de etapas e automacoes leves.', icon: Zap, tone: 'violet' },
  { rank: 'B+', title: 'Cartografo Global', kanji: '海', concept: 'Umi', archetype: 'escala', xpRequired: 100000, minLevel: 50, minKarma: 2000, requirement: 'Atingir marco relevante de alcance acumulado.', benefit: 'Mapa de perfis, campanhas e canais.', icon: Compass, tone: 'aqua' },
  { rank: 'A-', title: 'Dominio Expandido', kanji: '域', concept: 'Iki', archetype: 'controle', xpRequired: 150000, minLevel: 60, minKarma: 3000, requirement: 'Automatizar uma rotina sem perder revisao humana.', benefit: 'Agentes funcionais com permissoes restritas.', icon: Ghost, tone: 'violet' },
  { rank: 'A', title: 'Contrato de Impacto', kanji: '契', concept: 'Chigiri', archetype: 'compromisso', xpRequired: 250000, minLevel: 75, minKarma: 5000, requirement: 'Manter qualidade alta em uma campanha inteira.', benefit: 'Execucao em lote com checkpoints.', icon: Flame, tone: 'ember' },
  { rank: 'A+', title: 'Memoria Eterna', kanji: '永', concept: 'Ei', archetype: 'sabedoria', xpRequired: 400000, minLevel: 90, minKarma: 8000, requirement: 'Construir base de conhecimento reutilizavel.', benefit: 'Contexto historico para decisoes futuras.', icon: Hourglass, tone: 'jade' },
  { rank: 'S', title: 'Retorno Perfeito', kanji: '還', concept: 'Kaeru', archetype: 'correcao', xpRequired: 600000, minLevel: 100, minKarma: 12000, requirement: 'Recuperar projetos que falharam e documentar causa.', benefit: 'Checkpoints e revisoes de qualidade.', icon: Star, tone: 'violet' },
  { rank: 'SS', title: 'Monarca de Fluxos', kanji: '王', concept: 'Ou', archetype: 'comando', xpRequired: 1000000, minLevel: 120, minKarma: 20000, requirement: 'Dominar um fluxo completo de criacao a resultado.', benefit: 'Orquestracao ampla de agentes funcionais.', icon: Crown, tone: 'gold' },
  { rank: 'SSS', title: 'Soberano YGN', kanji: '神', concept: 'Kami', archetype: 'autoridade suprema', xpRequired: 2000000, minLevel: 150, minKarma: 50000, requirement: 'Controle integral, logs confiaveis e governanca ativa.', benefit: 'Edicao estrutural do OS com auditoria e simulacao.', icon: Crown, tone: 'void' },
];

const getCurrentTierIndex = (user: User) => {
  let currentRankIndex = 0;
  for (let i = 0; i < YGN_EVOLUTION_TIERS.length; i += 1) {
    if (user.xp >= YGN_EVOLUTION_TIERS[i].xpRequired) {
      currentRankIndex = i;
    }
  }

  const effectiveRank = getEffectiveRank(user);
  const foundIndexByRank = YGN_EVOLUTION_TIERS.findIndex((tier) => tier.rank === effectiveRank);

  return foundIndexByRank > currentRankIndex ? foundIndexByRank : currentRankIndex;
};

const getProgressToNextTier = (user: User, currentRankIndex: number) => {
  const currentTier = YGN_EVOLUTION_TIERS[currentRankIndex];
  const nextTier = YGN_EVOLUTION_TIERS[currentRankIndex + 1];

  if (!nextTier) return 100;

  const range = nextTier.xpRequired - currentTier.xpRequired;
  const progress = ((user.xp - currentTier.xpRequired) / range) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

export function EvolutionUserCard({
  user,
  profile,
  currentTier,
  nextTier,
  progressToNext,
  isDarkMode,
}: {
  user: User;
  profile: Profile;
  currentTier: EvolutionTier;
  nextTier?: EvolutionTier;
  progressToNext: number;
  isDarkMode?: boolean;
}) {
  const tone = toneStyles[currentTier.tone];
  const Icon = currentTier.icon;
  const isAdmin = user.role === NazarickRole.MOMONGA;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative overflow-hidden rounded-lg border p-6 md:p-8 bg-gradient-to-br',
        tone.surface,
        tone.border,
        tone.glow,
        isDarkMode ? 'glass-panel' : 'glass-panel-light'
      )}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-35" />
      <div className="absolute right-6 top-6 text-[104px] leading-none font-black opacity-[0.045] select-none">{currentTier.kanji}</div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="flex gap-5">
          <div className={cn('w-16 h-16 rounded-lg flex items-center justify-center text-white shadow-lg shrink-0', tone.fill)}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-[10px] font-black uppercase tracking-[0.34em] mb-2', tone.muted)}>YGN Evolution Card</p>
            <h2 className={cn('text-3xl md:text-5xl font-black uppercase leading-tight', tone.text)}>
              {profile.name}
            </h2>
            <p className={cn('text-sm md:text-base font-bold mt-3 max-w-2xl leading-relaxed', tone.muted)}>
              {isAdmin ? 'Admin Supremo em governanca do Sistema de Evolucao.' : 'Perfil em progressao dentro do YGGNAROK.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="grid grid-cols-3 gap-3">
            <StatPill label="Rank" value={currentTier.rank} tone={tone} />
            <StatPill label="Level" value={String(user.level || 1)} tone={tone} />
            <StatPill label="Karma" value={user.karma.toLocaleString()} tone={tone} />
          </div>

          <div>
            <div className="flex items-end justify-between gap-4 mb-2">
              <div>
                <p className={cn('text-[9px] font-black uppercase tracking-[0.24em]', tone.muted)}>Progresso ao proximo selo</p>
                <p className={cn('text-sm font-black uppercase mt-1', tone.text)}>
                  {nextTier ? `${currentTier.rank} -> ${nextTier.rank}` : 'Selo maximo estabilizado'}
                </p>
              </div>
              <span className={cn('text-2xl font-black font-mono', tone.text)}>{progressToNext}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className={cn('h-full rounded-full', tone.fill)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function StatPill({ label, value, tone }: { label: string; value: string; tone: ToneStyle }) {
  return (
    <div className="border border-current/10 bg-white/12 dark:bg-black/16 px-4 py-3 rounded-lg">
      <p className={cn('text-[8px] font-black uppercase tracking-[0.24em] mb-1', tone.muted)}>{label}</p>
      <p className={cn('text-xl font-black font-mono leading-none', tone.text)}>{value}</p>
    </div>
  );
}

export function EvolutionRankCard({
  tier,
  index,
  isUnlocked,
  isCurrent,
  isNext,
  progress,
}: {
  tier: EvolutionTier;
  index: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  isNext: boolean;
  progress: number;
}) {
  const tone = toneStyles[tier.tone];
  const Icon = tier.icon;
  const stateLabel = isCurrent ? 'Selo atual' : isNext ? 'Proximo selo' : isUnlocked ? 'Desbloqueado' : 'Bloqueado';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.025, 0.3), duration: 0.45 }}
      className={cn(
        'relative overflow-hidden rounded-lg border min-h-[24rem] bg-gradient-to-br p-5 transition-all duration-500',
        tone.surface,
        tone.border,
        isCurrent ? cn('scale-[1.015]', tone.glow) : 'shadow-sm',
        !isUnlocked && !isNext && 'opacity-55 grayscale'
      )}
      title={`Rank ${tier.rank} - ${tier.title}`}
    >
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-25" />
      <div className="absolute -right-3 top-2 text-[92px] font-black leading-none opacity-[0.045] select-none">{tier.kanji}</div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between gap-4 mb-6">
          <div>
            <p className={cn('text-[10px] font-black uppercase tracking-[0.3em]', tone.muted)}>{tier.concept}</p>
            <h3 className={cn('text-4xl font-black uppercase mt-2 leading-none', tone.text)}>{tier.rank}</h3>
          </div>
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md', tone.fill)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          {isUnlocked || isCurrent ? <Unlock className={cn('w-3.5 h-3.5', tone.muted)} /> : <Lock className={cn('w-3.5 h-3.5', tone.muted)} />}
          <span className={cn('text-[9px] font-black uppercase tracking-[0.22em]', tone.muted)}>{stateLabel}</span>
        </div>

        <h4 className={cn('text-xl font-black leading-snug mb-2', tone.text)}>{tier.title}</h4>
        <p className={cn('text-[11px] font-black uppercase tracking-[0.2em] mb-5', tone.muted)}>{tier.archetype}</p>

        <div className="space-y-4 flex-1">
          <div>
            <p className={cn('text-[8px] font-black uppercase tracking-[0.24em] mb-1', tone.muted)}>Requisito</p>
            <p className={cn('text-xs font-bold leading-relaxed', tone.text)}>{tier.requirement}</p>
          </div>
          <div>
            <p className={cn('text-[8px] font-black uppercase tracking-[0.24em] mb-1', tone.muted)}>Beneficio</p>
            <p className={cn('text-xs font-bold leading-relaxed', tone.text)}>{tier.benefit}</p>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-current/10">
          <div className="flex justify-between items-end mb-2">
            <p className={cn('text-[8px] font-black uppercase tracking-[0.24em]', tone.muted)}>XP</p>
            <p className={cn('text-[11px] font-black font-mono', tone.text)}>{progress}%</p>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn('h-full rounded-full', tone.fill)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniMeta label="Lvl" value={tier.minLevel.toLocaleString()} tone={tone} />
            <MiniMeta label="Karma" value={tier.minKarma.toLocaleString()} tone={tone} />
            <MiniMeta label="XP" value={tier.xpRequired.toLocaleString()} tone={tone} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MiniMeta({ label, value, tone }: { label: string; value: string; tone: ToneStyle }) {
  return (
    <div>
      <p className={cn('text-[7px] font-black uppercase tracking-[0.18em]', tone.muted)}>{label}</p>
      <p className={cn('text-[10px] font-black font-mono truncate', tone.text)}>{value}</p>
    </div>
  );
}

export default function Evolution({ user, profile, isDarkMode, activeFragment }: { user: User, profile: Profile, isDarkMode?: boolean, activeFragment?: CreatorFragment }) {
  const currentRankIndex = getCurrentTierIndex(user);
  const currentTier = YGN_EVOLUTION_TIERS[currentRankIndex];
  const nextTier = YGN_EVOLUTION_TIERS[currentRankIndex + 1];
  const progressToNext = getProgressToNextTier(user, currentRankIndex);
  const isSimulation = (user as any).isRealUser === false;
  const isAdmin = user.role === NazarickRole.MOMONGA || (user as any).isAdmin === true;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-24 px-4 sm:px-6">
      <div className={cn('flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 transition-colors mt-4', isDarkMode ? 'border-white/10' : 'border-slate-200')}>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-700 text-white shadow-xl">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-amber-500 mb-2">YGGNAROK / YGN</p>
            <h2 className={cn('font-black text-4xl uppercase transition-colors', isDarkMode ? 'text-white' : 'text-slate-900')}>Sistema de Evolucao</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.22em] mt-2">
              Cards centrais de XP, rank, level e governanca
            </p>
          </div>
        </div>

        <div className={cn('rounded-lg border px-4 py-3 transition-colors', isDarkMode ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200')}>
          <p className="text-[9px] uppercase font-black tracking-[0.24em] text-slate-500 mb-1">Contexto ativo</p>
          <div className="flex items-center gap-3">
            <span className={cn('text-sm font-black uppercase', isDarkMode ? 'text-white' : 'text-slate-900')}>{activeFragment || CreatorFragment.MOMONGA}</span>
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="text-xs font-bold text-slate-500">{isAdmin ? 'Admin' : 'Usuario'}</span>
            {isSimulation && (
              <>
                <span className="w-1 h-1 rounded-full bg-purple-400" />
                <span className="text-xs font-bold text-purple-400">Simulacao</span>
              </>
            )}
          </div>
        </div>
      </div>

      <EvolutionUserCard
        user={user}
        profile={profile}
        currentTier={currentTier}
        nextTier={nextTier}
        progressToNext={progressToNext}
        isDarkMode={isDarkMode}
      />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase font-black tracking-[0.34em] text-slate-500 mb-2">Escala reutilizavel</p>
          <h3 className={cn('text-2xl font-black uppercase', isDarkMode ? 'text-white' : 'text-slate-900')}>Cards de Rank YGN</h3>
        </div>
        <p className="hidden md:block text-xs font-bold text-slate-500 max-w-sm text-right">
          Estes cards sao a base visual do Sistema de Evolucao. Agentes/IAs continuam funcionais e sem visual proprio neste ciclo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {YGN_EVOLUTION_TIERS.map((tier, index) => {
          const isUnlocked = index <= currentRankIndex;
          const isCurrent = index === currentRankIndex;
          const isNext = index === currentRankIndex + 1;
          let progress = isUnlocked ? 100 : 0;

          if (isNext) {
            const previousTier = YGN_EVOLUTION_TIERS[index - 1];
            const range = tier.xpRequired - previousTier.xpRequired;
            progress = Math.min(100, Math.round(Math.max(0, user.xp - previousTier.xpRequired) / range * 100));
          }

          return (
            <EvolutionRankCard
              key={tier.rank}
              tier={tier}
              index={index}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              isNext={isNext}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
}
