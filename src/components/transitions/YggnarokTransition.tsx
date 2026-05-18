import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export type YggnarokMode = 'matheus' | 'kotaro' | 'momonga' | 'simulation' | 'role' | 'default';
export type YggnarokContext = 'system' | 'fragment' | 'simulation' | 'role';

interface YggnarokTransitionProps {
  active: boolean;
  mode?: YggnarokMode;
  roleName?: string;
  context?: YggnarokContext;
  runId?: number;
  onMidpoint?: () => void;
  onComplete?: () => void;
}

export const YGGNAROK_TOTAL_DURATION = 2850;
export const YGGNAROK_MIDPOINT = 1280;

type TransitionTheme = {
  accent: string;
  secondary: string;
  glow: string;
  text: string;
  ring: string;
  sigil: string;
  title: string;
  tagline: string;
};

const modeTheme: Record<YggnarokMode, TransitionTheme> = {
  default: {
    accent: '#d6a84f',
    secondary: '#9cc5d8',
    glow: 'rgba(214,168,79,0.20)',
    text: 'from-white via-amber-100 to-amber-500',
    ring: 'border-amber-300/40',
    sigil: 'YGN',
    title: 'YGGNAROK',
    tagline: 'Sistema lendario entre mundos'
  },
  matheus: {
    accent: '#d99b2b',
    secondary: '#4f8a67',
    glow: 'rgba(217,155,43,0.24)',
    text: 'from-white via-amber-100 to-emerald-500',
    ring: 'border-amber-300/50',
    sigil: 'YGN',
    title: 'YGGNAROK',
    tagline: 'Estrategia e monetizacao em sincronia'
  },
  kotaro: {
    accent: '#8d7cff',
    secondary: '#58c7f3',
    glow: 'rgba(141,124,255,0.24)',
    text: 'from-white via-blue-100 to-violet-500',
    ring: 'border-blue-300/50',
    sigil: 'YGN',
    title: 'YGGNAROK',
    tagline: 'Criacao entre midia e fantasia'
  },
  momonga: {
    accent: '#d6a84f',
    secondary: '#111827',
    glow: 'rgba(214,168,79,0.16)',
    text: 'from-white via-amber-100 to-yellow-600',
    ring: 'border-yellow-300/50',
    sigil: 'AOG',
    title: 'MOMONGA',
    tagline: 'Autoridade suprema selada em Yggnarok'
  },
  simulation: {
    accent: '#7c3aed',
    secondary: '#0ea5e9',
    glow: 'rgba(124,58,237,0.18)',
    text: 'from-white via-violet-100 to-sky-500',
    ring: 'border-violet-300/45',
    sigil: 'SIM',
    title: 'SIMULACAO',
    tagline: 'Ambiente seguro de destino simulado'
  },
  role: {
    accent: '#d6a84f',
    secondary: '#64748b',
    glow: 'rgba(214,168,79,0.18)',
    text: 'from-white via-amber-100 to-slate-500',
    ring: 'border-amber-300/35',
    sigil: 'YGN',
    title: 'YGGNAROK',
    tagline: 'Cargo sincronizado ao sistema lendario'
  }
};

