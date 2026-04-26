import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface TopBarProps { title: string; }

export function TopBar({ title }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <header className="h-16 shrink-0 border-b border-border bg-white/80 backdrop-blur-sm flex items-center justify-between px-8">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Nusantara</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-muted-foreground">
          {time.toLocaleTimeString('id-ID')}
        </span>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
}
