import React, { useState, useEffect } from 'react';
import { Dish, DishType } from '../types';
import { dishService } from '../services/dishService';
import { X, Loader2, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISH_TYPES } from '../constants/dishTypes';

interface DishFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingDish: Dish | null;
}

const EMPTY = {
  dishId: '', name: '', type: DishType.APPETIZER,
  price: '' as any, ingredients: '', introduction: '', photoUrl: '',
};

export function DishForm({ isOpen, onClose, editingDish }: DishFormProps) {
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (editingDish) {
      setForm({
        dishId:       editingDish.dishId,
        name:         editingDish.name,
        type:         editingDish.type,
        price:        editingDish.price,
        ingredients:  editingDish.ingredients,
        introduction: editingDish.introduction,
        photoUrl:     editingDish.photoUrl,
      });
    } else {
      setForm(EMPTY);
    }
    setError('');
  }, [editingDish, isOpen]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.dishId.trim())   return 'Dish ID is required';
    if (!form.name.trim())     return 'Dish name is required';
    if (!form.type)            return 'Category is required';
    
    // Validate type is in allowed list
    if (!DISH_TYPES.includes(form.type as any)) {
      return 'Invalid dish type. Please select from the list.';
    }
    
    const p = Number(form.price);
    if (isNaN(p) || p < 0)    return 'Price must be a valid positive number';
    if (!form.ingredients.trim()) return 'Ingredients are required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingDish) {
        await dishService.updateDish(editingDish.id, payload);
      } else {
        await dishService.addDish(payload as any);
      }
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save dish');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {editingDish ? 'Edit Dish' : 'Add New Dish'}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingDish ? `Editing ${editingDish.dishId}` : 'Fill in the dish information below'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Dish ID" required>
                  <input
                    className={inputCls} value={form.dishId}
                    onChange={e => set('dishId', e.target.value)}
                    placeholder="e.g. D034"
                    disabled={!!editingDish}
                  />
                </Field>
                <Field label="Category" required>
                  <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="">Select Dish Type</option>
                    {DISH_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Dish Name" required>
                <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Nasi Goreng Spesial" />
              </Field>

              <Field label="Price (IDR)" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                  <input
                    className={`${inputCls} pl-9`}
                    type="number" min="0" step="500"
                    value={form.price} onChange={e => set('price', e.target.value)}
                    placeholder="e.g. 25000"
                  />
                </div>
              </Field>

              <Field label="Ingredients" required>
                <textarea
                  className={`${inputCls} resize-none`} rows={3}
                  value={form.ingredients} onChange={e => set('ingredients', e.target.value)}
                  placeholder="e.g. nasi, telur, bawang merah, kecap manis, garam…"
                />
              </Field>

              <Field label="Description / Introduction">
                <textarea
                  className={`${inputCls} resize-none`} rows={3}
                  value={form.introduction} onChange={e => set('introduction', e.target.value)}
                  placeholder="Short description of the dish…"
                />
              </Field>

              <Field label="Photo URL">
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className={`${inputCls} pl-9`} value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)} placeholder="https://…" />
                </div>
                {form.photoUrl && (
                  <img src={form.photoUrl} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-border" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </Field>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
              )}
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-50 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit as any}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-md shadow-primary/20 text-sm"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving…' : editingDish ? 'Update Dish' : 'Add Dish'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
