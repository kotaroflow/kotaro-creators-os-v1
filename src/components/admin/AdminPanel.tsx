import React, { useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { BarChart3, Building2, CheckCircle, Edit3, Save, Shield, Tag, TrendingUp, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { NazarickRole, OperationalMode, User } from '../../types';
import { cn } from '../../lib/utils';

type AdminTab = 'comando' | 'evolucao' | 'auditoria';

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'comando', label: 'Comando' },
  { id: 'evolucao', label: 'Evolucao' },
  { id: 'auditoria', label: 'Auditoria' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('comando');
  const [stats, setStats] = useState({
    usersCount: 0,
    profilesCount: 0,
    activeCampaigns: 0,
    systemHealth: 98,
    aiLoad: 42,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const usersData = snap.docs.map((entry) => ({ ...entry.data(), uid: entry.id } as User));
      setUsers(usersData);
      setStats((prev) => ({ ...prev, usersCount: snap.size }));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'usuarios');
    });

    const fetchProfiles = async () => {
      try {
        const pSnap = await getDocs(collection(db, 'profiles'));
        setStats((prev) => ({ ...prev, profilesCount: pSnap.size }));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'profiles');
      }
    };

    fetchProfiles();
    return () => unsubUsers();
  }, []);

  const toggleAinzTag = async (userId: string, currentTags: string[] = []) => {
    const userRef = doc(db, 'users', userId);
    const hasTag = currentTags.includes('ainz ooal gown');
    try {
      await updateDoc(userRef, {
        tags: hasTag ? arrayRemove('ainz ooal gown') : arrayUnion('ainz ooal gown'),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `usuarios/${userId}`);
    }
  };

  const toggleLevelLimitBreak = async (userId: string, currentLimitBreak: boolean) => {
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        levelLimitBreak: !currentLimitBreak,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `usuarios/${userId}`);
    }
  };

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;

    try {
      const userRef = doc(db, 'users', editingUser.uid);
      await updateDoc(userRef, { ...editingUser });
      setEditingUser(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `usuarios/${editingUser.uid}`);
    }
  };

  const highLevelUsers = users.filter((user) => user.level >= 999);

  return (
    <div className="space-y-8 pb-20">
      <section className="glass-panel-light dark:glass-panel relative overflow-hidden rounded-lg border p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/30 bg-white/14 text-slate-200 shadow-inner">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.36em] text-slate-500">Nucleo Admin</p>
              <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">Governanca YGN</h1>
            </div>
          </div>

          <div className="glass-control flex gap-1 rounded-lg border border-white/20 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors',
                  activeTab === tab.id
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'text-slate-500 hover:text-slate-950 dark:hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === 'comando' && (
          <motion.div
            key="comando"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <StatCard icon={Users} label="Usuarios" value={stats.usersCount} sub="Membros registrados" />
              <StatCard icon={Building2} label="Perfis" value={stats.profilesCount} sub="Ambientes ativos" />
              <StatCard icon={CheckCircle} label="Saude" value={`${stats.systemHealth}%`} sub="Estado do nucleo" />
              <StatCard icon={BarChart3} label="Carga I.A." value={`${stats.aiLoad}%`} sub="Leitura interna" />
            </div>

            <section className="glass-panel-light dark:glass-panel rounded-lg border p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Usuarios e permissoes</h2>
                  <p className="mt-1 text-xs font-medium text-slate-500">Base multiusuario do YGGNAROK, preparada para membros confiaveis e varios perfis por usuario.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-white/14 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <th className="pb-4">Usuario</th>
                      <th className="pb-4">Cargo</th>
                      <th className="pb-4">Progresso</th>
                      <th className="pb-4 text-right">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm font-medium text-slate-500">Nenhum usuario sincronizado ainda.</td>
                      </tr>
                    )}
                    {users.map((entry) => (
                      <tr key={entry.uid} className="transition-colors hover:bg-white/8">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/12 text-xs font-black text-slate-500">
                              {entry.name?.charAt(0) || 'Y'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white">{entry.name}</p>
                              <p className="text-[10px] font-mono uppercase text-slate-500">{entry.uid.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-xs font-bold text-slate-500">{entry.role}</td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span className="glass-control rounded-lg border border-white/10 px-2 py-1">Lvl {entry.level}</span>
                            <span className="glass-control rounded-lg border border-white/10 px-2 py-1">XP {entry.xp}</span>
                            <span className="glass-control rounded-lg border border-white/10 px-2 py-1">Rank {entry.rank}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingUser(entry)}
                              className="ygn-icon-button glass-control border border-white/10 text-slate-500 hover:text-slate-950 dark:hover:text-white"
                              title="Editar usuario"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleAinzTag(entry.uid, entry.tags)}
                              className={cn(
                                'flex items-center gap-2 rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-colors',
                                entry.tags?.includes('ainz ooal gown')
                                  ? 'border-white/30 bg-white/18 text-slate-900 dark:text-white'
                                  : 'glass-control border-white/10 text-slate-500 hover:text-slate-950 dark:hover:text-white'
                              )}
                            >
                              <Tag className="h-3.5 w-3.5" />
                              {entry.tags?.includes('ainz ooal gown') ? 'Remover tag' : 'Adicionar tag'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'evolucao' && (
          <motion.div
            key="evolucao"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="glass-panel-light dark:glass-panel rounded-lg border p-6"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/14 text-slate-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Limite de evolucao</h2>
                <p className="text-sm font-medium text-slate-500">Autorizacao manual para usuarios que alcancarem o teto de level.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-white/14 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="pb-4">Usuario</th>
                    <th className="pb-4">Estado</th>
                    <th className="pb-4">Acao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {highLevelUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-sm font-medium text-slate-500">Nenhum usuario alcancou o limite ainda.</td>
                    </tr>
                  )}
                  {highLevelUsers.map((entry) => (
                    <tr key={entry.uid}>
                      <td className="py-4">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{entry.name}</p>
                        <p className="text-[10px] font-mono uppercase text-slate-500">{entry.uid.slice(0, 8)}</p>
                      </td>
                      <td className="py-4">
                        <span className="glass-control rounded-lg border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Level {entry.level} {entry.levelLimitBreak ? 'liberado' : 'bloqueado'}
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => toggleLevelLimitBreak(entry.uid, !!entry.levelLimitBreak)}
                          className="rounded-lg border border-white/15 bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                        >
                          {entry.levelLimitBreak ? 'Revogar' : 'Liberar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'auditoria' && (
          <motion.div
            key="auditoria"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            <AuditCard label="Sandbox" value="Isolado" desc="Simulacao fixa em perfil proprio, sem fragmentos." />
            <AuditCard label="Fragmentos" value="Foco real" desc="MATHEUS, KOTARO e MOMONGA nao alteram simulacao." />
            <AuditCard label="Agentes" value="Funcionais" desc="Sem visual proprio neste ciclo; regras antes de estetica." />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-slate-950/45"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="glass-panel-light dark:glass-panel relative w-full max-w-lg overflow-hidden rounded-lg border"
            >
              <div className="flex items-center justify-between border-b border-white/14 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/12 text-slate-500">
                    <Edit3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Ajustar usuario</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Parametros YGN</p>
                  </div>
                </div>
                <button onClick={() => setEditingUser(null)} className="ygn-icon-button text-slate-500 hover:text-slate-950 dark:hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-5 p-6">
                <Field label="Identificacao">
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(event) => setEditingUser({ ...editingUser, name: event.target.value })}
                    className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                  />
                </Field>

                <Field label="Cargo">
                  <select
                    value={editingUser.role}
                    onChange={(event) => setEditingUser({ ...editingUser, role: event.target.value as NazarickRole })}
                    className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                  >
                    {Object.values(NazarickRole).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Level">
                    <input
                      type="number"
                      value={editingUser.level}
                      onChange={(event) => setEditingUser({ ...editingUser, level: Number(event.target.value) })}
                      className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                    />
                  </Field>
                  <Field label="XP">
                    <input
                      type="number"
                      value={editingUser.xp}
                      onChange={(event) => setEditingUser({ ...editingUser, xp: Number(event.target.value) })}
                      className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                    />
                  </Field>
                  <Field label="Rank">
                    <input
                      type="text"
                      value={editingUser.rank}
                      onChange={(event) => setEditingUser({ ...editingUser, rank: event.target.value })}
                      className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                    />
                  </Field>
                  <Field label="Karma">
                    <input
                      type="number"
                      value={editingUser.karma}
                      onChange={(event) => setEditingUser({ ...editingUser, karma: Number(event.target.value) })}
                      className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                    />
                  </Field>
                </div>

                <Field label="Modo operacional">
                  <select
                    value={editingUser.operationalMode}
                    onChange={(event) => setEditingUser({ ...editingUser, operationalMode: event.target.value as OperationalMode })}
                    className="nazarick-input w-full rounded-lg p-3 text-sm font-bold"
                  >
                    {Object.values(OperationalMode).map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </Field>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-slate-950 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    <Save className="mr-2 inline h-4 w-4" />
                    Salvar
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

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub: string }) {
  return (
    <div className="glass-panel-light dark:glass-panel rounded-lg border p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/12 text-slate-500">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">{sub}</p>
    </div>
  );
}

function AuditCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="glass-panel-light dark:glass-panel rounded-lg border p-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
      <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-slate-950 dark:text-white">{value}</h3>
      <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      {children}
    </label>
  );
}
