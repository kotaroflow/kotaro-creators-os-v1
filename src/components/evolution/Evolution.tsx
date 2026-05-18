import React from 'react';
import { User, Profile, getEffectiveRank, NazarickRole, CreatorFragment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { 
  Lock, Unlock, ChevronRight, Zap, Target, Star, Shield, Crosshair, 
  Crown, Skull, Flame, BookOpen, Eye, Sword, Monitor, Book, Waves, 
  Atom, Compass, Cpu, Anchor, Ghost, Sparkles, Clock, Hourglass, Scan, Map
} from 'lucide-react';
import AdminSupremeDashboardCard from '../dashboard/AdminSupremeDashboardCard';

const RANK_TIERS = [
  {
    rank: "F", anime: "Naruto", title: "Iniciante da Vila", 
    xpRequired: 0, minLevel: 1, minKarma: 0, 
    requirements: "Começar a jornada no Kreators OS.", benefits: "Acesso básico ao sistema.", icon: Flame,
    theme: {
      wrapper: "bg-[#fff7ed] dark:bg-[#1a0f05] border-[#fdba74] dark:border-[#7c2d12]",
      header: "bg-orange-500/10 dark:bg-orange-900/20",
      progressBar: "bg-orange-200 dark:bg-orange-950",
      progressFill: "bg-orange-500",
      textPrimary: "text-orange-900 dark:text-orange-100",
      textSecondary: "text-orange-600 dark:text-orange-400",
      badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800",
      aura: "hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
      patternUtils: "opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]"
    }
  },
  {
    rank: "E-", anime: "Death Note", title: "Estrategista Sombrio", 
    xpRequired: 500, minLevel: 2, minKarma: 20, 
    requirements: "Concluir 1 projeto de alta estratégia.", benefits: "Planejamento avançado.", icon: BookOpen,
    theme: {
      wrapper: "bg-slate-50 dark:bg-[#0a0a0a] border-slate-300 dark:border-red-950",
      header: "bg-slate-200/50 dark:bg-red-950/20",
      progressBar: "bg-slate-300 dark:bg-red-950",
      progressFill: "bg-red-700 dark:bg-red-600",
      textPrimary: "text-slate-900 dark:text-red-50",
      textSecondary: "text-slate-600 dark:text-red-400",
      badge: "bg-slate-200 text-slate-800 dark:bg-red-950/50 dark:text-red-300 border-slate-300 dark:border-red-900",
      aura: "hover:shadow-[0_0_30px_rgba(185,28,28,0.15)]",
      patternUtils: "opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]"
    }
  },
  {
    rank: "E", anime: "Tokyo Ghoul", title: "Desperto pela Dor", 
    xpRequired: 1500, minLevel: 3, minKarma: 50, 
    requirements: "Sobreviver a 5 Ordens Críticas.", benefits: "Modo Instável desbloqueado.", icon: Eye,
    theme: {
      wrapper: "bg-zinc-100 dark:bg-[#111113] border-zinc-300 dark:border-red-900",
      header: "bg-zinc-200/50 dark:bg-red-900/10",
      progressBar: "bg-zinc-300 dark:bg-zinc-900",
      progressFill: "bg-red-600 dark:bg-red-500",
      textPrimary: "text-zinc-900 dark:text-red-100",
      textSecondary: "text-red-700 dark:text-red-500",
      badge: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-800/30",
      aura: "hover:shadow-[0_0_40px_rgba(220,38,38,0.2)]",
      patternUtils: "opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"
    }
  },
  {
    rank: "E+", anime: "Akame ga Kill!", title: "Assassino Noturno", 
    xpRequired: 3000, minLevel: 5, minKarma: 100, 
    requirements: "Eliminar 10 gargalos operativos.", benefits: "Ações rápidas letais.", icon: Sword,
    theme: {
      wrapper: "bg-rose-50 dark:bg-[#1f0a0e] border-rose-200 dark:border-rose-900/50",
      header: "bg-rose-100/50 dark:bg-rose-950/30",
      progressBar: "bg-rose-200 dark:bg-rose-950",
      progressFill: "bg-rose-600 dark:bg-rose-600",
      textPrimary: "text-rose-950 dark:text-rose-50",
      textSecondary: "text-rose-700 dark:text-rose-400",
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      aura: "hover:shadow-[0_0_30px_rgba(225,29,72,0.2)]",
      patternUtils: "opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"
    }
  },
  {
    rank: "D-", anime: "Sword Art Online", title: "Linker Digital", 
    xpRequired: 5000, minLevel: 7, minKarma: 150, 
    requirements: "Completar 1º projeto complexo inteiro.", benefits: "HUD Avançado + Análise de Dados.", icon: Monitor,
    theme: {
      wrapper: "bg-cyan-50 dark:bg-[#081b24] border-cyan-200 dark:border-cyan-900/50",
      header: "bg-cyan-100/50 dark:bg-cyan-950/30",
      progressBar: "bg-cyan-200 dark:bg-cyan-950",
      progressFill: "bg-cyan-500",
      textPrimary: "text-cyan-950 dark:text-cyan-100",
      textSecondary: "text-cyan-700 dark:text-cyan-400",
      badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
      aura: "hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
      patternUtils: "opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
    }
  },
  {
    rank: "D", anime: "Black Clover", title: "Mago Determinado", 
    xpRequired: 8000, minLevel: 10, minKarma: 200, 
    requirements: "Obter grimório de organização.", benefits: "Poder rodar Múltiplas Ordens simultâneas.", icon: Book,
    theme: {
      wrapper: "bg-emerald-50 dark:bg-[#07130a] border-emerald-200 dark:border-emerald-900/50",
      header: "bg-emerald-100/50 dark:bg-emerald-950/30",
      progressBar: "bg-emerald-200 dark:bg-emerald-950",
      progressFill: "bg-emerald-600 dark:bg-emerald-500",
      textPrimary: "text-emerald-950 dark:text-emerald-100",
      textSecondary: "text-emerald-700 dark:text-emerald-500",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      aura: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
      patternUtils: "opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"
    }
  },
  {
    rank: "D+", anime: "Fairy Tail", title: "Mago da Guilda", 
    xpRequired: 12000, minLevel: 15, minKarma: 300, 
    requirements: "Colaborar com a Guilda (Time).", benefits: "10% de Bônus passivo de XP Global.", icon: Flame,
    theme: {
      wrapper: "bg-red-50 dark:bg-[#200e0a] border-red-200 dark:border-red-900/50",
      header: "bg-red-100/50 dark:bg-red-950/30",
      progressBar: "bg-red-200 dark:bg-red-950",
      progressFill: "bg-red-500 dark:bg-red-500",
      textPrimary: "text-red-950 dark:text-red-100",
      textSecondary: "text-amber-600 dark:text-amber-500",
      badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
      aura: "hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]",
      patternUtils: "opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"
    }
  },
  {
    rank: "C-", anime: "Demon Slayer", title: "Espadachim Elementar", 
    xpRequired: 18000, minLevel: 20, minKarma: 450, 
    requirements: "Foco Total: 50 Ordens perfeitas.", benefits: "Agendamento avançado (Respirar).", icon: Waves,
    theme: {
      wrapper: "bg-teal-50 dark:bg-[#061814] border-teal-200 dark:border-teal-900/50",
      header: "bg-teal-100/50 dark:bg-teal-950/30",
      progressBar: "bg-teal-200 dark:bg-teal-950",
      progressFill: "bg-teal-500",
      textPrimary: "text-teal-950 dark:text-teal-100",
      textSecondary: "text-teal-700 dark:text-teal-400",
      badge: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      aura: "hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]",
      patternUtils: "opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]"
    }
  },
  {
    rank: "C", anime: "FMA: Brotherhood", title: "Alquimista Certificado", 
    xpRequired: 25000, minLevel: 25, minKarma: 600, 
    requirements: "Troca Equivalente de recursos.", benefits: "Criação de Ativos Alquímicos I.A.", icon: Atom,
    theme: {
      wrapper: "bg-[#fdf8f5] dark:bg-[#1a1210] border-[#e7bc91] dark:border-[#7c4a3a]",
      header: "bg-[#f5e6d3]/50 dark:bg-[#3a1d13]/30",
      progressBar: "bg-[#e7bc91] dark:bg-[#3a1d13]",
      progressFill: "bg-[#a42424] dark:bg-[#dc2626]",
      textPrimary: "text-[#5e2b1d] dark:text-[#f3dcb1]",
      textSecondary: "text-[#a42424] dark:text-[#dc2626]",
      badge: "bg-[#f5e6d3] text-[#a42424] dark:bg-[#3a1d13]/50 dark:text-[#f3dcb1] border-[#e7bc91] dark:border-[#7c4a3a]",
      aura: "hover:shadow-[0_0_30px_rgba(164,36,36,0.15)]",
      patternUtils: "opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/old-mathematics.png')]"
    }
  },
  {
    rank: "C+", anime: "Blue Lock", title: "Egoísta Implacável", 
    xpRequired: 35000, minLevel: 30, minKarma: 800, 
    requirements: "Superar estatísticas do mês anterior.", benefits: "Estatísticas em tempo real avançadas.", icon: Target,
    theme: {
      wrapper: "bg-blue-50 dark:bg-[#040c1e] border-blue-300 dark:border-blue-900",
      header: "bg-blue-100/50 dark:bg-blue-900/30",
      progressBar: "bg-blue-200 dark:bg-blue-950",
      progressFill: "bg-blue-600 dark:bg-blue-500",
      textPrimary: "text-blue-950 dark:text-blue-100",
      textSecondary: "text-blue-700 dark:text-blue-400",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      aura: "hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]",
      patternUtils: "opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
    }
  },
  {
    rank: "B-", anime: "Hunter x Hunter", title: "Caçador Licenciado", 
    xpRequired: 50000, minLevel: 35, minKarma: 1000, 
    requirements: "Passar na auditoria Hunter da diretoria.", benefits: "Acesso a todas as masterclasses.", icon: Compass,
    theme: {
      wrapper: "bg-lime-50 dark:bg-[#111a0d] border-lime-300 dark:border-lime-900",
      header: "bg-lime-100/50 dark:bg-lime-900/20",
      progressBar: "bg-lime-200 dark:bg-lime-950",
      progressFill: "bg-lime-600 dark:bg-lime-500",
      textPrimary: "text-lime-950 dark:text-lime-100",
      textSecondary: "text-lime-700 dark:text-lime-500",
      badge: "bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-400 border-lime-200 dark:border-lime-800",
      aura: "hover:shadow-[0_0_30px_rgba(101,163,13,0.15)]",
      patternUtils: "opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"
    }
  },
  {
    rank: "B", anime: "Cyberpunk: Edgerunners", title: "Mercenário Cromado", 
    xpRequired: 75000, minLevel: 40, minKarma: 1500, 
    requirements: "Superar a velocidade média do sistema.", benefits: "Overclock: Limites de I.A. turbinados.", icon: Cpu,
    theme: {
      wrapper: "bg-fuchsia-50 dark:bg-[#140514] border-fuchsia-300 dark:border-fuchsia-900",
      header: "bg-fuchsia-100/50 dark:bg-fuchsia-900/30",
      progressBar: "bg-fuchsia-200 dark:bg-fuchsia-950",
      progressFill: "bg-fuchsia-500 dark:bg-fuchsia-400",
      textPrimary: "text-fuchsia-950 dark:text-fuchsia-100",
      textSecondary: "text-cyan-600 dark:text-cyan-400",
      badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
      aura: "hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]",
      patternUtils: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"
    }
  },
  {
    rank: "B+", anime: "One Piece", title: "Supernova", 
    xpRequired: 100000, minLevel: 50, minKarma: 2000, 
    requirements: "Alcançar 1 milhão de visualizações globais.", benefits: "Desbloqueio de Mapa Estratégico Global.", icon: Anchor,
    theme: {
      wrapper: "bg-sky-50 dark:bg-[#071724] border-sky-300 dark:border-sky-900",
      header: "bg-sky-100/50 dark:bg-sky-900/30",
      progressBar: "bg-sky-200 dark:bg-sky-950",
      progressFill: "bg-amber-500 dark:bg-amber-400",
      textPrimary: "text-sky-950 dark:text-sky-100",
      textSecondary: "text-sky-700 dark:text-sky-400",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      aura: "hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
      patternUtils: "opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/waves-pattern.png')]"
    }
  },
  {
    rank: "A-", anime: "Jujutsu Kaisen", title: "Feiticeiro de Grau-Especial", 
    xpRequired: 150000, minLevel: 60, minKarma: 3000, 
    requirements: "Dominar a Expansão de Domínio (Automação).", benefits: "Feitiços de Automação liberados.", icon: Ghost,
    theme: {
      wrapper: "bg-indigo-50 dark:bg-[#090514] border-indigo-300 dark:border-indigo-900",
      header: "bg-indigo-100/50 dark:bg-indigo-900/30",
      progressBar: "bg-indigo-200 dark:bg-indigo-950",
      progressFill: "bg-indigo-800 dark:bg-indigo-500",
      textPrimary: "text-indigo-950 dark:text-indigo-100",
      textSecondary: "text-indigo-700 dark:text-indigo-400",
      badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      aura: "hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]",
      patternUtils: "opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
    }
  },
  {
    rank: "A", anime: "Chainsaw Man", title: "Demônio do Medo", 
    xpRequired: 250000, minLevel: 75, minKarma: 5000, 
    requirements: "Contrato Sangrento (100% de Win-rate mensal).", benefits: "Execução massiva de tarefas em 1 click.", icon: Zap,
    theme: {
      wrapper: "bg-orange-50 dark:bg-[#170804] border-orange-300 dark:border-orange-900",
      header: "bg-orange-100/50 dark:bg-orange-900/30",
      progressBar: "bg-orange-200 dark:bg-orange-950",
      progressFill: "bg-orange-600 dark:bg-orange-500",
      textPrimary: "text-orange-950 dark:text-orange-100",
      textSecondary: "text-orange-700 dark:text-orange-500",
      badge: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
      aura: "hover:shadow-[0_0_40px_rgba(234,88,12,0.3)]",
      patternUtils: "opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/rusty-metal.png')]"
    }
  },
  {
    rank: "A+", anime: "Frieren: Beyond Journey's End", title: "Mago Elfo Eterno", 
    xpRequired: 400000, minLevel: 90, minKarma: 8000, 
    requirements: "Manter taxa de crescimento por 6 meses.", benefits: "Banco de Sabedoria de longo prazo (IA).", icon: Sparkles,
    theme: {
      wrapper: "bg-emerald-50/50 dark:bg-[#071310] border-emerald-200 dark:border-emerald-900/40",
      header: "bg-emerald-100/30 dark:bg-emerald-900/20",
      progressBar: "bg-emerald-100 dark:bg-emerald-950/50",
      progressFill: "bg-emerald-400 dark:bg-emerald-400",
      textPrimary: "text-emerald-900 dark:text-emerald-100",
      textSecondary: "text-emerald-600 dark:text-emerald-500",
      badge: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-100 dark:border-amber-800/40",
      aura: "hover:shadow-[0_0_45px_rgba(52,211,153,0.15)]",
      patternUtils: "opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
    }
  },
  {
    rank: "S", anime: "Re:Zero", title: "Retornador da Morte", 
    xpRequired: 600000, minLevel: 100, minKarma: 12000, 
    requirements: "Recuperar 3 projetos totalmente falhos.", benefits: "Pontos de Checkpoint (Save-states da conta).", icon: Clock,
    theme: {
      wrapper: "bg-violet-50 dark:bg-[#0b0814] border-violet-300 dark:border-violet-900",
      header: "bg-violet-100/50 dark:bg-violet-900/30",
      progressBar: "bg-violet-200 dark:bg-violet-950",
      progressFill: "bg-violet-600 dark:bg-violet-500",
      textPrimary: "text-violet-950 dark:text-violet-100",
      textSecondary: "text-violet-700 dark:text-violet-400",
      badge: "bg-white text-slate-800 dark:bg-white/10 dark:text-white border-slate-200 dark:border-white/20",
      aura: "hover:shadow-[0_0_50px_rgba(139,92,246,0.3)]",
      patternUtils: "opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')]"
    }
  },
  {
    rank: "SS", anime: "Solo Leveling", title: "Monarca das Sombras", 
    xpRequired: 1000000, minLevel: 120, minKarma: 20000, 
    requirements: "Dominar inteiramente sua categoria no Nicho.", benefits: "Exército I.A. (Orquestração ilimitada).", icon: Crown,
    theme: {
      wrapper: "bg-slate-900 dark:bg-[#030305] border-indigo-900 dark:border-[#1a103c]",
      header: "bg-slate-800/50 dark:bg-[#110824]/80",
      progressBar: "bg-slate-800 dark:bg-[#0d0617]",
      progressFill: "bg-indigo-500 dark:bg-indigo-500",
      textPrimary: "text-white dark:text-indigo-50",
      textSecondary: "text-indigo-400 dark:text-indigo-400",
      badge: "bg-indigo-900/50 text-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-700 dark:border-indigo-800",
      aura: "hover:shadow-[0_0_60px_rgba(99,102,241,0.4)]",
      patternUtils: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
    }
  },
  {
    rank: "SSS", anime: "Overlord", title: "Ser Supremo de Nazarick", 
    xpRequired: 2000000, minLevel: 150, minKarma: 50000, 
    requirements: "Ascensão completa. Controle de Guilda Nível Max.", benefits: "Sistema VIP + Modificação Estrutural de I.A.", icon: Skull,
    theme: {
      wrapper: "bg-black dark:bg-[#000000] border-yellow-800 dark:border-yellow-600/40",
      header: "bg-amber-900/20 dark:bg-amber-950/30",
      progressBar: "bg-neutral-900 dark:bg-neutral-900",
      progressFill: "bg-yellow-500 dark:bg-yellow-500",
      textPrimary: "text-amber-100 dark:text-amber-100",
      textSecondary: "text-amber-500 dark:text-amber-600",
      badge: "bg-amber-950 text-amber-400 border-amber-700/50",
      aura: "hover:shadow-[0_0_80px_rgba(234,179,8,0.3)]",
      patternUtils: "opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')] mix-blend-overlay"
    }
  }
];

export default function Evolution({ user, profile, isDarkMode, activeFragment }: { user: User, profile: Profile, isDarkMode?: boolean, activeFragment?: CreatorFragment }) {
  // Encontrar o índice atual através do XP (cada 1xp real do bd pode valer 1 ou algo multiplicado dependendo de como definiram, let's treat user.xp as literal xp)
  // O prompt indica uma cadência de xp requerida
  let currentRankIndex = 0;
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (user.xp >= RANK_TIERS[i].xpRequired) {
      currentRankIndex = i;
    }
  }

  // Se o Momonga está operando o app, ou temos supreme levels mockados, no Dashboard o rank é alterado
  const effectiveRank = getEffectiveRank(user);
  const foundIndexByRank = RANK_TIERS.findIndex(r => r.rank === effectiveRank);
  // Se o effectiveRank for forçado para SSS ou algo assim, ele sobreescreve a checagem por xp
  if (foundIndexByRank > currentRankIndex) {
    currentRankIndex = foundIndexByRank;
  }

  const isSimulation = (user as any).isRealUser === false;
  const isMomongaAdmin = user.role === NazarickRole.MOMONGA || (user as any).isAdmin === true;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-500 pb-24 px-4 sm:px-6">
      <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 transition-colors mt-4", isDarkMode ? "border-white/10" : "border-slate-200")}>
        <div className="flex items-center gap-6">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors", isDarkMode ? "bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)]" : "bg-slate-900 text-white shadow-slate-200")}>
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h2 className={cn("font-black text-4xl tracking-tighter uppercase transition-colors drop-shadow-sm", isDarkMode ? "text-white" : "text-slate-900")}>Evolução</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-1.5 drop-shadow-sm">
              Progresso do Domínio de {profile.name}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {isSimulation && (
            <div className="p-3 rounded-xl border bg-purple-500/10 border-purple-500/30 w-full animate-pulse">
              <p className="text-[10px] font-black tracking-widest text-purple-400 uppercase">SIMULAÇÃO</p>
              <p className="text-[11px] font-bold text-white">Marionete de Nazarick</p>
              <p className="text-[9px] text-purple-300">Dados falsos para teste</p>
            </div>
          )}
          <div className={cn("p-4 rounded-2xl border flex gap-6 shadow-sm", isDarkMode ? "bg-slate-900/80 border-white/10 backdrop-blur-md" : "bg-white border-slate-200")}>
             <div>
               <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 mb-1">XP Atual</p>
               <p className={cn("text-2xl font-black font-mono leading-none tracking-tight", isDarkMode ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "text-slate-900")}>{user.xp.toLocaleString()}</p>
             </div>
             <div className={cn("w-px h-10 my-auto", isDarkMode ? "bg-white/10" : "bg-slate-200")} />
             <div>
               <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 mb-1">Rank Atual</p>
               <p className={cn("text-2xl font-black leading-none drop-shadow-md", isDarkMode ? "text-indigo-400" : "text-indigo-600")}>{RANK_TIERS[currentRankIndex].rank}</p>
             </div>
          </div>
        </div>
      </div>

      {!isSimulation && isMomongaAdmin ? (
        <AdminSupremeDashboardCard user={user} isDarkMode={isDarkMode} activeFragment={activeFragment} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {RANK_TIERS.map((tier, index) => {
          const isUnlocked = index <= currentRankIndex;
          const isNext = index === currentRankIndex + 1;
          const isCurrent = index === currentRankIndex;
          
          let statusLabel = isUnlocked ? 'Desbloqueado' : 'Bloqueado';
          if (isCurrent) statusLabel = 'Aura Atual';
          if (isNext) statusLabel = 'Em Progresso';

          let progress = 0;
          if (isUnlocked) progress = 100;
          else if (isNext) {
            const prevXP = RANK_TIERS[index - 1].xpRequired;
            const range = tier.xpRequired - prevXP;
            // mock the progression between ranks using user XP relative to previous
            const currentExpGap = Math.max(0, user.xp - prevXP);
            progress = Math.min(100, Math.round((currentExpGap / range) * 100));
          }

          const { theme } = tier;
          const Icon = tier.icon;

          return (
             <motion.div
              key={tier.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              title={`Rank ${tier.rank} - ${tier.anime}`}
              className={cn(
                "relative group rounded-[32px] overflow-hidden border transition-all duration-700 h-[28rem] flex flex-col cursor-crosshair transform",
                theme.wrapper,
                !isUnlocked && !isNext ? "opacity-50 grayscale hover:grayscale-[0.5] hover:opacity-80 border-transparent shadow-none" : "shadow-xl border-opacity-100",
                isUnlocked && theme.aura,
                isCurrent && "border-opacity-100 shadow-[0_0_50px_rgba(0,0,0,0.5)] scale-[1.02] z-10"
              )}
            >
              <div className={cn("absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000", theme.patternUtils, !isUnlocked ? "opacity-10" : "")} />
              
              <div className={cn("p-6 border-b relative z-10 flex flex-col gap-4 backdrop-blur-sm transition-colors duration-500", theme.header, (isDarkMode ? "border-white/10" : "border-black/5"))}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={cn("text-4xl font-black uppercase tracking-tighter leading-none mb-1 drop-shadow-sm", theme.textPrimary)}>
                      {tier.rank}
                    </h3>
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.25em] drop-shadow-md", theme.textSecondary)}>
                      {tier.anime}
                    </p>
                  </div>
                  <div className={cn("w-14 h-14 rounded-[1.25rem] flex items-center justify-center border shadow-inner backdrop-blur-md", theme.badge)}>
                    <Icon className="w-7 h-7 drop-shadow-md" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  {isUnlocked ? (
                    <Unlock className={cn("w-3 h-3 drop-shadow-md", theme.textSecondary)} />
                  ) : (
                    <Lock className={cn("w-3 h-3", theme.textSecondary, "opacity-50")} />
                  )}
                  <span className={cn("text-[8.5px] font-black uppercase tracking-[0.15em]", theme.textSecondary, !isUnlocked && "opacity-50")}>
                    {statusLabel}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                <div className="group-hover:-translate-y-1 transition-transform duration-500">
                  <h4 className={cn("font-black text-xl mb-6 tracking-tight leading-snug drop-shadow-md", theme.textPrimary)}>
                    {tier.title}
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
                      <p className={cn("text-[7px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-60", theme.textPrimary)}>Requisito de Desbloqueio</p>
                      <p className={cn("text-[11px] font-bold leading-relaxed", theme.textPrimary, "opacity-90")}>
                        {tier.requirements}
                      </p>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-black/5 dark:border-white/5">
                      <p className={cn("text-[7px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-60", theme.textPrimary)}>Benefício</p>
                      <p className={cn("text-[11px] font-black leading-relaxed drop-shadow-sm", theme.textPrimary)}>
                        {tier.benefits}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                   <div className="flex justify-between items-end mb-2">
                     <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] opacity-60", theme.textPrimary)}>Progresso de XP</p>
                     <p className={cn("text-[11px] font-black font-mono drop-shadow-md", theme.textPrimary)}>
                       {progress}%
                     </p>
                   </div>
                   
                   <div className={cn("h-2 w-full rounded-full overflow-hidden border border-black/10 dark:border-white/10 shadow-inner", theme.progressBar)}>
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn("h-full relative", theme.progressFill)}
                      >
                         {progress > 0 && progress < 100 && (
                            <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                         )}
                      </motion.div>
                   </div>

                   <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={cn("text-[7px] font-black uppercase tracking-[0.2em] opacity-50", theme.textPrimary)}>Lvl Mín</span>
                        <span className={cn("text-[10px] font-bold font-mono", theme.textPrimary)}>{tier.minLevel}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={cn("text-[7px] font-black uppercase tracking-[0.2em] opacity-50", theme.textPrimary)}>Karma</span>
                        <span className={cn("text-[10px] font-bold font-mono", theme.textPrimary)}>{tier.minKarma.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-right">
                        <span className={cn("text-[7px] font-black uppercase tracking-[0.2em] opacity-50", theme.textPrimary)}>XP Alvo</span>
                        <span className={cn("text-[10px] font-black font-mono shadow-sm", theme.textPrimary)}>{(tier.xpRequired / 1000).toFixed(tier.xpRequired < 1000 ? 1 : 0)}k</span>
                      </div>
                   </div>
                </div>
              </div>

              {isUnlocked && (
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-current to-transparent opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none" style={{ color: 'inherit' }} />
              )}
            </motion.div>
          );
        })}
        </div>
      )}
    </div>
  );
}
