import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, Utensils, List, LayoutGrid, 
  History, CreditCard, LogOut, Search, Plus, Trash2, Edit, ChevronRight
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { StaffManagement } from './StaffManagement';
import { MenuManagement } from './MenuManagement';
import { CategoriesManagement } from './CategoriesManagement';
import { TableManagement } from './TableManagement';
import { OrdersHistory } from './OrdersHistory';
import { Payments } from './Payments';

export type AdminView = 'dashboard' | 'staff' | 'menu' | 'categories' | 'tables' | 'orders' | 'payments';

export const AdminApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  // Handle mock login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 scene-default">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg-card w-full max-w-md p-8 flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#30D158] to-[#28B54E] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
            <LayoutDashboard size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">JenilPay Admin</h1>
          <p className="text-black/50 mb-8 text-center">Sign in to manage your restaurant operations</p>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-black/70 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#30D158]/50 transition-all"
                placeholder="admin@restaurant.kz"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-black/70 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#30D158]/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="lg-btn lg-btn-green mt-4 w-full text-center py-3.5">
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'menu', label: 'Menu Management', icon: Utensils },
    { id: 'categories', label: 'Categories', icon: List },
    { id: 'tables', label: 'Table Management', icon: LayoutGrid },
    { id: 'orders', label: 'Orders History', icon: History },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen flex bg-[#F2F2F7] pb-24">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 bottom-0 left-0 bg-white/70 backdrop-blur-3xl border-r border-black/5 z-40 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#30D158] to-[#28B54E] rounded-xl flex items-center justify-center shadow-md shadow-green-500/20">
            <LayoutDashboard size={20} color="white" />
          </div>
          <h2 className="font-bold text-lg tracking-tight">JenilPay Admin</h2>
        </div>
        
        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm
                  ${isActive 
                    ? 'bg-[#30D158]/10 text-[#28B54E] font-semibold shadow-sm' 
                    : 'text-black/60 hover:bg-black/5 hover:text-black/90'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-[#28B54E]' : 'text-black/40'} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-black/5">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-black/60 hover:bg-black/5 transition-all text-sm font-medium"
          >
            <LogOut size={18} className="text-black/40" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative min-h-screen p-4 md:p-8 pt-6">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-black/90 capitalize">
            {activeView.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 rounded-full bg-white/60 border border-black/5 backdrop-blur-xl text-sm outline-none focus:ring-2 focus:ring-[#30D158]/30 w-64 transition-all"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/80 border border-black/5 flex items-center justify-center shadow-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#007AFF] text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-6xl mx-auto"
          >
            {activeView === 'dashboard' && <AdminDashboard />}
            {activeView === 'staff' && <StaffManagement />}
            {activeView === 'menu' && <MenuManagement />}
            {activeView === 'categories' && <CategoriesManagement />}
            {activeView === 'tables' && <TableManagement />}
            {activeView === 'orders' && <OrdersHistory />}
            {activeView === 'payments' && <Payments />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
