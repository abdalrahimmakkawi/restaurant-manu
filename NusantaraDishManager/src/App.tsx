import React, { useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser } from './lib/supabase';
import { Login }        from './components/Login';
import { Sidebar }      from './components/Sidebar';
import { TopBar }       from './components/TopBar';
import { Overview }     from './components/Overview';
import { DishList }     from './components/DishList';
import { ImportExport } from './components/ImportExport';
import { DishForm }     from './components/DishForm';
import { dishService }  from './services/dishService';
import { Dish }         from './types';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TAB_LABELS: Record<string, string> = {
  overview:  'Overview',
  inventory: 'Inventory',
  search:    'Search & Sort',
  import:    'Data Management',
  settings:  'Settings',
};

const TAB_SUBS: Record<string, string> = {
  overview:  'Real-time synchronization active for your culinary database.',
  inventory: 'Efficiently manage and monitor your menu items.',
  search:    'Locate specific items with intelligent criteria filters.',
  import:    'Import dishes, export CSV, or load sample data.',
  settings:  'Customize your operational environment.',
};

export default function App() {
  const [user,        setUser]       = useState<any>(null);
  const [loading,     setLoading]    = useState(true);
  const [activeTab,   setActiveTab]  = useState('overview');
  const [dishes,      setDishes]     = useState<Dish[]>([]);
  const [isFormOpen,  setIsFormOpen] = useState(false);
  const [editingDish, setEditing]    = useState<Dish | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const user = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };
    
    initializeAuth();
    
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setDishes([]); return; }
    const unsub = dishService.subscribeToDishes(setDishes);
    return () => unsub();
  }, [user]);

  const handleEdit    = (dish: Dish) => { setEditing(dish); setIsFormOpen(true); };
  const handleAddNew  = ()            => { setEditing(null); setIsFormOpen(true); };
  const handleClose   = ()            => { setIsFormOpen(false); setEditing(null); };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <UtensilsCrossed className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm font-medium">Initializing Nusantara…</p>
      </div>
    );
  }

  if (!user) return <Login />;

  const showAddBtn = ['overview', 'inventory', 'search'].includes(activeTab);
  const tabTitle   = TAB_LABELS[activeTab] || activeTab;
  const username   = user.displayName?.split(' ')[0] || 'Admin';

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar title={tabTitle} />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">

            {/* Page header */}
            <header className="flex items-start justify-between mb-8">
              <div>
                <motion.h2
                  key={activeTab}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-extrabold text-foreground tracking-tight"
                >
                  {activeTab === 'overview' ? `Welcome back, ${username}` : tabTitle}
                </motion.h2>
                <p className="text-muted-foreground text-sm mt-1">{TAB_SUBS[activeTab]}</p>
              </div>

              {showAddBtn && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all text-sm group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Add Dish
                </motion.button>
              )}
            </header>

            {/* Page content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview'  && <Overview  dishes={dishes} />}
                {activeTab === 'inventory' && <DishList  dishes={dishes} onEdit={handleEdit} />}
                {activeTab === 'search'    && <DishList  dishes={dishes} onEdit={handleEdit} />}
                {activeTab === 'import'    && <ImportExport />}
                {activeTab === 'settings'  && (
                  <div className="bg-white border border-border rounded-2xl p-20 text-center shadow-sm">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UtensilsCrossed className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="font-bold text-foreground">Settings Coming Soon</p>
                    <p className="text-sm text-muted-foreground mt-1">System preferences are managed by organization admins.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </main>

      <DishForm isOpen={isFormOpen} onClose={handleClose} editingDish={editingDish} />
    </div>
  );
}
