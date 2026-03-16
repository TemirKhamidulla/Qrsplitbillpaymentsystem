import React from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { CATEGORIES, MENU_DATA } from '../../data/menu';

export const CategoriesManagement: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black/80">Menu Categories</h2>
        <button className="lg-btn lg-btn-green lg-btn-sm flex items-center gap-2">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="bubble-card overflow-hidden">
        <div className="relative z-10 divide-y divide-black/5">
          {CATEGORIES.map((category) => {
            const itemCount = MENU_DATA.filter(item => item.category === category).length;
            return (
              <div key={category} className="flex items-center justify-between p-4 hover:bg-white/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <button className="text-black/30 hover:text-black/60 cursor-grab">
                    <GripVertical size={18} />
                  </button>
                  <div>
                    <div className="font-semibold text-black/80">{category}</div>
                    <div className="text-xs text-black/50">{itemCount} items</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bubble-icon w-8 h-8 text-black/50 hover:text-[#007AFF]">
                    <Edit2 size={14} />
                  </button>
                  <button className="bubble-icon w-8 h-8 text-black/50 hover:text-[#FF453A]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
