import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { User, Profile, NazarickRole, SIMULATION_PROFILE_ID, createSimulationProfile } from '../../types';
import { Plus, LogOut, Sparkles, Building2, ChevronRight, Edit2, Trash2, X, Save, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '../../lib/utils';


const DEMO_PROFILES_KEY = 'ygn.presentation.profiles';

const defaultProfiles = (userId: string): Profile[] => [
  {
    id: 'demo-profile-ygn',
    name: 'YGGNAROK Core',
    niche: 'Conteudo e IA',
    objective: 'Planejar, criar e organizar conteudos de alto impacto',
    socialAccounts: {},
    ownerId: userId,
    memberIds: [userId],
    managerIds: [userId],
    editorIds: [],
    viewerIds: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-profile-nazarick',
    name: 'Nazarick Studio',
    niche: 'Estrategia',
    objective: 'Transformar ideias em campanhas e roteiros',
    socialAccounts: {},
    ownerId: userId,
    memberIds: [userId],
    managerIds: [userId],
    editorIds: [],
    viewerIds: [],
    createdAt: new Date().toISOString()
  }
];

const normalizeProfileAccess = (profile: Profile): Profile => {
  const memberIds = Array.from(new Set([
    profile.ownerId,
    ...(profile.memberIds || []),
    ...(profile.managerIds || []),
    ...(profile.editorIds || []),
    ...(profile.viewerIds || []),
  ].filter(Boolean)));

  return {
    ...profile,
    name: profile.name === 'Kotaro Creators' ? 'YGGNAROK Core' : profile.name,
    memberIds,
    managerIds: profile.managerIds || (profile.ownerId ? [profile.ownerId] : []),
    editorIds: profile.editorIds || [],
    viewerIds: profile.viewerIds || [],
  };
};

const canAccessProfile = (profile: Profile, user: User) => {
  if (user.role === NazarickRole.MOMONGA) return true;
  const normalized = normalizeProfileAccess(profile);
  return normalized.ownerId === user.uid
    || normalized.memberIds?.includes(user.uid)
    || normalized.managerIds?.includes(user.uid)
    || normalized.editorIds?.includes(user.uid)
    || normalized.viewerIds?.includes(user.uid)
    || user.managedProfileIds?.includes(normalized.id);
};

const readLocalProfiles = (userId: string): Profile[] => {
  const saved = localStorage.getItem(DEMO_PROFILES_KEY);
  if (!saved) {
    const profiles = defaultProfiles(userId);
    localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(profiles));
    return profiles;
  }

  try {
    const parsed = JSON.parse(saved) as Profile[];
    const migrated = (parsed.length > 0 ? parsed : defaultProfiles(userId)).map(normalizeProfileAccess);
    localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    const profiles = defaultProfiles(userId);
    localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(profiles));
    return profiles;
  }
};

