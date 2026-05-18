import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Profile } from '../../types';
import { UserPlus, Shield, X, Crown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ManagePermissionsProps {
  profile: Profile;
  onClose: () => void;
}

export default function ManagePermissions({ profile, onClose }: ManagePermissionsProps) {
  const [accessList, setAccessList] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newRole, setNewRole] = useState('Creator');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessPath = `profiles/${profile.id}/access`;
    const q = query(collection(db, accessPath));
    const unsub = onSnapshot(q, (snapshot) => {
      setAccessList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, accessPath);
    });
    return unsub;
  }, [profile.id]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const accessPath = `profiles/${profile.id}/access`;
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', newUserEmail));
      const userSnap = await getDocs(userQuery);
      
      if (userSnap.empty) {
        alert("Usuário não encontrado nos registros do sistema.");
        return;
      }

      const targetUser = userSnap.docs[0].data();
      await setDoc(doc(db, 'profiles', profile.id, 'access', targetUser.uid), {
        userId: targetUser.uid,
        profileId: profile.id,
        accessLevel: newRole,
        userName: targetUser.name,
        userEmail: targetUser.email
      });

      setNewUserEmail('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, accessPath);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (userId === profile.ownerId) {
      alert("O Proprietário não pode ser removido de seu próprio domínio.");
      return;
    }
    const accessPath = `profiles/${profile.id}/access/${userId}`;
    try {
      await deleteDoc(doc(db, 'profiles', profile.id, 'access', userId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, accessPath);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-10 relative z-10"
      >
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <Shield className="w-6 h-6" />
             </div>
             <div>
               <h2 className="font-bold text-2xl tracking-tight text-slate-800 uppercase">Acesso ao Domínio</h2>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Gestão de Permissões: {profile.name}</p>
             </div>
           </div>
           <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleAddUser} className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
           <div className="md:col-span-2">
             <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block font-black">Email do Colaborador</label>
             <input 
              required
              type="email"
              className="nazarick-input py-2"
              placeholder="ex: colab@empresa.com"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
             />
           </div>
           <div>
             <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block font-black">Nível de Acesso</label>
             <select 
              className="nazarick-input py-2"
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
             >
               <option value="Admin">Administrador</option>
               <option value="Editor">Editor</option>
               <option value="Viewer">Visualizador</option>
             </select>
           </div>
           <div className="flex items-end">
             <button 
              disabled={loading}
              className="nazarick-button w-full h-[42px] flex items-center justify-center gap-2"
             >
               <UserPlus className="w-4 h-4" /> Convidar
             </button>
           </div>
        </form>

        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
           {accessList.map(item => (
             <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-600/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    {item.userId === profile.ownerId ? <Crown className="w-5 h-5 text-amber-500" /> : <Users className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.userName || item.userEmail}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{item.accessLevel} {item.userId === profile.ownerId ? '— PROPRIETÁRIO' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => handleRemove(item.userId)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </motion.div>
    </div>
  );
}
