import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { User, Profile, NazarickRole, OperationalMode } from '../../types';
import { Shield, Users, Building2, BarChart3, AlertTriangle, FileText, CheckCircle, ChevronRight, Tag, Edit3, X, Save, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'comando' | 'evolucao' | 'overlord'>('comando');
  const [stats, setStats] = useState({
    usersCount: 0,
    profilesCount: 0,
    activeCampaigns: 5,
    systemHealth: 98,
    aiLoad: 42
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const usersData = snap.docs.map(d => ({ ...d.data(), uid: d.id } as User));
      setUsers(usersData);
      setStats(prev => ({ ...prev, usersCount: snap.size }));
      setLoading(false);
    });

    const fetchProfiles = async () => {
      const pSnap = await getDocs(collection(db, 'profiles'));
      setStats(prev => ({ ...prev, profilesCount: pSnap.size }));
    };

    fetchProfiles();
    return () => unsubUsers();
  }, []);

  const toggleAinzTag = async (userId: string, currentTags: string[] = []) => {
    const userRef = doc(db, 'users', userId);
    const hasTag = currentTags.includes('ainz ooal gown');
    try {
      await updateDoc(userRef, {
        tags: hasTag ? arrayRemove('ainz ooal gown') : arrayUnion('ainz ooal gown')
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `usuários/${userId}`);
    }
  };

  const toggleLevelLimitBreak = async (userId: string, currentLimitBreak: boolean) => {
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        levelLimitBreak: !currentLimitBreak
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `usuários/${userId}`);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const userRef = doc(db, 'users', editingUser.uid);
      await updateDoc(userRef, { ...editingUser });
      setEditingUser(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `usuários/${editingUser.uid}`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Estilizado: Grande Tumba de Nazarick */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-white border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Shield className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-bold text-4xl tracking-tighter uppercase">Grande Tumba de Nazarick</h1>
              <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mt-1 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block">Tumba de Nazarick (Nível Máximo)</p>
            </div>
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm self-start md:self-center overflow-x-auto">
            <button 
              onClick={() => setActiveTab('comando')}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === 'comando' ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"
              )}
            >
              Comando Supremo
            </button>
            <button 
              onClick={() => setActiveTab('evolucao')}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === 'evolucao' ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"
              )}
            >
              Evolução
            </button>
            <button 
              onClick={() => setActiveTab('overlord')}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === 'overlord' ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"
              )}
            >
              OverLord
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'comando' ? (
          <motion.div 
            key="comando"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard icon={Users} label="Subordinados" value={stats.usersCount} sub="Capacidade Nazarick" color="text-indigo-600" bg="bg-indigo-50" />
              <StatCard icon={Building2} label="Domínios" value={stats.profilesCount} sub="Espaços Ativos" color="text-indigo-600" bg="bg-indigo-50" />
              <StatCard icon={CheckCircle} label="Saúde Nazarick" value={`${stats.systemHealth}%`} sub="Status do Trono" color="text-emerald-600" bg="bg-emerald-50" />
              <StatCard icon={BarChart3} label="Carga I.A." value={`${stats.aiLoad}%`} sub="Utilização de Núcleo" color="text-amber-600" bg="bg-amber-50" />
            </div>

            <div className="nazarick-card p-10 bg-white">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Users className="w-5 h-5 text-indigo-600" /> Registro de Subordinados
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 italic">Gestão e controle de permissões de alto escalão</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Entidade</th>
                      <th className="pb-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Tags de Atribuição</th>
                      <th className="pb-4 text-[10px] uppercase font-black text-slate-400 tracking-widest">Métricas Reais</th>
                      <th className="pb-4 text-[10px] uppercase font-black text-slate-400 tracking-widest text-right">Governança</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(u => (
                      <tr key={u.uid} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px] border border-slate-200">
                              {u.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{u.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{u.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {u.tags?.map((t, idx) => (
                              <span key={`${t}-${idx}`} className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                {t}
                              </span>
                            ))}
                            {(!u.tags || u.tags.length === 0) && <span className="text-[9px] text-slate-300 italic">Nenhum rastro</span>}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-4 text-[10px] font-mono">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <span className="text-slate-400 block pb-0.5 leading-none">LVL/XP</span>
                              <span className="font-bold">{u.level} / {u.xp}</span>
                            </div>
                            <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-indigo-600">
                              <span className="text-indigo-400 block pb-0.5 leading-none">RANK</span>
                              <span className="font-bold">{u.rank}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setEditingUser(u)}
                              className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => toggleAinzTag(u.uid, u.tags)}
                              className={cn(
                                "text-[9px] font-black uppercase px-3 py-2 rounded-xl border transition-all flex items-center gap-2",
                                u.tags?.includes('ainz ooal gown') 
                                  ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200" 
                                  : "bg-white border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200"
                              )}
                            >
                              <Tag className="w-3.5 h-3.5" />
                              {u.tags?.includes('ainz ooal gown') ? 'Remover Ainz' : 'Dar Tag Ainz'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'evolucao' ? (
          <motion.div 
            key="evolucao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="nazarick-card p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Ascensão aos 4 Dígitos</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Autorização Supremos: Jogadores Nível 999 aguardando quebra de limite (Level 1000+)</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b text-[10px] uppercase font-black tracking-widest text-slate-400">
                      <th className="py-4 px-6 font-medium">Usuário</th>
                      <th className="py-4 px-6 font-medium">Status Atual</th>
                      <th className="py-4 px-6 font-medium">Decisão Suprema</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter(u => u.level >= 999).length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">
                          Nenhum usuário alcançou o Nível 999 ainda.
                        </td>
                      </tr>
                    )}
                    {users.filter(u => u.level >= 999).map(u => (
                      <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{u.uid.substring(0, 8)}...</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                             <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black font-mono">
                               LVL: {u.level}
                             </span>
                             {u.levelLimitBreak && (
                               <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-black uppercase tracking-widest">
                                 Limite Quebrado
                               </span>
                             )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                           <button 
                             onClick={() => toggleLevelLimitBreak(u.uid, !!u.levelLimitBreak)}
                             className={cn(
                               "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                               u.levelLimitBreak 
                                 ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                 : "bg-indigo-600 text-white shadow-lg border border-indigo-500 hover:bg-indigo-700"
                             )}
                           >
                              {u.levelLimitBreak ? 'Revogar Autorização' : 'Liberar Ascensão'}
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="overlord"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Console Avançado */}
              <div className="lg:col-span-2 nazarick-card p-0 bg-slate-900 border-none shadow-2xl overflow-hidden flex flex-col h-[500px]">
                <div className="bg-slate-800/50 px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Nazarick.OS Terminal</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 animate-pulse">SISTEMA ONLINE</div>
                </div>
                <div className="flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar bg-slate-950">
                  <p className="text-emerald-500 mb-2 font-bold select-none">{"> RUN simulador_nazarick_v.4.1"}</p>
                  <p className="text-slate-400 mb-1 opacity-50 whitespace-pre leading-relaxed">
                    [INFO] Inicializando Núcleo Momonga... [OK]<br/>
                    [INFO] Sincronizando Banco de Dados CREA... [OK]<br/>
                    [INFO] Carregando Modelos de I.A. Preditiva... [OK]<br/>
                    [INFO] Escaneando Vulnerabilidades... [0 AMEAÇAS DETECTADAS]<br/>
                    [INFO] Autorização Confirmada: Ser Supremo Detectado.
                  </p>
                  <p className="text-indigo-400 mt-4 mb-2 font-bold">{"> ANALISAR saúde_sistema"}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-slate-500 block mb-1">LATÊNCIA DATABASE</span>
                      <span className="text-emerald-400 font-bold">12ms - EXCELENTE</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-slate-500 block mb-1">ESTABILIDADE I.A.</span>
                      <span className="text-indigo-400 font-bold">99.99% - ABSOLUTA</span>
                    </div>
                  </div>
                  <p className="text-emerald-500 mt-4 animate-pulse select-none">_</p>
                </div>
              </div>

              {/* Dados Críticos */}
              <div className="space-y-6">
                <div className="nazarick-card p-8 bg-white border-none shadow-xl">
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-6">Controle de Privilégios</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">MODO_DEV</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">ATIVO</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">BYPASS_QUOTA</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">INATIVO</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">ROOT_ACCESS</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">CONCEDIDO</span>
                    </div>
                  </div>
                </div>

                <div className="nazarick-card p-8 bg-indigo-600 text-white border-none shadow-2xl shadow-indigo-200">
                  <h4 className="text-[10px] uppercase font-black text-indigo-200 tracking-widest mb-4">Simulação Interna</h4>
                  <p className="text-sm font-medium mb-6 italic opacity-80 leading-relaxed">"Projete mudanças globais em Nazarick antes de aplicar à base de usuários Pleiades."</p>
                  <button className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-black/20">
                    Iniciar Simulação OS
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusing Edit Modal and other helpers from earlier but with updated Nazarick styling */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 tracking-tight text-xl">Ajuste de Subordinado</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Parâmetros de Nazarick</p>
                  </div>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Identificação</label>
                    <input 
                      type="text" 
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="nazarick-input"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Hierarquia (Atribuição)</label>
                    <select 
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as NazarickRole })}
                      className="nazarick-input"
                    >
                      {Object.values(NazarickRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nível</label>
                    <input 
                      type="number" 
                      value={editingUser.level}
                      onChange={(e) => setEditingUser({ ...editingUser, level: parseInt(e.target.value) })}
                      className="nazarick-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">XP Total</label>
                    <input 
                      type="number" 
                      value={editingUser.xp}
                      onChange={(e) => setEditingUser({ ...editingUser, xp: parseInt(e.target.value) })}
                      className="nazarick-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rank de Batalha</label>
                    <input 
                      type="text" 
                      value={editingUser.rank}
                      onChange={(e) => setEditingUser({ ...editingUser, rank: e.target.value })}
                      className="nazarick-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Karma</label>
                    <input 
                      type="number" 
                      value={editingUser.karma}
                      onChange={(e) => setEditingUser({ ...editingUser, karma: parseInt(e.target.value) })}
                      className="nazarick-input"
                    />
                  </div>

                   <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Frequência Operacional</label>
                    <select 
                      value={editingUser.operationalMode}
                      onChange={(e) => setEditingUser({ ...editingUser, operationalMode: e.target.value as OperationalMode })}
                      className="nazarick-input"
                    >
                      {Object.values(OperationalMode).map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                  >
                    Desconsiderar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all hover:bg-indigo-600 shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Solidificar Dados
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, bg }: any) {
  return (
    <div className="nazarick-card p-6 flex flex-col gap-4 bg-white">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", bg, color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tighter text-slate-900">{value}</p>
        </div>
        <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tighter mt-1 italic">{sub}</p>
      </div>
    </div>
  );
}

function AlertItem({ title, desc, type }: any) {
  const colors = {
    info: "border-blue-100 bg-blue-50/50 text-blue-700",
    warning: "border-amber-100 bg-amber-50/50 text-amber-700",
    danger: "border-red-100 bg-red-50/50 text-red-700"
  };
  return (
    <div className={cn("p-4 border rounded-2xl", colors[type as keyof typeof colors])}>
      <h4 className="text-xs font-bold uppercase mb-1 tracking-tight">{title}</h4>
      <p className="text-[11px] opacity-70 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function ReportLink({ title, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 cursor-pointer transition-all border border-white/10 group">
      <span className="text-xs font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{title}</span>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-400 font-mono">{date}</span>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </div>
    </div>
  );
}
