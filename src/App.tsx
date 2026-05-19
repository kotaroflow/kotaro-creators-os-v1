/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { User, Profile, NazarickRole, OperationalMode, getEffectiveRank, CreatorFragment, SimulationState } from './types';
import { Layout, LogOut, Shield, User as UserIcon, LayoutDashboard, Target, Share2, Library as LibraryIcon, BarChart3, Users, Settings, TrendingUp, Plus, Search, Trash2, Calendar, FileAudio, Menu, LayoutGrid, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getRankTheme } from './lib/utils';
import { getLayoutTheme } from './lib/theme';

// Components
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ProfileSelector from './components/dashboard/ProfileSelector';
import ContentCreation from './components/creation/ContentCreation';
import ManagePermissions from './components/profile/ManagePermissions';
import AdminPanel from './components/admin/AdminPanel';
import Evolution from './components/evolution/Evolution';
import Library from './components/library/Library';
import Strategy from './components/strategy/Strategy';
import Scheduling from './components/scheduling/Scheduling';

import SupremeSimulator from './components/admin/SupremeSimulator';
import FragmentSelector from './components/admin/FragmentSelector';

const AUTH_STORAGE_KEY = 'ygn.auth.user';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    marioneteNazarick: null,
    simulatedFragment: CreatorFragment.MOMONGA
  });
  const [showSupremeSimulator, setShowSupremeSimulator] = useState(false);
  const [activeFragment, setActiveFragment] = useState<CreatorFragment>(CreatorFragment.MOMONGA);
  const [showFragmentSelector, setShowFragmentSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserDetailsVisible, setIsUserDetailsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState<'profiles' | 'dashboard' | 'creation' | 'strategy' | 'campaigns' | 'links' | 'scheduling' | 'reports' | 'library' | 'users' | 'evolution' | 'finance' | 'admin'>('profiles');
  
  const finalUser = user ? (simulationState.isActive ? { ...user, ...(simulationState.marioneteNazarick || {}) } as User : user) : null;
  const currentFragment = simulationState.isActive ? simulationState.simulatedFragment : activeFragment;
  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode);
  const effectiveRank = getEffectiveRank(finalUser);

  const openSupremeSimulator = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    flushSync(() => {
      setShowSupremeSimulator(true);
    });
  };

  const createPresentationUser = (): User => ({
    uid: 'presentation-user',
    name: 'Apresentacao YGN',
    email: 'demo@yggnarok.local',
    role: NazarickRole.MOMONGA,
    xp: 999,
    level: 99,
    rank: 'SSS',
    karma: 100,
    operationalMode: OperationalMode.SUPREME,
    createdAt: new Date().toISOString(),
    tags: ['ainz ooal gown']
  });

  const handlePresentationLogin = () => {
    const demoUser = createPresentationUser();
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    flushSync(() => {
      setUser(demoUser);
      setAuthError('');
      setLoading(false);
      setView('profiles');
    });
  };

  const handleLogout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setActiveProfile(null);
    setView('profiles');
    setLoading(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsedUser));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.className = layoutTheme.bgMain + " ygn-os-body transition-colors duration-1000";
  }, [layoutTheme.bgMain]);


  const navigateTo = (newView: typeof view, profile?: Profile) => {
    if (profile) {
      flushSync(() => {
        setActiveProfile(profile);
        setIsUserDetailsVisible(false); // Close details on navigation
        setView(newView);
      });
    } else {
      setView(newView);
    }
  };

  const menuItems = React.useMemo(() => {
    if (!finalUser) return [];
    
    const isSupreme = finalUser.role === NazarickRole.MOMONGA;
    const isHighRank = ['SSS', 'SS', 'S', 'A'].includes(finalUser.rank || 'F');
    const isHighRole = isSupreme || finalUser.role === NazarickRole.ALBEDO || finalUser.role === NazarickRole.DEMIURGE;

    return [
      { id: 'dashboard', label: 'Painel Central', icon: LayoutDashboard, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.MATHEUS, CreatorFragment.KOTARO, CreatorFragment.MOMONGA] },
      { id: 'creation', label: 'Criação I.A.', icon: FileAudio, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.KOTARO] },
      { id: 'strategy', label: 'Estratégia Profunda', icon: Target, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.MATHEUS, CreatorFragment.KOTARO, CreatorFragment.MOMONGA] },
      { id: 'campaigns', label: 'Arco de Campanhas', icon: TrendingUp, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], roleReq: isHighRole, fragments: [CreatorFragment.MATHEUS] },
      { id: 'links', label: 'Forja de Links', icon: Share2, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.MATHEUS] },
      { id: 'scheduling', label: 'Cronograma', icon: Calendar, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.KOTARO, CreatorFragment.MATHEUS] },
      { id: 'reports', label: 'Relatórios de Guerra', icon: BarChart3, modes: [OperationalMode.HARD, OperationalMode.SUPREME], rankReq: isHighRank || isHighRole, fragments: [CreatorFragment.MATHEUS] },
      { id: 'library', label: 'Biblioteca de Ativos', icon: LibraryIcon, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.KOTARO] },
      { id: 'users', label: 'Subordinados', icon: Users, modes: [OperationalMode.SUPREME], roleReq: isSupreme, fragments: [CreatorFragment.MOMONGA] },
      { id: 'evolution', label: 'Evolução de Escala', icon: TrendingUp, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], fragments: [CreatorFragment.MOMONGA] },
      { id: 'finance', label: 'Cofre Real', icon: Settings, modes: [OperationalMode.SUPREME], roleReq: isSupreme, fragments: [CreatorFragment.MATHEUS] },
      ...(isSupreme ? [{ id: 'admin', label: 'Tumba de Nazarick', icon: Shield, modes: [OperationalMode.SUPREME], fragments: [CreatorFragment.MOMONGA] }] : []),
    ].filter(item => {
      const modeMatch = item.modes.includes(finalUser.operationalMode || OperationalMode.NORMAL);
      const roleMatch = item.roleReq !== undefined ? item.roleReq : true;
      const rankMatch = item.rankReq !== undefined ? item.rankReq : true;
      const fragmentMatch = (!isSupreme) || (item.fragments ? item.fragments.includes(currentFragment) : true);
      return modeMatch && roleMatch && rankMatch && fragmentMatch;
    });
  }, [finalUser, user, currentFragment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-900 animate-pulse font-sans font-bold text-2xl tracking-tight">
          YGGNAROK <span className="text-xs text-slate-400 block font-normal">Sincronizando dados locais...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full border border-red-500/20 bg-red-950/20 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-black mb-3">Falha ao sincronizar dados</h1>
          <p className="text-sm text-red-100/80 mb-6 leading-relaxed">{authError}</p>
          <button
            onClick={handleLogout}
            className="px-5 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
          >
            Sair e tentar de novo
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="contents"
        >
          <Login onLogin={handlePresentationLogin} />
        </motion.div>
      ) : (view === 'profiles' || !activeProfile) ? (
        <motion.div
          key="profile-selector"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="contents"
        >
          <ProfileSelector 
            user={finalUser} 
            onSelect={(p) => navigateTo('dashboard', p)} 
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "ygn-app-shell flex h-screen overflow-hidden font-sans transition-colors duration-1000",
            layoutTheme.bgMain, layoutTheme.textPrimary
          )}
        >
          {/* Sidebar */}
          <motion.aside 
            initial={false}
            animate={{ width: isSidebarCollapsed ? 80 : 256 }}
            className={cn(
              "flex flex-col border-r shrink-0 overflow-hidden transition-colors duration-1000 relative z-30",
              isDarkMode ? "glass-panel" : "glass-panel-light",
              layoutTheme.bgSidebar, layoutTheme.border
            )}
          >
            <div className={cn(
              "h-16 flex items-center px-6 border-b gap-4 transition-colors duration-1000",
              layoutTheme.border
            )}>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                )}
              >
                <Menu className="w-5 h-5" />
              </button>
              {!isSidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-3 overflow-hidden"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-black shrink-0", layoutTheme.accentBg)}>Y</div>
                  <div className="truncate">
                    <h2 className={cn("font-sans font-bold text-sm leading-none tracking-tight uppercase", isDarkMode ? "text-white" : "text-slate-900")}>YGGNAROK</h2>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase truncate">YGN Private OS</span>
                  </div>
                </motion.div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
              {!isSidebarCollapsed && (
                <div className="text-[10px] uppercase font-black text-slate-600 px-3 mb-4 tracking-[0.2em] truncate">Workspace</div>
              )}
              
              {menuItems.map((item) => (
                <motion.button 
                  key={item.id}
                  layout="position"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView(item.id as any)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black transition-all group relative uppercase tracking-widest",
                    isSidebarCollapsed && "justify-center px-0",
                    view === item.id 
                      ? `text-white ${layoutTheme.accentBg} ${layoutTheme.shadowLg}` 
                      : isDarkMode 
                        ? `text-slate-400 ${layoutTheme.accentTextHover} ${layoutTheme.hoverBg}` 
                        : `text-slate-500 ${layoutTheme.accentTextHover} hover:bg-slate-50/80`
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 shrink-0 transition-all duration-300", 
                    view === item.id ? "text-white scale-110" : `text-slate-500 ${layoutTheme.accentTextGroupHover} group-hover:scale-110`
                  )} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {view === item.id && (
                    <motion.div 
                      layoutId="active-nav"
                      className={cn(
                        `absolute left-0 w-1 h-4 rounded-full ${layoutTheme.accentBg}`,
                        layoutTheme.shadowGlow
                      )}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 mx-4 mb-4 rounded-xl border relative overflow-hidden group/rank transition-all duration-500",
                  isDarkMode 
                    ? `bg-slate-900 shadow-xl border-white/5 ${layoutTheme.borderHoverBase}` 
                    : `bg-white shadow-sm border-slate-200 ${layoutTheme.borderHoverBase}`
                )}
              >
                {/* Background Decoration */}
                <div className={cn(
                  "absolute inset-0 pointer-events-none opacity-[0.03]",
                  "bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]"
                )} />
                <div className={cn("absolute inset-x-0 top-0 h-px pointer-events-none", layoutTheme.accentBg)} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-3">
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md border",
                      isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                    )}>
                      <Shield className={cn("w-2.5 h-2.5", layoutTheme.accentText)} />
                      <span className={cn("text-[8.5px] font-black uppercase tracking-[0.2em] leading-none font-mono", isDarkMode ? "text-white" : "text-slate-800")}>Sync_V1</span>
                    </div>
                    <span className={cn("text-[10px] font-black font-mono", layoutTheme.accentText)}>
                      {((finalUser?.xp || 0) % 100)}%
                    </span>
                  </div>

                  <div className={cn(
                    "h-1.5 w-full rounded-full overflow-hidden relative",
                    isDarkMode ? "bg-slate-800" : "bg-slate-100"
                  )}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, (finalUser?.xp || 0) % 100)}%` }}
                      transition={{ duration: 2, ease: "circOut" }}
                      className={cn("h-full rounded-full relative", layoutTheme.accentBg)}
                    >
                      <motion.div 
                        animate={{ x: ['-100%', '400%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                      />
                    </motion.div>
                  </div>

                  <div className="mt-3 flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className={cn("text-[7px] font-black uppercase tracking-widest mb-0.5", isDarkMode ? "text-slate-500" : "text-slate-400")}>Patente</span>
                      <span className={cn("text-[11px] font-black uppercase tracking-tighter leading-none", isDarkMode ? "text-white" : "text-slate-900")}>
                        Rank {effectiveRank}
                      </span>
                    </div>
                    <div className="text-right">
                       <span className={cn("text-[7px] font-black uppercase tracking-widest block mb-0.5", isDarkMode ? "text-slate-500" : "text-slate-400")}>Status</span>
                       <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest block leading-none">ESTÁVEL</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className={cn(
              "border-t flex group relative transition-all duration-1000",
              isSidebarCollapsed ? "h-20 items-center justify-center px-0 py-0" : "p-4",
              layoutTheme.border
            )}>
              <div className={cn(
                "flex items-center relative z-[60]",
                isSidebarCollapsed ? "justify-center w-full" : "justify-between w-full"
              )}>
                <div 
                  onClick={() => setIsUserDetailsVisible(!isUserDetailsVisible)}
                  className={cn(
                    "flex items-center overflow-hidden cursor-pointer group/user shrink-0",
                    isSidebarCollapsed ? "justify-center w-12 h-12" : "gap-3"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ring-2 ring-white/10 group-hover/user:scale-105 transition-transform duration-500", layoutTheme.gradientStart, layoutTheme.gradientVia, layoutTheme.gradientEnd, layoutTheme.shadowGlow)}>
                    {finalUser?.name?.charAt(0) || 'U'}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="flex flex-col overflow-hidden group/text">
                      <span className={cn("text-[11px] font-black leading-none truncate uppercase tracking-tighter transition-colors", isDarkMode ? "text-slate-100" : "text-slate-900", layoutTheme.accentTextGroupHover)}>{finalUser?.name}</span>
                      <span className="text-[8px] text-slate-500 truncate uppercase font-mono mt-1 font-black">Nazarick System</span>
                    </div>
                  )}
                </div>
                
                {!isSidebarCollapsed && (
                  <button 
                    onClick={handleLogout}
                    className={cn(
                      "p-2 transition-colors rounded-lg",
                      isDarkMode ? "text-slate-600 hover:text-red-400 bg-slate-800/50" : "text-slate-400 hover:text-red-500 bg-slate-100"
                    )}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* User Detail Floating Box - MOVED AND POSITIONED */}
              <AnimatePresence>
                {isUserDetailsVisible && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    className={cn(
                      "fixed left-[84px] bottom-4 w-72 border rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] z-[100] transition-colors duration-500",
                      !isSidebarCollapsed && "left-[260px]",
                      isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-slate-200/60"
                    )}
                  >
                     <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/10", layoutTheme.gradientStart, layoutTheme.gradientVia, layoutTheme.gradientEnd, layoutTheme.shadowGlow)}>
                          {finalUser?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                           <h4 className={cn("text-sm font-black uppercase tracking-tighter", isDarkMode ? "text-white" : "text-slate-900")}>{finalUser?.name || 'Usuário'}</h4>
                           <p className={cn("text-[8px] font-black uppercase tracking-widest mt-0.5", layoutTheme.accentText)}>{finalUser?.role}</p>
                        </div>
                     </div>

                     <div className="space-y-5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <div className="flex items-center gap-2"><Shield className={cn("w-3.5 h-3.5", layoutTheme.accentText)} /> STATUS_PRO</div>
                          <div className={isDarkMode ? "text-white" : "text-slate-900"}>RANK {effectiveRank}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">
                            <span>Exp de Sincronia</span>
                            <span className={isDarkMode ? "text-white" : "text-slate-900"}>{(finalUser?.xp || 0) % 100}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(finalUser?.xp || 0) % 100}%` }}
                              className={cn(
                                "h-full rounded-full", layoutTheme.accentBg, layoutTheme.shadowGlow
                              )}
                            />
                          </div>
                        </div>
                     </div>
                     
                     <div className={cn(
                       "absolute left-[-6px] bottom-10 w-3 h-3 border-l border-b rotate-45 transition-colors duration-500",
                       isDarkMode ? "bg-slate-900 border-slate-700/50" : "bg-white border-slate-200"
                     )} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main 
            className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
            onClick={() => {
              if (isUserDetailsVisible) setIsUserDetailsVisible(false);
            }}
          >
            {/* Header */}
              <header 
              onClick={() => {
                if (isUserDetailsVisible) setIsUserDetailsVisible(false);
              }}
              className={cn(
                "h-20 border-b flex items-center justify-between px-8 z-20 shrink-0 transition-colors duration-1000 group/header",
                layoutTheme.glassInfo, layoutTheme.border
              )}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 relative">
                    <h1 className={cn("text-xl font-black uppercase tracking-tighter flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                      {finalUser?.name?.replace(/^adm\s+/i, '').split(' ')[0] || 'Usuário'}
                    </h1>
                    <div className="flex items-center gap-1.5 cursor-help">
                      <span className={cn("text-[8px] text-white px-2 py-0.5 rounded-md font-black uppercase tracking-widest shadow-sm", layoutTheme.accentBg)}>{finalUser?.operationalMode}</span>
                    </div>
                    
                  </div>
                  <div className="h-4 w-px bg-slate-500/20"></div>
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-lg border shadow-sm transition-colors duration-500",
                    isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                  )}>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Nível {finalUser?.level || 1}</span>
                  </div>
                  
                  {/* Comando Supremo - Fragmentos e Simulador */}
                  {user?.role === NazarickRole.MOMONGA && (
                    <div className={cn(
                      "flex items-center ml-2 p-1 rounded-xl border shadow-sm glass-control relative",
                      layoutTheme.bgDim,
                      isDarkMode ? "border-white/10" : "border-slate-200"
                    )}>
                      {/* Badge Momonga Effect */}
                      <div className={cn("absolute -top-1.5 -left-1.5 w-4 h-4 rounded-md border flex items-center justify-center shadow-lg rotate-12 z-10", layoutTheme.accentBg, isDarkMode ? "border-white/10" : "border-white/20")}>
                        <span className="text-[10px] text-white font-overlord font-black -rotate-12 leading-none">∞</span>
                      </div>

                       {/* Fragmento Launcher */}
                       <button
                         onClick={(e) => { e.stopPropagation(); setShowFragmentSelector(true); }}
                         title="Fragmentos do Criador Supremo"
                         className={cn(
                           "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 group/frag",
                           isDarkMode ? "hover:bg-slate-800" : "hover:bg-white"
                         )}
                       >
                         <Layers className={cn("w-3.5 h-3.5 transition-transform group-hover/frag:scale-110", layoutTheme.accentText)} />
                         <span className={cn("text-[9px] font-black uppercase tracking-widest", layoutTheme.accentText)}>{currentFragment}</span>
                       </button>

                       <div className={cn("w-px h-4 mx-1", isDarkMode ? "bg-white/10" : "bg-slate-200")} />

                       {/* Simulador Launcher */}
                       <button
                         onClick={openSupremeSimulator}
                         title="Simulador dos Seres Supremos"
                         className={cn(
                           "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 group/sim relative",
                           isDarkMode ? "hover:bg-slate-800" : "hover:bg-white"
                         )}
                       >
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest transition-all",
                           isDarkMode ? "text-slate-400 group-hover/sim:text-slate-300" : "text-slate-500 group-hover/sim:text-slate-700"
                         )}>
                           Simulador
                         </span>
                       </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={cn(
                      "relative h-10 w-24 rounded-full p-1 transition-all duration-500 border overflow-hidden",
                      isDarkMode ? "bg-slate-900 border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" : "bg-slate-100 border-slate-200 shadow-inner"
                    )}
                  >
                    <motion.div 
                      layout
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={cn(
                        "h-full aspect-square rounded-full flex items-center justify-center shadow-md relative z-10",
                        isDarkMode ? cn("ml-auto", layoutTheme.accentBg) : "bg-white"
                      )}
                    >
                      <motion.span 
                        key={isDarkMode ? 'dark' : 'light'}
                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        className={cn("text-[10px] font-black", isDarkMode ? "text-white" : layoutTheme.textPrimary)}
                      >
                        {isDarkMode ? "ON" : "OFF"}
                      </motion.span>
                    </motion.div>
                    <span className={cn(
                      "absolute inset-y-0 flex items-center text-[7px] font-black uppercase tracking-widest px-3 pointer-events-none transition-opacity",
                      isDarkMode ? "left-1 opacity-40 text-slate-500" : "right-1 opacity-40 text-slate-400"
                    )}>
                      {isDarkMode ? "DARK" : "LIGHT"}
                    </span>
                  </button>

                 {(user?.role === NazarickRole.MOMONGA && isSidebarCollapsed) && (
                   <button 
                    onClick={() => setShowPermissions(true)}
                    className={cn("flex items-center gap-2 px-4 py-2 text-white rounded-xl text-[10px] font-black transition-all uppercase tracking-widest", layoutTheme.accentBg, layoutTheme.shadowGlow)}
                   >
                     <Shield className="w-3.5 h-3.5" /> Gestão
                   </button>
                 )}
                 <div className="h-8 w-px bg-slate-500/20 mx-2"></div>
                 <div className="flex items-center gap-3">
                   <button className="p-2.5 text-slate-400 hover:bg-slate-500/10 rounded-xl transition-all"><Search className="w-4 h-4" /></button>
                   <button 
                     onClick={() => setView('profiles')}
                     className="p-2.5 text-slate-400 hover:bg-slate-500/10 rounded-xl transition-all"
                     title="Trocar Perfil"
                   >
                     <LayoutGrid className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            </header>

            {/* Simulation Active Banner */}
            <AnimatePresence>
              {simulationState.isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={cn(
                    "border-b overflow-hidden relative z-30 shadow-md transition-colors duration-700",
                    layoutTheme.border,
                    layoutTheme.accentBg
                  )}
                >
                  <div className="max-w-7xl mx-auto px-8 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 animate-pulse">
                        <Shield className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-white/90 uppercase mb-0.5">MODO DE SIMULAÇÃO ATIVO — AMBIENTE 100% SIMULADO</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-white shadow-sm">
                          <span className={layoutTheme.accentText}>{finalUser?.role}</span>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span>Rank {finalUser?.rank || 'F'}</span>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span>Lv {finalUser?.level === Infinity ? '∞' : finalUser?.level || 1}</span>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span>{finalUser?.operationalMode}</span>
                        </div>
                      </div>
                    </div>
                     <div className="flex items-center gap-2">
                       <button 
                         onClick={() => {
                           alert('Relatório da simulação gerado e salvo nos arquivos locais.');
                         }}
                         className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10"
                       >
                         Salvar Relatório
                       </button>
                       <button 
                         onClick={() => {
                           alert('Mudanças enviadas para a fila de aprovação central.');
                           setSimulationState(prev => ({ ...prev, isActive: false, marioneteNazarick: null }));
                         }}
                         className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-widest transition-colors border border-white/10"
                       >
                         Enviar P/ Aprovação
                       </button>
                       {user?.role === NazarickRole.MOMONGA && (
                         <button 
                           onClick={async () => {
                             if (confirm('ATENÇÃO: Você está prestes a aplicar as mudanças do ambiente de simulação ao SUPREMO ESTADO REAL do sistema. Esta ação é irreversível. Prosseguir?')) {
                               if (simulationState.marioneteNazarick && user?.uid) {
                                 const confirmUpdate = {
                                    ...simulationState.marioneteNazarick
                                 };
                                  if (user.uid === 'presentation-user') {
                                    const nextUser = { ...user, ...confirmUpdate } as User;
                                    setUser(nextUser);
                                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
                                  } else {
                                    await updateDoc(doc(db, 'users', user.uid), confirmUpdate);
                                  }
                                 alert('Alterações aplicadas ao estado real do OS.');
                                 setSimulationState(prev => ({ ...prev, isActive: false, marioneteNazarick: null }));
                               }
                             }
                           }}
                           className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-100 text-[10px] font-black uppercase tracking-widest transition-colors border border-red-500/30"
                         >
                           Aplicar ao Sistema Real
                         </button>
                       )}
                       <button 
                         onClick={openSupremeSimulator}
                         className={cn("px-4 py-1.5 rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm ml-2", layoutTheme.accentBg, layoutTheme.shadowGlow)}
                       >
                         Ajustar Simulação
                       </button>
                       <button 
                         onClick={() => setSimulationState(prev => ({ ...prev, isActive: false, marioneteNazarick: null }))}
                         className={cn("px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest transition-colors shadow-md", layoutTheme.accentText)}
                       >
                         Descartar / Sair
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <div className={cn(
              "flex-1 overflow-y-auto p-8 relative scrollbar-hide transition-colors duration-1000",
              layoutTheme.bgMain
            )}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-7xl mx-auto space-y-8"
                >
                  {view === 'dashboard' && (
                    <Dashboard 
                      user={finalUser} 
                      profile={activeProfile!} 
                      onNavigate={(v) => setView(v)}
                      isDarkMode={isDarkMode}
                      activeFragment={currentFragment}
                    />
                  )}
                  {view === 'creation' && (
                    <ContentCreation 
                      user={finalUser} 
                      profile={activeProfile!} 
                      onSidebarCollapse={(collapse) => setIsSidebarCollapsed(collapse)}
                      isDarkMode={isDarkMode}
                      currentFragment={currentFragment}
                    />
                  )}
                  {view === 'evolution' && <Evolution user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} activeFragment={currentFragment} />}
                  {view === 'library' && <Library user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} currentFragment={currentFragment} />}
                  {view === 'strategy' && <Strategy user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} currentFragment={currentFragment} />}
                  {view === 'scheduling' && <Scheduling user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} currentFragment={currentFragment} />}
                  {view === 'admin' && <AdminPanel />}
                  
                  {['campaigns', 'links', 'reports', 'users', 'finance'].includes(view) && (
                    <div className={cn(
                      "flex flex-col items-center justify-center p-20 border border-dashed rounded-3xl transition-colors duration-500",
                      isDarkMode ? "bg-slate-900 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-300"
                    )}>
                      <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6", layoutTheme.bgDim)}>
                        <Layout className={cn("w-10 h-10 opacity-40", layoutTheme.accentText)} />
                      </div>
                      <h3 className={cn("font-bold text-2xl tracking-tight mb-2 uppercase", isDarkMode ? "text-white" : "text-slate-800")}>Interface em Manutenção</h3>
                      <p className="text-sm text-slate-500 italic max-w-sm text-center font-medium">Os artesãos de Nazarick estão calibrando este setor. Disponível em breve no YGGNAROK.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

      <AnimatePresence>
        {showPermissions && activeProfile && (
          <ManagePermissions profile={activeProfile} onClose={() => setShowPermissions(false)} />
        )}
      </AnimatePresence>
    </motion.div>
    )}

        <AnimatePresence>
          {showSupremeSimulator && user?.role === NazarickRole.MOMONGA && (
               <SupremeSimulator 
                 realUser={user}
                 simulationState={simulationState}
                 onStartSimulation={(simulatedUser, targetFragment) => {
                   flushSync(() => {
                     setSimulationState(prev => ({
                       ...prev,
                       isActive: true,
                       marioneteNazarick: {
                          ...simulatedUser,
                          id: "simulation_marionete_nazarick",
                          displayName: "Marionete de Nazarick",
                          type: "simulation_only",
                          origin: "simulation",
                          isRealUser: false,
                       },
                       simulatedFragment: targetFragment || activeFragment
                     }));
                     setShowSupremeSimulator(false);
                   });
                 }}
                 onDiscard={() => {
                   setSimulationState(prev => ({ ...prev, isActive: false, marioneteNazarick: null }));
                   setShowSupremeSimulator(false);
                 }}
                 onClose={() => setShowSupremeSimulator(false)}
                 isDarkMode={isDarkMode}
               />
          )}

          {showFragmentSelector && user?.role === NazarickRole.MOMONGA && (
            <FragmentSelector
              activeFragment={currentFragment}
              onSelect={(fragment) => {
                flushSync(() => {
                  setShowFragmentSelector(false);
                  if (simulationState.isActive) {
                    setSimulationState(prev => ({ ...prev, simulatedFragment: fragment }));
                  } else {
                    setActiveFragment(fragment);
                  }
                });
              }}
              onClose={() => setShowFragmentSelector(false)}
              isDarkMode={isDarkMode}
              userMode={finalUser?.operationalMode || OperationalMode.NORMAL}
              onChangeMode={async (mode) => {
                if (!user?.uid) return;
                if (simulationState.isActive) {
                  setSimulationState(prev => ({ ...prev, marioneteNazarick: { ...prev.marioneteNazarick, operationalMode: mode } }));
                } else {
                  if (user.uid === 'presentation-user') {
                    const nextUser = { ...user, operationalMode: mode };
                    setUser(nextUser);
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
                  } else {
                    await updateDoc(doc(db, 'users', user.uid), { operationalMode: mode });
                  }
                }
              }}
            />
          )}
        </AnimatePresence>
    </>
  );
}