const roleThemeRegistry: Array<{ keys: string[]; theme: Partial<TransitionTheme> }> = [
  {
    keys: ['momonga', 'criador supremo'],
    theme: {
      accent: '#d6a84f',
      secondary: '#111827',
      glow: 'rgba(214,168,79,0.16)',
      text: 'from-white via-amber-100 to-yellow-600',
      ring: 'border-yellow-300/50',
      sigil: 'AOG',
      title: 'MOMONGA',
      tagline: 'Autoridade suprema selada em Yggnarok'
    }
  },
  {
    keys: ['pleiades', 'pleides', 'esquadrao de batalha'],
    theme: {
      accent: '#4f8dff',
      secondary: '#38bdf8',
      glow: 'rgba(79,141,255,0.18)',
      text: 'from-white via-sky-100 to-blue-500',
      ring: 'border-sky-300/50',
      sigil: 'PLD',
      title: 'PLEIADES',
      tagline: 'Esquadrao de batalha sob Yggnarok'
    }
  },
  {
    keys: ['pestonya', 'empregada chefe'],
    theme: {
      accent: '#d98c9f',
      secondary: '#4f8a67',
      glow: 'rgba(217,140,159,0.18)',
      text: 'from-white via-rose-100 to-emerald-500',
      ring: 'border-rose-300/45',
      sigil: 'PES',
      title: 'PESTONYA',
      tagline: 'Cuidado real harmonizado a Yggnarok'
    }
  },
  {
    keys: ['albedo', 'supervisora'],
    theme: {
      accent: '#f2c56b',
      secondary: '#c026d3',
      glow: 'rgba(242,197,107,0.19)',
      text: 'from-white via-yellow-100 to-fuchsia-500',
      ring: 'border-yellow-300/45',
      sigil: 'ALB',
      title: 'ALBEDO',
      tagline: 'Supervisao guardia em selo imperial'
    }
  },
  {
    keys: ['demiurge', 'guardiao do 7'],
    theme: {
      accent: '#ef9b3a',
      secondary: '#16a34a',
      glow: 'rgba(239,155,58,0.18)',
      text: 'from-white via-orange-100 to-emerald-500',
      ring: 'border-orange-300/45',
      sigil: 'DEM',
      title: 'DEMIURGE',
      tagline: 'Estrategia infernal sob ordem clara'
    }
  }
];

const fallbackRolePalettes: Array<Pick<TransitionTheme, 'accent' | 'secondary' | 'glow' | 'text' | 'ring'>> = [
  { accent: '#d6a84f', secondary: '#64748b', glow: 'rgba(214,168,79,0.17)', text: 'from-white via-amber-100 to-slate-500', ring: 'border-amber-300/35' },
  { accent: '#5ea3ff', secondary: '#22c55e', glow: 'rgba(94,163,255,0.16)', text: 'from-white via-blue-100 to-emerald-500', ring: 'border-blue-300/35' },
  { accent: '#c084fc', secondary: '#38bdf8', glow: 'rgba(192,132,252,0.16)', text: 'from-white via-violet-100 to-cyan-500', ring: 'border-violet-300/35' },
  { accent: '#fb7185', secondary: '#facc15', glow: 'rgba(251,113,133,0.15)', text: 'from-white via-rose-100 to-yellow-500', ring: 'border-rose-300/35' }
];

function normalizeRoleName(roleName = '') {
  return roleName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getRoleDisplayName(roleName = '') {
  return roleName.replace(/\s+[-\u2014].*$/, '').trim() || 'Cargo Nazarick';
}

function createRoleSigil(roleName = '') {
  const words = normalizeRoleName(getRoleDisplayName(roleName)).split(' ').filter(Boolean);
  const initials = words.length > 1 ? words.map((word) => word[0]).join('') : (words[0] || 'ygn');
  return initials.slice(0, 3).toUpperCase().padEnd(3, 'N');
}

function createFallbackRoleTheme(roleName = ''): TransitionTheme {
  const score = normalizeRoleName(roleName).split('').reduce((total, char) => total + char.charCodeAt(0), 0);
  const palette = fallbackRolePalettes[score % fallbackRolePalettes.length];
  const displayName = getRoleDisplayName(roleName);

  return {
    ...modeTheme.role,
    ...palette,
    sigil: createRoleSigil(roleName),
    title: displayName.toUpperCase(),
    tagline: 'Cargo futuro conectado ao selo Yggnarok'
  };
}

function resolveTransitionTheme(mode: YggnarokMode, roleName?: string, context?: YggnarokContext): TransitionTheme {
  if ((context === 'role' || mode === 'role') && roleName) {
    const normalizedRole = normalizeRoleName(roleName);
    const registeredRole = roleThemeRegistry.find(({ keys }) => keys.some((key) => normalizedRole.includes(key)));

    if (registeredRole) {
      return { ...modeTheme.role, ...registeredRole.theme };
    }

    return createFallbackRoleTheme(roleName);
  }

  return modeTheme[mode] || modeTheme.default;
}

const runeGlyphs = ['\u16A8', '\u16B1', '\u16B2', '\u16DF', '\u16C9', '\u16DE', '\u16D7', '\u16DC'];

const strips = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  left: 10 + ((index * 23) % 80),
  top: 36 + ((index * 17) % 28),
  height: 26 + ((index * 19) % 92),
  delay: (index % 9) * 0.035,
  drift: ((index % 2 === 0 ? 1 : -1) * (8 + (index % 7) * 3))
}));

