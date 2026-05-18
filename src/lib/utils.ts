import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const getRankTheme = (rawRank: string, isDarkMode: boolean) => {
  const rank = rawRank.replace(/[+-]/g, '');
  const themes: Record<string, any> = {
    'F': {
      bg: isDarkMode ? "from-slate-900 to-indigo-950" : "from-indigo-50 to-white",
      accent: "bg-indigo-500",
      pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/cracked-earth.png')]",
      glow: isDarkMode ? "bg-indigo-500/20" : "bg-indigo-300/10",
      label: "F - DESPERTAR"
    },
    'E': {
      bg: isDarkMode ? "from-orange-950 via-slate-900 to-slate-950" : "from-orange-50 via-white to-slate-50",
      accent: "bg-orange-600",
      pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]",
      glow: isDarkMode ? "bg-orange-600/18" : "bg-orange-300/10",
      label: "E - GENIN"
    },
    'D': {
      bg: isDarkMode ? "from-yellow-900 via-red-950 to-slate-950" : "from-yellow-50 via-red-50 to-white",
      accent: "bg-yellow-500",
      pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/waves.png')]",
      glow: isDarkMode ? "bg-yellow-500/20" : "bg-yellow-200/10",
      label: "D - PIRATA"
    },
    'C': {
      bg: isDarkMode ? "from-zinc-900 via-red-950 to-black" : "from-slate-100 via-red-50 to-white",
      accent: "bg-red-700",
      pattern: "opacity-[0.12] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]",
      glow: isDarkMode ? "bg-red-700/18" : "bg-red-300/5",
      label: "C - ANTIBREU"
    },
    'B': {
      bg: isDarkMode ? "from-green-950 via-slate-900 to-slate-950" : "from-green-50 via-slate-50 to-white",
      accent: "bg-green-500",
      pattern: "opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",
      glow: isDarkMode ? "bg-green-500/16" : "bg-green-300/5",
      label: "B - HUNTER"
    },
    'A': {
      bg: isDarkMode ? "from-red-950 via-purple-950 to-black" : "from-red-50 via-purple-50 to-white",
      accent: "bg-red-600",
      pattern: "opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]",
      glow: isDarkMode ? "bg-red-600/18" : "bg-red-200/5",
      label: "A - DOMÍNIO"
    },
    'S': {
      bg: isDarkMode ? "from-black via-zinc-900 to-white/5" : "from-slate-100 via-slate-50 to-white",
      accent: "bg-slate-800",
      pattern: "opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]",
      glow: isDarkMode ? "bg-white/12" : "bg-slate-200/10",
      label: "S - BANKAI"
    },
    'SS': {
      bg: isDarkMode ? "from-blue-950 via-slate-950 to-black" : "from-blue-50 via-slate-100 to-white",
      accent: "bg-blue-500",
      pattern: "opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]",
      glow: isDarkMode ? "bg-blue-500/18" : "bg-blue-300/10",
      label: "SS - MONARCA"
    },
    'SSS': {
      bg: isDarkMode ? "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-950 via-purple-950 to-indigo-900" : "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-purple-50 to-indigo-100",
      accent: "bg-indigo-500",
      pattern: "opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')] mix-blend-overlay",
      glow: isDarkMode ? "bg-indigo-400/18" : "bg-indigo-200/20",
      label: "SSS - SUPREMO"
    }
  };
  return themes[rank] || themes['F'];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
