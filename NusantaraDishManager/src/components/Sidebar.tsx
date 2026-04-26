import React from 'react';
import { UtensilsCrossed, LayoutDashboard, List, Search, Upload, Settings, LogOut } from 'lucide-react';
import { auth, signOut } from '../lib/firebase';
import { motion } from 'framer-motion';

const NAV = [
  { id: 'overview',   label: 'Overview',      Icon: LayoutDashboard },
  { id: 'inventory',  label: 'Inventory',     Icon: List },
  { id: 'search',     label: 'Search & Sort', Icon: Search },
  { id: 'import',     label: 'Data Import',   Icon: Upload },
  { id: 'settings',   label: 'Settings',      Icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const user = auth.currentUser;
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? 'U';

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-border flex flex-col h-screen">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground leading-tight">Nusantara</p>
            <p className="text-[10px] text-muted-foreground leading-tight">Dish Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {NAV.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary/8 text-primary'
                      : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute left-3 w-0.5 h-5 bg-primary rounded-full"
                    />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : ''}`} />
                  {label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {user?.displayName || 'Admin'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
