import React, { useState, useMemo } from 'react';
import { Dish, DishType } from '../types';
import { dishService } from '../services/dishService';
import { formatIDR } from './Overview';
import { Search, ArrowUpDown, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPE_COLOR: Record<string, string> = {
  [DishType.AYAM]:    'bg-orange-100 text-orange-700 border-orange-200',
  [DishType.SAPI]:    'bg-red-100 text-red-700 border-red-200',
  [DishType.IKAN]:    'bg-blue-100 text-blue-700 border-blue-200',
  [DishType.UDANG]:   'bg-pink-100 text-pink-700 border-pink-200',
  [DishType.TEMPE]:   'bg-amber-100 text-amber-700 border-amber-200',
  [DishType.TAHU]:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  [DishType.TELUR]:   'bg-lime-100 text-lime-700 border-lime-200',
  [DishType.KAMBING]: 'bg-purple-100 text-purple-700 border-purple-200',
  [DishType.NASI]:    'bg-green-100 text-green-700 border-green-200',
  [DishType.KUE]:     'bg-rose-100 text-rose-700 border-rose-200',
  [DishType.MINUMAN]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

interface DishListProps {
  dishes: Dish[];
  onEdit: (dish: Dish) => void;
}

export function DishList({ dishes, onEdit }: DishListProps) {
  const [query,     setQuery]     = useState('');
  const [typeFilter,setTypeFilter]= useState('');
  const [sortField, setSortField] = useState<'dishId' | 'name' | 'price' | 'type'>('dishId');
  const [sortDir,   setSortDir]   = useState<'asc' | 'desc'>('asc');
  const [deleting,  setDeleting]  = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...dishes];
    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.dishId.toLowerCase().includes(q) ||
        d.ingredients.toLowerCase().includes(q)
      );
    }
    // filter type
    if (typeFilter) list = list.filter(d => d.type === typeFilter);
    // sort
    list.sort((a, b) => {
      let av: any = a[sortField], bv: any = b[sortField];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [dishes, query, typeFilter, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleDelete = async (dish: Dish) => {
    if (!confirm(`Delete "${dish.name}"? This cannot be undone.`)) return;
    setDeleting(dish.id);
    try { await dishService.deleteDish(dish.id); }
    finally { setDeleting(null); }
  };

  const SortBtn = ({ field, label }: { field: typeof sortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
        sortField === field ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-primary' : ''}`} />
      {sortField === field && <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, ID, or ingredient…"
            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {Object.values(DishType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
        <span className="text-xs text-muted-foreground ml-auto font-medium">
          {filtered.length} of {dishes.length} dishes
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[80px_1fr_140px_130px_180px_100px] gap-4 px-5 py-3 bg-slate-50 border-b border-border">
          <SortBtn field="dishId"  label="ID" />
          <SortBtn field="name"    label="Dish Name" />
          <SortBtn field="type"    label="Category" />
          <SortBtn field="price"   label="Price" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ingredients</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</span>
        </div>

        {/* Rows */}
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              No dishes found. Try adjusting your search.
            </div>
          ) : (
            filtered.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="grid grid-cols-[80px_1fr_140px_130px_180px_100px] gap-4 px-5 py-3.5 border-b border-border last:border-0 items-center hover:bg-slate-50/50 transition-colors group"
              >
                <span className="text-xs font-mono font-bold text-primary">{dish.dishId}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground truncate">{dish.name}</p>
                  {dish.introduction && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-xs">{dish.introduction}</p>
                  )}
                </div>
                <span className={`inline-flex w-fit text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_COLOR[dish.type] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {dish.type}
                </span>
                <span className="text-sm font-bold text-emerald-600 font-mono">{formatIDR(dish.price)}</span>
                <p className="text-xs text-muted-foreground truncate">{dish.ingredients}</p>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(dish)}
                    className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(dish)}
                    disabled={deleting === dish.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
