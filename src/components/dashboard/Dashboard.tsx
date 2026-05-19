import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User, Profile, Task, OperationalMode, NazarickRole, getEffectiveRank, CreatorFragment } from '../../types';
import { Zap, Trophy, History, Star, ArrowUpRight, CheckCircle2, Clock, Calendar, BarChart3, TrendingUp, Shield, Swords, Ghost, Flame, Crown, Gem, Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getRankTheme } from '../../lib/utils';
import AdminSupremeDashboardCard from './AdminSupremeDashboardCard';

// Rank icon mapping based on level - Iconic Anime Representations
const getRankIcon = (rawRank: string) => {
  const r = (rawRank || 'F').replace(/[+-]/g, '');
  if (r === 'SSS') return SupremeStaffIcon;
  if (r === 'SS') return ShadowArmyIcon;
  if (r === 'S') return HollowMaskIcon;
  if (r === 'A') return CursedMarksIcon;
  if (r === 'B') return HunterLicenseIcon;
  if (r === 'C') return BlackCloverIcon;
  if (r === 'D') return PirateSkullIcon;
  if (r === 'E') return HiddenLeafIcon;
  return BrokenBladeIcon;
};

// Custom Anime Icons (High Fidelity SVG)
const SupremeStaffIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gold-grad" x1="24" y1="6" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF2AD" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <g>
      <motion.path 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        d="M24 44V22" stroke="url(#gold-grad)" strokeWidth="3" strokeLinecap="round" 
      />
      <path d="M24 22C20 18 14 18 14 12C14 8 18 6 24 6C30 6 34 8 34 12C34 18 28 18 24 22Z" fill="#B8860B" fillOpacity="0.4" stroke="url(#gold-grad)" strokeWidth="1.5" />
      <circle cx="24" cy="12" r="4" fill="#FFD700" />
      
      {/* 7 Gems - Animated */}
      {[
        { cx: 24, cy: 4, color: "#FF0000" }, // Red
        { cx: 32, cy: 8, color: "#0000FF" }, // Blue
        { cx: 16, cy: 8, color: "#00FF00" }, // Green
        { cx: 34, cy: 16, color: "#FFFF00" }, // Yellow
        { cx: 14, cy: 16, color: "#FF00FF" }, // Purple
        { cx: 28, cy: 20, color: "#00FFFF" }, // Cyan
        { cx: 20, cy: 20, color: "#FFFFFF" }  // White
      ].map((gem, i) => (
        <motion.circle 
          key={`gem-${i}`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
          cx={gem.cx} cy={gem.cy} r="2.5" 
          fill={gem.color} 
          className="opacity-90"
        />
      ))}
    </g>
  </svg>
);

const ShadowArmyIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20L24 8L38 20L34 40H14L10 20Z" fill="#1E3A8A" fillOpacity="0.3" stroke="#60A5FA" strokeWidth="2" />
    <motion.path 
      animate={{ d: ["M12 24Q24 20 36 24", "M12 28Q24 32 36 28", "M12 24Q24 20 36 24"] }}
      transition={{ duration: 3, repeat: Infinity }}
      stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 3"
    />
    <path d="M20 12V18M28 12V18" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="24" r="3" fill="#60A5FA" />
  </svg>
);

const HollowMaskIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6C14 6 8 14 8 24C8 36 16 42 24 42C32 42 40 36 40 24C40 14 34 6 24 6Z" fill="#FFFFFF" fillOpacity="0.1" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M16 20L12 16M32 20L36 16" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
    <path d="M16 28H32M20 32H28M24 32V42" stroke="#FFFFFF" strokeWidth="1.5" />
    <rect x="18" y="26" width="2" height="6" fill="#FFFFFF" />
    <rect x="23" y="26" width="2" height="6" fill="#FFFFFF" />
    <rect x="28" y="26" width="2" height="6" fill="#FFFFFF" />
  </svg>
);

const CursedMarksIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" stroke="#991B1B" strokeWidth="1" strokeDasharray="4 2" />
    <path d="M16 20Q16 20 20 16M32 20Q32 20 28 16" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
    <path d="M16 28Q24 36 32 28" stroke="#991B1B" strokeWidth="2" fill="none" />
    <path d="M24 16V22M24 28V34" stroke="#991B1B" strokeWidth="1.5" />
    <path d="M8 24H14M34 24H40" stroke="#991B1B" strokeWidth="1.5" />
  </svg>
);

const HunterLicenseIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="12" width="36" height="24" rx="4" fill="#FBBF24" fillOpacity="0.1" stroke="#FBBF24" strokeWidth="2" />
    <circle cx="24" cy="24" r="5" stroke="#FBBF24" strokeWidth="2" />
    <path d="M24 12V18M24 30V36" stroke="#FBBF24" strokeWidth="1.2" />
    <path d="M6 24H16M32 24H42" stroke="#FBBF24" strokeWidth="1.2" />
    <path d="M12 18V30M36 18V30" stroke="#FBBF24" strokeWidth="0.5" opacity="0.5" />
  </svg>
);

const BlackCloverIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 24L24 42" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
    <g fill="#EF4444" fillOpacity="0.3">
      <path d="M24 24C24 24 32 16 38 16C42 16 44 20 40 24C36 28 24 24 24 24Z" />
      <path d="M24 24C24 24 16 16 10 16C6 16 4 20 8 24C12 28 24 24 24 24Z" />
      <path d="M24 24C24 24 32 32 38 32C42 32 44 28 40 24C36 20 24 24 24 24Z" />
      <path d="M24 24C24 24 16 32 10 32C6 32 4 28 8 24C12 20 24 24 24 24Z" />
      <path d="M24 24Q24 12 24 6Q20 2 20 6" fill="none" stroke="#EF4444" strokeWidth="2" />
    </g>
    <circle cx="24" cy="24" r="3" fill="#111827" />
  </svg>
);

const PirateSkullIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20C10 12 16 6 24 6C32 6 38 12 38 20C38 26 34 32 24 32C14 32 10 26 10 20Z" fill="#FDE047" fillOpacity="0.1" stroke="#FDE047" strokeWidth="2" />
    <path d="M6 20H42" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="16" r="4" fill="#FDE047" />
    <circle cx="30" cy="16" r="4" fill="#FDE047" />
    <path d="M18 26H30" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 32V40" stroke="#FDE047" strokeWidth="1.5" />
    <path d="M16 36H32" stroke="#FDE047" strokeWidth="1" />
  </svg>
);

const HiddenLeafIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 24C8 14 16 8 24 8C34 8 40 16 40 24C40 34 32 40 24 40C14 40 8 32 8 24Z" fill="#EA580C" fillOpacity="0.1" stroke="#EA580C" strokeWidth="2" />
    <path d="M24 24C24 24 28 20 34 20" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
    <motion.path 
      animate={{ rotate: 360 }} 
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      d="M24 24C24 20 20 16 16 16C12 16 10 20 10 24C10 28 14 32 20 32" 
      stroke="#EA580C" 
      strokeWidth="3" 
      fill="none" 
    />
    <circle cx="24" cy="24" r="2" fill="#EA580C" />
  </svg>
);

const BrokenBladeIcon = (props: any) => (
  <svg {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 44V36L20 32H28L24 36" fill="#64748B" fillOpacity="0.2" stroke="#64748B" strokeWidth="2" />
    <path d="M24 32L20 26L26 20L16 10L24 4" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 32L30 26L24 20L32 10" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
  </svg>
);

function RankLetter({ char, index, rank, isDarkMode, themeAccent }: { char: string, index: number, rank: string, isDarkMode: boolean, themeAccent?: any }) {
  const isSSS = rank === 'SSS';
  const isHigh = rank === 'S' || rank === 'SS' || isSSS;
  
  return (
    <motion.span
      initial={{ y: 20, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.2, 
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 400,
        damping: 10
      }}
      className={cn(
        "inline-block relative px-1 font-black cursor-default select-none group/letter",
        isSSS 
          ? (isDarkMode ? "text-white italic" : (themeAccent?.text || "text-indigo-600") + " italic") 
          : isHigh 
            ? (isDarkMode ? "text-indigo-100" : "text-indigo-900") 
            : (isDarkMode ? "text-white/90" : "text-slate-800")
      )}
    >
      <span className="relative z-10">{char}</span>
      
      {/* Anime Aura Effect */}
      <motion.div
        animate={{ 
          scale: isHigh ? [1, 1.1, 1] : 1,
          opacity: isHigh ? [0.16, 0.32, 0.16] : 0
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className={cn(
          "absolute inset-0 z-0 flex items-center justify-center -translate-y-2",
          rank === 'SSS' ? (themeAccent?.textLight || "text-indigo-400") : 
          rank === 'SS' ? "text-blue-400" : 
          rank === 'S' ? "text-white" : 
          rank === 'A' ? "text-red-400" : "text-transparent"
        )}
      >
        <span className="text-current scale-110 select-none opacity-40">{char}</span>
      </motion.div>

      {isSSS && (
        <motion.div
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0.5, 1.8, 0.5],
            rotate: [0, 180, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          className="absolute -top-3 -right-3 pointer-events-none"
        >
          <Sparkles className="w-5 h-5 text-yellow-300/80" />
        </motion.div>
      )}
    </motion.span>
  );
}

// Detailed Anime Background Decorations - High Fidelity
const RankBackgrounds: Record<string, React.FC<{ isDarkMode: boolean }>> = {
  'F': () => (
     <div className="absolute inset-0 opacity-[0.2] pointer-events-none overflow-hidden">
       <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-500 fill-current">
         <path d="M0 0 L200 200 M200 0 L0 200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
         <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
         <path d="M100 20 L100 180 M20 100 L180 100" stroke="currentColor" strokeWidth="0.5" />
         <path d="M60 60 L140 140 M140 60 L60 140" stroke="currentColor" strokeWidth="0.5" />
       </svg>
     </div>
  ),
  'E': () => (
     <div className="absolute inset-0 opacity-[0.3] pointer-events-none overflow-hidden">
       <svg viewBox="0 0 400 400" className="w-full h-full text-orange-500 fill-current">
          {/* Detailed Hidden Leaf / Spiral Motif */}
          <motion.path 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            d="M200 200 m-150 0 a150 150 0 1 0 300 0 a150 150 0 1 0 -300 0" 
            fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="20 10" 
          />
          <path d="M200 100 Q280 100 280 200 T200 300 T120 200 T200 100" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.15" />
          <path d="M200 200 L260 140 M200 200 L140 140 M200 200 L260 260 M200 200 L140 260" stroke="currentColor" strokeWidth="1" opacity="0.6" />
       </svg>
     </div>
  ),
  'D': () => (
     <div className="absolute inset-0 opacity-[0.35] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full text-yellow-400 fill-current">
          {/* Waves and Sun - One Piece Style */}
          <path d="M0 300 Q100 250 200 300 T400 300 V400 H0 Z" opacity="0.3" />
          <path d="M0 340 Q100 290 200 340 T400 340 V400 H0 Z" opacity="0.5" />
          <motion.circle 
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            cx="300" cy="100" r="60" fill="currentColor" 
          />
          <path d="M280 80 L320 120 M320 80 L280 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.2" />
        </svg>
     </div>
  ),
  'C': () => (
     <div className="absolute inset-0 opacity-[0.4] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full text-red-600 fill-current">
          {/* Pentagram / Clover Magic Circle */}
          <motion.g animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 5" />
            <path d="M200 20 L380 340 L20 340 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M200 380 L20 60 L380 60 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </motion.g>
          <path d="M180 180 Q200 140 220 180 T180 180" fill="currentColor" opacity="0.5" />
        </svg>
     </div>
  ),
  'B': () => (
     <div className="absolute inset-0 opacity-[0.35] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full text-green-500 fill-current">
          {/* Nen Flow Lines */}
          {[...Array(12)].map((_, i) => (
            <motion.path
              key={`orbit-${i}`}
              animate={{ 
                d: [`M${i * 40} 0 Q${i * 40 + 20} 200 ${i * 40} 400`, `M${i * 40 + 20} 0 Q${i * 40} 200 ${i * 40 + 20} 400`, `M${i * 40} 0 Q${i * 40 + 20} 200 ${i * 40} 400`],
                opacity: [0.15, 0.4, 0.15]
              }}
              transition={{ duration: 4 + i % 3, repeat: Infinity, ease: "easeInOut" }}
              d={`M${i * 40} 0 Q${i * 40 + 20} 200 ${i * 40} 400`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
     </div>
  ),
  'A': () => (
     <div className="absolute inset-0 opacity-[0.45] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full text-red-600 fill-current">
           {/* Sukuna's Domain Expansion / Marks */}
           <path d="M0 200 L400 200 M200 0 L200 400" stroke="currentColor" strokeWidth="1" opacity="0.3" />
           <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
           <path d="M100 100 Q200 50 300 100 T100 300 T100 100" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.4" />
           <motion.path 
             animate={{ opacity: [0.3, 0.8, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             d="M50 50 L150 150 M350 350 L250 250" stroke="currentColor" strokeWidth="6" 
           />
        </svg>
     </div>
  ),
  'S': () => (
     <div className="absolute inset-0 opacity-[0.4] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full text-white fill-current">
          {/* Cherry Blossoms / Senbonzakura and Hollow Cracks */}
          {[...Array(20)].map((_, i) => (
             <motion.path
               key={`particle-${i}`}
               animate={{ 
                 y: [0, 400], 
                 x: [Math.random() * 400, Math.random() * 400 + 100],
                 rotate: [0, 360]
               }}
               transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
               d="M0 0 Q5 5 10 0 T0 0" 
               fill="#F472B6" 
               opacity="0.5" 
             />
          ))}
          <path d="M0 0 L400 400 M400 0 L0 400" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        </svg>
     </div>
  ),
  'SS': () => (
     <div className="absolute inset-0 opacity-[0.5] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 400 400" className="w-full h-full text-blue-500 fill-current">
           {/* Shadow Army Summoning Circle */}
           <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
             <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="30 10" />
             <path d="M200 40 L360 200 L200 360 L40 200 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
           </motion.g>
           <motion.path 
             animate={{ d: ["M100 200 Q200 180 300 200", "M100 200 Q200 220 300 200", "M100 200 Q200 180 300 200"] }}
             transition={{ duration: 4, repeat: Infinity }}
             stroke="currentColor" strokeWidth="24" opacity="0.1" 
           />
        </svg>
     </div>
  ),
  'SSS': () => (
     <div className="absolute inset-0 opacity-[0.55] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 1000" className="w-full h-full text-indigo-400 fill-current">
           {/* Tier 10 Magic Circle - Ainz Style */}
           <motion.g animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
             <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="3" />
             <circle cx="500" cy="500" r="420" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="50 20" />
             {[...Array(12)].map((_, i) => (
                <rect key={`rect-${i}`} x="480" y="50" width="40" height="40" transform={`rotate(${i * 30} 500 500)`} fill="none" stroke="currentColor" strokeWidth="2" />
             ))}
           </motion.g>
           <motion.path 
             animate={{ opacity: [0.15, 0.4, 0.15] }}
             transition={{ duration: 5, repeat: Infinity }}
             d="M500 500 m-200 0 a200 200 0 1 0 400 0 a200 200 0 1 0 -400 0" 
             fill="none" stroke="currentColor" strokeWidth="24" opacity="0.2" 
           />
           <path d="M500 100 V900 M100 500 H900" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
     </div>
  )
};

export default function Dashboard({ user, profile, onNavigate, isDarkMode, activeFragment }: { user: User, profile: Profile, onNavigate: (v: any) => void, isDarkMode: boolean, activeFragment?: CreatorFragment }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const effectiveRank = getEffectiveRank(user);
  const RankIcon = getRankIcon(effectiveRank);
  const rankChars = effectiveRank.split('');

  const baseRank = effectiveRank.replace(/[+-]/g, '');
  const rankTheme = getRankTheme(effectiveRank, isDarkMode);
  const RankDecoration = RankBackgrounds[effectiveRank] || RankBackgrounds[baseRank] || RankBackgrounds['F'];

  const internalHighLevel = ['S', 'SS', 'SSS'].includes(effectiveRank);

  const neutralFragmentTheme = {
    bg: 'bg-slate-600',
    bgHover: 'hover:bg-slate-500',
    text: 'text-slate-600',
    textLight: 'text-slate-300',
    heroBgLight: 'from-white/78 via-slate-100/62 to-slate-200/48',
    heroBgDark: 'from-slate-950/72 via-slate-900/58 to-slate-800/40',
    glow: 'bg-white/10 dark:bg-white/8',
    borderHoverDark: 'hover:border-white/18',
    borderHoverLight: 'hover:border-white/70',
    textHover: 'hover:text-slate-700',
    borderHoverBtnDark: 'hover:border-white/24',
    borderHoverBtnLight: 'hover:border-white',
    groupTextHover: 'group-hover:text-slate-700',
    xpText: 'text-slate-500'
  };
  const themeColors: { [key: string]: typeof neutralFragmentTheme } = {
    [CreatorFragment.MOMONGA]: neutralFragmentTheme,
    [CreatorFragment.KOTARO]: neutralFragmentTheme,
    [CreatorFragment.MATHEUS]: neutralFragmentTheme
  };
  const themeAccent = themeColors[activeFragment || CreatorFragment.MOMONGA] || themeColors[CreatorFragment.MOMONGA];

  useEffect(() => {
    if (!user?.uid) return;
    if (user.uid === 'presentation-user') {
      setTasks([
        {
          id: 'demo-task-1',
          title: 'Criar roteiro de apresentacao',
          description: 'Montar uma narrativa curta para validar o produto.',
          xpReward: 25,
          status: 'Pending'
        },
        {
          id: 'demo-task-2',
          title: 'Organizar biblioteca inicial',
          description: 'Salvar os primeiros ativos criados pela IA.',
          xpReward: 15,
          status: 'In_Progress'
        }
      ]);
      return;
    }

    const q = query(collection(db, 'users', user.uid, 'orders'), where('status', '!=', 'Completed'));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });
    return unsub;
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid === 'presentation-user') {
      setAllUsers([user]);
      return;
    }

    if (internalHighLevel || user?.role === NazarickRole.MOMONGA) {
      const q = query(collection(db, 'users'));
      const unsub = onSnapshot(q, (snapshot) => {
        setAllUsers(snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User)));
      });
      return unsub;
    }
  }, [internalHighLevel, user?.role]);

  const handleCompleteTask = async (task: Task) => {
    if (!user?.uid) return;
    if (user.uid === 'presentation-user') {
      setTasks((prev) => prev.map((item) => (
        item.id === task.id ? { ...item, status: 'Completed' } : item
      )));
      return;
    }

    await updateDoc(doc(db, 'users', user.uid, 'orders', task.id), { status: 'Completed' });
    await updateDoc(doc(db, 'users', user.uid), { 
      xp: increment(task.xpReward),
      karma: increment(1) 
    });
  };

  const isSupremeRole = user?.role === NazarickRole.MOMONGA;
  
  // Dynamic metrics calculation - Zeroed out until real integrations are implemented
  const xp = user?.xp || 0;
  const metricsSuccess = 0; // Awaiting real data
  const metricsEngagement = 0; // Awaiting real data
  const metricsVideos = tasks.filter(t => t.status === 'Completed').length;
  const metricsProductivity = 0; // Awaiting real data

  // User Experience Mode Evaluation
  const opMode = user?.operationalMode || OperationalMode.NORMAL;
  const isSimulatingEasy = opMode === OperationalMode.EASY;
  const isSimulatingNormal = opMode === OperationalMode.NORMAL;
  const isSimulatingHard = opMode === OperationalMode.HARD;
  const isSimulatingSupreme = opMode === OperationalMode.SUPREME;

  const isSupreme = isSupremeRole && isSimulatingSupreme;
  const isHighLevel = isSimulatingHard || isSimulatingSupreme;
  const isGuardianLevel = isSimulatingHard || isSimulatingSupreme;
  const hasHighRank = ['SSS', 'SS', 'S', 'A'].includes(effectiveRank);

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Simulator Bar (Moved to App.tsx) */}
      
      {(user as any).isRealUser === false && (
        <div className="p-3 rounded-xl border bg-purple-500/10 border-purple-500/30 w-full animate-pulse my-2">
          <p className="text-[10px] font-black tracking-widest text-purple-400 uppercase">SIMULAÇÃO</p>
          <p className="text-[11px] font-bold text-white">Marionete de Nazarick</p>
          <p className="text-[9px] text-purple-300">Dados falsos para teste</p>
        </div>
      )}

      {/* SSS Status & Resources - Dynamic based on Mode */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className={cn(
          "p-6 rounded-3xl border flex items-center justify-between transition-all duration-500",
          isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-100 shadow-sm"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              isDarkMode ? "bg-white/5" : "bg-black/5"
            )}>
              {isHighLevel ? <Gem className={cn("w-6 h-6", themeAccent.text)} /> : <Star className={cn("w-6 h-6", themeAccent.text)} />}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {isHighLevel ? "Ouro de Yggdrasil" : "Pontos Sincronia"}
              </p>
              <h4 className={cn("text-2xl font-black tabular-nums", isDarkMode ? "text-white" : "text-slate-900")}>
                {((user?.xp || 0) * 10).toLocaleString()}
              </h4>
            </div>
          </div>
          {isHighLevel && <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className={cn("font-bold text-[10px]", themeAccent.text)}>+0/h</motion.div>}
        </div>

        <div className={cn(
          "p-6 rounded-3xl border flex items-center justify-between transition-all duration-500",
          isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-100 shadow-sm"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              isDarkMode ? "bg-white/5" : "bg-black/5"
            )}>
              {isHighLevel ? <Flame className={cn("w-6 h-6", themeAccent.text)} /> : <Zap className={cn("w-6 h-6", themeAccent.text)} />}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {isHighLevel ? "Reserva de Mana" : "Carga de Trabalho"}
              </p>
              <h4 className={cn("text-lg font-black tabular-nums mt-0.5", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                AGUARDANDO
              </h4>
            </div>
          </div>
          {isHighLevel && (
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={cn("h-full w-[0%] shadow-[0_0_8px_currentColor]", themeAccent.bg, themeAccent.text)} />
            </div>
          )}
        </div>

        <div className={cn(
          "p-6 rounded-3xl border flex items-center justify-between transition-all duration-500",
          isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-100 shadow-sm"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              isDarkMode ? "bg-white/5" : "bg-black/5"
            )}>
              {isHighLevel ? <Crown className={cn("w-6 h-6", themeAccent.text)} /> : <Calendar className={cn("w-6 h-6", themeAccent.text)} />}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {isHighLevel ? "Nível de Ameaça" : "Dias Ativos"}
              </p>
              <h4 className={cn("text-xl font-black uppercase tabular-nums", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                --
              </h4>
            </div>
          </div>
          {isHighLevel && <div className={cn("px-3 py-1 text-[9px] font-black rounded-full border bg-opacity-10 border-opacity-20", themeAccent.text, themeAccent.bg, `border-${themeAccent.bg.replace('bg-', '')}`)}>SEGURO</div>}
        </div>
      </motion.div>

      {/* Hero Stats */}
      {(user as any).isRealUser !== false && (user.role === NazarickRole.MOMONGA || (user as any).isAdmin === true) ? (
        <AdminSupremeDashboardCard user={user} isDarkMode={isDarkMode} activeFragment={activeFragment} />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={cn(
          "md:col-span-2 p-10 relative overflow-hidden group transition-all duration-1000 shadow-2xl rounded-3xl border border-transparent",
          "bg-gradient-to-br transition-colors duration-1000",
          isDarkMode ? themeAccent.heroBgDark : themeAccent.heroBgLight
        )}>
          {/* Background Decorative - Japanese Anime Vibe */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className={cn("absolute left-10 right-10 top-0 h-px", themeAccent.bg)}
            />
            {/* Pattern Overlay */}
            <div className={cn("absolute inset-0 mix-blend-overlay transition-opacity duration-1000", rankTheme.pattern)} />
            
            {/* Unique Rank Background Decoration */}
            <RankDecoration isDarkMode={isDarkMode} />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "px-3 py-1 bg-white/5 glass-control rounded-lg border flex items-center gap-2 transition-all duration-700",
                  effectiveRank === 'SSS' ? "border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "border-white/10"
                )}>
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                     "bg-white"
                   )} />
                   <p className="text-[9px] text-white/80 font-black uppercase tracking-[0.5em] font-mono">
                     {rankTheme.label}
                   </p>
                </div>
                {effectiveRank === 'SSS' && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-white border border-white/20 text-[8px] font-black rounded-md tracking-tighter glass-control"
                  >
                    <Crown className="w-2.5 h-2.5" />
                    AUTORIDADE_MÁXIMA
                  </motion.div>
                )}
              </div>
              
              <div className="mb-12">
                <p className={cn(
                  "text-lg font-black uppercase tracking-[0.4em] mb-1 italic transition-all duration-700 font-mono",
                  effectiveRank === 'SSS' 
                    ? (isDarkMode ? `${themeAccent.textLight} opacity-100 scale-105 origin-left` : `${themeAccent.text} opacity-100 scale-105 origin-left`) 
                    : (isDarkMode ? "text-white/40 opacity-70" : "text-slate-500 opacity-70")
                )}>
                   {user?.role === NazarickRole.MOMONGA ? 'Regente de Nazarick' : 'Data Scientist Elite'}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: [-2, 2, 0] }}
                    className={cn(
                      "w-24 h-24 md:w-36 md:h-36 rounded-[2rem] flex items-center justify-center shrink-0 border relative overflow-hidden transition-all duration-700 shadow-2xl",
                      isDarkMode ? "bg-black/40 border-white/10 glass-control" : "bg-white/80 border-slate-200 glass-control"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                    <RankIcon className="w-16 h-16 md:w-24 md:h-24 relative z-10" />
                  </motion.div>
                  <h2 className={cn(
                    "font-black text-7xl md:text-[8.5rem] tracking-tighter flex relative transition-all duration-700",
                    effectiveRank === 'SSS' ? "animate-pulse" : ""
                  )}>
                    {rankChars.map((char, i) => (
                      <RankLetter key={`rankChar-${i}`} char={char} index={i} rank={effectiveRank} isDarkMode={isDarkMode} themeAccent={themeAccent} />
                    ))}
                    
                    <AnimatePresence>
                      {(effectiveRank === 'SSS' || effectiveRank === 'SS') && (
                        <motion.div
                          key="legendary-status"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 0.3, x: 0 }}
                          className="absolute -right-32 top-8 rotate-90 origin-left hidden md:block"
                        >
                          <p className={cn("text-[10px] font-black tracking-[1.5em] uppercase whitespace-nowrap", isDarkMode ? "text-white" : themeAccent?.text || "text-indigo-900")}>STATUS: LENDA VIVA</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </h2>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 max-w-sm">
               <div className="flex justify-between text-[11px] font-black font-mono">
                 <span className={cn("uppercase tracking-[0.3em] flex items-center gap-2", isDarkMode ? "text-white/50" : "text-slate-600/70")}>
                   <div className={cn("w-1.5 h-1.5 rounded-full", themeAccent.bg)} />
                   Próxima Patente: {getNextRank(effectiveRank)}
                 </span>
                 <motion.span 
                  key={user?.xp}
                  className={cn("font-black tracking-widest", isDarkMode ? "text-white/90" : "text-slate-800")}
                 >
                  {((user?.xp || 0) % 100).toFixed(0)}% SINC_MODO
                 </motion.span>
               </div>
               
               <div className={cn("h-2.5 rounded-full overflow-hidden border p-0.5 relative shadow-inner", isDarkMode ? "bg-black/50 border-white/10" : "bg-white/50 border-slate-300 gap-2")}>
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(5, (user?.xp || 0) % 100)}%` }}
                  transition={{ type: "spring", stiffness: 40, damping: 15 }}
                  className={cn(
                    "h-full rounded-full relative transition-all duration-1000",
                    themeAccent.bg,
                    "shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  )}
                 >
                   <motion.div 
                     animate={{ x: ['-200%', '300%'] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full skew-x-12"
                   />
                   <motion.div 
                     animate={{ opacity: [0.2, 0.5, 0.2] }}
                     transition={{ duration: 2, repeat: Infinity }}
                     className="absolute inset-0 bg-white/20"
                   />
                 </motion.div>
               </div>
            </div>
          </div>

          {/* Blueprint Corner Decorations */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <div className="w-16 h-16 border-t border-r border-white/30" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 opacity-10">
             <div className="w-16 h-16 border-b border-l border-white/30" />
          </div>
        </div>

        {/* Info Box to fill empty space for EASY modes */}
        {(!isHighLevel) && (
          <div className={cn(
            "md:col-span-2 p-8 rounded-3xl border border-dashed flex flex-col justify-center transition-all duration-500",
            isDarkMode ? "bg-slate-900/30 border-slate-700 shadow-inner" : "bg-slate-50/50 border-slate-300"
          )}>
             <div className="flex items-center gap-4 mb-4 opacity-70">
               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isDarkMode ? "bg-slate-800" : "bg-white shadow-sm")}>
                 <Target className={cn("w-5 h-5", themeAccent.text)} />
               </div>
               <div>
                  <h3 className={cn("font-bold uppercase tracking-tight", isDarkMode ? "text-slate-300" : "text-slate-700")}>Seu Próximo Passo</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Guia de Evolução</p>
               </div>
             </div>
             <p className={cn("text-sm leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
               Conclua tarefas no painel para ganhar <strong className={themeAccent.text}>Pontos de Sincronia</strong>. 
               Ao atingir 100%, você subirá de Patente e desbloqueará novos níveis de acesso e ferramentas avançadas.
             </p>
             <button onClick={() => onNavigate('creation')} className={cn("mt-6 px-4 py-2 w-max text-white text-xs font-black uppercase rounded-xl transition-all shadow-md active:scale-95", themeAccent.bg, themeAccent.bgHover)}>
                Iniciar Missão
             </button>
          </div>
        )}

      </div>
      )}

      {/* Main Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Orders (Tasks) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 shadow-sm transition-colors", isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200")}>
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className={cn("font-bold text-lg tracking-tight uppercase tracking-tighter", isDarkMode ? "text-white" : "text-slate-900")}>Ordens de Prioridade</h3>
            </div>
            {tasks.length > 0 && tasks.some(t => t.id.includes('urgent') || t.xpReward > 40) && (
              <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase animate-pulse border border-red-500/20 shadow-sm">Urgente</span>
            )}
          </div>

          <div className="space-y-4">
            {tasks.length > 0 ? tasks.map((task, idx) => (
              <motion.div 
                key={`task-${task.id || idx}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.05 * idx }}
                className={cn(
                  "p-5 flex items-center gap-5 group rounded-3xl border transition-all duration-200",
                  isDarkMode 
                    ? `bg-slate-900/50 border-white/5 hover:bg-slate-900 ${themeAccent.borderHoverDark}` 
                    : `bg-white border-slate-100 shadow-sm ${themeAccent.borderHoverLight} hover:shadow-md`
                )}
              >
                <button 
                  onClick={() => handleCompleteTask(task)}
                  className={cn(
                    "w-7 h-7 rounded-lg border-2 flex items-center justify-center text-transparent transition-all shadow-inner",
                    themeAccent.textHover,
                    isDarkMode ? `border-slate-800 bg-black/20 ${themeAccent.borderHoverBtnDark}` : `border-slate-200 bg-slate-50 ${themeAccent.borderHoverBtnLight}`
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h4 className={cn(`font-black transition-colors uppercase text-xs tracking-tight ${themeAccent.groupTextHover}`, isDarkMode ? "text-slate-200" : "text-slate-800")}>{task.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed italic opacity-80">{task.description}</p>
                </div>
                <div className="text-right">
                  <div className={cn("font-black text-sm", themeAccent.xpText)}>+{task.xpReward} XP</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Bonus Sinc.</div>
                </div>
              </motion.div>
            )) : (
              <div className={cn(
                "p-24 text-center rounded-3xl border-2 border-dashed shadow-none flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500",
                isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"
              )}>
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className={cn(
                    "w-24 h-24 rounded-full border border-dashed mb-8 flex items-center justify-center transition-all duration-500",
                    isDarkMode ? "border-slate-800 group-hover:border-indigo-500 bg-slate-950/50" : "border-slate-200 group-hover:border-indigo-400 bg-slate-50"
                   )}
                >
                  <Ghost className={cn("w-10 h-10 transition-colors duration-500", isDarkMode ? "text-slate-700 group-hover:text-indigo-400" : "text-slate-300 group-hover:text-indigo-500")} />
                </motion.div>
                <div className="relative z-10 space-y-2">
                  <p className={cn("text-[11px] font-black uppercase tracking-[0.5em] transition-colors duration-500", isDarkMode ? "text-slate-600 group-hover:text-indigo-300" : "text-slate-400 group-hover:text-indigo-600")}>
                    Sincronia Completa
                  </p>
                  <p className={cn("text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 italic", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                    Esperando novos dados da rede...
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full flex justify-center overflow-hidden">
                  <motion.div 
                    animate={{ scaleX: [0, 1, 0], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-[1px] w-full max-w-md bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Monitoramento de Domínio (Visible to all, dynamically adjusted) */}
          <div className={cn(
            "p-8 rounded-3xl border transition-all duration-500 overflow-hidden relative",
            isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl shadow-black/40" : "bg-white border-slate-100 shadow-sm"
          )}>
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')] pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className={cn("font-black text-lg tracking-tighter uppercase leading-none", isDarkMode ? "text-white" : "text-slate-900")}>
                    {isHighLevel ? "Projetos em Andamento" : "Meus Resultados"}
                  </h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase mt-1 tracking-widest">
                    {isHighLevel ? "Visão Geral de Campanhas" : "Estatística Geral"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Integridade Total</p>
                  <p className={cn("text-xs font-black italic", isHighLevel ? "text-emerald-500" : "text-slate-500")}>
                    {isHighLevel ? "98.4%" : "--"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full animate-pulse", isHighLevel ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-400")} />
                    <span className={cn("text-[10px] font-black uppercase", isHighLevel ? "text-emerald-500" : "text-slate-400")}>
                      {isHighLevel ? "Sincronia Total" : "Aguardando"}
                    </span>
                </div>
              </div>
            </div>
            
            {isHighLevel ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <DomainCard label="Reels Instagram" status="Aguardando Relatório" health={0} isDarkMode={isDarkMode} />
                <DomainCard label="TikTok Diário" status="Aguardando Relatório" health={0} isDarkMode={isDarkMode} />
                <DomainCard label="YouTube Shorts" status="Aguardando Relatório" health={0} isDarkMode={isDarkMode} />
                <DomainCard label="Conteúdo Longo" status="Inativo" health={0} isDarkMode={isDarkMode} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <DomainCard label="Vídeos Completos" status={metricsVideos > 0 ? "Em Progresso" : "Aguardando"} health={metricsSuccess} isDarkMode={isDarkMode} />
                <DomainCard label="Produtividade" status={metricsProductivity > 80 ? "Alta" : "Estável"} health={metricsProductivity} isDarkMode={isDarkMode} />
              </div>
            )}

            {/* Additional Metrics */}
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Progresso de Publicações</h4>
                    <span className={cn("text-[9px] font-mono", isHighLevel ? "text-indigo-400" : "text-slate-500")}>
                      {isHighLevel ? "SYNC_OK" : "AGUARDANDO"}
                    </span>
                  </div>
                  <div className="h-16 flex items-end gap-1 px-2">
                    {(isHighLevel ? [40, 60, 45, 80, 55, 90, 70, 85, 60, 40, 50, 75] : Array(12).fill(0)).map((h, i) => (
                      <motion.div 
                        key={`chartbar-${i}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className={cn(
                          "flex-1 rounded-t-sm relative group transition-all duration-500",
                          isHighLevel ? "bg-indigo-500/20" : isDarkMode ? "bg-slate-800" : "bg-slate-200"
                        )}
                      >
                        {isHighLevel && <div className="absolute inset-x-0 bottom-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity h-[20%]" />}
                      </motion.div>
                    ))}
                  </div>
              </div>
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {isHighLevel ? "Alertas de Projetos (24h)" : "Alertas do Sistema (24h)"}
                    </h4>
                    <span className={cn("text-[9px] font-mono font-black", isHighLevel ? "text-emerald-500" : "text-slate-400")}>{isHighLevel ? "NENHUMA" : "--"}</span>
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between",
                    isDarkMode ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg border",
                        isHighLevel ? "bg-emerald-500/10 text-emerald-500 border-none" : "bg-slate-500/5 text-slate-400 border-slate-500/10"
                      )}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">
                        {isHighLevel ? "Prazos em Dia" : "Aguardando"}
                      </p>
                    </div>
                    <p className="text-[10px] font-black tabular-nums text-slate-400">0/0</p>
                  </div>
              </div>
            </div>
          </div>

          {/* Terminal de Atividade (Restricted to High Level) */}
          {isHighLevel && (
            <div className={cn(
              "p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden",
              isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200 shadow-sm"
            )}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", themeAccent?.glow)}>
                    <History className={cn("w-4 h-4", themeAccent?.text)} />
                  </div>
                  <h3 className={cn("font-black text-xs uppercase tracking-[0.3em]", isDarkMode ? "text-white" : "text-slate-900")}>
                    Logs de Sincronia
                  </h3>
                </div>
                <button className="text-[8px] font-black uppercase tracking-widest text-indigo-500 hover:underline">Ver_Tudo</button>
              </div>
              
              <div className="space-y-3 font-mono">
                <LogEntry time="22:31:04" type="SYNC" message="Protocolo de Despertar executado com sucesso." isDarkMode={isDarkMode} />
                <LogEntry time="22:30:12" type="AUTH" message="Sincronia restabelecida via Oauth." isDarkMode={isDarkMode} />
                <LogEntry time="22:28:45" type="DOMN" message="Varredura completa no 9º Andar confirmada." isDarkMode={isDarkMode} />
                <LogEntry time="22:25:01" type="CREA" message="Relatório do Visual Composer gerado." isDarkMode={isDarkMode} />
              </div>
            </div>
          )}
        </div>

        {/* Shortcuts / Activity / Right Col */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm transition-colors", isDarkMode ? "bg-slate-900 border-white/5 text-amber-500/80" : "bg-amber-50 border-amber-100 text-amber-500")}>
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <h3 className={cn("font-bold text-lg tracking-tight uppercase tracking-tighter", isDarkMode ? "text-white" : "text-slate-900")}>Ações Rápidas</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
             <QuickAction label="Manifestar Roteiro" sub="Motor I.A. v4.2" icon={Clock} color="indigo" onClick={() => onNavigate('creation')} isDarkMode={isDarkMode} />
             {isHighLevel && <QuickAction label="Analisar Estratégia" sub="Protocolo Gaia" icon={BarChart3} color="purple" onClick={() => onNavigate('strategy')} isDarkMode={isDarkMode} />}
             <QuickAction label="Visual Composer" sub="Relatórios" icon={Zap} color="amber" onClick={() => onNavigate('creation')} isDarkMode={isDarkMode} />
          </div>
          
          {!isHighLevel && (
            <div className={cn(
              "p-6 rounded-3xl border transition-all duration-500",
              isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-100 shadow-sm"
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600")}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className={cn("font-bold text-sm tracking-tight uppercase", isDarkMode ? "text-white" : "text-slate-900")}>Progresso Semanal</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1.5 text-slate-500">
                    <span>Taxa de Acerto</span>
                    <span className={metricsSuccess > 0 ? "text-emerald-500" : "text-slate-400"}>
                      {metricsSuccess > 0 ? `${metricsSuccess}%` : 'AGUARDANDO'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${metricsSuccess}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1.5 text-slate-500">
                    <span>Engajamento do Público</span>
                    <span className={metricsEngagement > 0 ? "text-indigo-500" : "text-slate-400"}>
                      {metricsEngagement > 0 ? `+${metricsEngagement}%` : 'AGUARDANDO'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${metricsEngagement}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sincronia de Guardiões (Restricted to High Level) */}
          {isHighLevel && (
            <div className="space-y-3">
              <h4 className={cn("text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1")}>Equipe e Cargos</h4>
              <div className="space-y-2">
                {Object.entries(
                  allUsers.reduce((acc, u) => {
                    if (!acc[u.role]) acc[u.role] = [];
                    acc[u.role].push(u);
                    return acc;
                  }, {} as Record<string, typeof allUsers>)
                )
                  .sort((a, b) => {
                    const idxA = Object.values(NazarickRole).indexOf(a[0] as NazarickRole);
                    const idxB = Object.values(NazarickRole).indexOf(b[0] as NazarickRole);
                    return idxA - idxB;
                  })
                  .map(([role, usersInRole]) => (
                    <GuardianStatus key={`guardian-${role}`} roleName={role} users={usersInRole} isDarkMode={isDarkMode} />
                  ))
                }
                {Object.keys(allUsers).length === 0 && (
                  <div className="text-center p-4 border rounded-2xl border-dashed opacity-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Aguardando sincronização de membros...
                  </div>
                )}
              </div>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 border relative overflow-hidden group rounded-3xl transition-all duration-500 shadow-xl",
              isDarkMode 
                ? "bg-[#020617] border-indigo-500/20 shadow-indigo-500/10" 
                : "bg-white border-indigo-100 shadow-indigo-500/5 text-slate-900"
            )}
          >
            {/* Animated Glow */}
            <motion.div 
              animate={{ opacity: isDarkMode ? [0.1, 0.25, 0.1] : [0.03, 0.08, 0.03] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={cn(
                "absolute inset-x-0 top-0 h-px",
                isDarkMode ? themeAccent.bg : themeAccent.bg
              )}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isDarkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                )}>
                   <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className={cn("text-[10px] font-black uppercase tracking-[0.4em] font-mono", isDarkMode ? "text-indigo-400" : "text-indigo-600")}>
                    {isSupreme ? "IA // BENZAITEN_SYS_SUPREME" : "IA // PROTOCOLO_ASSISTENTE"}
                  </h4>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                    {isSupreme ? "Sexto Sentido Ativado" : "Conexão de Apoio"}
                  </p>
                </div>
              </div>
              <p className={cn(
                "text-[13px] leading-relaxed italic font-medium tracking-tight", 
                isDarkMode ? "text-slate-300" : "text-slate-600 font-serif"
              )}>
                {isSupreme 
                  ? `"Ser Supremo, o domínio ${profile.name} está crescendo além das projeções. Recomendo ativação do Arco de Campanhas Supremo para expansão total."`
                  : `"Membro de Nazarick, detectamos oportunidades de otimização no perfil ${profile.name}. Continue subindo sua patente para desbloquear protocolos avançados."`
                }
              </p>
              <div className={cn(
                "mt-8 pt-4 border-t flex justify-between items-center text-[8px] font-black font-mono tracking-[0.2em] uppercase",
                isDarkMode ? "border-white/5 text-slate-500" : "border-slate-100 text-slate-400"
              )}>
                <span className={cn(
                  "flex items-center gap-2 px-2.5 py-1 rounded-full border",
                  isDarkMode 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}><CheckCircle2 className="w-2.5 h-2.5" /> STATUS: ANALISANDO</span>
                <span>SYS_LOG: 2026-05-16</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function LogEntry({ time, type, message, isDarkMode }: { time: string, type: string, message: string, isDarkMode: boolean }) {
  const typeColors: any = {
    SYNC: "text-indigo-500",
    AUTH: "text-purple-500",
    DOMN: "text-emerald-500",
    CREA: "text-amber-500"
  };

  return (
    <div className={cn(
      "flex items-center gap-4 text-[9px] transition-colors group",
      isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
    )}>
       <span className="opacity-50">{time}</span>
       <span className={cn("font-black tracking-widest", typeColors[type] || "text-slate-500")}>[{type}]</span>
       <span className="flex-1 truncate">{message}</span>
       <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-3 bg-indigo-500/50" />
    </div>
  );
}

function GuardianStatus({ roleName, users, isDarkMode }: { roleName: string, users: any[], isDarkMode: boolean }) {
  const isMultiple = users.length > 1;
  const status = isMultiple ? 'Grupo Ativo' : 'Online';
  const load = Math.round(users.reduce((acc, u) => acc + (u.xp || 0), 0) / Math.max(1, users.length));
  
  // Extrair o nome do cargo (antes do —)
  const displayRole = roleName.split('—')[0].trim();
  const titleRole = roleName.split('—')[1]?.trim() || displayRole;

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-500 group/guardian relative overflow-visible",
      isDarkMode ? "bg-slate-900/50 border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/80" : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200"
    )}>
      {/* Anime Interface Scanline */}
      <motion.div 
        animate={{ y: [-100, 100] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[1px] bg-indigo-500/10 z-0 pointer-events-none"
      />
      
      <div className="flex items-center justify-between relative z-10 cursor-help">
        <div className="flex items-center gap-3 relative z-10 w-full">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover/guardian:scale-110 transition-transform relative shrink-0">
            <Shield className="w-5 h-5 text-indigo-500" />
            {/* Count Indicator */}
            {isMultiple && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-[0_0_8px_rgba(79,70,229,0.5)]">
                 <span className="text-[7px] text-white font-black">{users.length}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("text-[11px] font-black uppercase tracking-tight truncate", isDarkMode ? "text-white" : "text-slate-900")}>
              {!isMultiple && users[0] ? users[0].name.replace(/^adm\s+/i, '') : displayRole}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]")} />
              <p className={cn("text-[8px] font-bold uppercase tracking-widest", "text-emerald-500 truncate")}>{isMultiple ? titleRole : displayRole}</p>
            </div>
          </div>
        </div>
        <div className="text-right relative z-10 pl-2">
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Média_XP</p>
          <div className="flex items-baseline justify-end gap-1">
            <p className={cn("text-xs font-black tabular-nums mt-0.5", isDarkMode ? "text-white" : "text-slate-900")}>{load}</p>
            <span className="text-[8px] text-slate-500 font-bold">xp</span>
          </div>
        </div>
      </div>
      
      {/* Users Popover */}
      {isMultiple && (
        <div className="absolute top-[80%] right-0 mt-2 p-3 w-48 opacity-0 invisible group-hover/guardian:opacity-100 group-hover/guardian:visible group-hover/guardian:translate-y-2 transition-all duration-300 z-50 rounded-xl border shadow-xl glass-control pointer-events-none transform translate-y-0"
             style={{ 
               backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
               borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'
             }}>
          <p className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2 border-b border-indigo-500/20 pb-1">Membros Ativos</p>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
            {users.map((u, idx) => (
              <div key={`user-${u.uid || idx}`} className="flex justify-between items-center text-[10px]">
                <span className={cn("font-bold truncate max-w-[90px]", isDarkMode ? "text-white/90" : "text-slate-800")}>{u.name.replace(/^adm\s+/i, '')}</span>
                <span className="text-slate-500 tabular-nums">Lv {u.level || 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DomainCard({ label, status, health, isDarkMode }: { label: string, status: string, health: number, isDarkMode: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-300 group/domain",
      isDarkMode ? "bg-black/20 border-white/5 hover:bg-black/40 hover:border-indigo-500/30" : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md hover:border-indigo-600/20"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover/domain:scale-110 transition-transform">
          <Target className="w-3.5 h-3.5" />
        </div>
        <span className={cn(
          "text-[8px] font-black px-2 py-0.5 rounded-md border",
          health === 0 
            ? "bg-slate-500/10 text-slate-400 border-slate-500/20" 
            : health > 95 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        )}>
          {health > 0 ? `${health}%` : 'S/D'}
        </span>
      </div>
      <p className={cn("text-[10px] font-black uppercase tracking-tight truncate", isDarkMode ? "text-white" : "text-slate-900")}>{label}</p>
      <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 tracking-widest">{health === 0 ? "AGUARDANDO" : status}</p>
      <div className={cn("h-1 w-full rounded-full mt-3 overflow-hidden", isDarkMode ? "bg-slate-800" : "bg-slate-200")}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${health}%` }}
          className={cn("h-full transition-all duration-1000", health > 95 ? "bg-emerald-500" : "bg-amber-500")}
        />
      </div>
    </div>
  );
}

function getNextRank(rank: string) {
  const ranks = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
  const idx = ranks.indexOf(rank);
  return ranks[idx + 1] || 'MAX';
}

function QuickAction({ label, sub, icon: Icon, color, onClick, isDarkMode }: { label: string, sub: string, icon: any, color?: string, onClick?: () => void, isDarkMode?: boolean }) {
  const colorMap: any = {
    indigo: isDarkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100",
    purple: isDarkMode ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-600 border-purple-100",
    amber: isDarkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100",
    emerald: isDarkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  return (
    <motion.button 
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 border rounded-2xl transition-all duration-200 flex items-center justify-between group overflow-hidden relative",
        isDarkMode 
          ? "bg-slate-900 border-white/5 hover:border-slate-700 hover:shadow-black/40" 
          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300", color && colorMap[color] ? colorMap[color] : (isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-50 text-slate-400"))}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className={cn("text-[11px] font-black uppercase tracking-tight transition-colors leading-none", isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-900 group-hover:text-slate-800")}>{label}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{sub}</p>
        </div>
      </div>
      <div className={cn(
        "p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-10", 
        isDarkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
      )}>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>
    </motion.button>
  );
}
