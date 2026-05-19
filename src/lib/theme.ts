export const getLayoutTheme = (fragment: string, isDark: boolean) => {
  const base = {
    bgMain: isDark ? "ygn-bg-dark" : "ygn-bg-light",
    bgSidebar: isDark ? "ygn-sidebar-dark" : "ygn-sidebar-light",
    textPrimary: isDark ? "text-slate-50" : "text-slate-900",
    glassInfo: isDark ? "glass-panel" : "glass-panel-light",
  };

  switch (fragment) {
    case 'MATHEUS':
      return {
        ...base,
        border: isDark ? "border-amber-200/18" : "border-amber-200/45",
        textSecondary: isDark ? "text-amber-200/78" : "text-amber-800/72",
        accentBg: isDark ? "bg-amber-400/70" : "bg-amber-500/72",
        accentText: isDark ? "text-amber-200" : "text-amber-700",
        accentTextHover: isDark ? "hover:text-amber-200" : "hover:text-amber-700",
        accentTextGroupHover: isDark ? "group-hover:text-amber-200" : "group-hover:text-amber-700",
        hoverBg: isDark ? "hover:bg-amber-200/10" : "hover:bg-amber-100/44",
        shadowLg: isDark ? "shadow-[0_12px_34px_rgba(180,130,38,0.16)]" : "shadow-[0_12px_30px_rgba(180,130,38,0.13)]",
        shadowGlow: isDark ? "shadow-[0_0_18px_rgba(244,211,141,0.16)]" : "shadow-[0_0_16px_rgba(217,119,6,0.14)]",
        gradientStart: isDark ? "from-amber-200/80" : "from-amber-300/80",
        gradientVia: isDark ? "via-yellow-300/58" : "via-orange-300/58",
        gradientEnd: isDark ? "to-emerald-200/48" : "to-emerald-300/48",
        borderHoverBase: isDark ? "hover:border-amber-200/32" : "hover:border-amber-300/55",
        bgDim: isDark ? "bg-amber-200/10" : "bg-amber-100/52",
        bgDimHover: isDark ? "hover:bg-amber-200/12" : "hover:bg-amber-100/62",
      };
    case 'KOTARO':
      return {
        ...base,
        border: isDark ? "border-sky-200/18" : "border-sky-200/44",
        textSecondary: isDark ? "text-sky-200/78" : "text-sky-800/70",
        accentBg: isDark ? "bg-sky-400/64" : "bg-sky-500/68",
        accentText: isDark ? "text-sky-200" : "text-sky-700",
        accentTextHover: isDark ? "hover:text-sky-200" : "hover:text-sky-700",
        accentTextGroupHover: isDark ? "group-hover:text-sky-200" : "group-hover:text-sky-700",
        hoverBg: isDark ? "hover:bg-sky-200/10" : "hover:bg-sky-100/44",
        shadowLg: isDark ? "shadow-[0_12px_34px_rgba(56,139,186,0.16)]" : "shadow-[0_12px_30px_rgba(56,139,186,0.13)]",
        shadowGlow: isDark ? "shadow-[0_0_18px_rgba(186,230,253,0.15)]" : "shadow-[0_0_16px_rgba(14,165,233,0.14)]",
        gradientStart: isDark ? "from-sky-200/76" : "from-sky-300/74",
        gradientVia: isDark ? "via-cyan-300/50" : "via-cyan-300/48",
        gradientEnd: isDark ? "to-violet-200/42" : "to-violet-300/42",
        borderHoverBase: isDark ? "hover:border-sky-200/32" : "hover:border-sky-300/55",
        bgDim: isDark ? "bg-sky-200/10" : "bg-sky-100/52",
        bgDimHover: isDark ? "hover:bg-sky-200/12" : "hover:bg-sky-100/62",
      };
    case 'MOMONGA':
    default:
      return {
        ...base,
        border: isDark ? "border-yellow-200/18" : "border-amber-200/48",
        textSecondary: isDark ? "text-yellow-200/78" : "text-amber-800/72",
        accentBg: isDark ? "bg-yellow-400/68" : "bg-amber-500/70",
        accentText: isDark ? "text-yellow-200" : "text-amber-700",
        accentTextHover: isDark ? "hover:text-yellow-200" : "hover:text-amber-700",
        accentTextGroupHover: isDark ? "group-hover:text-yellow-200" : "group-hover:text-amber-700",
        hoverBg: isDark ? "hover:bg-yellow-200/10" : "hover:bg-amber-100/44",
        shadowLg: isDark ? "shadow-[0_12px_36px_rgba(190,151,48,0.15)]" : "shadow-[0_12px_32px_rgba(217,119,6,0.12)]",
        shadowGlow: isDark ? "shadow-[0_0_18px_rgba(254,240,138,0.14)]" : "shadow-[0_0_16px_rgba(217,119,6,0.13)]",
        gradientStart: isDark ? "from-yellow-200/78" : "from-amber-300/78",
        gradientVia: isDark ? "via-amber-300/54" : "via-yellow-300/54",
        gradientEnd: isDark ? "to-slate-200/38" : "to-slate-300/38",
        borderHoverBase: isDark ? "hover:border-yellow-200/32" : "hover:border-amber-300/55",
        bgDim: isDark ? "bg-yellow-200/10" : "bg-amber-100/52",
        bgDimHover: isDark ? "hover:bg-yellow-200/12" : "hover:bg-amber-100/62",
      };
  }
};
