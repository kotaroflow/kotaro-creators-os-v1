export const getLayoutTheme = (fragment: string, isDark: boolean) => {
  switch (fragment) {
    case 'MATHEUS':
      return {
        bgMain: isDark ? "bg-[#090806]" : "bg-slate-50",
        bgSidebar: isDark ? "bg-[#0d0a08]" : "bg-white",
        border: isDark ? "border-[#C9A227]/20" : "border-slate-200",
        textPrimary: isDark ? "text-[#FFF8E1]" : "text-slate-900",
        textSecondary: isDark ? "text-[#C9A227]" : "text-slate-500",
        accentBg: isDark ? "bg-[#C9A227]" : "bg-amber-600",
        accentText: isDark ? "text-[#C9A227]" : "text-amber-600",
        accentTextHover: isDark ? "hover:text-[#C9A227]" : "hover:text-amber-600",
        accentTextGroupHover: isDark ? "group-hover:text-[#C9A227]" : "group-hover:text-amber-600",
        hoverBg: isDark ? "hover:bg-[#C9A227]/10" : "hover:bg-amber-50/80",
        glassInfo: isDark ? "glass-panel bg-[#0d0a08]/72" : "glass-panel-light bg-white/72",
        shadowLg: isDark ? "shadow-[0_5px_15px_rgba(201,162,39,0.3)]" : "shadow-[0_5px_15px_rgba(217,119,6,0.3)]",
        shadowGlow: isDark ? "shadow-[0_0_10px_rgba(201,162,39,0.3)]" : "shadow-[0_0_10px_rgba(217,119,6,0.5)]",
        gradientStart: isDark ? "from-amber-600" : "from-amber-500",
        gradientVia: isDark ? "via-amber-800" : "via-orange-500",
        gradientEnd: isDark ? "to-[#C9A227]" : "to-amber-700",
        borderHoverBase: isDark ? "hover:border-amber-500/30" : "hover:border-amber-600/20",
        bgDim: isDark ? "bg-amber-500/10" : "bg-amber-500/5",
        bgDimHover: isDark ? "hover:bg-amber-500/10" : "hover:bg-amber-500/5",
      };
    case 'KOTARO':
      return {
        bgMain: isDark ? "bg-[#080B1F]" : "bg-slate-50",
        bgSidebar: isDark ? "bg-[#0a0d26]" : "bg-white",
        border: isDark ? "border-[#2563EB]/20" : "border-slate-200",
        textPrimary: isDark ? "text-[#EEF4FF]" : "text-slate-900",
        textSecondary: isDark ? "text-[#A78BFA]" : "text-slate-500",
        accentBg: isDark ? "bg-[#2563EB]" : "bg-blue-600",
        accentText: isDark ? "text-[#3B82F6]" : "text-blue-600",
        accentTextHover: isDark ? "hover:text-[#3B82F6]" : "hover:text-blue-600",
        accentTextGroupHover: isDark ? "group-hover:text-[#3B82F6]" : "group-hover:text-blue-600",
        hoverBg: isDark ? "hover:bg-[#2563EB]/10" : "hover:bg-blue-50/80",
        glassInfo: isDark ? "glass-panel bg-[#0a0d26]/72" : "glass-panel-light bg-white/72",
        shadowLg: isDark ? "shadow-[0_5px_15px_rgba(37,99,235,0.3)]" : "shadow-[0_5px_15px_rgba(37,99,235,0.3)]",
        shadowGlow: isDark ? "shadow-[0_0_10px_rgba(37,99,235,0.3)]" : "shadow-[0_0_10px_rgba(37,99,235,0.5)]",
        gradientStart: isDark ? "from-blue-600" : "from-blue-500",
        gradientVia: isDark ? "via-blue-800" : "via-indigo-500",
        gradientEnd: isDark ? "to-[#2563EB]" : "to-blue-700",
        borderHoverBase: isDark ? "hover:border-blue-500/30" : "hover:border-blue-600/20",
        bgDim: isDark ? "bg-blue-500/10" : "bg-blue-500/5",
        bgDimHover: isDark ? "hover:bg-blue-500/10" : "hover:bg-blue-500/5",
      };
    case 'MOMONGA':
    default:
      return {
        bgMain: isDark ? "bg-[#05040A]" : "bg-slate-50",
        bgSidebar: isDark ? "bg-[#080612]" : "bg-white",
        border: isDark ? "border-[#D4AF37]/20" : "border-amber-200/70",
        textPrimary: isDark ? "text-[#FFF8E1]" : "text-slate-900",
        textSecondary: isDark ? "text-[#D4AF37]" : "text-amber-700",
        accentBg: isDark ? "bg-[#D4AF37]" : "bg-amber-600",
        accentText: isDark ? "text-[#D4AF37]" : "text-amber-700",
        accentTextHover: isDark ? "hover:text-[#D4AF37]" : "hover:text-amber-700",
        accentTextGroupHover: isDark ? "group-hover:text-[#D4AF37]" : "group-hover:text-amber-700",
        hoverBg: isDark ? "hover:bg-[#D4AF37]/10" : "hover:bg-amber-50/80",
        glassInfo: isDark ? "glass-panel bg-[#080612]/72" : "glass-panel-light bg-white/72",
        shadowLg: isDark ? "shadow-[0_5px_15px_rgba(212,175,55,0.26)]" : "shadow-[0_5px_15px_rgba(217,119,6,0.22)]",
        shadowGlow: isDark ? "shadow-[0_0_10px_rgba(212,175,55,0.22)]" : "shadow-[0_0_10px_rgba(217,119,6,0.32)]",
        gradientStart: "from-amber-500",
        gradientVia: "via-yellow-600",
        gradientEnd: "to-amber-700",
        borderHoverBase: isDark ? "hover:border-amber-400/30" : "hover:border-amber-300",
        bgDim: isDark ? "bg-amber-500/10" : "bg-amber-500/5",
        bgDimHover: isDark ? "hover:bg-amber-500/10" : "hover:bg-amber-500/5",
      };
  }
};
