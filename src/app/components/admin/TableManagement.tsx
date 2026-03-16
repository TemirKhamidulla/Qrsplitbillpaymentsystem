import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useSharedState } from '../../SharedStateProvider';

export const TableManagement: React.FC = () => {
  const { activeTables } = useSharedState();
  const allTables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black/80">Table Layout</h2>
        <button className="lg-btn lg-btn-green lg-btn-sm flex items-center gap-2">
          <Plus size={18} />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allTables.map((tableNum) => {
          const isActive = activeTables[tableNum] !== undefined;
          const session = activeTables[tableNum];

          return (
            <div key={tableNum} className={`bubble-card p-5 border-2 transition-all ${
              isActive ? 'border-[#30D158]/50 bg-[#30D158]/5' : 'border-transparent'
            }`}>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    isActive ? 'bg-[#30D158] text-white shadow-lg shadow-green-500/30' : 'bg-black/5 text-black/60'
                  }`}>
                    {tableNum}
                  </div>
                  <div className="flex items-center gap-1 text-black/40 text-sm font-medium">
                    <Users size={14} />
                    <span>{isActive ? session.guestCount : 4}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className={`text-sm font-semibold ${isActive ? 'text-[#28B54E]' : 'text-black/40'}`}>
                    {isActive ? 'Occupied' : 'Available'}
                  </div>
                  {isActive && (
                    <div className="text-xs text-black/50 mt-1">
                      {session.orders.length} items ordered
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
