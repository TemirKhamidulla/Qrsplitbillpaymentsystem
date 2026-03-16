import React from 'react';
import { Eye, Download } from 'lucide-react';

const MOCK_ORDERS = [
  { id: 'ORD-9823', table: 12, waiter: 'Danais', amount: 45000, status: 'Completed', date: 'Today, 14:30' },
  { id: 'ORD-9822', table: 4, waiter: 'Kamila', amount: 12500, status: 'Active', date: 'Today, 14:15' },
  { id: 'ORD-9821', table: 8, waiter: 'Danais', amount: 34000, status: 'Completed', date: 'Today, 13:45' },
  { id: 'ORD-9820', table: 2, waiter: 'Temirlan', amount: 8900, status: 'Completed', date: 'Today, 13:10' },
  { id: 'ORD-9819', table: 6, waiter: 'Inkar', amount: 56000, status: 'Cancelled', date: 'Today, 12:20' },
  { id: 'ORD-9818', table: 1, waiter: 'Kamila', amount: 21000, status: 'Completed', date: 'Today, 11:45' },
];

export const OrdersHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black/80">Order History</h2>
        <div className="flex gap-2">
          <input type="date" className="bg-white/60 border border-black/5 rounded-xl px-3 py-2 text-sm outline-none" />
          <button className="lg-btn lg-btn-glass lg-btn-sm flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="bubble-card overflow-hidden">
        <div className="w-full overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-black/5">
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Order ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Table</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Waiter</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-white/30 transition-colors">
                  <td className="py-4 px-6 font-medium text-sm text-black/80">{order.id}</td>
                  <td className="py-4 px-6 text-sm text-black/60">Table {order.table}</td>
                  <td className="py-4 px-6 text-sm text-black/60">{order.waiter}</td>
                  <td className="py-4 px-6 font-semibold text-sm">₸ {order.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Completed' ? 'bg-[#30D158]/10 text-[#28B54E]' :
                      order.status === 'Active' ? 'bg-[#007AFF]/10 text-[#007AFF]' :
                      'bg-[#FF453A]/10 text-[#FF453A]'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-black/50">{order.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <button className="bubble-icon w-8 h-8 text-black/50 hover:text-[#007AFF]">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
