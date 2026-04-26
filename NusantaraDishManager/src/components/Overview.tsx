import React, { useMemo } from 'react';
import { Dish, DishType } from '../types';
import { TrendingUp, Package, Tag, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

// ── Helpers ──────────────────────────────────────────────────────────────────
export function formatIDR(n: number) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
}

const TYPE_COLOR: Record<string, string> = {
  [DishType.AYAM]:    'bg-orange-100 text-orange-700',
  [DishType.SAPI]:    'bg-red-100 text-red-700',
  [DishType.IKAN]:    'bg-blue-100 text-blue-700',
  [DishType.UDANG]:   'bg-pink-100 text-pink-700',
  [DishType.TEMPE]:   'bg-amber-100 text-amber-700',
  [DishType.TAHU]:    'bg-yellow-100 text-yellow-700',
  [DishType.TELUR]:   'bg-lime-100 text-lime-700',
  [DishType.KAMBING]: 'bg-purple-100 text-purple-700',
  [DishType.NASI]:    'bg-green-100 text-green-700',
  [DishType.KUE]:     'bg-rose-100 text-rose-700',
  [DishType.MINUMAN]: 'bg-cyan-100 text-cyan-700',
};

const TYPE_BAR: Record<string, string> = {
  [DishType.AYAM]:    'bg-orange-400',
  [DishType.SAPI]:    'bg-red-400',
  [DishType.IKAN]:    'bg-blue-400',
  [DishType.UDANG]:   'bg-pink-400',
  [DishType.TEMPE]:   'bg-amber-400',
  [DishType.TAHU]:    'bg-yellow-400',
  [DishType.TELUR]:   'bg-lime-400',
  [DishType.KAMBING]: 'bg-purple-400',
  [DishType.NASI]:    'bg-green-400',
  [DishType.KUE]:     'bg-rose-400',
  [DishType.MINUMAN]: 'bg-cyan-400',
};

interface OverviewProps { dishes: Dish[]; }

export function Overview({ dishes }: OverviewProps) {
  const stats = useMemo(() => {
    if (!dishes.length) return { total: 0, types: 0, avg: 0, max: 0 };
    const prices = dishes.map(d => d.price);
    return {
      total: dishes.length,
      types: new Set(dishes.map(d => d.type)).size,
      avg:   Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      max:   Math.max(...prices),
    };
  }, [dishes]);

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    dishes.forEach(d => { map[d.type] = (map[d.type] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [dishes]);

  const maxCount = byType[0]?.[1] || 1;

  const cheapest  = useMemo(() => [...dishes].sort((a, b) => a.price - b.price).slice(0, 5), [dishes]);
  const expensive = useMemo(() => [...dishes].sort((a, b) => b.price - a.price).slice(0, 5), [dishes]);

  const STATS = [
    { label: 'Total Dishes',   value: stats.total, sub: 'in database', icon: Package,   color: 'bg-primary/8 text-primary' },
    { label: 'Categories',     value: stats.types, sub: 'dish types',  icon: Tag,       color: 'bg-violet-50 text-violet-600' },
    { label: 'Average Price',  value: formatIDR(stats.avg), sub: 'per dish', icon: Wallet,    color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Highest Price',  value: formatIDR(stats.max), sub: 'most expensive', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Count by type */}
        <div className="col-span-1 bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-sm text-foreground mb-5">Dishes by Category</h3>
          <div className="space-y-3">
            {byType.map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[type] || 'bg-slate-100 text-slate-600'}`}>{type}</span>
                  <span className="text-xs font-bold text-foreground">{count}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${TYPE_BAR[type] || 'bg-slate-400'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price tables */}
        <div className="col-span-2 grid grid-rows-2 gap-4">
          {/* Cheapest */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-foreground mb-3">Most Affordable Dishes</h3>
            <div className="space-y-2">
              {cheapest.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate block">{d.name}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[d.type] || 'bg-slate-100 text-slate-600'}`}>{d.type}</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">{formatIDR(d.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Most expensive */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-foreground mb-3">Premium Dishes</h3>
            <div className="space-y-2">
              {expensive.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate block">{d.name}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[d.type] || 'bg-slate-100 text-slate-600'}`}>{d.type}</span>
                  <span className="text-xs font-bold text-amber-600 font-mono">{formatIDR(d.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
