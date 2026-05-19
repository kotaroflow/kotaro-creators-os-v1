import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User, Profile, Content, OperationalMode } from '../../types';
import { Library as LibraryIcon, FileText, Video, MessageSquare, Search, Filter, MoreVertical, Download, ExternalLink, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { getLayoutTheme } from '../../lib/theme';

export default function Library({ user, profile, isDarkMode, currentFragment = 'MOMONGA' }: { user: User, profile: Profile, isDarkMode?: boolean, currentFragment?: string }) {
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Video' | 'Post' | 'Story'>('All');

  const isSimplified = user.operationalMode === OperationalMode.EASY || user.operationalMode === OperationalMode.NORMAL;
  const isPresentationMode = user.uid === 'presentation-user';
  const contentsStorageKey = `ygn.presentation.contents.${profile.id}`;
  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode || false);

  useEffect(() => {
    if (isPresentationMode) {
      const saved = localStorage.getItem(contentsStorageKey);
      setContents(saved ? JSON.parse(saved) : []);
      return;
    }

    const q = query(collection(db, 'profiles', profile.id, 'contents'));
    const unsub = onSnapshot(q, (snapshot) => {
      setContents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content)));
    });
    return unsub;
  }, [contentsStorageKey, isPresentationMode, profile.id]);

  const filteredContents = contents.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (c.script || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || c.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 transition-colors", isDarkMode ? "border-white/5" : "border-slate-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors text-white", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
            <LibraryIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className={cn("font-bold text-3xl tracking-tight uppercase transition-colors", isDarkMode ? "text-white" : "text-slate-900")}>Biblioteca de Manifestações</h2>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mt-1">Acervo do Domínio {profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSimplified ? (
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest animate-pulse transition-colors", isDarkMode ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100")}>
              <Info className="w-3 h-3" /> Modo Simples Ativo
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Buscar manifestações..."
                  className={cn(
                    "pl-12 pr-4 py-3 border rounded-2xl text-xs focus:outline-none focus:ring-1 transition-all w-64 uppercase tracking-widest font-bold glass-control",
                    isDarkMode ? "bg-black/40 border-white/5 text-white placeholder:text-slate-700" : "bg-white border-slate-200 text-slate-900"
                  )}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button className={cn("p-3 border rounded-2xl transition-all", isDarkMode ? "bg-slate-900 border-white/5 text-slate-500 hover:text-white" : "bg-white border-slate-200 text-slate-400", layoutTheme.accentTextHover)}>
                <Filter className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {(['All', 'Video', 'Post', 'Story'] as const).map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              activeFilter === f 
                ? cn("text-white shadow-xl", layoutTheme.accentBg, layoutTheme.shadowGlow) 
                : isDarkMode ? "bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
            )}
          >
            {f === 'All' ? 'Tudo' : f === 'Video' ? 'Vídeo' : f === 'Post' ? 'Postagem' : f}
          </button>
        ))}
      </div>

      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "p-8 flex flex-col border transition-all duration-500 group rounded-3xl",
                  isDarkMode ? cn("glass-panel border-white/5 shadow-black/30 shadow-2xl", layoutTheme.borderHoverBase) : cn("glass-panel-light border-slate-200/60 shadow-sm", layoutTheme.borderHoverBase)
                )}
              >
                <div className="flex justify-between items-start mb-8">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg",
                  isDarkMode 
                    ? (content.type === 'Video' ? "bg-red-600/60 shadow-red-900/20" : 
                       content.type === 'Post' ? "bg-blue-600/60 shadow-blue-900/20" : "bg-emerald-600/60 shadow-emerald-900/20")
                    : (content.type === 'Video' ? "bg-red-500/10 text-red-500 shadow-inner" : 
                       content.type === 'Post' ? "bg-blue-500/10 text-blue-500 shadow-inner" : "bg-emerald-500/10 text-emerald-500 shadow-inner")
                )}>
                  {content.type === 'Video' ? <Video className="w-6 h-6" /> : content.type === 'Post' ? <MessageSquare className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                </div>
                  {!isSimplified && (
                    <button className={cn("p-2 rounded-xl transition-all", isDarkMode ? "text-slate-700 hover:text-slate-300" : "text-slate-200 hover:text-slate-600 hover:bg-slate-50")}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <h3 className={cn("font-black mb-2 truncate transition-colors uppercase text-[11px] tracking-widest", isDarkMode ? "text-white" : "text-slate-800", layoutTheme.accentTextGroupHover)}>{content.title}</h3>
                <div className="flex items-center gap-3 mb-6">
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-md",
                    content.status === 'Draft' 
                      ? (isDarkMode ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500") 
                      : "bg-indigo-600 text-white shadow-sm"
                  )}>
                    {content.status === 'Draft' ? 'Rascunho' : 'Publicado'}
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest opacity-60">DOMÍNIO SEGURO</span>
                </div>

                <div className={cn("mt-auto pt-6 border-t flex items-center justify-between transition-colors", isDarkMode ? "border-white/5" : "border-slate-50")}>
                  <div className="flex gap-2">
                    <button className={cn("p-2.5 rounded-xl transition-all", isDarkMode ? "text-slate-500 hover:text-white bg-slate-800/50" : "text-slate-400 hover:text-indigo-600 bg-white shadow-sm")}><Download className="w-4.5 h-4.5" /></button>
                    {!isSimplified && <button className={cn("p-2.5 rounded-xl transition-all", isDarkMode ? "text-slate-500 hover:text-white bg-slate-800/50" : "text-slate-400 hover:text-indigo-600 bg-white shadow-sm")}><ExternalLink className="w-4.5 h-4.5" /></button>}
                  </div>
                  <p className="text-[9px] text-slate-600 font-mono font-bold">SHA: {content.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className={cn(
          "p-24 text-center border-dashed border-2 rounded-[40px] transition-all",
          isDarkMode ? "bg-slate-900/10 border-white/5 text-slate-600" : "bg-transparent border-slate-200 text-slate-300"
        )}>
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-current flex items-center justify-center mx-auto mb-8 opacity-20">
            <LibraryIcon className="w-10 h-10" />
          </div>
          <h3 className={cn("text-xl font-bold mb-2 transition-colors", isDarkMode ? "text-slate-400" : "text-slate-900")}>Acervo Vazio</h3>
          <p className="text-xs font-black uppercase tracking-widest opacity-40">Nenhuma manifestação detectada.</p>
        </div>
      )}
    </div>
  );
}