function YggdrasilSigil({ theme, reducedMotion }: { theme: TransitionTheme; reducedMotion: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 720 720"
      aria-hidden="true"
      className="absolute inset-0 m-auto h-[92vmin] w-[92vmin] max-h-[760px] max-w-[760px]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="yggnarok-root-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.34" />
          <stop offset="58%" stopColor={theme.secondary} stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="yggnarok-canopy" cx="50%" cy="34%" r="58%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
          <stop offset="42%" stopColor={theme.accent} stopOpacity="0.24" />
          <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.06" />
        </radialGradient>
        <linearGradient id="yggnarok-trunk" x1="360" y1="96" x2="360" y2="635" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="34%" stopColor={theme.accent} stopOpacity="0.62" />
          <stop offset="72%" stopColor={theme.accent} stopOpacity="0.38" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id="yggnarok-roots" x1="80" y1="638" x2="640" y2="638" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={theme.secondary} stopOpacity="0.18" />
          <stop offset="50%" stopColor={theme.accent} stopOpacity="0.52" />
          <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.18" />
        </linearGradient>
      </defs>

      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 0.95, ease: 'easeOut' }}
      >
        <motion.path
          d="M360 76 C292 84 246 122 228 176 C170 188 118 226 98 288 C151 260 212 262 266 294 C283 244 318 200 360 171 C402 200 437 244 454 294 C508 262 569 260 622 288 C602 226 550 188 492 176 C474 122 428 84 360 76 Z"
          fill="url(#yggnarok-canopy)"
          stroke={theme.accent}
          strokeWidth="1.4"
          opacity="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.72 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.32, ease: 'easeInOut' }}
        />
        <motion.path
          d="M350 604 C338 520 342 444 354 360 C366 278 357 198 344 116 C354 104 366 104 376 116 C363 198 354 278 366 360 C378 444 382 520 370 604 C365 620 355 620 350 604 Z"
          fill="url(#yggnarok-trunk)"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.82"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.82 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.36, delay: 0.08, ease: 'easeInOut' }}
        />
        <motion.path
          d="M350 582 C320 604 280 624 226 637 C175 650 122 644 70 620 C136 612 184 598 232 565 C270 540 315 522 350 528 Z M370 582 C400 604 440 624 494 637 C545 650 598 644 650 620 C584 612 536 598 488 565 C450 540 405 522 370 528 Z"
          fill="url(#yggnarok-roots)"
          stroke={theme.accent}
          strokeWidth="1.2"
          opacity="0.76"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.76 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.24, delay: 0.18, ease: 'easeInOut' }}
        />
      </motion.g>

      <motion.g
        fill="none"
        stroke={theme.accent}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: reducedMotion ? 0.2 : 1.55, ease: 'easeInOut' }}
      >
        <path strokeWidth="4.5" d="M360 590 C352 512 354 442 360 354 C367 268 363 190 360 112" />
        <path strokeWidth="3" d="M360 520 C321 486 284 450 238 438 C194 426 154 444 108 464" />
        <path strokeWidth="3" d="M360 520 C399 486 436 450 482 438 C526 426 566 444 612 464" />
        <path strokeWidth="3" d="M360 580 C318 612 270 632 214 640 C166 646 122 628 76 610" />
        <path strokeWidth="3" d="M360 580 C402 612 450 632 506 640 C554 646 598 628 644 610" />
        <path strokeWidth="3" d="M358 420 C304 358 250 334 188 326 C138 320 98 292 64 252" />
        <path strokeWidth="3" d="M362 420 C416 358 470 334 532 326 C582 320 622 292 656 252" />
        <path strokeWidth="3" d="M360 296 C308 250 260 222 202 212 C154 204 112 174 80 134" />
        <path strokeWidth="3" d="M360 296 C412 250 460 222 518 212 C566 204 608 174 640 134" />
        <path strokeWidth="1.5" opacity="0.8" d="M360 238 C334 194 306 156 268 124 C238 100 224 70 218 42" />
        <path strokeWidth="1.5" opacity="0.8" d="M360 238 C386 194 414 156 452 124 C482 100 496 70 502 42" />
      </motion.g>

      {[218, 292, 360, 428, 502].map((cx, index) => (
        <motion.circle
          key={`ygg-node-${cx}`}
          cx={cx}
          cy={index % 2 === 0 ? 205 : 286}
          r={index === 2 ? 5 : 3.5}
          fill="#ffffff"
          stroke={theme.accent}
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{
            opacity: reducedMotion ? 0.55 : [0.35, 0.95, 0.45],
            scale: reducedMotion ? 1 : [0.8, 1.25, 0.95]
          }}
          transition={{ duration: 1.6, delay: 0.35 + index * 0.08, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
        />
      ))}

      <motion.g
        fill="none"
        stroke={theme.secondary}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.42"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 1.55, delay: 0.15, ease: 'easeInOut' }}
      >
        <path d="M360 546 C340 500 332 450 344 390" />
        <path d="M360 546 C380 500 388 450 376 390" />
        <path d="M360 180 C344 226 344 278 360 336" />
        <path d="M360 180 C376 226 376 278 360 336" />
      </motion.g>
    </motion.svg>
  );
}

