/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { User, Profile, NazarickRole, OperationalMode, CreatorFragment, SimulationState, MarioneteDeNazarick, SIMULATION_PROFILE_ID, createSimulationProfile } from './types';
import { Layout, LogOut, Shield, LayoutDashboard, Target, Share2, Library as LibraryIcon, BarChart3, Users, Settings, TrendingUp, Search, Calendar, FileAudio, Menu, LayoutGrid, Layers, Bot, Image, PlugZap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
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
import SimulationSpace from './components/admin/SimulationSpace';

const AUTH_STORAGE_KEY = 'ygn.auth.user';

type AppView =
  | 'profiles'
  | 'dashboard'
  | 'creation'
  | 'strategy'
  | 'campaigns'
  | 'links'
  | 'scheduling'
  | 'reports'
  | 'library'
  | 'users'
  | 'evolution'
  | 'finance'
  | 'admin'
  | 'simulation'
  | 'agents'
  | 'media'
  | 'integrations';

const normalizeRole = (role: unknown): NazarickRole => {
  const raw = String(role || '');
  const currentRoles = Object.values(NazarickRole) as string[];
  if (currentRoles.includes(raw)) return raw as NazarickRole;
  if (raw.includes('Momonga')) return NazarickRole.MOMONGA;
  if (raw.includes('Albedo')) return NazarickRole.ALBEDO;
  if (raw.includes('Demiurge')) return NazarickRole.DEMIURGE;
  if (raw.includes('Cocytus')) return NazarickRole.COCYTUS;
  if (raw.includes('Pandora')) return NazarickRole.PANDORAS_ACTOR;
  if (raw.includes('Victim')) return NazarickRole.VICTIM;
  if (raw.includes('Gargantua')) return NazarickRole.GARGANTUA;
  if (raw.includes('Sebas')) return NazarickRole.SEBAS_TIAN;
  if (raw.includes('Shalltear')) return NazarickRole.SHALLTEAR;
  if (raw.includes('Aura')) return NazarickRole.AURA;
  if (raw.includes('Mare')) return NazarickRole.MARE;
  if (raw.includes('Pestonya')) return NazarickRole.PESTONYA;
  if (raw.includes('Pleiades')) return NazarickRole.PLEIADES;
  return NazarickRole.PESTONYA;
};

const normalizeUser = (rawUser: User): User => ({
  ...rawUser,
  name: rawUser.name === 'Apresentacao Kotaro' ? 'Apresentacao YGN' : rawUser.name,
  role: normalizeRole(rawUser.role),
  operationalMode: Object.values(OperationalMode).includes(rawUser.operationalMode)
    ? rawUser.operationalMode
    : OperationalMode.NORMAL,
  managedProfileIds: rawUser.managedProfileIds || [],
});

const sanitizeSimulationPatch = (draft: MarioneteDeNazarick | null): Partial<User> => {
  if (!draft) return {};

  const patch: Partial<User> = {
    role: draft.role ? normalizeRole(draft.role) : undefined,
    rank: draft.rank,
    level: draft.level,
    levelLimitBreak: draft.levelLimitBreak,
    xp: draft.xp,
    karma: draft.karma,
    operationalMode: draft.operationalMode,
    tags: draft.tags,
    managedProfileIds: draft.managedProfileIds,
  };

  return Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  ) as Partial<User>;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    marioneteNazarick: null
  });
  const [showSupremeSimulator, setShowSupremeSimulator] = useState(false);
  const [activeFragment, setActiveFragment] = useState<CreatorFragment>(CreatorFragment.MOMONGA);
  const [showFragmentSelector, setShowFragmentSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState<AppView>('profiles');
  
  const isSimulationProfile = activeProfile?.id === SIMULATION_PROFILE_ID || view === 'simulation';
  const finalUser = user ? (isSimulationProfile && simulationState.isActive ? normalizeUser({ ...user, ...(simulationState.marioneteNazarick || {}) } as User) : normalizeUser(user)) : null;
  const currentFragment = activeFragment;
  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode);

  const openSupremeSimulator = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    flushSync(() => {
      setShowSupremeSimulator(true);
    });
  };

  const exitSimulation = () => {
    setSimulationState(prev => ({ ...prev, isActive: false, marioneteNazarick: null }));
  };

  const openSimulationProfile = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    if (!user) return;

    flushSync(() => {
      setActiveProfile(createSimulationProfile(user.uid));
      setView('simulation');
    });
  };

  const leaveSimulationProfile = () => {
    exitSimulation();
    setActiveProfile(null);
    setView('profiles');
  };

  const quickApplySimulationPatch = (patch: Partial<User>) => {
    if (!user) return;

    setSimulationState(prev => ({
      ...prev,
      isActive: true,
      marioneteNazarick: {
        role: user.role,
        rank: user.rank,
        level: user.level,
        operationalMode: user.operationalMode,
        xp: user.xp,
        karma: user.karma,
        levelLimitBreak: user.levelLimitBreak,
        managedProfileIds: user.managedProfileIds,
        ...(prev.marioneteNazarick || {}),
        ...patch,
        id: "simulation_marionete_nazarick",
        displayName: "Marionete de Nazarick",
        type: "simulation_only",
        origin: "simulation",
        isRealUser: false,
      }
    }));
  };

  const applySimulationToReal = async () => {
    if (!simulationState.marioneteNazarick || !user?.uid) return;

    if (!confirm('ATENCAO: voce esta prestes a aplicar a simulacao ao usuario real. Esta acao deve ser usada apenas depois de revisar o teste. Prosseguir?')) {
      return;
    }

    const confirmUpdate = sanitizeSimulationPatch(simulationState.marioneteNazarick);

    if (user.uid === 'presentation-user') {
      const nextUser = normalizeUser({ ...user, ...confirmUpdate } as User);
      setUser(nextUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await updateDoc(doc(db, 'users', user.uid), confirmUpdate);
    }

    alert('Alteracoes aplicadas ao usuario real do OS.');
    exitSimulation();
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
    tags: ['ainz ooal gown'],
    managedProfileIds: []
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
        const parsedUser = normalizeUser(JSON.parse(savedUser) as User);
        setUser(parsedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsedUser));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.className = layoutTheme.bgMain + " ygn-os-body transition-colors duration-300";
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [layoutTheme.bgMain, isDarkMode]);


  const navigateTo = (newView: AppView, profile?: Profile) => {
    if (profile) {
      flushSync(() => {
        setActiveProfile(profile);
        setView(profile.id === SIMULATION_PROFILE_ID ? 'simulation' : newView);
      });
    } else {
      setView(newView);
    }
  };

  const menuItems = React.useMemo(() => {
    if (!finalUser) return [];

    if (isSimulationProfile) {
      return [
        { id: 'simulation', label: 'Simulacao', icon: Shield, modes: [OperationalMode.SUPREME] },
      ];
    }

    const isSupreme = finalUser.role === NazarickRole.MOMONGA;
    const isHighRank = ['SSS', 'SS', 'S', 'A'].includes(finalUser.rank || 'F');
    const isHighRole = isSupreme || finalUser.role === NazarickRole.ALBEDO || finalUser.role === NazarickRole.DEMIURGE;

    return [
      { id: 'dashboard', label: 'Painel Central', icon: LayoutDashboard, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'creation', label: 'Criacao I.A.', icon: FileAudio, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'strategy', label: 'Estrategia', icon: Target, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'campaigns', label: 'Campanhas', icon: TrendingUp, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME], roleReq: isHighRole },
      { id: 'links', label: 'Links', icon: Share2, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'scheduling', label: 'Cronograma', icon: Calendar, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'reports', label: 'Relatorios', icon: BarChart3, modes: [OperationalMode.HARD, OperationalMode.SUPREME], rankReq: isHighRank || isHighRole },
      { id: 'library', label: 'Biblioteca', icon: LibraryIcon, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'media', label: 'Midia', icon: Image, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'agents', label: 'Agentes', icon: Bot, modes: [OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'integrations', label: 'Conectores', icon: PlugZap, modes: [OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'users', label: 'Usuarios', icon: Users, modes: [OperationalMode.SUPREME], roleReq: isSupreme },
      { id: 'evolution', label: 'Evolucao', icon: TrendingUp, modes: [OperationalMode.EASY, OperationalMode.NORMAL, OperationalMode.HARD, OperationalMode.SUPREME] },
      { id: 'finance', label: 'Financeiro', icon: Settings, modes: [OperationalMode.SUPREME], roleReq: isSupreme },
      ...(isSupreme ? [
        { id: 'simulation', label: 'Simulacao', icon: Shield, modes: [OperationalMode.SUPREME] },
        { id: 'admin', label: 'Nucleo Admin', icon: Shield, modes: [OperationalMode.SUPREME] },
      ] : []),
    ].filter(item => {
      const modeMatch = item.modes.includes(finalUser.operationalMode || OperationalMode.NORMAL);
      const roleMatch = item.roleReq !== undefined ? item.roleReq : true;
      const rankMatch = item.rankReq !== undefined ? item.rankReq : true;
      return modeMatch && roleMatch && rankMatch;
    });
  }, [finalUser, isSimulationProfile]);
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
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
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
          transition={{ duration: 0.36, ease: "easeOut" }}
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
          transition={{ duration: 0.32, ease: "easeOut" }}
          className={cn(
            "ygn-app-shell flex h-screen overflow-hidden font-sans transition-colors duration-300",
            layoutTheme.bgMain, layoutTheme.textPrimary
          )}
        >
          {/* Sidebar */}
          <aside
            className={cn(
              "flex flex-col border-r shrink-0 overflow-hidden relative z-30 transition-[width,background-color,border-color] duration-200 ease-out",
              isSidebarCollapsed ? "w-20" : "w-64",
              isDarkMode ? "glass-panel" : "glass-panel-light",
              layoutTheme.bgSidebar, layoutTheme.border
            )}
          >
            <div className={cn("h-16 flex items-center border-b gap-3 px-4", layoutTheme.border)}>
              <button
                onClick={() => setIsSidebarCollapsed((value) => !value)}
                className={cn(
                  "ygn-icon-button text-slate-400 hover:text-slate-950 dark:hover:text-white",
                  isDarkMode ? "hover:bg-white/8" : "hover:bg-white/60"
                )}
                title={isSidebarCollapsed ? "Expandir barra" : "Recolher barra"}
              >
                <Menu className="w-5 h-5" />
              </button>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black shrink-0 bg-slate-900/80 dark:bg-white/14">Y</div>
                  <div className="truncate">
                    <h2 className={cn("font-sans font-bold text-sm leading-none tracking-tight uppercase", isDarkMode ? "text-white" : "text-slate-900")}>YGGNAROK</h2>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase truncate">YGN Private OS</span>
                  </div>
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 scrollbar-hide">
              {!isSidebarCollapsed && (
                <div className="text-[10px] uppercase font-black text-slate-500 px-3 mb-3 tracking-[0.2em] truncate">Workspace</div>
              )}

              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'simulation') {
                        openSimulationProfile();
                        return;
                      }
                      setView(item.id as AppView);
                    }}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "ygn-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest relative border border-transparent",
                      isSidebarCollapsed && "justify-center px-0",
                      isActive
                        ? "bg-white/22 dark:bg-white/12 text-slate-950 dark:text-white border-white/25"
                        : isDarkMode
                          ? "text-slate-400 hover:text-white hover:bg-white/8"
                          : "text-slate-500 hover:text-slate-950 hover:bg-white/58"
                    )}
                  >
                    <span className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-full", isActive ? "bg-current opacity-80" : "bg-transparent")} />
                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-current" : "text-slate-500")} />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            <div className={cn("border-t p-3 flex gap-2", layoutTheme.border, isSidebarCollapsed ? "justify-center" : "justify-between")}>
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setView('profiles')}
                  className="flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-white/10"
                >
                  Perfis
                </button>
              )}
              <button
                onClick={handleLogout}
                className="ygn-icon-button text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
          {/* Main Content */}
          <main 
            className="flex-1 flex flex-col min-w-0 overflow-hidden relative"
          >
            {/* Header */}
              <header 
              className={cn(
                "h-20 border-b flex items-center justify-between px-8 z-20 shrink-0 overflow-hidden transition-colors duration-300",
                layoutTheme.glassInfo, layoutTheme.border
              )}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 relative">
                    <h1 className={cn("text-xl font-black uppercase tracking-tighter flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                      {finalUser?.name?.replace(/^adm\s+/i, '').split(' ')[0] || 'Usuario'}
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
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Nivel {finalUser?.level || 1}</span>
                  </div>
                  
                  {/* Comando Supremo - Fragmentos e Simulador */}
                  {user?.role === NazarickRole.MOMONGA && (
                    <div className={cn(
                      "flex items-center ml-2 p-1 rounded-xl border shadow-sm glass-control relative",
                      layoutTheme.bgDim,
                      isDarkMode ? "border-white/10" : "border-slate-200"
                    )}>

                       {/* Fragmento Launcher */}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           if (!simulationState.isActive) setShowFragmentSelector(true);
                         }}
                         disabled={simulationState.isActive}
                         title={simulationState.isActive ? "Saia da simulacao para trocar foco" : "Foco operacional"}
                         className={cn(
                           "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200 group/frag",
                           simulationState.isActive && "opacity-50 cursor-not-allowed",
                           isDarkMode ? "hover:bg-slate-800" : "hover:bg-white"
                         )}
                       >
                         <Layers className={cn("w-3.5 h-3.5", layoutTheme.accentText)} />
                         <span className={cn("text-[9px] font-black uppercase tracking-widest", layoutTheme.accentText)}>{currentFragment}</span>
                       </button>

                       <div className={cn("w-px h-4 mx-1", isDarkMode ? "bg-white/10" : "bg-slate-200")} />

                       {/* Simulador Launcher */}
                       <button
                         onClick={openSimulationProfile}
                         title="Abrir perfil fixo de simulacao"
                         className={cn(
                           "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200 group/sim relative",
                           isDarkMode ? "hover:bg-slate-800" : "hover:bg-white"
                         )}
                       >
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest transition-colors",
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
                      "relative h-10 w-24 rounded-full p-1 transition-colors duration-200 border overflow-hidden",
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
                    className={cn("flex items-center gap-2 px-4 py-2 text-white rounded-lg text-[10px] font-black transition-colors uppercase tracking-widest", layoutTheme.accentBg)}
                   >
                     <Shield className="w-3.5 h-3.5" /> Gestao
                   </button>
                 )}
                 <div className="h-8 w-px bg-slate-500/20 mx-2"></div>
                 <div className="flex items-center gap-3">
                   <button className="ygn-icon-button text-slate-400 hover:bg-slate-500/10"><Search className="w-4 h-4" /></button>
                   <button 
                     onClick={() => setView('profiles')}
                     className="ygn-icon-button text-slate-400 hover:bg-slate-500/10"
                     title="Trocar Perfil"
                   >
                     <LayoutGrid className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            </header>


            {/* Content Area */}
            <div className={cn(
              "flex-1 overflow-y-auto p-8 relative scrollbar-hide transition-colors duration-300",
              layoutTheme.bgMain
            )}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="max-w-7xl mx-auto space-y-8 ygn-view-surface"
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
                  {view === 'simulation' && user?.role === NazarickRole.MOMONGA && (
                    <SimulationSpace
                      realUser={user}
                      simulatedUser={finalUser!}
                      activeProfile={activeProfile}
                      isDarkMode={isDarkMode}
                      onExit={leaveSimulationProfile}
                      onAdjust={openSupremeSimulator}
                      onQuickApply={quickApplySimulationPatch}
                      onSaveReport={() => alert('Relatorio da simulacao preparado para os logs locais do YGN.')}
                      onQueueApproval={() => {
                        alert('Simulacao enviada para a fila de aprovacao interna.');
                        exitSimulation();
                      }}
                      onApplyToReal={applySimulationToReal}
                    />
                  )}
                  
                  {['campaigns', 'links', 'reports', 'users', 'finance', 'agents', 'media', 'integrations'].includes(view) && (
                    <div className={cn(
                      "flex flex-col items-center justify-center p-20 border border-dashed rounded-3xl transition-colors duration-500",
                      isDarkMode ? "bg-slate-900 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-300"
                    )}>
                      <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6", layoutTheme.bgDim)}>
                        <Layout className={cn("w-10 h-10 opacity-40", layoutTheme.accentText)} />
                      </div>
                      <h3 className={cn("font-bold text-2xl tracking-tight mb-2 uppercase", isDarkMode ? "text-white" : "text-slate-800")}>Interface em Manutencao</h3>
                      <p className="text-sm text-slate-500 italic max-w-sm text-center font-medium">Este setor esta preparado para receber os proximos modulos do YGGNAROK.</p>
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
                 onStartSimulation={(simulatedUser) => {
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
                       }
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

          {showFragmentSelector && !simulationState.isActive && user?.role === NazarickRole.MOMONGA && (
            <FragmentSelector
              activeFragment={activeFragment}
              onSelect={(fragment) => {
                flushSync(() => {
                  setShowFragmentSelector(false);
                  setActiveFragment(fragment);
                });
              }}
              onClose={() => setShowFragmentSelector(false)}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>
    </>
  );
}
