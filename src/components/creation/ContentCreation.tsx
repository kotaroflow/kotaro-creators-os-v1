import React, { useState } from 'react';
import { User, Profile, Content } from '../../types';
import { generateContentIdea, refineContent, analyzeUserIdea } from '../../services/geminiService';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles, FileText, Video, MessageSquare, Loader2, Wand2, PlayCircle, Save, CheckCircle2, Type, Send, Lock, AlertCircle, CheckCircle, Search, History, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { getLayoutTheme } from '../../lib/theme';

export default function ContentCreation({ user, profile, onSidebarCollapse, isDarkMode, currentFragment = 'MOMONGA' }: { user: User, profile: Profile, onSidebarCollapse?: (c: boolean) => void, isDarkMode?: boolean, currentFragment?: string }) {
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<'Video' | 'Post' | 'Story'>('Video');
  const [activeTab, setActiveTab] = useState<'Generator' | 'Visual' | 'Subtitles' | 'Drafts'>('Generator');
  const [result, setResult] = useState<any>(null);
  const [ideaAnalysis, setIdeaAnalysis] = useState<any>(null);
  const [isPromptPerfected, setIsPromptPerfected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userIdea, setUserIdea] = useState('');
  const [feedback, setFeedback] = useState('');
  const [drafts, setDrafts] = useState<Content[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const isPresentationMode = user.uid === 'presentation-user';
  const draftsStorageKey = `ygn.presentation.contents.${profile.id}`;
  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode || false);

  // Fetch drafts
  React.useEffect(() => {
    if (isPresentationMode) {
      const saved = localStorage.getItem(draftsStorageKey);
      setDrafts(saved ? JSON.parse(saved) : []);
      return;
    }

    const q = query(
      collection(db, `profiles/${profile.id}/contents`),
      where('status', '==', 'Draft')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setDrafts(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Content)));
    });
    return unsub;
  }, [draftsStorageKey, isPresentationMode, profile.id]);

  const handleAnalyzeIdea = async () => {
    if (!userIdea.trim()) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await analyzeUserIdea(profile, userIdea, user.tags);
      setIdeaAnalysis(data);
      
      // Auto-skip logic for beginner users or simple prompts
      if (data.can_skip_approval) {
        console.log("Benzaiten detectou necessidade de auxílio direto. Ignorando aprovação...");
        handleGenerate();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel analisar a ideia agora.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setSaved(false);
    setIsPromptPerfected(false);
    setErrorMessage('');
    try {
      const data = await generateContentIdea(profile, activeType, userIdea, user.tags);
      setResult(data);
      if (onSidebarCollapse) onSidebarCollapse(true); // Recede sidebar for focus
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel gerar o conteudo agora.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      if (isPresentationMode) {
        const nextDrafts = drafts.filter((draft) => draft.id !== draftId);
        setDrafts(nextDrafts);
        localStorage.setItem(draftsStorageKey, JSON.stringify(nextDrafts));
        return;
      }

      await deleteDoc(doc(db, `profiles/${profile.id}/contents`, draftId));
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, 'conteúdo');
    }
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !result) return;
    
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await refineContent(profile, result, feedback, user.tags);
      setResult(data);
      setFeedback('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel ajustar o conteudo agora.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setLoading(true);
    const contentsPath = `profiles/${profile.id}/contents`;
    try {
      if (isPresentationMode) {
        const contentData: Content = {
          id: `local-content-${Date.now()}`,
          title: result.title,
          type: activeType,
          status: 'Draft',
          script: result.script,
          aiPrompt: JSON.stringify({ hook: result.hook, cta: result.cta })
        };
        const nextDrafts = [contentData, ...drafts];
        setDrafts(nextDrafts);
        localStorage.setItem(draftsStorageKey, JSON.stringify(nextDrafts));
        setSaved(true);
        return;
      }

      const contentRef = doc(collection(db, contentsPath));
      const contentData = {
        id: contentRef.id,
        profileId: profile.id,
        title: result.title,
        type: activeType,
        status: 'Draft' as const,
        script: result.script,
        aiPrompt: JSON.stringify({ hook: result.hook, cta: result.cta }),
        createdAt: serverTimestamp()
      };
      
      await setDoc(contentRef, contentData);
      setSaved(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, contentsPath);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className={cn("text-3xl font-bold tracking-tight group flex items-center gap-2 transition-colors", layoutTheme.textPrimary)}>
             Compositor I.A. Studio <Sparkles className={cn("w-6 h-6 animate-pulse", layoutTheme.accentText)} />
           </h2>
           <p className="text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em] mt-1">Criação de Ativos Multimodais</p>
        </div>
        <div className={cn("flex p-1 rounded-xl shadow-sm border gap-1 transition-colors", isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200")}>
           {(['Video', 'Post', 'Story'] as const).map(type => (
              <button 
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                  activeType === type 
                    ? cn("text-white shadow-lg", layoutTheme.accentBg, layoutTheme.shadowGlow) 
                    : isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {type === 'Video' ? 'Vídeo Curto' : type === 'Post' ? 'Postagem' : type}
              </button>
           ))}
        </div>
      </div>

      <div className={cn("flex gap-6 border-b mb-8 overflow-x-auto scrollbar-hide transition-colors", isDarkMode ? "border-white/5" : "border-slate-100")}>
        {(['Generator', 'Visual', 'Subtitles', 'Drafts'] as const).map(tab => {
          const isLocked = tab !== 'Generator' && tab !== 'Drafts' && !isPromptPerfected;
          return (
            <button
              key={tab}
              disabled={isLocked}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 whitespace-nowrap",
                activeTab === tab 
                  ? layoutTheme.accentText 
                  : isDarkMode ? "text-slate-600 hover:text-slate-400" : "text-slate-400 hover:text-slate-600",
                isLocked && "cursor-not-allowed opacity-30"
              )}
            >
              {isLocked && <Lock className="w-3 h-3" />}
              {tab === 'Generator' ? 'Gerador de Ideias' : tab === 'Visual' ? 'Visual Composer' : tab === 'Subtitles' ? 'Legendagem I.A.' : 'Rascunhos'}
              {tab === 'Drafts' && drafts.length > 0 && (
                <span className={cn("ml-1 text-[8px] px-1.5 py-0.5 rounded-full transition-colors", isDarkMode ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500")}>{drafts.length}</span>
              )}
              {activeTab === tab && (
                <motion.div layoutId="activeTabCreation" className={cn("absolute bottom-0 left-0 right-0 h-0.5", layoutTheme.accentBg)} />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cn(
          "p-10 border flex flex-col justify-center items-center text-center space-y-6 min-h-[500px] rounded-3xl transition-all duration-500",
          isDarkMode ? "glass-panel border-white/5 shadow-black/30 shadow-2xl" : "glass-panel-light border-slate-200/60 shadow-sm"
        )}>
           {activeTab === 'Generator' ? (
              <>
                 <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner transition-colors", layoutTheme.bgDim, layoutTheme.accentText)}>
                   <Wand2 className={`w-10 h-10 ${loading ? 'animate-spin' : ''}`} />
                 </div>
                 
                 <div className="max-w-sm w-full space-y-4">
                   <div className="text-center">
                     <h3 className={cn("font-bold text-xl mb-2 tracking-tight transition-colors", isDarkMode ? "text-white" : "text-slate-900")}>Arquitetura de Conteúdo</h3>
                     <p className="text-slate-500 text-sm italic leading-relaxed">
                       Manifeste sua ideia para que o motor Benzaiten a refine.
                     </p>
                   </div>

                   <textarea 
                     value={userIdea}
                     onFocus={() => onSidebarCollapse?.(true)}
                     onBlur={() => !userIdea && onSidebarCollapse?.(false)}
                     onChange={(e) => setUserIdea(e.target.value)}
                     placeholder="Descreva sua ideia (ex: Um vídeo sobre como ADMs podem dominar scripts de vendas...)"
                     className={cn(
                       "w-full h-32 p-4 border rounded-2xl text-sm focus:ring-1 focus:border-transparent transition-all resize-none outline-none glass-control",
                       isDarkMode ? "bg-black/40 border-white/5 text-white placeholder:text-slate-700" : "bg-slate-50 border-slate-200 text-slate-900"
                     )}
                   />
                 </div>

                 <div className="w-full space-y-3">
                   {errorMessage && (
                     <div className={cn(
                       "p-4 rounded-2xl border text-[11px] font-bold leading-relaxed text-left",
                       isDarkMode ? "bg-red-950/30 border-red-500/20 text-red-200" : "bg-red-50 border-red-100 text-red-700"
                     )}>
                       {errorMessage}
                     </div>
                   )}

                   {!ideaAnalysis ? (
                     <button 
                       disabled={loading || !userIdea.trim()}
                       onClick={handleAnalyzeIdea}
                       className={cn("w-full py-5 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest rounded-lg text-white transition-all disabled:opacity-50", layoutTheme.accentBg, layoutTheme.shadowLg)}
                     >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                       ANALISAR VIABILIDADE
                     </button>
                   ) : (
                     <button 
                       disabled={loading}
                       onClick={handleGenerate}
                       className={cn("w-full py-5 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest rounded-lg text-white transition-all disabled:opacity-50", layoutTheme.accentBg, layoutTheme.shadowLg)}
                     >
                       {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                       GERAR MANIFESTAÇÃO
                     </button>
                   )}
                   
                   {ideaAnalysis && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className={cn(
                         "p-6 rounded-3xl text-left border relative overflow-hidden group transition-all duration-500 shadow-xl",
                         isDarkMode 
                          ? cn("bg-slate-900 border-white/10", layoutTheme.shadowGlow)
                          : "glass-panel-light border-slate-200/60"
                       )}
                     >
                       {/* Subtle animated background */}
                       <motion.div 
                         animate={{ opacity: isDarkMode ? [0.18, 0.32, 0.18] : [0.12, 0.24, 0.12] }}
                         transition={{ duration: 5, repeat: Infinity }}
                         className={cn("absolute inset-x-6 top-0 h-px -z-10", layoutTheme.accentBg)}
                       />
                       <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                       <div className="flex justify-between items-center mb-4 relative z-10">
                         <div className="flex items-center gap-2">
                           <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", layoutTheme.bgDim)}>
                             <Sparkles className={cn("w-4 h-4 animate-pulse", layoutTheme.accentText)} />
                           </div>
                           <span className={cn(
                             "text-[9px] font-black uppercase tracking-[0.2em]",
                             ideaAnalysis.status === 'Excelente' ? "text-emerald-500" : 
                             ideaAnalysis.status === 'Boa' ? layoutTheme.accentText : "text-amber-500"
                           )}>
                             {ideaAnalysis.status === 'Excelente' ? 'Protocolo_Alfa' : 'Análise_Operacional'}
                           </span>
                         </div>
                         <button onClick={() => setIdeaAnalysis(null)} className={cn("text-[9px] font-black text-slate-500 uppercase tracking-widest transition-colors", layoutTheme.accentTextHover)}>DESCARTAR</button>
                       </div>

                       <p className={cn("text-[13px] leading-relaxed font-medium mb-4 relative z-10 italic", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                         "{ideaAnalysis.reasoning}"
                       </p>

                       {ideaAnalysis.suggested_pivot && (
                         <div className={cn("pt-4 border-t relative z-10 transition-colors", isDarkMode ? "border-white/5" : "border-slate-100")}>
                            <div className="flex items-center gap-2 mb-2">
                              <Wand2 className={cn("w-3 h-3", layoutTheme.accentText)} />
                              <p className={cn("text-[9px] font-black uppercase tracking-widest leading-none", layoutTheme.accentText)}>Sugestão do Soberano:</p>
                            </div>
                            <p className={cn("text-xs font-bold leading-relaxed transition-colors", isDarkMode ? "text-slate-100" : "text-slate-900")}>{ideaAnalysis.suggested_pivot}</p>
                         </div>
                       )}
                     </motion.div>
                   )}
                 </div>
              </>
           ) : activeTab === 'Visual' ? (
              <div className="w-full space-y-6">
                 <div className="aspect-video bg-black rounded-3xl relative overflow-hidden flex items-center justify-center group">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <PlayCircle className="w-16 h-16 text-white relative z-10 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer" />
                   <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
                     <div className={cn("h-full w-1/3", layoutTheme.accentBg)} />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <button className={cn("p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", isDarkMode ? "bg-black/20 border-white/5 text-slate-500 hover:text-white hover:border-slate-700" : "bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200 transition-all")}>Trocar Estilo</button>
                   <button className={cn("p-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", isDarkMode ? "bg-black/20 border-white/5 text-slate-500 hover:text-white hover:border-slate-700" : "bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200 transition-all")}>Mixagem Áudio</button>
                 </div>
                 <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Visual Composer Beta v0.9</p>
              </div>
           ) : activeTab === 'Subtitles' ? (
              <div className="w-full space-y-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <Type className={cn("w-5 h-5", layoutTheme.accentText)} />
                  <h3 className={cn("font-black uppercase text-xs tracking-widest transition-colors", isDarkMode ? "text-white" : "text-slate-800")}>Editor de Legendagem Dinâmica</h3>
                </div>
                <div className="space-y-3">
                  {[
                    "Transforme seu conteúdo em segundos.",
                    "Engajamento 3x maior com legendas.",
                    "IA processando timestamps..."
                  ].map((line, i) => (
                    <div key={i} className={cn("p-4 border rounded-2xl flex items-center justify-between group transition-colors", isDarkMode ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-100")}>
                      <span className={cn("text-xs font-medium transition-colors", isDarkMode ? "text-slate-400" : "text-slate-600")}>00:0{i} - {line}</span>
                      <button className="text-[9px] font-black text-indigo-500 hover:text-white uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">EDITAR</button>
                    </div>
                  ))}
                </div>
                <button className={cn("w-full py-5 border-2 border-dashed rounded-2xl text-[10px] font-black uppercase transition-all", isDarkMode ? "border-white/5 text-slate-600 hover:border-indigo-500/30 hover:text-indigo-400" : "border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-600")}>
                  Importar Áudio para Sincronia
                </button>
              </div>
           ) : (
              <div className="w-full h-full flex flex-col items-start text-left">
                <div className="flex items-center gap-3 mb-6">
                  <History className={cn("w-5 h-5", layoutTheme.accentText)} />
                  <h3 className={cn("font-black uppercase text-xs tracking-widest transition-colors", isDarkMode ? "text-white" : "text-slate-800")}>Rascunhos de Nazarick</h3>
                </div>
                
                {drafts.length === 0 ? (
                  <div className="flex-1 w-full flex flex-col items-center justify-center opacity-20 py-20">
                    <History className="w-12 h-12 mb-4" />
                    <p className="text-[10px] uppercase font-black tracking-widest">Interface Vazia</p>
                  </div>
                ) : (
                  <div className="w-full space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide text-left">
                    {drafts.map((draft) => (
                      <div key={draft.id} className={cn("p-5 border rounded-3xl group transition-all text-left w-full", isDarkMode ? "bg-black/20 border-white/5 hover:border-indigo-500/30" : "bg-slate-50 border-slate-100 hover:border-indigo-200")}>
                        <div className="flex justify-between items-start mb-3">
                           <span className={cn("text-[8px] font-black uppercase text-white px-2 py-0.5 rounded-md shadow-sm", layoutTheme.accentBg)}>{draft.type === 'Video' ? 'Vídeo' : 'Post'}</span>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setResult({ title: draft.title, script: draft.script, ...JSON.parse(draft.aiPrompt) });
                                  setActiveTab('Generator');
                                }}
                                className={cn("p-2 rounded-xl transition-all", isDarkMode ? "text-slate-500 hover:text-white bg-slate-800/50" : "text-slate-400 hover:text-indigo-600 bg-white shadow-sm")}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDraft(draft.id)}
                                className={cn("p-2 rounded-xl transition-all", isDarkMode ? "text-slate-500 hover:text-red-500 bg-slate-800/50" : "text-slate-400 hover:text-red-500 bg-white shadow-sm")}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                        <h4 className={cn("text-xs font-black mb-1 group-hover:text-indigo-500 transition-colors line-clamp-1", isDarkMode ? "text-slate-200" : "text-slate-800")}>{draft.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 italic leading-relaxed font-medium transition-colors">{draft.script}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
           )}
        </div>

        <div className="relative h-full">
            <AnimatePresence mode="wait">
            {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "p-8 h-full space-y-6 flex flex-col border rounded-3xl transition-all duration-500 relative overflow-hidden",
                    isDarkMode ? "glass-panel border-white/10 shadow-black/40 shadow-2xl" : "glass-panel-light border-slate-200/60 shadow-sm"
                  )}
                >
                  {/* Subtle AI Aura */}
                  <motion.div 
                    animate={{ 
                      opacity: isDarkMode ? [0.03, 0.08, 0.03] : [0.01, 0.04, 0.01],
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className={cn("absolute inset-x-8 top-0 h-px pointer-events-none", layoutTheme.accentBg)}
                  />

                  <div className={cn("flex justify-between items-start border-b pb-6 transition-colors relative z-10", isDarkMode ? "border-white/5" : "border-slate-100")}>
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", layoutTheme.bgDim)}>
                        <Sparkles className={cn("w-6 h-6 animate-pulse", layoutTheme.accentText)} />
                      </div>
                      <div>
                        <span className={cn("text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg", layoutTheme.bgDim, layoutTheme.accentText)}>Frequência Supra-Ajustada</span>
                        <h4 className={cn("text-2xl font-black tracking-tighter mt-1 transition-colors", isDarkMode ? "text-white" : "text-slate-900")}>{result.title}</h4>
                      </div>
                    </div>
                  <div className="flex gap-2">
                    {!isPromptPerfected && (
                      <button 
                        onClick={() => setIsPromptPerfected(true)}
                        className={cn("flex items-center gap-2 px-4 py-2 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg", layoutTheme.accentBg, layoutTheme.shadowGlow)}
                      >
                        <CheckCircle className="w-4 h-4" /> Finalizar
                      </button>
                    )}
                    <button 
                      onClick={handleSave}
                      disabled={loading || saved}
                      className={cn(
                        "p-2.5 rounded-xl border transition-all font-bold",
                        saved 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                          : isDarkMode ? "bg-slate-800 border-white/5 text-slate-500 hover:text-white" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                      )}
                    >
                      {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className={cn("p-5 rounded-3xl text-white shadow-xl relative overflow-hidden group", layoutTheme.accentBg, layoutTheme.shadowLg)}>
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-x-4 top-0 h-px bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <p className="text-[9px] opacity-70 uppercase tracking-widest mb-2 font-black flex items-center gap-2 relative z-10">
                      <Sparkles className="w-3 h-3" /> Gancho Sugerido
                    </p>
                    <p className="text-sm font-bold italic leading-relaxed relative z-10">"{result.hook}"</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Roteiro Estratégico</p>
                    <div className={cn(
                      "p-5 rounded-3xl whitespace-pre-wrap font-mono text-[11px] border max-h-[180px] overflow-y-auto scrollbar-hide transition-colors",
                      isDarkMode ? "bg-black/20 border-white/5 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"
                    )}>
                      {result.script}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className={cn("w-4 h-4", layoutTheme.accentText)} />
                      <span className="text-[9px] font-black uppercase tracking-tight leading-none">CTA: <span className="text-white ml-2 opacity-80">{result.cta}</span></span>
                    </div>
                    <button className={cn("text-[9px] font-black hover:text-white transition-colors uppercase tracking-widest", layoutTheme.accentText)}>COPIAR</button>
                  </div>
                </div>

                <div className={cn("pt-4 border-t space-y-6 transition-colors", isDarkMode ? "border-white/5" : "border-slate-100")}>
                  {/* AI Bot Feedback Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-5 rounded-2xl border relative overflow-hidden group shadow-lg",
                      isDarkMode ? "bg-black/40 border-white/10" : "glass-panel-light border-slate-200/60"
                    )}
                  >
                    <motion.div 
                      animate={{ 
                        opacity: [0.05, 0.15, 0.05],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={cn("absolute inset-x-4 top-0 h-px -z-10", layoutTheme.accentBg)}
                    />
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", layoutTheme.bgDim)}>
                        <Sparkles className={cn("w-3.5 h-3.5 animate-pulse", layoutTheme.accentText)} />
                      </div>
                      <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] leading-none", layoutTheme.accentText)}>Protocolo_De_Feedback</p>
                    </div>

                    <p className={cn("text-[11px] leading-relaxed italic font-medium tracking-tight relative z-10", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                       "{result.ai_personality_comment}"
                    </p>
                  </motion.div>

                  <form onSubmit={handleRefine} className="relative">
                    <input 
                      type="text"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Solicitar ajuste estratégico..."
                      className={cn(
                        "w-full pl-4 pr-12 py-4 border rounded-2xl text-xs focus:ring-1 focus:border-transparent outline-none transition-all glass-control",
                        isDarkMode ? "bg-black/40 border-white/5 text-white placeholder:text-slate-700" : "bg-slate-50 border-slate-200 text-slate-900"
                      )}
                    />
                    <button 
                      type="submit"
                      disabled={loading || !feedback.trim()}
                      className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white rounded-xl disabled:opacity-50 transition-all shadow-md", layoutTheme.accentBg, layoutTheme.shadowGlow)}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                className={cn(
                  "p-12 h-full flex flex-col items-center justify-center border-dashed rounded-3xl shadow-none transition-colors",
                  isDarkMode ? "bg-slate-900/10 border-white/5 text-slate-600" : "bg-transparent border-slate-200 text-slate-300"
                )}
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest opacity-40 transition-opacity">Aguardando Comando Estratégico</p>
              </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