const writeLocalProfiles = (profiles: Profile[]) => {
  localStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(profiles));
};
interface ProfileSelectorProps {
  user: User;
  onSelect: (profile: Profile) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function ProfileSelector({ user, onSelect, onLogout, isDarkMode, onToggleDarkMode }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [newProfile, setNewProfile] = useState({ name: '', niche: '', objective: '' });
  const isPresentationMode = user.uid === 'presentation-user';

  useEffect(() => {
    if (isPresentationMode) {
      setProfiles(readLocalProfiles(user.uid));
      return;
    }

    const profilesRef = collection(db, 'profiles');

    const unsub = onSnapshot(profilesRef, (snapshot) => {
      const pList = snapshot.docs
        .map(doc => normalizeProfileAccess({ id: doc.id, ...doc.data() } as Profile))
        .filter(profile => canAccessProfile(profile, user));
      setProfiles(pList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'profiles');
    });
    return unsub;
  }, [isPresentationMode, user.uid, user.role]);

  const handleSelect = (profile: Profile) => {
    onSelect(profile);
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const profilesPath = 'profiles';
    try {
      if (isPresentationMode) {
        const profile: Profile = {
          ...newProfile,
          id: `local-${Date.now()}`,
          ownerId: user.uid,
          memberIds: [user.uid],
          managerIds: [user.uid],
          editorIds: [],
          viewerIds: [],
          socialAccounts: {},
          createdAt: new Date().toISOString()
        };
        const nextProfiles = [...profiles, profile];
        setProfiles(nextProfiles);
        writeLocalProfiles(nextProfiles);
        setIsCreating(false);
        setNewProfile({ name: '', niche: '', objective: '' });
        return;
      }

      const profileRef = doc(collection(db, profilesPath));
      await setDoc(profileRef, {
        ...newProfile,
        id: profileRef.id,
        ownerId: user.uid,
        memberIds: [user.uid],
        managerIds: [user.uid],
        editorIds: [],
        viewerIds: [],
        socialAccounts: {},
        createdAt: new Date().toISOString()
      });
      
      await setDoc(doc(db, 'profiles', profileRef.id, 'access', user.uid), {
        userId: user.uid,
        profileId: profileRef.id,
        accessLevel: 'Owner',
        userName: user.name,
        userEmail: user.email
      });

      setIsCreating(false);
      setNewProfile({ name: '', niche: '', objective: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, profilesPath);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    try {
      if (isPresentationMode) {
        const nextProfiles = profiles.map((profile) => (
          profile.id === editingProfile.id ? editingProfile : profile
        ));
        setProfiles(nextProfiles);
        writeLocalProfiles(nextProfiles);
        setEditingProfile(null);
        return;
      }

      await updateDoc(doc(db, 'profiles', editingProfile.id), { ...editingProfile });
      setEditingProfile(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `profiles/${editingProfile.id}`);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja apagar este domínio? Esta ação é irreversível.')) return;
    try {
      if (isPresentationMode) {
        const nextProfiles = profiles.filter((profile) => profile.id !== id);
        setProfiles(nextProfiles);
        writeLocalProfiles(nextProfiles);
        setEditingProfile(null);
        return;
      }

      await deleteDoc(doc(db, 'profiles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `profiles/${id}`);
    }
  };

  const isSupreme = user.role === NazarickRole.MOMONGA;
  const visibleProfiles = isSupreme
    ? [createSimulationProfile(user.uid), ...profiles.filter((profile) => profile.id !== SIMULATION_PROFILE_ID)]
    : profiles;

  return (
    <div className={cn(
      "min-h-screen w-full flex flex-col items-center p-8 pt-24 overflow-x-hidden overflow-y-auto relative transition-colors duration-300 select-none ygn-os-body",
      isDarkMode ? "ygn-bg-dark text-white" : "ygn-bg-light text-slate-900"
    )}>
      {/* Background Fill to prevent white edges during bounce/scroll */}
      <div className={cn(
        "fixed inset-0 z-[-1] transition-colors duration-300",
        isDarkMode ? "ygn-bg-dark" : "ygn-bg-light"
      )} />
      {/* Dark Mode Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={onToggleDarkMode}
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
              isDarkMode ? "bg-slate-700 ml-auto" : "bg-white"
            )}
          >
            <motion.span 
              key={isDarkMode ? 'dark' : 'light'}
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className={cn("text-[10px] font-black", isDarkMode ? "text-white" : "text-slate-700")}
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
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.36, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h1 className={cn("text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase transition-colors duration-500", isDarkMode ? "text-white" : "text-slate-900")}>Identidade Operacional</h1>
        <p className={cn("font-black uppercase text-[10px] tracking-[0.6em] transition-colors duration-500", isDarkMode ? "text-slate-500" : "text-slate-400")}>
          {isSupreme ? "Gerenciar perfis e sandbox" : "Acessar perfil autorizado"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-16 max-w-7xl w-full px-4 justify-items-center">
        {visibleProfiles.map((profile, i) => {
          const isSimulationProfile = profile.id === SIMULATION_PROFILE_ID;
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + (i * 0.035), duration: 0.32, ease: "easeOut" }}
              className="flex flex-col items-center group cursor-pointer w-full max-w-[280px]"
              onClick={() => handleSelect(profile)}
            >
              <div className="relative mb-8 w-full aspect-square">
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "absolute inset-0 rounded-[3rem] flex flex-col items-center justify-center overflow-hidden border-2 transition-colors duration-200",
                    isSimulationProfile
                      ? isDarkMode
                        ? "glass-panel border-white/12 group-hover:border-white/24"
                        : "glass-panel-light border-white/70 group-hover:border-white"
                      : isDarkMode
                      ? "glass-panel border-white/10 group-hover:border-white/20"
                      : "glass-panel-light border-white/70 group-hover:border-white"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Hexagon Blueprint Pattern (subtle) */}
                  <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] bg-[size:16px_16px]" />
                  
                  <Building2 className={cn("w-14 h-14 md:w-20 md:h-20 mb-4 transition-colors duration-200 relative z-10", isSimulationProfile ? "text-slate-400 group-hover:text-slate-100" : isDarkMode ? "text-slate-500 group-hover:text-slate-200" : "text-slate-300 group-hover:text-slate-700")} />
                  
                  <div className="text-center px-6 relative z-10">
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.25em] transition-colors mb-1", isDarkMode ? "text-slate-500 group-hover:text-slate-200" : "text-slate-400 group-hover:text-slate-700")}>
                      {profile.niche}
                    </p>
                    <p className={cn("text-[8px] font-medium uppercase tracking-[0.1em] opacity-40 line-clamp-1 group-hover:opacity-80 transition-opacity", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                      {profile.objective || 'Diretriz não definida'}
                    </p>
                  </div>

                  {/* Tech Corner Accents */}
                  <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/0 group-hover:border-white/45 transition-colors" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/0 group-hover:border-white/45 transition-colors" />

                  {!isSimulationProfile && (profile.ownerId === user.uid || isSupreme) && (
                    <div className="absolute top-5 right-5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingProfile(profile); }}
                        className={cn(
                          "ygn-icon-button border opacity-0 group-hover:opacity-100 transition-opacity",
                          isDarkMode ? "glass-control border-white/10 text-slate-400 hover:text-white" : "glass-control border-white/70 text-slate-400 hover:text-slate-900"
                        )}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
              <span className={cn("text-2xl font-black transition-colors uppercase tracking-[0.25em] leading-none mb-2 text-center", isDarkMode ? "text-white" : "text-slate-900")}>{profile.name}</span>
              <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] transition-colors", isDarkMode ? "text-slate-500" : "text-slate-400")}>Nivel Identificado</span>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + (visibleProfiles.length * 0.035), duration: 0.32, ease: "easeOut" }}
          className="flex flex-col items-center group cursor-pointer w-full max-w-[240px]"
          onClick={() => setIsCreating(true)}
        >
          <div className="relative mb-8 w-full aspect-square">
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "absolute inset-0 rounded-[3rem] border-2 border-dashed flex items-center justify-center transition-colors duration-200",
                isDarkMode
                  ? "border-white/10 glass-panel hover:border-white/20 shadow-inner"
                  : "border-white/70 glass-panel-light hover:border-white"
              )}
            >
              <Plus className={cn("w-14 h-14 md:w-20 md:h-20 transition-colors", isDarkMode ? "text-slate-500 group-hover:text-slate-200" : "text-slate-300 group-hover:text-slate-700")} />
            </motion.div>
          </div>
          <span className={cn("text-2xl font-black transition-colors uppercase tracking-[0.25em] mb-2", isDarkMode ? "text-slate-600 group-hover:text-slate-200" : "text-slate-400 group-hover:text-slate-700")}>Novo Perfil</span>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.4em] text-slate-700", isDarkMode ? "text-slate-800" : "text-slate-200")}>Expandir YGN</span>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.28 }}
        className="mt-20 md:mt-32 flex flex-col items-center gap-10"
      >
        <button 
          onClick={onLogout}
          className={cn(
            "flex items-center gap-2 transition-colors font-black uppercase text-[10px] tracking-[0.3em] group",
            isDarkMode ? "text-slate-700 hover:text-red-500" : "text-slate-300 hover:text-red-500"
          )}
        >
          <LogOut className="w-4 h-4" /> Sair do Sistema
        </button>
      </motion.div>

      <div className={cn("absolute top-0 left-0 w-full h-32 pointer-events-none transition-colors duration-500", 
        isDarkMode ? "bg-gradient-to-b from-slate-950/80 to-transparent" : "bg-gradient-to-b from-white/60 to-transparent"
      )} />

      {/* Modals */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setIsCreating(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-lg border rounded-3xl p-10 relative z-10 shadow-2xl transition-colors duration-500",
                isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
              )}
            >
               <h2 className={cn("text-3xl font-black mb-8 tracking-tighter uppercase", isDarkMode ? "text-white" : "text-slate-900")}>Novo Domínio</h2>
               <form onSubmit={handleCreateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Codinome</label>
                  <input 
                    required
                    className={cn(
                      "w-full border rounded-lg p-4 transition-colors outline-none",
                      isDarkMode
                        ? "glass-control border-white/10 text-white placeholder:text-slate-600"
                        : "glass-control border-white/70 text-slate-900 placeholder:text-slate-400"
                    )}
                    placeholder="Ex: Tumba de Ouro"
                    value={newProfile.name}
                    onChange={e => setNewProfile({...newProfile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Setor</label>
                  <input 
                    required
                    className={cn(
                      "w-full border rounded-lg p-4 transition-colors outline-none",
                      isDarkMode
                        ? "glass-control border-white/10 text-white placeholder:text-slate-600"
                        : "glass-control border-white/70 text-slate-900 placeholder:text-slate-400"
                    )}
                    placeholder="Ex: Tecnologia, Finanças"
                    value={newProfile.niche}
                    onChange={e => setNewProfile({...newProfile, niche: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest text-[10px] shadow-lg">Criar Dominio</button>
                  <button type="button" onClick={() => setIsCreating(false)} className={cn("flex-1 font-black py-4 rounded-2xl transition-colors uppercase tracking-widest text-[10px]", isDarkMode ? "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}>Cancelar</button>
                </div>
               </form>
            </motion.div>
          </div>
        )}

        {editingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setEditingProfile(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "w-full max-w-lg border rounded-3xl p-10 relative z-10 shadow-2xl transition-colors duration-500",
                isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-white/70"
              )}
            >
               <div className="flex justify-between items-center mb-8">
                 <h2 className={cn("text-3xl font-black tracking-tighter uppercase", isDarkMode ? "text-white" : "text-slate-900")}>Ajustar Domínio</h2>
                 <button 
                  onClick={() => handleDeleteProfile(editingProfile.id)}
                  className={cn("p-3 rounded-2xl transition-colors", isDarkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-500 hover:bg-red-100")}
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
               </div>
               <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Codinome</label>
                  <input 
                    required
                    className={cn(
                      "w-full border rounded-lg p-4 transition-colors outline-none",
                      isDarkMode
                        ? "glass-control border-white/10 text-white"
                        : "glass-control border-white/70 text-slate-900"
                    )}
                    value={editingProfile.name}
                    onChange={e => setEditingProfile({...editingProfile, name: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest text-[10px] shadow-lg">Salvar Mudancas</button>
                  <button type="button" onClick={() => setEditingProfile(null)} className={cn("flex-1 font-black py-4 rounded-2xl transition-colors uppercase tracking-widest text-[10px]", isDarkMode ? "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}>Descartar</button>
                </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
