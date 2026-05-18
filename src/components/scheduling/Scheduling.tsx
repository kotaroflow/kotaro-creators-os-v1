import React, { useState, useEffect } from 'react';
import { User, Profile, OperationalMode } from '../../types';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Info, Hourglass } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLayoutTheme } from '../../lib/theme';
import { initAuth, googleSignIn, getAccessToken } from '../../lib/firebase';

export default function Scheduling({ user, profile, isDarkMode, currentFragment = 'MOMONGA' }: { user: User, profile: Profile, isDarkMode?: boolean, currentFragment?: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [nextEventCountdown, setNextEventCountdown] = useState<string>('');
  
  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode || false);
  const isSimplified = user.operationalMode === OperationalMode.EASY || user.operationalMode === OperationalMode.NORMAL;
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Pad the start with empty slots
  const paddedDays = Array.from({ length: firstDayOfMonth }, () => null);

  useEffect(() => {
    const fetchCalendar = async (token: string) => {
      try {
        const timeMin = new Date().toISOString(); // Only fetch future events
        const timeMax = new Date(currentYear + 1, currentMonth, 0).toISOString();
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=50`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.items || []);
        } else {
          console.error("GCal fetch failed", res.status);
        }
      } catch (err) {
        console.error("GCal fetch error", err);
      }
    };

    const unsubscribe = initAuth(
      (_user, token) => {
        setNeedsAuth(false);
        fetchCalendar(token);
      },
      () => setNeedsAuth(true)
    );
    
    return () => unsubscribe();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nextEvent = events.find((e) => new Date(e.start.dateTime || e.start.date) > now);
      
      if (!nextEvent) {
        setNextEventCountdown('');
        return;
      }

      const eventTime = new Date(nextEvent.start.dateTime || nextEvent.start.date);
      const diffMs = eventTime.getTime() - now.getTime();
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (diffDays > 0) {
        setNextEventCountdown(`${diffDays}d ${diffHrs}h ${diffMins}m`);
      } else {
        setNextEventCountdown(`${diffHrs}h ${diffMins}m ${diffSecs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      const eDate = new Date(e.start.dateTime || e.start.date);
      return eDate.getDate() === day && eDate.getMonth() === currentMonth;
    });
  };
  
  const upcomingEvents = events.filter(e => new Date(e.start.dateTime || e.start.date) >= currentDate);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 transition-all duration-500">
      <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 transition-colors", layoutTheme.border)}>
        <div className="flex items-center gap-4">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors text-white", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className={cn("font-bold text-3xl tracking-tight uppercase transition-colors", layoutTheme.textPrimary)}>Cronograma de Lançamento</h2>
            <p className={cn("text-[10px] uppercase font-black tracking-widest leading-none mt-1", layoutTheme.textSecondary)}>Planejamento para {profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {isSimplified ? (
             <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest animate-pulse transition-colors text-amber-500 border-amber-500/20 bg-amber-500/10")}>
               <Info className="w-3 h-3" /> Modo Somente Visualização
             </div>
           ) : (
             <button className={cn("flex items-center gap-2 px-6 py-3 text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
               <Plus className="w-4 h-4" /> NOVO EVENTO
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className={cn(
             "p-8 border rounded-[32px] transition-all duration-500",
             isDarkMode ? "bg-slate-900 shadow-2xl" : "bg-white shadow-sm",
             layoutTheme.border
           )}>
              <div className="flex items-center justify-between mb-8">
                <h3 className={cn("font-black uppercase text-[11px] tracking-widest transition-colors", layoutTheme.textPrimary)}>{monthName} {currentYear}</h3>
                <div className="flex gap-2">
                  <button className={cn("p-2 rounded-xl transition-all", layoutTheme.hoverBg)}><ChevronLeft className={cn("w-4 h-4", layoutTheme.textSecondary)} /></button>
                  <button className={cn("p-2 rounded-xl transition-all", layoutTheme.hoverBg)}><ChevronRight className={cn("w-4 h-4", layoutTheme.textSecondary)} /></button>
                </div>
              </div>
              
              <div className={cn("grid grid-cols-7 gap-px border overflow-hidden rounded-2xl transition-colors", isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-100", layoutTheme.border)}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d, i) => (
                  <div key={`header-${i}-${d}`} className={cn("p-3 text-center text-[10px] font-black uppercase tracking-widest transition-colors", isDarkMode ? "bg-slate-900" : "bg-slate-50", layoutTheme.textSecondary)}>{d}</div>
                ))}
                {paddedDays.map((_, i) => (
                  <div key={`empty-${i}`} className={cn("p-4 h-24 border-t border-r transition-all duration-300 relative", isDarkMode ? "bg-slate-900/50" : "bg-white/50", layoutTheme.border)} />
                ))}
                {days.map(d => {
                  const dayEvents = getEventsForDay(d);
                  return (
                    <div key={`day-${d}`} className={cn("p-4 min-h-[6rem] border-t border-r transition-all duration-300 relative group overflow-hidden", isDarkMode ? "bg-slate-900" : "bg-white", layoutTheme.border, layoutTheme.hoverBg)}>
                      <span className={cn("text-[10px] font-bold transition-colors", layoutTheme.textSecondary)}>{d}</span>
                      <div className="flex flex-col gap-1 mt-1">
                        {dayEvents.slice(0, 3).map((e, idx) => (
                          <div key={idx} className={cn("p-1 px-1.5 rounded text-[8px] font-bold text-white leading-tight shadow-sm truncate flex flex-col", layoutTheme.accentBg)}>
                            {e.summary}
                            {e.start.dateTime && (
                                <span className="opacity-70 text-[7.5px] scale-90 origin-left mt-[1px]">
                                  {new Date(e.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            )}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className={cn("text-[7px] font-bold mt-0.5", layoutTheme.accentText)}>+ {dayEvents.length - 3} mais</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {needsAuth ? (
             <div className={cn("p-8 border rounded-3xl transition-all duration-500 text-center", isDarkMode ? "bg-slate-900" : "bg-white", layoutTheme.border)}>
               <CalendarIcon className={cn("w-12 h-12 mx-auto mb-4 opacity-50", layoutTheme.accentText)} />
               <h3 className={cn("font-black mb-2 uppercase text-[11px] tracking-widest transition-colors", layoutTheme.textPrimary)}>Google Calendar</h3>
               <p className={cn("text-[10px] mb-6", layoutTheme.textSecondary)}>Conecte seu calendário para sincronizar rituais e lançamentos diretamente com Nazarick.</p>
               <button onClick={handleLogin} disabled={isLoggingIn} className="gsi-material-button mx-auto w-full max-w-[240px]">
                 <div className="gsi-material-button-state"></div>
                 <div className="gsi-material-button-content-wrapper">
                   <div className="gsi-material-button-icon">
                     <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                       <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                       <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                       <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                       <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                       <path fill="none" d="M0 0h48v48H0z"></path>
                     </svg>
                   </div>
                   <span className="gsi-material-button-contents">Sign in with Google</span>
                   <span style="display: none;">Sign in with Google</span>
                 </div>
               </button>
             </div>
           ) : (
             <div className={cn("p-8 border rounded-3xl transition-all duration-500", isDarkMode ? "bg-slate-900" : "bg-white", layoutTheme.border)}>
               <div className="flex items-center justify-between mb-8">
                 <h3 className={cn("font-black uppercase text-[10px] tracking-widest transition-colors", layoutTheme.textPrimary)}>Próximos Alertas</h3>
                 {nextEventCountdown && (
                   <span className={cn("text-[9px] font-mono font-black uppercase flex items-center gap-1.5 px-2.5 py-1 rounded-lg animate-pulse transition-colors text-white", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
                     <Hourglass className="w-3 h-3" /> Faltam {nextEventCountdown}
                   </span>
                 )}
               </div>

               <div className="space-y-4">
                  {upcomingEvents.slice(0, 4).map((e, idx) => {
                    const eDate = new Date(e.start.dateTime || e.start.date);
                    const isToday = eDate.getDate() === currentDate.getDate() && eDate.getMonth() === currentMonth;
                    return (
                      <div key={idx} className="flex gap-4 group">
                         <div className={cn("w-1.5 h-12 rounded-full group-hover:h-14 transition-all", layoutTheme.accentBg)} />
                         <div>
                           <p className={cn("text-xs font-black transition-colors line-clamp-1", layoutTheme.textPrimary)}>{e.summary}</p>
                           <p className={cn("text-[10px] flex items-center gap-1 mt-0.5 font-bold uppercase tracking-widest", layoutTheme.textSecondary)}>
                             <Clock className={cn("w-3 h-3", layoutTheme.accentText)} /> 
                             {isToday ? 'Hoje às ' : `${eDate.getDate()} às `}
                             {e.start.dateTime ? eDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'O dia todo'}
                           </p>
                         </div>
                      </div>
                    )
                  })}
                  {upcomingEvents.length === 0 && (
                    <div className={cn("text-xs font-bold text-center py-4", layoutTheme.textSecondary)}>
                      Nenhum evento futuro encontrado.
                    </div>
                  )}
               </div>
             </div>
           )}

           <div className={cn(
             "p-8 border-dashed border-2 rounded-[32px] transition-all duration-500",
             layoutTheme.bgDim, layoutTheme.borderHoverBase, layoutTheme.accentText
           )}>
             <p className="text-[11px] font-bold mb-4 italic leading-relaxed">
               {isSimplified 
                 ? `"Mantenha o foco no cronograma estabelecido para garantir a constância dos seus domínios."`
                 : `"Ser Supremo, sua sincronia temporal com Google Agenda está em efeito. Planejamento unificado com Nazarick."`
               }
             </p>
             {!isSimplified && <button onClick={() => {}} className={cn("text-[10px] font-black uppercase transition-colors tracking-widest animate-pulse mt-2", layoutTheme.accentText, "hover:text-white")}>Templo Sincronizado</button>}
           </div>
        </div>
      </div>
    </div>
  );
}
