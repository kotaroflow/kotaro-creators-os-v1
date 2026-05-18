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
        glassInfo: isDark ? "bg-[#0d0a08]/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md",
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
        glassInfo: isDark ? "bg-[#0a0d26]/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md",
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
        border: isDark ? "border-[#6B21A8]/20" : "border-slate-200",
        textPrimary: isDark ? "text-[#F3F0FA]" : "text-slate-900",
        textSecondary: isDark ? "text-[#991B1B]" : "text-slate-500",
        accentBg: isDark ? "bg-[#6B21A8]" : "bg-indigo-600",
        accentText: isDark ? "text-indigo-400" : "text-indigo-600",
        accentTextHover: isDark ? "hover:text-indigo-400" : "hover:text-indigo-600",
        accentTextGroupHover: isDark ? "group-hover:text-indigo-400" : "group-hover:text-indigo-600",
        hoverBg: isDark ? "hover:bg-[#6B21A8]/10" : "hover:bg-indigo-50/80",
        glassInfo: isDark ? "bg-[#080612]/80 backdrop-blur-md" : "bg-white/80 backdrop-blur-md",
        shadowLg: isDark ? "shadow-[0_5px_15px_rgba(79,70,229,0.3)]" : "shadow-[0_5px_15px_rgba(79,70,229,0.3)]",
        shadowGlow: isDark ? "shadow-[0_0_10px_rgba(79,70,229,0.3)]" : "shadow-[0_0_10px_rgba(79,70,229,0.5)]",
        gradientStart: "from-indigo-500",
        gradientVia: "via-purple-600",
        gradientEnd: "to-indigo-700",
        borderHoverBase: isDark ? "hover:border-indigo-500/30" : "hover:border-indigo-200",
        bgDim: isDark ? "bg-indigo-500/10" : "bg-indigo-500/5",
        bgDimHover: isDark ? "hover:bg-indigo-500/5" : "hover:bg-indigo-500/5",
      };
  }
};
