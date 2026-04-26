import React, { useState, useRef } from 'react';
import { dishService, SEED_DISHES } from '../services/dishService';
import { auth } from '../lib/firebase';
import { Upload, Download, Database, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DishType } from '../types';

type Status = { type: 'success' | 'error' | 'info'; message: string } | null;

export function ImportExport() {
  const [status,   setStatus]   = useState<Status>(null);
  const [loading,  setLoading]  = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showStatus = (type: Status['type'], message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 5000);
  };

  // ── Seed the 33 real dishes ──────────────────────────────────────────
  const handleSeed = async () => {
    if (!confirm(`This will add all ${SEED_DISHES.length} sample Indonesian dishes to your database. Continue?`)) return;
    setLoading('seed');
    try {
      await dishService.seedDishes();
      showStatus('success', `✓ Successfully added ${SEED_DISHES.length} Indonesian dishes to the database.`);
    } catch (e: any) {
      showStatus('error', e.message || 'Failed to seed dishes');
    } finally {
      setLoading(null);
    }
  };

  // ── Export current dishes as CSV ─────────────────────────────────────
  const handleExport = async () => {
    setLoading('export');
    try {
      // We'll get data from the snapshot via the service
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Not authenticated');

      const header = 'dishId,name,type,price,ingredients,introduction,photoUrl';
      let csv = header + '\n';

      // Subscribe once to get current data
      await new Promise<void>((resolve, reject) => {
        const unsub = dishService.subscribeToDishes(dishes => {
          unsub();
          dishes.forEach(d => {
            const row = [
              d.dishId, d.name, d.type, d.price,
              `"${d.ingredients?.replace(/"/g, '""') || ''}"`,
              `"${d.introduction?.replace(/"/g, '""') || ''}"`,
              d.photoUrl || ''
            ].join(',');
            csv += row + '\n';
          });
          resolve();
        });
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `nusantara-dishes-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showStatus('success', 'CSV file downloaded successfully.');
    } catch (e: any) {
      showStatus('error', e.message || 'Export failed');
    } finally {
      setLoading(null);
    }
  };

  // ── Import from CSV file ──────────────────────────────────────────────
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading('import');
    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const header = lines[0].toLowerCase();

      if (!header.includes('name') || !header.includes('type')) {
        throw new Error('Invalid CSV format. Expected columns: dishId, name, type, price, ingredients, introduction, photoUrl');
      }

      const cols = lines[0].split(',').map(c => c.trim().toLowerCase().replace(/"/g, ''));
      const idx  = (col: string) => cols.indexOf(col);

      let added = 0, skipped = 0, errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV properly (handle quoted fields)
        const vals: string[] = [];
        let cur = '', inQ = false;
        for (const ch of line + ',') {
          if (ch === '"') { inQ = !inQ; }
          else if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; }
          else { cur += ch; }
        }

        const get = (col: string) => vals[idx(col)]?.replace(/^"|"$/g, '') || '';
        const name = get('name');
        const dishId = get('dishid') || get('id') || `IMP${String(i).padStart(3,'0')}`;
        const type = get('type');
        const price = parseFloat(get('price') || '0');

        if (!name) { errors.push(`Line ${i + 1}: missing name`); skipped++; continue; }

        // Map type to DishType enum
        const matchedType = Object.values(DishType).find(t =>
          t.toLowerCase() === type.toLowerCase()
        ) || DishType.AYAM;

        try {
          await dishService.addDish({
            dishId,
            name,
            type:         matchedType,
            price:        isNaN(price) ? 0 : price,
            ingredients:  get('ingredients'),
            introduction: get('introduction'),
            photoUrl:     get('photourl') || '',
            userId:       auth.currentUser!.uid,
          });
          added++;
        } catch {
          errors.push(`Line ${i + 1}: "${name}" — failed to save`);
          skipped++;
        }
      }

      let msg = `Import complete: ${added} added, ${skipped} skipped.`;
      if (errors.length) msg += ` Errors: ${errors.slice(0, 3).join('; ')}`;
      showStatus(skipped > 0 ? 'info' : 'success', msg);
    } catch (e: any) {
      showStatus('error', e.message || 'Import failed');
    } finally {
      setLoading(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const Card = ({ icon: Icon, title, desc, action, btnLabel, btnColor, busy }: any) => (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${btnColor === 'primary' ? 'bg-primary/10 text-primary' : btnColor === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-violet-50 text-violet-600'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
        </div>
      </div>
      <button
        onClick={action}
        disabled={!!loading}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 ${
          btnColor === 'primary'  ? 'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/20' :
          btnColor === 'emerald'  ? 'bg-emerald-500 text-white hover:opacity-90 shadow-md shadow-emerald-200' :
          'bg-violet-500 text-white hover:opacity-90 shadow-md shadow-violet-200'
        }`}
      >
        {busy === loading && loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {btnLabel}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-4">
        <Card
          icon={Database}
          title={`Load Sample Data (${SEED_DISHES.length} Dishes)`}
          desc="Populate your database with 33 authentic Indonesian dishes from the recipe dataset — Ayam, Sapi, Ikan, Udang, Tempe, Tahu, Telur, Kambing, Nasi, Kue, and Minuman. Prices in IDR."
          action={handleSeed}
          btnLabel={loading === 'seed' ? 'Loading dishes…' : `Add All ${SEED_DISHES.length} Sample Dishes`}
          btnColor="primary"
          busy="seed"
        />

        <Card
          icon={Upload}
          title="Import from CSV File"
          desc="Upload a CSV file with columns: dishId, name, type, price, ingredients, introduction, photoUrl. Prices should be in IDR (e.g. 25000)."
          action={() => fileRef.current?.click()}
          btnLabel={loading === 'import' ? 'Importing…' : 'Choose CSV File'}
          btnColor="violet"
          busy="import"
        />

        <Card
          icon={Download}
          title="Export to CSV"
          desc="Download all your current dishes as a CSV file. Useful for backup, sharing with Java app, or importing into MySQL."
          action={handleExport}
          btnLabel={loading === 'export' ? 'Exporting…' : 'Download CSV'}
          btnColor="emerald"
          busy="export"
        />
      </div>

      <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleImport} className="hidden" />

      {/* Format reference */}
      <div className="bg-slate-50 border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">CSV Format Reference</h4>
        </div>
        <pre className="text-xs text-muted-foreground overflow-x-auto leading-relaxed font-mono">
{`dishId,name,type,price,ingredients,introduction,photoUrl
D001,Nasi Goreng Spesial,Nasi,25000,"nasi, telur, bawang merah, kecap","Nasi goreng khas Indonesia",
D002,Es Teh Manis,Minuman,5000,"teh, gula, es batu","Teh manis segar",
D003,Rendang Sapi,Sapi,55000,"daging sapi, santan, rempah","Rendang khas Padang",`}
        </pre>
        <p className="text-[10px] text-muted-foreground mt-3">
          Valid categories: {Object.values(DishType).join(' · ')}
        </p>
      </div>

      {/* Status toast */}
      {status && (
        <div className={`fixed bottom-6 right-6 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border max-w-sm z-50 ${
          status.type === 'success' ? 'bg-white border-emerald-200 text-emerald-700' :
          status.type === 'error'   ? 'bg-white border-red-200 text-red-600' :
          'bg-white border-blue-200 text-blue-600'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}
    </div>
  );
}
