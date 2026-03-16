import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_DATA, CATEGORIES } from '../../data/menu';

export const MenuManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const allItems = MENU_DATA;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <h2 className="text-xl font-semibold text-black/80">Menu Items</h2>
          <div className="bg-black/5 rounded-full px-3 py-1 flex items-center text-xs font-semibold text-black/50">
            {allItems.length} items total
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="lg-btn lg-btn-green lg-btn-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="bubble-card overflow-hidden">
        <div className="w-full overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-black/5">
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Item</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {allItems.slice(0, 8).map((item) => {
                const category = item.category;
                return (
                  <tr key={item.id} className="hover:bg-white/30 transition-colors">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black/20 bg-black/5 shadow-sm">
                          <ImageIcon size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-black/80 text-sm">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-black/5 text-xs font-medium text-black/60">
                        {category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-sm">₸ {item.price.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      {/* Simple toggle visual */}
                      <div className="w-11 h-6 bg-[#30D158] rounded-full p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-5" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="bubble-icon w-8 h-8 text-black/50 hover:text-[#007AFF]">
                          <Edit2 size={14} />
                        </button>
                        <button className="bubble-icon w-8 h-8 text-black/50 hover:text-[#FF453A]">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="lg-card w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-black/80">Add Menu Item</h3>
                <button onClick={() => setShowAddForm(false)} className="bubble-icon w-8 h-8 text-black/50">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-black/40 bg-black/5 cursor-pointer hover:bg-black/10 transition-colors">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs font-medium">Add Photo</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Dish Name</label>
                      <input type="text" className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50" placeholder="e.g. Tom Yum Goong" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Price (₸)</label>
                        <input type="number" className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50" placeholder="0" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Category</label>
                        <select className="w-full bg-black/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50 appearance-none">
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-black/60 mb-1.5 ml-1">Description (Optional)</label>
                  <textarea rows={2} className="w-full bg-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#30D158]/50 resize-none" placeholder="Ingredients, allergens, etc." />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-black/5">
                  <div>
                    <div className="font-semibold text-sm">Available for ordering</div>
                    <div className="text-xs text-black/50">Show this item on the guest menu</div>
                  </div>
                  <div className="w-11 h-6 bg-[#30D158] rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-5" />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 lg-btn lg-btn-glass py-3 text-sm">Cancel</button>
                  <button onClick={() => setShowAddForm(false)} className="flex-1 lg-btn lg-btn-green py-3 text-sm">Save Item</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
