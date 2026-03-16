import React from 'react';
import { CreditCard, QrCode, Banknote, Download } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'PAY-1004', table: 12, client: 'Client_1', amount: 15000, method: 'QR', status: 'Success', date: 'Today, 14:32' },
  { id: 'PAY-1003', table: 12, client: 'Client_2', amount: 30000, method: 'Card', status: 'Success', date: 'Today, 14:30' },
  { id: 'PAY-1002', table: 8, client: 'Client_1', amount: 34000, method: 'QR', status: 'Success', date: 'Today, 13:46' },
  { id: 'PAY-1001', table: 2, client: 'Client_3', amount: 8900, method: 'Cash', status: 'Success', date: 'Today, 13:12' },
  { id: 'PAY-1000', table: 6, client: 'Client_1', amount: 12000, method: 'Card', status: 'Failed', date: 'Today, 12:21' },
];

const MethodIcon = ({ method }: { method: string }) => {
  if (method === 'QR') return <QrCode size={14} className="text-[#30D158]" />;
  if (method === 'Card') return <CreditCard size={14} className="text-[#007AFF]" />;
  return <Banknote size={14} className="text-[#FF9F0A]" />;
};

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black/80">Transactions</h2>
        <div className="flex gap-2">
          <button className="lg-btn lg-btn-glass lg-btn-sm flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bubble-card p-4 flex items-center gap-4 relative">
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#30D158]/10 flex items-center justify-center text-[#28B54E]">
            <QrCode size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-black/50">QR Payments</p>
            <p className="text-lg font-bold">₸ 845,000</p>
          </div>
        </div>
        <div className="bubble-card p-4 flex items-center gap-4 relative">
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
            <CreditCard size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-black/50">Card Payments</p>
            <p className="text-lg font-bold">₸ 210,000</p>
          </div>
        </div>
        <div className="bubble-card p-4 flex items-center gap-4 relative">
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#FF9F0A]/10 flex items-center justify-center text-[#FF9F0A]">
            <Banknote size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-black/50">Cash Payments</p>
            <p className="text-lg font-bold">₸ 95,000</p>
          </div>
        </div>
      </div>

      <div className="bubble-card overflow-hidden">
        <div className="w-full overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-black/5">
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Payment ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Client</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Table</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Method</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-black/40 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {MOCK_PAYMENTS.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/30 transition-colors">
                  <td className="py-4 px-6 font-medium text-sm text-black/80">{payment.id}</td>
                  <td className="py-4 px-6 text-sm text-black/60">{payment.client.replace('_', ' ')}</td>
                  <td className="py-4 px-6 text-sm text-black/60">Table {payment.table}</td>
                  <td className="py-4 px-6 font-semibold text-sm">₸ {payment.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 bg-black/5 px-2.5 py-1 rounded-full w-fit">
                      <MethodIcon method={payment.method} />
                      <span className="text-xs font-medium text-black/70">{payment.method}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'Success' ? 'bg-[#30D158]/10 text-[#28B54E]' : 'bg-[#FF453A]/10 text-[#FF453A]'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-black/50">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