function MagicCircles({ theme, reducedMotion }: { theme: TransitionTheme; reducedMotion: boolean }) {
  const rotate = reducedMotion ? 0 : 360;

  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <motion.div
        className={cn('absolute h-[62vmin] w-[62vmin] max-h-[560px] max-w-[560px] rounded-full border border-dashed', theme.ring)}
        animate={{ rotate }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute h-[48vmin] w-[48vmin] max-h-[430px] max-w-[430px] rounded-full border border-amber-200/60"
        animate={{ rotate: -rotate }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute h-[36vmin] w-[36vmin] max-h-[320px] max-w-[320px] rounded-full border border-white/70"
        animate={{ scale: reducedMotion ? 1 : [0.98, 1.02, 0.98] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {runeGlyphs.map((rune, index) => {
        const angle = (index / runeGlyphs.length) * 360;
        return (
          <motion.span
            key={rune}
            className="absolute text-[13px] font-black text-amber-600/45"
            style={{
              transform: `rotate(${angle}deg) translateY(-31vmin) rotate(${-angle}deg)`,
              textShadow: `0 0 18px ${theme.accent}`
            }}
            animate={{ opacity: reducedMotion ? 0.36 : [0.22, 0.66, 0.22] }}
            transition={{ duration: 1.8, delay: index * 0.08, repeat: Infinity }}
          >
            {rune}
          </motion.span>
        );
      })}

      {Array.from({ length: 18 }, (_, index) => (
        <motion.div
          key={`mark-${index}`}
          className="absolute h-8 w-px rounded-full bg-amber-500/35"
          style={{ transform: `rotate(${index * 20}deg) translateY(-25vmin)` }}
          animate={{ opacity: reducedMotion ? 0.28 : [0.16, 0.55, 0.16] }}
          transition={{ duration: 1.6, delay: index * 0.045, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function LightStrips({ theme, reducedMotion }: { theme: TransitionTheme; reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {strips.map((strip) => (
        <motion.div
          key={strip.id}
          className="absolute w-px rounded-full"
          style={{
            left: `${strip.left}%`,
            top: `${strip.top}%`,
            height: strip.height,
            background: `linear-gradient(180deg, transparent, ${theme.accent}, #ffffff, transparent)`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.18)`
          }}
          initial={{ opacity: 0, scaleY: 0.2, y: 22 }}
          animate={reducedMotion ? { opacity: [0, 0.25, 0], scaleY: 1 } : {
            opacity: [0, 0.75, 0.18, 0],
            scaleY: [0.3, 1.35, 0.72, 0],
            y: [24, -10, strip.drift, -26]
          }}
          transition={{ duration: reducedMotion ? 0.7 : 1.62, delay: 0.48 + strip.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function YggnarokTransition({
  active,
  mode = 'default',
  roleName,
  context = 'system',
  runId = 0,
  onMidpoint,
  onComplete
}: YggnarokTransitionProps) {
  const reducedMotion = useReducedMotion();
  const theme = resolveTransitionTheme(mode, roleName, context);
  const midpointRef = React.useRef(onMidpoint);
  const completeRef = React.useRef(onComplete);

  React.useEffect(() => {
    midpointRef.current = onMidpoint;
    completeRef.current = onComplete;
  }, [onMidpoint, onComplete]);

  React.useEffect(() => {
    if (!active) return;

    if (reducedMotion) {
      const mid = window.setTimeout(() => midpointRef.current?.(), 180);
      const done = window.setTimeout(() => completeRef.current?.(), 620);
      return () => {
        window.clearTimeout(mid);
        window.clearTimeout(done);
      };
    }

    const mid = window.setTimeout(() => midpointRef.current?.(), YGGNAROK_MIDPOINT);
    const done = window.setTimeout(() => completeRef.current?.(), YGGNAROK_TOTAL_DURATION);

    return () => {
      window.clearTimeout(mid);
      window.clearTimeout(done);
    };
  }, [active, reducedMotion, runId]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={runId}
          aria-hidden="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white/86 text-slate-950 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={reducedMotion ? { opacity: [0, 1, 0] } : { opacity: [0, 1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.62 : YGGNAROK_TOTAL_DURATION / 1000, times: reducedMotion ? [0, 0.22, 1] : [0, 0.1, 0.88, 1], ease: 'easeOut' }}
          onAnimationComplete={() => completeRef.current?.()}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 46%, rgba(255,255,255,0.96), rgba(255,255,255,0.68) 38%, rgba(248,250,252,0.82) 68%),
                radial-gradient(circle at 50% 70%, ${theme.glow}, transparent 42%),
                linear-gradient(135deg, rgba(255,255,255,0.88), rgba(245,245,240,0.68))
              `
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(214,168,79,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(214,168,79,0.08)_1px,transparent_1px)] bg-[size:52px_52px] opacity-40" />
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, #ffffff, ${theme.secondary}, transparent)` }}
            animate={{ opacity: reducedMotion ? 0.28 : [0.08, 0.42, 0.16], scaleX: reducedMotion ? 1 : [0.72, 1, 0.82] }}
            transition={{ duration: 2.35, ease: 'easeInOut' }}
          />

          <YggdrasilSigil theme={theme} reducedMotion={!!reducedMotion} />
          <MagicCircles theme={theme} reducedMotion={!!reducedMotion} />
          <LightStrips theme={theme} reducedMotion={!!reducedMotion} />

          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={reducedMotion ? { opacity: 1, y: 0, scale: 1 } : {
              opacity: [0, 1, 1, 0.86, 1],
              y: [16, 0, 0, -2, 0],
              scale: [0.92, 1, 1.02, 0.985, 1]
            }}
            transition={{ duration: reducedMotion ? 0.2 : 2.38, times: [0, 0.2, 0.58, 0.78, 1], ease: 'easeOut' }}
          >
            <div className="relative px-8 py-6">
              <motion.div
                className="absolute inset-0 rounded-2xl border border-white/65 bg-white/18 shadow-[0_18px_42px_rgba(15,23,42,0.10)]"
                animate={{ opacity: reducedMotion ? 0.62 : [0.22, 0.58, 0.34] }}
                transition={{ duration: 2.18, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className={cn(
                  'relative block bg-gradient-to-br bg-clip-text text-6xl font-black tracking-[0.18em] text-transparent sm:text-7xl md:text-8xl',
                  theme.text
                )}
                style={{
                  textShadow: `0 1px 0 rgba(255,255,255,0.72), 0 12px 20px rgba(15,23,42,0.14)`
                }}
                animate={reducedMotion ? { opacity: 1 } : {
                  opacity: [0, 1, 1, 0.46, 1],
                  letterSpacing: ['0.38em', '0.18em', '0.18em', '0.32em', '0.18em']
                }}
                transition={{ duration: 2.32, times: [0, 0.22, 0.58, 0.76, 1], ease: 'easeOut' }}
              >
                {theme.sigil}
              </motion.span>
            </div>

            <motion.div
              className="mt-5 text-[10px] font-black uppercase tracking-[0.8em] text-amber-700/70 sm:text-xs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
              transition={{ duration: reducedMotion ? 0.45 : 2.58, times: [0, 0.2, 0.82, 1] }}
            >
              {theme.title}
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-12 flex justify-center text-[9px] font-black uppercase tracking-[0.55em] text-slate-500/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.78, 0] }}
            transition={{ duration: reducedMotion ? 0.6 : 2.58, delay: 0.18 }}
          >
            {theme.tagline}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
