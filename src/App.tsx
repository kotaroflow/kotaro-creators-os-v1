/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
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
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserDetailsVisible, setIsUserDetailsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [view, setView] = useState<'profiles' | 'dashboard' | 'creation' | 'strategy' | 'campaigns' | 'links' | 'scheduling' | 'reports' | 'library' | 'users' | 'evolution' | 'finance' | 'admin'>('profiles');
  const [isIntroActive, setIsIntroActive] = useState(false);
  
  const finalUser = user ? (simulationState.isActive ? { ...user, ...(simulationState.marioneteNazarick || {}) } as User : user) : null;
  const currentFragment = simulationState.isActive ? simulationState.simulatedFragment : activeFragment;
  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode);
  const effectiveRank = getEffectiveRank(finalUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userRef = doc(db, 'users', fbUser.uid);
        const unsubUser = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            // Force admin role for the specified email
            if (fbUser.email === 'naoteemteresa@gmail.com' && userData.role !== NazarickRole.MOMONGA) {
              await updateDoc(userRef, { role: NazarickRole.MOMONGA });
            }
            setUser(userData);
          } else {
            // Create default user profile
            const isInitialAdmin = fbUser.email === 'naoteemteresa@gmail.com';
            const newUser: User = {
              uid: fbUser.uid,
              name: fbUser.displayName || 'Usuário',
              email: fbUser.email || '',
              role: isInitialAdmin ? NazarickRole.MOMONGA : NazarickRole.PLEIADES,
              xp: 0,
              level: 1,
              rank: 'F',
              karma: 0,
              operationalMode: OperationalMode.NORMAL,
              createdAt: new Date().toISOString(),
              tags: []
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `usuários/${fbUser.uid}`);
          setLoading(false);
        });
        return unsubUser;
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    document.body.className = layoutTheme.bgMain + " transition-colors duration-1000";
  }, [layoutTheme.bgMain]);

  const navigateTo = (newView: typeof view, profile?: Profile) => {
    if (profile) {
      setActiveProfile(profile);
      setIsIntroActive(true);
      setIsUserDetailsVisible(false); // Close details on navigation
      
      // The veil covers the screen faster
      setTimeout(() => {
        setView(newView);
      }, 1400); 

      // End intro state after animation completes fully
      setTimeout(() => {
        setIsIntroActive(false);
      }, 1800); 
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
          CREA.OS <span className="text-xs text-slate-400 block font-normal">Sincronizando seus dados...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="contents"
        >
          <Login onLogin={() => {}} />
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
            onLogout={() => signOut(auth)}
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
            "flex h-screen overflow-hidden font-sans transition-colors duration-1000",
            layoutTheme.bgMain, layoutTheme.textPrimary
          )}
        >
          {/* Sidebar */}
          <motion.aside 
            initial={false}
            animate={{ width: isSidebarCollapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn(
              "flex flex-col border-r shrink-0 overflow-hidden transition-colors duration-1000 relative z-30",
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
              <AnimatePresence mode="wait">
                {!isSidebarCollapsed && (
                  <motion.div 
                    key="logo"
                    initial={{ opacity: 0, width: 0 }} 
                    animate={{ opacity: 1, width: "auto" }} 
                    exit={{ opacity: 0, width: 0, transition: { duration: 0.1 } }}
                    className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-black shrink-0", layoutTheme.accentBg)}>C</div>
                    <div className="truncate">
                      <h2 className={cn("font-sans font-bold text-sm leading-none tracking-tight uppercase", isDarkMode ? "text-white" : "text-slate-900")}>CREA.OS</h2>
                      <span className="text-[10px] text-slate-500 font-mono block uppercase truncate">SaaS Multi-Tenant</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
              <AnimatePresence mode="wait">
                {!isSidebarCollapsed && (
                  <motion.div 
                    key="workspace-title"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.1 } }}
                    className="text-[10px] uppercase font-black text-slate-600 px-3 pb-4 tracking-[0.2em] truncate whitespace-nowrap"
                  >
                    Workspace
                  </motion.div>
                )}
              </AnimatePresence>
              
              {menuItems.map((item) => (
                <motion.button 
                  key={item.id}
                  layout="position"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView(item.id as any)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black transition-all group relative uppercase tracking-widest overflow-hidden",
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
                  <AnimatePresence mode="wait">
                    {!isSidebarCollapsed && (
                      <motion.span 
                        key="nav-label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0, transition: { duration: 0.1 } }}
                        className="truncate whitespace-nowrap text-left"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
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

            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.div 
                  key="user-rank"
                  initial={{ opacity: 0, scale: 0.95, height: 0 }}
                  animate={{ opacity: 1, scale: 1, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, transition: { duration: 0.1 } }}
                  className="px-4 mb-4"
                >
                  <div className={cn(
                    "p-4 rounded-xl border relative overflow-hidden group/rank transition-all duration-500",
                    isDarkMode 
                      ? `bg-slate-900 shadow-xl border-white/5 ${layoutTheme.borderHoverBase}` 
                      : `bg-white shadow-sm border-slate-200 ${layoutTheme.borderHoverBase}`
                  )}>
                {/* Background Decoration */}
                <div className={cn(
                  "absolute inset-0 pointer-events-none opacity-[0.03]",
                  "bg-[url('https://www.transparenttextures.com/patterns/japanese-sayagata.png')]"
                )} />
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 blur-3xl pointer-events-none -mr-10 -mt-10",
                  layoutTheme.bgDim
                )} />
                
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              "p-4 border-t flex flex-col group relative transition-all duration-1000",
              isSidebarCollapsed ? "h-16 items-center justify-center p-0" : "h-auto",
              layoutTheme.border
            )}>
              <div className="flex items-center justify-between w-full relative z-[60]">
                <div 
                  onClick={() => setIsUserDetailsVisible(!isUserDetailsVisible)}
                  className="flex items-center gap-3 overflow-hidden cursor-pointer group/user shrink-0"
                >
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ring-2 ring-white/10 group-hover/user:scale-105 transition-transform duration-500", layoutTheme.gradientStart, layoutTheme.gradientVia, layoutTheme.gradientEnd, layoutTheme.shadowGlow)}>
                    {finalUser?.name?.charAt(0) || 'U'}
                  </div>
                  <AnimatePresence mode="wait">
                    {!isSidebarCollapsed && (
                      <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0, transition: { duration: 0.1 } }}
                        className="flex flex-col overflow-hidden group/text whitespace-nowrap"
                      >
                        <span className={cn("text-[11px] font-black leading-none truncate uppercase tracking-tighter transition-colors", isDarkMode ? "text-slate-100" : "text-slate-900", layoutTheme.accentTextGroupHover)}>{finalUser?.name}</span>
                        <span className="text-[8px] text-slate-500 truncate uppercase font-mono mt-1 font-black">Nazarick System</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <AnimatePresence mode="wait">
                  {!isSidebarCollapsed && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.1 } }}
                      onClick={() => signOut(auth)}
                      className={cn(
                        "p-2 transition-colors rounded-lg shrink-0",
                        isDarkMode ? "text-slate-600 hover:text-red-400 bg-slate-800/50" : "text-slate-400 hover:text-red-500 bg-slate-100"
                      )}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* User Detail Floating Box - MOVED AND POSITIONED */}
              <AnimatePresence>
                {isUserDetailsVisible && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    className={cn(
                      "fixed left-[84px] bottom-4 w-72 border rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] backdrop-blur-xl transition-colors duration-500",
                      !isSidebarCollapsed && "left-[260px]",
                      isDarkMode ? "bg-slate-900 border-slate-700/50" : "bg-white border-slate-200"
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
                      "flex items-center ml-2 p-1 rounded-xl border shadow-sm backdrop-blur-md relative",
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
                         onClick={(e) => { e.stopPropagation(); setShowSupremeSimulator(true); }}
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
                  className="bg-purple-600 border-b border-purple-800 overflow-hidden relative z-30 shadow-md"
                >
                  <div className="max-w-7xl mx-auto px-8 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 animate-pulse">
                        <Shield className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest text-white/90 uppercase mb-0.5">MODO DE SIMULAÇÃO ATIVO — AMBIENTE 100% SIMULADO</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-white shadow-sm">
                          <span>{finalUser?.role}</span>
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
                                 await updateDoc(doc(db, 'users', user.uid), confirmUpdate);
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
                         onClick={() => setShowSupremeSimulator(true)}
                         className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm ml-2"
                       >
                         Ajustar Simulação
                       </button>
                       <button 
                         onClick={() => setSimulationState(prev => ({ ...prev, isActive: false, marioneteNazarick: null }))}
                         className="px-4 py-1.5 rounded-lg bg-white text-purple-700 hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest transition-colors shadow-md"
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
                    />
                  )}
                  {view === 'evolution' && <Evolution user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} activeFragment={currentFragment} />}
                  {view === 'library' && <Library user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} />}
                  {view === 'strategy' && <Strategy user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} />}
                  {view === 'scheduling' && <Scheduling user={finalUser} profile={activeProfile!} isDarkMode={isDarkMode} />}
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
                      <p className="text-sm text-slate-500 italic max-w-sm text-center font-medium">Os artesãos de Nazarick estão calibrando este setor. Disponível em breve no CREA.OS.</p>
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
    </AnimatePresence>

      {/* Global Cinematic Intro Layer */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden",
              isDarkMode ? "bg-slate-950" : "bg-white"
            )}
          >
            {/* Force background color */}
            <style dangerouslySetInnerHTML={{ __html: `body { background-color: ${isDarkMode ? '#020617' : '#ffffff'} !important; }` }} />
            
            {/* Subtle Grid Pattern */}
            <div className={cn(
              "absolute inset-0 opacity-[0.02] pointer-events-none",
              isDarkMode ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" : "bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px]"
            )} />
            
            <div className="relative flex items-center justify-center scale-75 md:scale-100 perspective-1000">
              {/* Spinning HUD Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute w-[700px] h-[700px] border rounded-full border-dashed opacity-[0.05]",
                  isDarkMode ? "border-white/20" : "border-black/20"
                )}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute w-[650px] h-[650px] border-t border-l rounded-full opacity-[0.03]",
                  isDarkMode ? "border-white/20" : "border-black/20"
                )}
              />

              {/* Insignia Background (Ainz Ooal Gown Crest - ABSOLUTE FIDELITY) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.1, rotate: -30 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.1, 1, 1.05, 8],
                  rotate: [-30, 0, 0, 10],
                }}
                transition={{ duration: 3.5, times: [0, 0.2, 0.8, 1], ease: "easeOut" }}
                className={cn(
                  "absolute w-[900px] h-[900px] pointer-events-none flex items-center justify-center",
                  layoutTheme.accentText
                )}
              >
                {/* Aura Layers */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                    filter: ["blur(40px) brightness(1)", "blur(60px) brightness(1.5)", "blur(40px) brightness(1)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={cn("absolute inset-0 rounded-full", layoutTheme.bgDim)}
                />
                
                {/* Particles of Power */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 400, 
                      y: (Math.random() - 0.5) * 400, 
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2, 
                      repeat: Infinity, 
                      delay: Math.random() * 2 
                    }}
                    className={cn("absolute w-2 h-2 rounded-full blur-[2px]", layoutTheme.accentBg)}
                  />
                ))}

                <svg viewBox="0 0 500 500" className={cn(
                  "w-full h-full fill-current relative z-10",
                  layoutTheme.shadowGlow
                )}>
                  <g transform="translate(250, 250)">
                    {/* Central Vertical Spine */}
                    <path d="M -1.5,-210 L 1.5,-210 L 1.5,190 L -1.5,190 Z" />
                    <circle cx="0" cy="-210" r="3" />
                    
                    {[1, -1].map((side) => (
                      <g key={`side-${side}`} transform={`scale(${side}, 1)`}>
                        {/* Recursive Horns/Spikes (Top half) */}
                        <path d="M 5,-190 L 25,-210 L 45,-205 L 55,-180 L 15,-150 Q 80,-175 105,-155 L 115,-130 L 90,-115 L 10,-140 Z" />
                        <path d="M 12,-120 Q 60,-140 95,-100 L 115,-115 L 125,-75 L 105,-65 Z" />
                        
                        {/* Main Body Wings - Jagged & Symmetric */}
                        <path d="M 15,-80 Q 90,-120 120,-80 L 140,-95 L 150,-60 L 130,-50 Q 180,-50 195,-15 L 215,-30 L 220,10 L 185,0 Q 210,30 210,80 L 225,70 L 200,120 L 155,95 Q 130,140 70,165 L 5,145 V 100 Q 50,110 90,80 L 100,50 L 70,70 L 60,30 L 90,25 L 80,-20 L 110,-30 L 100,-70 L 60,-50 L 15,-75 Z" />
                        
                        {/* Decorative Interior Voids */}
                        <path d="M 30,-35 L 55,-15 L 50,25 L 25,45 Z" opacity="0.5" />
                        <path d="M 35,65 L 65,90 L 60,130 L 30,150 Z" opacity="0.5" />
                        
                        {/* Bottom Frame Base */}
                        <path d="M 5,160 Q 95,150 160,120 L 170,140 Q 95,175 5,200 Z" />
                        <path d="M 65,180 V 220 H 75 V 176 Z" />
                        <path d="M 125,155 V 205 H 135 V 148 Z" />
                      </g>
                    ))}
                    
                    {/* Top Spike - Zenith */}
                    <path d="M 0,-215 L 15,-185 H -15 Z" />
                  </g>
                </svg>
              </motion.div>

              {/* Main KC Text with Kinetic Impact */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ 
                  scale: [0.6, 1, 1, 20],
                  opacity: [0, 1, 1, 0],
                  filter: ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(40px)']
                }}
                transition={{ duration: 3.8, times: [0, 0.2, 0.8, 1], ease: [0.19, 1, 0.22, 1] }}
                className="relative z-10 flex flex-col items-center justify-center -mt-10"
              >
                <div className="relative group">
                  <span className={cn(
                    "text-[180px] md:text-[380px] font-overlord select-none leading-none filter relative inline-block tracking-tighter drop-shadow-2xl",
                    isDarkMode ? "text-white" : layoutTheme.textPrimary
                  )}>
                    KC
                    {/* Inner detail for KC */}
                    <span className={cn("absolute inset-0 blur-[10px] scale-95 opacity-50", layoutTheme.accentText)} aria-hidden="true">KC</span>
                  </span>
                </div>

                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
                   transition={{ duration: 3.8, times: [0, 0.25, 0.75, 1] }}
                   className={cn(
                     "mt-6 text-[14px] font-black uppercase font-mono tracking-[1.5em]",
                     layoutTheme.accentText
                   )}
                >
                  NAZARICK_SINC
                </motion.div>
              </motion.div>
            </div>

            {/* Fast Sequential Status Messages */}
            <div className="absolute bottom-32 left-0 w-full flex flex-col items-center gap-2">
               <motion.div
                 animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                 transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.2 }}
                 className={cn("text-[10px] font-mono font-black uppercase tracking-[0.8em] opacity-0", layoutTheme.accentText)}
               >
                 PROTOCOLO_DESPERTAR
               </motion.div>
               <motion.div
                 animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                 transition={{ duration: 0.5, times: [0, 0.5, 1], delay: 0.6 }}
                 className={cn("text-[10px] font-mono font-black uppercase tracking-[0.8em] opacity-0", layoutTheme.accentText)}
               >
                 TUMBA_RECONECTADA
               </motion.div>
            </div>

            {/* Final Transition Veil with Glitch Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0.5, 0] }}
              transition={{ duration: 2.6, times: [0, 0.6, 0.75, 0.85, 0.95, 1] }}
              className={cn(
                "absolute inset-0 z-[10000] pointer-events-none backdrop-blur-sm",
                isDarkMode ? "bg-slate-950" : "bg-white"
              )}
            >
               <motion.div 
                 animate={{ opacity: [0, 1, 0] }}
                 transition={{ duration: 0.2, delay: 1.8 }}
                 className={cn("absolute inset-0 mix-blend-overlay", layoutTheme.bgDim)}
               />
            </motion.div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {showSupremeSimulator && user?.role === NazarickRole.MOMONGA && (
               <SupremeSimulator 
                 realUser={user}
                 simulationState={simulationState}
                 onStartSimulation={(simulatedUser, targetFragment) => {
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
                if (simulationState.isActive) {
                  setSimulationState(prev => ({ ...prev, simulatedFragment: fragment }));
                } else {
                  setActiveFragment(fragment);
                }
              }}
              onClose={() => setShowFragmentSelector(false)}
              isDarkMode={isDarkMode}
              userMode={finalUser?.operationalMode || OperationalMode.NORMAL}
              onChangeMode={async (mode) => {
                if (!user?.uid) return;
                if (simulationState.isActive) {
                  setSimulationState(prev => ({ ...prev, marioneteNazarick: { ...prev.marioneteNazarick, operationalMode: mode } }));
                } else {
                  await updateDoc(doc(db, 'users', user.uid), { operationalMode: mode });
                }
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Content Area uses AnimatePresence mode wait */}
      </AnimatePresence>
    </>
  );
}
