export const getLayoutTheme = (_fragment: string, isDark: boolean) => {
  const base = {
    bgMain: isDark ? "ygn-bg-dark" : "ygn-bg-light",
    bgSidebar: isDark ? "ygn-sidebar-dark" : "ygn-sidebar-light",
    textPrimary: isDark ? "text-slate-50" : "text-slate-900",
    textSecondary: isDark ? "text-slate-300/78" : "text-slate-600",
    glassInfo: isDark ? "glass-panel" : "glass-panel-light",
    border: isDark ? "border-white/10" : "border-white/65",
    accentBg: isDark ? "bg-slate-100/18" : "bg-slate-900/82",
    accentText: isDark ? "text-slate-100" : "text-slate-800",
    accentTextHover: isDark ? "hover:text-white" : "hover:text-slate-950",
    accentTextGroupHover: isDark ? "group-hover:text-white" : "group-hover:text-slate-950",
    hoverBg: isDark ? "hover:bg-white/8" : "hover:bg-white/58",
    shadowLg: isDark ? "shadow-[0_14px_34px_rgba(0,0,0,0.22)]" : "shadow-[0_14px_34px_rgba(15,23,42,0.10)]",
    shadowGlow: isDark ? "shadow-[0_0_18px_rgba(255,255,255,0.08)]" : "shadow-[0_0_18px_rgba(15,23,42,0.08)]",
    gradientStart: isDark ? "from-white/26" : "from-slate-900/86",
    gradientVia: isDark ? "via-slate-200/18" : "via-slate-700/76",
    gradientEnd: isDark ? "to-white/10" : "to-slate-500/68",
    borderHoverBase: isDark ? "hover:border-white/18" : "hover:border-white/80",
    bgDim: isDark ? "bg-white/8" : "bg-white/52",
    bgDimHover: isDark ? "hover:bg-white/12" : "hover:bg-white/68",
  };

  return base;
};
