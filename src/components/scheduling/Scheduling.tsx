import React, { useMemo, useState, useEffect } from 'react';
import { User, Profile, OperationalMode } from '../../types';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Info, Hourglass, PlugZap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLayoutTheme } from '../../lib/theme';

interface InternalEvent {
  id: string;
  summary: string;
  startsAt: string;
}

export default function Scheduling({ user, profile, isDarkMode, currentFragment = 'MOMONGA' }: { user: User, profile: Profile, isDarkMode?: boolean, currentFragment?: string }) {
  const [nextEventCountdown, setNextEventCountdown] = useState<string>('');

  const layoutTheme = getLayoutTheme(currentFragment, isDarkMode || false);
  const isSimplified = user.operationalMode === OperationalMode.EASY || user.operationalMode === OperationalMode.NORMAL;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

  const events = useMemo<InternalEvent[]>(() => {
    const buildDate = (dayOffset: number, hour: number, minute = 0) => {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      date.setHours(hour, minute, 0, 0);
      return date.toISOString();
    };

    return [
      { id: 'ygn-review', summary: 'Revisao de cards YGN', startsAt: buildDate(1, 10) },
      { id: 'ygn-content', summary: `Planejamento de conteudo - ${profile.name}`, startsAt: buildDate(2, 15, 30) },
      { id: 'ygn-data', summary: 'Auditoria de metricas reais', startsAt: buildDate(5, 9) },
    ];
  }, [profile.name]);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddedDays = Array.from({ length: firstDayOfMonth }, () => null);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nextEvent = events.find((event) => new Date(event.startsAt) > now);

      if (!nextEvent) {
        setNextEventCountdown('');
        return;
      }

      const eventTime = new Date(nextEvent.startsAt);
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

  const getEventsForDay = (day: number) =>
    events.filter((event) => {
      const eventDate = new Date(event.startsAt);
      return eventDate.getDate() === day && eventDate.getMonth() === currentMonth;
    });

  const upcomingEvents = events.filter((event) => new Date(event.startsAt) >= currentDate);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 transition-all duration-500">
      <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 transition-colors", layoutTheme.border)}>
        <div className="flex items-center gap-4">
          <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center shadow-xl transition-colors text-white", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className={cn("font-bold text-3xl uppercase transition-colors", layoutTheme.textPrimary)}>Cronograma YGN</h2>
            <p className={cn("text-[10px] uppercase font-black tracking-widest leading-none mt-1", layoutTheme.textSecondary)}>Planejamento interno para {profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSimplified ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest animate-pulse transition-colors text-amber-500 border-amber-500/20 bg-amber-500/10">
              <Info className="w-3 h-3" /> Modo somente visualizacao
            </div>
          ) : (
            <button className={cn("flex items-center gap-2 px-6 py-3 text-white rounded-lg text-[10px] font-black transition-all uppercase tracking-widest", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
              <Plus className="w-4 h-4" /> Novo evento interno
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={cn(
            "p-8 border rounded-lg transition-all duration-500",
            isDarkMode ? "glass-panel shadow-2xl" : "glass-panel-light shadow-sm",
            layoutTheme.border
          )}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={cn("font-black uppercase text-[11px] tracking-widest transition-colors", layoutTheme.textPrimary)}>{monthName} {currentYear}</h3>
              <div className="flex gap-2">
                <button className={cn("p-2 rounded-lg transition-all", layoutTheme.hoverBg)}><ChevronLeft className={cn("w-4 h-4", layoutTheme.textSecondary)} /></button>
                <button className={cn("p-2 rounded-lg transition-all", layoutTheme.hoverBg)}><ChevronRight className={cn("w-4 h-4", layoutTheme.textSecondary)} /></button>
              </div>
            </div>

            <div className={cn("grid grid-cols-7 gap-px border overflow-hidden rounded-lg transition-colors", isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-100", layoutTheme.border)}>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((dayName) => (
                <div key={dayName} className={cn("p-3 text-center text-[10px] font-black uppercase tracking-widest transition-colors", isDarkMode ? "bg-slate-900" : "bg-slate-50", layoutTheme.textSecondary)}>{dayName}</div>
              ))}
              {paddedDays.map((_, index) => (
                <div key={`empty-${index}`} className={cn("p-4 h-24 border-t border-r transition-all duration-300 relative", isDarkMode ? "bg-slate-900/50" : "bg-white/50", layoutTheme.border)} />
              ))}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div key={`day-${day}`} className={cn("p-4 min-h-[6rem] border-t border-r transition-all duration-300 relative group overflow-hidden", isDarkMode ? "bg-slate-900" : "bg-white", layoutTheme.border, layoutTheme.hoverBg)}>
                    <span className={cn("text-[10px] font-bold transition-colors", layoutTheme.textSecondary)}>{day}</span>
                    <div className="flex flex-col gap-1 mt-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className={cn("p-1 px-1.5 rounded text-[8px] font-bold text-white leading-tight shadow-sm truncate flex flex-col", layoutTheme.accentBg)}>
                          {event.summary}
                          <span className="opacity-70 text-[7.5px] scale-90 origin-left mt-[1px]">
                            {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
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
          <div className={cn("p-8 border rounded-lg transition-all duration-500", isDarkMode ? "glass-panel" : "glass-panel-light", layoutTheme.border)}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={cn("font-black uppercase text-[10px] tracking-widest transition-colors", layoutTheme.textPrimary)}>Proximos alertas</h3>
              {nextEventCountdown && (
                <span className={cn("text-[9px] font-mono font-black uppercase flex items-center gap-1.5 px-2.5 py-1 rounded-lg animate-pulse transition-colors text-white", layoutTheme.accentBg, layoutTheme.shadowGlow)}>
                  <Hourglass className="w-3 h-3" /> Faltam {nextEventCountdown}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {upcomingEvents.slice(0, 4).map((event) => {
                const eventDate = new Date(event.startsAt);
                const isToday = eventDate.getDate() === currentDate.getDate() && eventDate.getMonth() === currentMonth;
                return (
                  <div key={event.id} className="flex gap-4 group">
                    <div className={cn("w-1.5 h-12 rounded-full group-hover:h-14 transition-all", layoutTheme.accentBg)} />
                    <div>
                      <p className={cn("text-xs font-black transition-colors line-clamp-1", layoutTheme.textPrimary)}>{event.summary}</p>
                      <p className={cn("text-[10px] flex items-center gap-1 mt-0.5 font-bold uppercase tracking-widest", layoutTheme.textSecondary)}>
                        <Clock className={cn("w-3 h-3", layoutTheme.accentText)} />
                        {isToday ? 'Hoje as ' : `${eventDate.getDate()} as `}
                        {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cn("p-8 border rounded-lg transition-all duration-500", isDarkMode ? "glass-panel" : "glass-panel-light", layoutTheme.border)}>
            <div className="flex items-center gap-3 mb-4">
              <PlugZap className={cn("w-5 h-5", layoutTheme.accentText)} />
              <h3 className={cn("font-black uppercase text-[10px] tracking-widest", layoutTheme.textPrimary)}>Conectores externos pausados</h3>
            </div>
            <p className={cn("text-[11px] font-bold leading-relaxed", layoutTheme.textSecondary)}>
              Sincronizacao direta por conta externa esta fora do escopo atual. O YGGNAROK fica com agenda interna ate a camada de dados e agentes estar pronta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
