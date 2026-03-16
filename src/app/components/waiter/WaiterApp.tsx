import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, ChevronRight, Plus, ChevronLeft, Check, Trash2,
  QrCode, LogOut, Smartphone, ClipboardCheck, Clock,
  CircleCheckBig, CircleDashed, Receipt, ArrowRightLeft,
  RotateCcw, Printer, X, Eye, Copy, Share2, Delete, Minus
} from 'lucide-react';
import { useSharedState } from '../../SharedStateProvider';
import { GuestId, OrderItem } from '../../types';
import { MENU_DATA, CATEGORIES, MenuItem } from '../../data/menu';
import { LG } from '../../ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { projectId, publicAnonKey } from '/utils/supabase/info';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type WaiterStep = 'login' | 'table_select' | 'guest_count' | 'ordering' | 'review' | 'bill' | 'payment_tracker';
const WAITERS = ['Danais', 'Kamila', 'Inkar', 'Temirlan'];

interface WaiterAppProps {
  onOpenGuest: (tableId: number) => void;
  returnToStep?: string | null;
  onConsumeReturnStep?: () => void;
}

export const WaiterApp: React.FC<WaiterAppProps> = ({ onOpenGuest, returnToStep, onConsumeReturnStep }) => {
  const { activeTables, startNewSession, updateGuestCount, addToOrder, removeItem, closeTable } = useSharedState();
  const [step, setStep] = useState<WaiterStep>('login');
  const [pin, setPin] = useState('');
  const [typedName, setTypedName] = useState('');
  const [selectedWaiter, setSelectedWaiter] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [showItemDetail, setShowItemDetail] = useState<MenuItem | null>(null);
  const [tempGuests, setTempGuests] = useState<GuestId[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [tableCount, setTableCount] = useState(4);
  const MAX_TABLES = 8;

  const session = selectedTable ? activeTables[selectedTable] || null : null;

  useEffect(() => {
    if (returnToStep === 'bill' && selectedWaiter && selectedTable && session) {
      setStep('bill'); onConsumeReturnStep?.();
    } else if (returnToStep) { onConsumeReturnStep?.(); }
  }, [returnToStep]);

  const isValidWaiter = (name: string) => WAITERS.some(w => w.toLowerCase() === name.trim().toLowerCase());

  const handleLogin = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (isValidWaiter(typedName)) {
          setSelectedWaiter(typedName.trim());
          setTimeout(() => { setStep('table_select'); setPin(''); }, 300);
        } else { setTimeout(() => setPin(''), 1000); }
      }
    }
  };

  const handleLogout = () => {
    setSelectedWaiter(null); setSelectedTable(null);
    setPin(''); setTypedName(''); setStep('login');
  };

  const handleStartNewSession = (table: number, guests: number) => { startNewSession(table, guests); setStep('ordering'); };
  const handleUpdateGuestCount = (count: number) => { if (selectedTable) updateGuestCount(selectedTable, count); };

  const handleAddToOrder = (menuItem: MenuItem, guests: GuestId[]) => {
    if (!selectedTable) return;
    addToOrder(selectedTable, {
      id: Math.random().toString(36).substr(2, 9),
      menuId: menuItem.id, name: menuItem.name,
      price: menuItem.price, assignedGuests: guests,
    });
    setShowItemDetail(null); setTempGuests([]);
  };

  const handleAddIndividual = (menuItem: MenuItem, guests: GuestId[]) => {
    if (!selectedTable) return;
    guests.forEach(guestId => {
      addToOrder(selectedTable, {
        id: Math.random().toString(36).substr(2, 9),
        menuId: menuItem.id, name: menuItem.name,
        price: menuItem.price, assignedGuests: [guestId],
      });
    });
    setShowItemDetail(null); setTempGuests([]);
  };

  const handleRemoveItem = (orderId: string) => { if (selectedTable) removeItem(selectedTable, orderId); };
  const handleCloseTable = () => { if (selectedTable) { closeTable(selectedTable); setSelectedTable(null); setStep('table_select'); } };

  const handleFinishSession = async () => {
    if (!selectedTable || !session || isFinishing) return;
    try {
      setIsFinishing(true);
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b219b36a/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          tableNumber: selectedTable,
          waiter: selectedWaiter,
          guestCount: session.guestCount,
          total: total,
          subtotal: subtotal,
          serviceFee: serviceFee,
          serverFee: serverFee
        })
      });
      if (res.ok) {
        handleCloseTable();
      } else {
        console.error('Failed to save payment to database');
        alert('Failed to save payment. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving payment. Check connection.');
    } finally {
      setIsFinishing(false);
    }
  };

  const SERVICE_FEE_RATE = 0.10;
  const SERVER_FEE_RATE = 0.02;
  const subtotal = session?.orders.reduce((s, i) => s + i.price, 0) || 0;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const serverFee = subtotal * SERVER_FEE_RATE;
  const total = subtotal + serviceFee + serverFee;

  const calculateGuestTotal = (guestId: GuestId) => {
    if (!session) return 0;
    let sub = 0;
    session.orders.filter(i => i.assignedGuests.includes(guestId)).forEach(i => { sub += i.price / i.assignedGuests.length; });
    return sub + sub * SERVICE_FEE_RATE + sub * SERVER_FEE_RATE;
  };

  // ===== Liquid Glass Nav Bar =====
  const LiquidNav = ({ left, title, right }: { left?: React.ReactNode; title: string; right?: React.ReactNode }) => (
    <div className="px-4 pt-3 pb-2 sticky top-0 z-20">
      <div className="liquid-nav flex items-center justify-between px-3 h-[48px]">
        <div className="flex-1 flex justify-start">{left}</div>
        <h3 className="text-[17px] font-semibold tracking-tight" style={{ color: LG.label }}>{title}</h3>
        <div className="flex-1 flex justify-end">{right}</div>
      </div>
    </div>
  );

  // ===== LOGIN =====
  const renderLogin = () => (
    <div className="h-full flex flex-col items-center justify-center px-6 relative overflow-hidden scene-default">
      <div className="ambient-orb w-[250px] h-[250px] md:w-[450px] md:h-[450px] -top-20 -right-20" style={{ background: LG.blue }} />
      <div className="ambient-orb w-[200px] h-[200px] md:w-[350px] md:h-[350px] bottom-10 -left-20" style={{ background: LG.purple }} />
      <div className="ambient-orb w-[160px] h-[160px] top-1/3 left-1/4" style={{ background: LG.teal, opacity: 0.15 }} />

      <div className="w-full max-w-[340px] md:max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-[64px] h-[64px] rounded-[18px] flex items-center justify-center mb-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3395FF 0%, #007AFF 50%, #5E5CE6 100%)',
              boxShadow: '0 8px 32px rgba(0, 122, 255, 0.35), 0 0 0 0.5px rgba(255,255,255,0.3) inset',
            }}
          >
            <span className="text-white text-[26px] font-bold tracking-tight">J</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: LG.label }}>JenilPay</h1>
          <p className="text-[14px] mt-1" style={{ color: LG.labelSecondary }}>Server Portal</p>
        </div>

        {/* Name Input — bubble card */}
        <div className="lg-card mb-3">
          <div className="px-4 py-2.5">
            <label className="text-[11px] uppercase tracking-wider" style={{ color: LG.labelTertiary }}>Server Name</label>
            <input
              type="text" value={typedName} onChange={(e) => setTypedName(e.target.value)}
              placeholder="Enter your name"
              className="w-full py-1 bg-transparent text-[16px] placeholder:text-black/20 outline-none"
              style={{ color: LG.label }}
            />
          </div>
        </div>

        {/* PIN — bubble pad buttons */}
        <div className="lg-card p-4 mb-3">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-[11px] uppercase tracking-wider" style={{ color: LG.labelTertiary }}>Access PIN</span>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <motion.div key={i} animate={{ scale: pin.length >= i ? 1.15 : 1 }}
                  className="w-[10px] h-[10px] rounded-full transition-colors duration-200"
                  style={{ background: pin.length >= i ? LG.blue : 'rgba(0,0,0,0.1)' }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((val, i) => (
              <button key={i} disabled={!typedName.trim()}
                onClick={() => { if (val === 'del') setPin(''); else if (val !== '') handleLogin(val.toString()); }}
                className={cn(
                  "h-[48px] text-[18px]",
                  val === '' && "invisible",
                  val === 'del' ? "bubble-icon" : "bubble-pad"
                )}
                style={{ color: val === 'del' ? LG.labelSecondary : LG.label }}
              >
                {val === 'del' ? <Delete size={18} /> : val}
              </button>
            ))}
          </div>
        </div>

        {pin.length === 4 && !isValidWaiter(typedName) && (
          <p className="text-center text-[14px] animate-pulse" style={{ color: LG.red }}>Invalid server name</p>
        )}

        <p className="text-center text-[11px] mt-5 pb-16" style={{ color: LG.labelTertiary }}>
          Team: Danais &bull; Kamila &bull; Inkar &bull; Temirlan
        </p>
      </div>
    </div>
  );

  // ===== TABLE SELECT =====
  const renderTableSelect = () => (
    <div className="h-full flex flex-col relative overflow-hidden scene-default">
      <div className="ambient-orb w-[350px] h-[350px] md:w-[500px] md:h-[500px] -top-40 right-10" style={{ background: LG.indigo, opacity: 0.2 }} />
      <div className="ambient-orb w-[250px] h-[250px] md:w-[350px] md:h-[350px] bottom-20 -left-20" style={{ background: LG.teal, opacity: 0.18 }} />

      <div className="px-5 md:px-10 pt-14 pb-4 relative z-10 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] md:text-[15px]" style={{ color: LG.labelSecondary }}>
            Signed in as <span style={{ color: LG.blue }}>{selectedWaiter}</span>
          </p>
          <button onClick={handleLogout} className="lg-btn lg-btn-red lg-btn-xs flex items-center gap-1">
            <LogOut size={14} /> Log Out
          </button>
        </div>
        <h1 className="text-[36px] md:text-[42px] font-bold tracking-tight" style={{ color: LG.label }}>Tables</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pb-20 md:p-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-lg md:max-w-4xl w-full">
          {Array.from({ length: tableCount }).map((_, i) => {
            const tableNum = i + 1;
            const tableSession = activeTables[tableNum];
            const isActive = !!tableSession;
            return (
              <div key={tableNum} className="relative aspect-square">
                <button
                  onClick={() => { setSelectedTable(tableNum); setStep(isActive ? 'ordering' : 'guest_count'); }}
                  className="w-full h-full bubble-card flex flex-col items-center justify-center relative p-4"
                >
                  {isActive && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-[10px] h-[10px] rounded-full animate-pulse" style={{ background: LG.green, boxShadow: `0 0 12px ${LG.green}` }} />
                    </div>
                  )}
                  <span className="text-[11px] tracking-[0.15em] uppercase mb-1 relative z-10" style={{ color: LG.labelTertiary }}>Table</span>
                  <span className="text-[48px] font-bold tracking-tight mb-2 relative z-10" style={{ color: LG.label }}>{tableNum}</span>
                  {isActive ? (
                    <span className="lg-badge text-white relative z-10"
                      style={{ background: `linear-gradient(135deg, ${LG.green}, #28B54E)`, boxShadow: `0 2px 8px rgba(48,209,88,0.3)` }}>
                      {tableSession.guestCount} Guests
                    </span>
                  ) : (
                    <span className="text-[13px] relative z-10" style={{ color: LG.labelTertiary }}>Tap to open</span>
                  )}
                </button>
                
                {/* Reset Button for Active Tables */}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Reset Table ${tableNum}?\n\nThis will clear all orders and close the table.`)) {
                        closeTable(tableNum);
                        if (selectedTable === tableNum) {
                          setSelectedTable(null);
                          setStep('table_select');
                        }
                      }
                    }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bubble-icon w-[36px] h-[36px] z-20"
                    style={{ color: LG.red }}
                    title="Reset Table"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Table Management — Add / Remove */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bubble-card flex flex-col items-center justify-center gap-3 border-2 border-dashed"
            style={{ borderColor: 'rgba(0,122,255,0.15)' }}
          >
            <span className="text-[11px] tracking-[0.12em] uppercase relative z-10" style={{ color: LG.labelTertiary }}>Manage</span>
            <span className="text-[28px] font-bold tracking-tight relative z-10" style={{ color: LG.label }}>{tableCount}<span className="text-[17px] font-semibold" style={{ color: LG.labelTertiary }}>/{MAX_TABLES}</span></span>
            <div className="flex items-center gap-3 relative z-10">
              <button
                disabled={(() => {
                  if (tableCount <= 1) return true;
                  return !!activeTables[tableCount];
                })()}
                onClick={() => setTableCount(prev => Math.max(prev - 1, 1))}
                className={cn(
                  "w-[40px] h-[40px] bubble-icon transition-opacity",
                  (tableCount <= 1 || !!activeTables[tableCount]) && "opacity-30 cursor-not-allowed"
                )}
                style={{ color: LG.red }}
              >
                <Minus size={18} />
              </button>
              <button
                disabled={tableCount >= MAX_TABLES}
                onClick={() => setTableCount(prev => Math.min(prev + 1, MAX_TABLES))}
                className={cn(
                  "w-[40px] h-[40px] bubble-icon transition-opacity",
                  tableCount >= MAX_TABLES && "opacity-30 cursor-not-allowed"
                )}
                style={{ color: LG.blue }}
              >
                <Plus size={18} />
              </button>
            </div>
            {!!activeTables[tableCount] && tableCount > 1 && (
              <span className="text-[10px] text-center px-2 relative z-10" style={{ color: LG.orange }}>Close table {tableCount} first</span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );

  // ===== GUEST COUNT =====
  const renderGuestCount = () => (
    <div className="h-full flex flex-col relative overflow-hidden scene-default">
      <div className="ambient-orb w-[300px] h-[300px] top-10 -right-20" style={{ background: LG.blue, opacity: 0.15 }} />

      <LiquidNav
        title={`Table ${selectedTable}`}
        left={
          <button onClick={() => { if (session) setStep('ordering'); else { setSelectedTable(null); setStep('table_select'); } }}
            className="bubble-nav flex items-center gap-0" style={{ color: LG.blue }}>
            <ChevronLeft size={20} strokeWidth={2.5} /> {session ? 'Order' : 'Back'}
          </button>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <h1 className="text-[30px] font-bold tracking-tight mb-2" style={{ color: LG.label }}>How many guests?</h1>
        <p className="text-[15px] mb-10" style={{ color: LG.labelSecondary }}>Select the number of guests</p>

        <div className="grid grid-cols-3 gap-4 max-w-xs w-full">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const isCurrent = session?.guestCount === num;
            return (
              <button key={num}
                onClick={() => { if (session) { handleUpdateGuestCount(num); setStep('ordering'); } else handleStartNewSession(selectedTable!, num); }}
                className={cn(
                  "h-[84px] flex flex-col items-center justify-center gap-1.5",
                  isCurrent ? "lg-btn lg-btn-blue" : "bubble-card"
                )}
              >
                <Users size={22} className="relative z-10" style={{ color: isCurrent ? 'rgba(255,255,255,0.7)' : LG.labelTertiary }} />
                <span className="text-[24px] font-bold relative z-10" style={{ color: isCurrent ? 'white' : LG.label }}>{num}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ===== ORDERING =====
  const renderOrdering = () => (
    <div className="h-full flex flex-col overflow-hidden relative scene-default">
      <div className="px-3 pt-3 pb-2 sticky top-0 z-20">
        <div className="liquid-nav flex items-center justify-between px-2 h-[48px]">
          <button onClick={() => { setSelectedTable(null); setStep('table_select'); }}
            className="bubble-nav flex items-center gap-0 px-2.5 py-1.5 text-[13px]" style={{ color: LG.blue }}>
            <ChevronLeft size={18} strokeWidth={2.5} />
            <span className="hidden min-[400px]:inline">Tables</span>
          </button>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[15px] font-semibold" style={{ color: LG.label }}>T{session?.tableNumber}</span>
            <span className="lg-badge text-[10px] px-1.5 py-0.5" style={{ background: 'rgba(0,0,0,0.05)', color: LG.labelSecondary }}>{session?.guestCount}G</span>
          </div>
          <button onClick={() => setStep('review')}
            className="bubble-nav flex items-center gap-1 px-2.5 py-1.5 text-[13px]" style={{ color: LG.blue }}>
            <span className="hidden min-[400px]:inline">Review</span>
            <span className="min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, #3395FF, ${LG.blue})`, boxShadow: `0 2px 8px rgba(0,122,255,0.3)` }}>
              {session?.orders.length}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Category sidebar — bubble segments */}
        <aside className="w-[76px] md:w-[120px] flex flex-col py-2 px-1 md:px-2 gap-1 overflow-y-auto relative shrink-0">
          <div className="absolute inset-0 liquid-glass-thin" style={{ borderRadius: 0 }} />
          <div className="relative z-10 flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn(
                  "w-full py-3 px-1 text-[12px] md:text-[13px] font-semibold text-center bubble-seg",
                  activeCategory === cat && "bubble-seg-active"
                )}
                style={{ color: activeCategory === cat ? LG.blue : LG.labelTertiary }}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Menu grid — bubble cards */}
        <main className="flex-1 overflow-y-auto p-3 md:p-4">
          <h2 className="text-[20px] md:text-[24px] font-bold tracking-tight mb-3 ml-1" style={{ color: LG.label }}>{activeCategory}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {MENU_DATA.filter(item => item.category === activeCategory).map(item => (
              <button key={item.id}
                onClick={() => { setShowItemDetail(item); setTempGuests([]); }}
                className="bubble-card p-3 md:p-4 text-left flex flex-col h-full justify-between"
              >
                <div className="relative z-10">
                  <h4 className="font-semibold text-[14px] md:text-[15px] mb-0.5 leading-tight" style={{ color: LG.label }}>{item.name}</h4>
                  <p className="text-[12px] md:text-[13px] line-clamp-2 leading-snug" style={{ color: LG.labelSecondary }}>{item.description}</p>
                </div>
                <p className="text-[15px] md:text-[17px] font-bold mt-2 self-end relative z-10" style={{ color: LG.blue }}>{item.price} &#8376;</p>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Item Detail Sheet */}
      <AnimatePresence>
        {showItemDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.25)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowItemDetail(null); }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 32, stiffness: 360 }}
              className="w-full max-w-lg rounded-t-[24px] max-h-[85vh] overflow-y-auto liquid-glass-elevated"
              style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            >
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-9 h-[5px] rounded-full" style={{ background: 'rgba(0,0,0,0.12)' }} />
              </div>

              <div className="px-5 pt-2 pb-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex-1 mr-4">
                    <h2 className="text-[22px] font-bold tracking-tight leading-tight" style={{ color: LG.label }}>{showItemDetail.name}</h2>
                    <p className="text-[15px] mt-1" style={{ color: LG.labelSecondary }}>{showItemDetail.description}</p>
                  </div>
                  <span className="text-[22px] font-bold shrink-0" style={{ color: LG.blue }}>{showItemDetail.price} &#8376;</span>
                </div>

                {/* Guest selection — bubble-guest */}
                <div className="lg-card p-4 mb-3">
                  <p className="text-[12px] font-semibold mb-3 uppercase tracking-wider" style={{ color: LG.labelTertiary }}>Assign to Guests</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: session?.guestCount || 0 }).map((_, i) => {
                      const guestId = `Client_${i + 1}` as GuestId;
                      const isSelected = tempGuests.includes(guestId);
                      return (
                        <button key={guestId}
                          onClick={() => {
                            if (isSelected) setTempGuests(tempGuests.filter(g => g !== guestId));
                            else setTempGuests([...tempGuests, guestId]);
                          }}
                          className={cn("h-[58px] flex flex-col items-center justify-center",
                            isSelected ? "bubble-guest bubble-guest-selected" : "bubble-guest"
                          )}
                        >
                          <span className="text-[11px] opacity-55 relative z-10">Guest</span>
                          <span className="text-[18px] font-bold relative z-10">{i + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 justify-center mt-3">
                    <button
                      onClick={() => setTempGuests(Array.from({ length: session?.guestCount || 0 }).map((_, i) => `Client_${i + 1}` as GuestId))}
                      className="bubble-chip" style={{ color: LG.blue }}
                    >Select All</button>
                    <button onClick={() => setTempGuests([])}
                      className="bubble-chip" style={{ color: LG.red }}
                    >Clear</button>
                  </div>
                </div>

                {/* Price preview */}
                {tempGuests.length > 1 && (
                  <div className="lg-card p-3 mb-3">
                    <div className="flex justify-between text-[13px] mb-1.5" style={{ color: LG.labelSecondary }}>
                      <span className="flex items-center gap-1"><Copy size={12} /> Individual</span>
                      <span style={{ color: LG.label }}>{showItemDetail.price} &times; {tempGuests.length} = {showItemDetail.price * tempGuests.length} &#8376;</span>
                    </div>
                    <div className="flex justify-between text-[13px]" style={{ color: LG.labelSecondary }}>
                      <span className="flex items-center gap-1"><Share2 size={12} /> Shared</span>
                      <span style={{ color: LG.label }}>{showItemDetail.price} &divide; {tempGuests.length} = {Math.round(showItemDetail.price / tempGuests.length)} &#8376; each</span>
                    </div>
                  </div>
                )}

                {/* Action buttons — bubble CTA */}
                <div className="flex gap-2.5 mb-2.5">
                  <button disabled={tempGuests.length === 0}
                    onClick={() => handleAddIndividual(showItemDetail, tempGuests)}
                    className="lg-btn lg-btn-green flex-1 flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1 text-[15px]"><Copy size={14} /> Individual</span>
                    {tempGuests.length >= 1 && (
                      <span className="text-[11px] opacity-75">{tempGuests.length > 1 ? `${tempGuests.length} items • ${showItemDetail.price * tempGuests.length} ₸` : `1 item • ${showItemDetail.price} ₸`}</span>
                    )}
                  </button>
                  <button disabled={tempGuests.length < 2}
                    onClick={() => handleAddToOrder(showItemDetail, tempGuests)}
                    className="lg-btn lg-btn-blue flex-1 flex flex-col items-center gap-0.5">
                    <span className="flex items-center gap-1 text-[15px]"><Share2 size={14} /> Shared</span>
                    <span className="text-[11px] opacity-75">{tempGuests.length >= 2 ? `Split • ${Math.round(showItemDetail.price / tempGuests.length)} ₸ each` : 'Select 2+ guests'}</span>
                  </button>
                </div>
                <button onClick={() => setShowItemDetail(null)} className="lg-btn lg-btn-glass w-full text-[15px]">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ===== REVIEW =====
  const renderReview = () => (
    <div className="h-full flex flex-col relative overflow-hidden scene-default">
      <div className="ambient-orb w-[300px] h-[300px] -top-20 right-20" style={{ background: LG.green, opacity: 0.12 }} />

      <LiquidNav
        title="Review Order"
        left={
          <button onClick={() => setStep('ordering')} className="bubble-nav flex items-center gap-0" style={{ color: LG.blue }}>
            <ChevronLeft size={20} strokeWidth={2.5} /> Menu
          </button>
        }
        right={
          <button onClick={() => setStep('ordering')} className="bubble-icon w-[34px] h-[34px]" style={{ color: LG.blue }}>
            <Plus size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-2 pb-4 relative z-10">
        <div className="max-w-2xl mx-auto">
        {session?.orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bubble-icon w-[64px] h-[64px] mb-4 mx-auto" style={{ color: LG.labelTertiary, cursor: 'default' }}>
              <Receipt size={28} />
            </div>
            <h3 className="text-[17px] font-semibold" style={{ color: LG.label }}>No items added</h3>
            <p className="text-[15px] mt-1" style={{ color: LG.labelSecondary }}>Start adding items from the menu.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {session?.orders.map((item) => {
              const isShared = item.assignedGuests.length > 1;
              return (
                <div key={item.id} className="bubble-row flex items-center justify-between py-3 px-4">
                  <div className="flex-1 mr-4 relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[17px]" style={{ color: LG.label }}>{item.name}</span>
                      <span className="text-[15px] font-bold" style={{ color: LG.blue }}>{item.price} &#8376;</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.assignedGuests.map(g => (
                        <span key={g} className="lg-badge" style={{ background: 'rgba(0,0,0,0.04)', color: LG.labelSecondary }}>{g.replace('_', ' ')}</span>
                      ))}
                      <span className="lg-badge flex items-center gap-0.5" style={{
                        background: isShared ? `${LG.green}12` : `${LG.blue}12`,
                        color: isShared ? LG.green : LG.blue,
                      }}>
                        {isShared ? <><Share2 size={9} /> Shared</> : <><Copy size={9} /> Individual</>}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)}
                    className="bubble-icon w-[36px] h-[36px] shrink-0 relative z-10" style={{ color: LG.red }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => { if (window.confirm('Close this table?')) handleCloseTable(); }}
          className="w-full mt-4 lg-btn lg-btn-red lg-btn-sm">
          Close Table
        </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 pb-4 relative z-10">
        <div className="max-w-2xl mx-auto">
        <div className="liquid-glass-elevated rounded-[24px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[12px] uppercase tracking-wider" style={{ color: LG.labelTertiary }}>Subtotal</p>
              <p className="text-[30px] font-bold tracking-tight" style={{ color: LG.label }}>{subtotal} &#8376;</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] uppercase tracking-wider" style={{ color: LG.labelTertiary }}>Items</p>
              <p className="text-[30px] font-bold tracking-tight" style={{ color: LG.label }}>{session?.orders.length}</p>
            </div>
          </div>
          <button disabled={session?.orders.length === 0} onClick={() => setStep('bill')}
            className="lg-btn lg-btn-green w-full flex items-center justify-center gap-2">
            Generate Bill <Check size={20} />
          </button>
        </div>
        </div>
      </div>
    </div>
  );

  // ===== BILL =====
  const renderBill = () => {
    if (!session) return null;
    return (
      <div className="h-full flex flex-col relative overflow-hidden scene-default">
        <div className="ambient-orb w-[400px] h-[400px] -top-40 -right-20" style={{ background: LG.green, opacity: 0.1 }} />
        <div className="ambient-orb w-[300px] h-[300px] bottom-20 -left-20" style={{ background: LG.blue, opacity: 0.1 }} />

        <LiquidNav
          title="Bill"
          left={
            <button onClick={() => setStep('review')} className="bubble-nav flex items-center gap-0" style={{ color: LG.blue }}>
              <ChevronLeft size={20} strokeWidth={2.5} /> Review
            </button>
          }
          right={<span className="lg-badge" style={{ background: `${LG.green}15`, color: LG.green }}>Table {session.tableNumber}</span>}
        />

        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 md:p-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-[36px] font-bold tracking-tight leading-tight" style={{ color: LG.label }}>Bill Overview</h1>

              <div className="lg-card">
                <div className="max-h-64 overflow-y-auto">
                  {session.orders.map((item, idx) => (
                    <div key={item.id}>
                      <div className="flex justify-between py-2.5 px-4 text-[15px]">
                        <div className="flex items-center gap-2">
                          <span style={{ color: LG.label }}>{item.name}</span>
                          {item.assignedGuests.length > 1 && (
                            <span className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: LG.green }}>
                              <Share2 size={9} /> {item.assignedGuests.length}x
                            </span>
                          )}
                        </div>
                        <span style={{ color: LG.label }}>{item.price} &#8376;</span>
                      </div>
                      {idx < session.orders.length - 1 && <div className="lg-separator" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg-card p-5 space-y-3">
                <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Subtotal</span><span>{subtotal} &#8376;</span></div>
                <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Service Fee (10%)</span><span>{serviceFee.toFixed(0)} &#8376;</span></div>
                <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Server Fee (2%)</span><span>{serverFee.toFixed(0)} &#8376;</span></div>
                <div className="h-[0.5px]" style={{ background: LG.separator }} />
                <div className="flex justify-between text-[30px] font-bold tracking-tight">
                  <span style={{ color: LG.label }}>Total</span>
                  <span style={{ color: LG.green }}>{total.toFixed(0)} &#8376;</span>
                </div>
              </div>

              <div className="lg-card p-4 flex gap-3.5">
                <div className="bubble-icon w-[40px] h-[40px] shrink-0" style={{ color: LG.green, cursor: 'default' }}>
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold" style={{ color: LG.label }}>Split Ready</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: LG.labelSecondary }}>Each guest pays only for their items.</p>
                </div>
              </div>
            </div>

            {/* Right — QR */}
            <div className="flex flex-col items-center text-center sticky top-5 pb-20 md:pb-5">
              <div className="lg-card p-8 mb-5">
                <div className="w-[220px] h-[220px] rounded-[20px] flex items-center justify-center p-4 liquid-glass-thin">
                  <div className="relative">
                    <QrCode size={180} style={{ color: LG.label }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, #3395FF, ${LG.blue})`, boxShadow: `0 4px 16px rgba(0,122,255,0.3)` }}>
                        <span className="text-white text-[20px] font-bold">J</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[17px] font-semibold mb-5" style={{ color: LG.label }}>Scan to Pay</p>

              <button onClick={() => onOpenGuest(session.tableNumber)}
                className="lg-btn lg-btn-blue w-full max-w-[320px] flex items-center justify-center gap-2">
                <Smartphone size={18} /> Open Guest View
              </button>
              <button onClick={() => setStep('payment_tracker')}
                className="lg-btn lg-btn-glass w-full max-w-[320px] mt-3 flex items-center justify-center gap-2">
                <ClipboardCheck size={18} /> Track Payments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===== PAYMENT TRACKER =====
  const renderPaymentTracker = () => {
    const guestCount = session?.guestCount || 0;
    const paidGuests = session?.paidGuests || [];
    const paidCount = paidGuests.length;
    const pendingCount = guestCount - paidCount;
    const allPaid = paidCount === guestCount && guestCount > 0;
    const progressPercent = guestCount > 0 ? (paidCount / guestCount) * 100 : 0;

    return (
      <div className="h-full flex flex-col relative overflow-hidden scene-default">
        <div className="ambient-orb w-[350px] h-[350px] -top-20 right-10" style={{ background: allPaid ? LG.green : LG.orange, opacity: 0.12 }} />

        <LiquidNav
          title="Payments"
          left={
            <button onClick={() => setStep('bill')} className="bubble-nav flex items-center gap-0" style={{ color: LG.blue }}>
              <ChevronLeft size={20} strokeWidth={2.5} /> Bill
            </button>
          }
          right={<span className="lg-badge" style={{ background: `${LG.green}15`, color: LG.green }}>Table {session?.tableNumber}</span>}
        />

        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 relative z-10">
          <div className="max-w-xl mx-auto">
            {/* Progress */}
            <div className="lg-card p-5 mb-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[34px] font-bold tracking-tight" style={{ color: allPaid ? LG.green : LG.label }}>{paidCount}</p>
                    <p className="text-[12px] font-semibold" style={{ color: LG.green }}>Paid</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[34px] font-bold tracking-tight" style={{ color: pendingCount > 0 ? LG.orange : LG.labelQuaternary }}>{pendingCount}</p>
                    <p className="text-[12px] font-semibold" style={{ color: LG.orange }}>Pending</p>
                  </div>
                </div>
                <p className="text-[34px] font-bold tracking-tight" style={{ color: allPaid ? LG.green : LG.label }}>{Math.round(progressPercent)}%</p>
              </div>
              <div className="w-full h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ background: allPaid ? `linear-gradient(90deg, ${LG.green}, #28B54E)` : `linear-gradient(90deg, ${LG.orange}, #FF6B00)` }}
                />
              </div>
            </div>

            {/* Guest List — bubble rows */}
            <div className="space-y-2 mb-4">
              {Array.from({ length: guestCount }).map((_, i) => {
                const guestId = `Client_${i + 1}` as GuestId;
                const isPaid = paidGuests.includes(guestId);
                const guestTotal = calculateGuestTotal(guestId);
                const guestItems = session?.orders.filter(item => item.assignedGuests.includes(guestId)) || [];
                return (
                  <div key={guestId} className="bubble-row flex items-center justify-between py-3.5 px-4" style={{ cursor: 'default' }}>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center" style={isPaid
                        ? { background: `linear-gradient(135deg, ${LG.green}, #28B54E)`, color: 'white', boxShadow: `0 2px 10px ${LG.green}40` }
                        : { background: 'rgba(120,120,128,0.08)', color: LG.orange }
                      }>
                        {isPaid ? <CircleCheckBig size={18} /> : <CircleDashed size={18} />}
                      </div>
                      <div>
                        <p className="text-[17px]" style={{ color: LG.label }}>Guest {i + 1}</p>
                        <p className="text-[13px]" style={{ color: LG.labelSecondary }}>{guestItems.length} items &bull; {guestTotal.toFixed(0)} &#8376;</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      {isPaid ? (
                        <span className="lg-badge text-white" style={{ background: `linear-gradient(135deg, ${LG.green}, #28B54E)` }}>Paid</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: LG.orange }}>
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {allPaid ? (
              <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                <div className="lg-card p-8 text-center">
                  <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${LG.green}15`, color: LG.green, boxShadow: `0 0 24px ${LG.green}20` }}>
                    <CircleCheckBig size={34} />
                  </div>
                  <h2 className="text-[22px] font-bold mb-1" style={{ color: LG.label }}>All Guests Paid!</h2>
                  <p className="text-[15px] mb-2" style={{ color: LG.labelSecondary }}>Total collected:</p>
                  <p className="text-[30px] font-bold tracking-tight" style={{ color: LG.green }}>{total.toFixed(0)} &#8376;</p>
                </div>

                <button 
                  onClick={handleFinishSession} 
                  disabled={isFinishing}
                  className="lg-btn lg-btn-blue w-full py-4 text-[17px] font-bold flex items-center justify-center gap-2 mb-3"
                >
                  {isFinishing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={20} strokeWidth={2.5} />
                      Finish & Save
                    </>
                  )}
                </button>

                {/* Action grid — bubble cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Receipt, label: 'Receipt', color: LG.blue, action: () => setShowReceipt(true) },
                    { icon: ArrowRightLeft, label: 'Switch Table', color: LG.blue, action: () => { setSelectedTable(null); setShowReceipt(false); setStep('table_select'); } },
                    { icon: Printer, label: 'Print', color: LG.blue, action: () => { if (window.confirm('Print?')) window.print(); } },
                    { icon: RotateCcw, label: 'Close Without Saving', color: LG.red, action: () => { if (window.confirm('Are you sure you want to close without saving to database?')) handleCloseTable(); } },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action} className="bubble-card p-4 flex flex-col items-center gap-2.5">
                      <a.icon size={22} className="relative z-10" style={{ color: a.color }} />
                      <span className="text-[13px] font-semibold relative z-10" style={{ color: a.color === LG.red ? LG.red : LG.label }}>{a.label}</span>
                    </button>
                  ))}
                </div>

                {(() => {
                  const others = Object.entries(activeTables).filter(([n]) => Number(n) !== selectedTable);
                  if (!others.length) return null;
                  return (
                    <div className="lg-card p-4">
                      <p className="text-[11px] uppercase tracking-[0.1em] mb-3 flex items-center gap-1" style={{ color: LG.labelTertiary }}><Eye size={12} /> Other Tables</p>
                      <div className="flex gap-2 flex-wrap">
                        {others.map(([num, tbl]) => (
                          <button key={num}
                            onClick={() => { setSelectedTable(Number(num)); setShowReceipt(false); setStep('ordering'); }}
                            className="bubble-chip flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: LG.green, boxShadow: `0 0 8px ${LG.green}` }} />
                            <span className="font-semibold" style={{ color: LG.label }}>Table {num}</span>
                            <span style={{ color: LG.labelSecondary }}>{tbl.guestCount}G</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="lg-card p-4 text-center">
                  <p className="text-[15px]" style={{ color: LG.labelSecondary }}>Waiting for {pendingCount} guest{pendingCount !== 1 ? 's' : ''}...</p>
                </div>
                <div className="flex gap-2.5 justify-center">
                  <button onClick={() => { setSelectedTable(null); setStep('table_select'); }}
                    className="lg-btn lg-btn-glass lg-btn-sm flex items-center gap-1.5">
                    <ArrowRightLeft size={14} /> Switch
                  </button>
                  <button onClick={() => setShowReceipt(true)}
                    className="lg-btn lg-btn-glass lg-btn-sm flex items-center gap-1.5">
                    <Receipt size={14} /> Bill
                  </button>
                  <button onClick={handleFinishSession} disabled={isFinishing}
                    className="lg-btn lg-btn-blue lg-btn-sm flex items-center gap-1.5">
                    {isFinishing ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={14} />} 
                    Force Finish & Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Sheet */}
        <AnimatePresence>
          {showReceipt && session && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowReceipt(false); }}>
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 32, stiffness: 360 }}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-[24px] liquid-glass-elevated"
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <div className="flex justify-center pt-2.5 pb-1 sticky top-0 z-10"><div className="w-9 h-[5px] rounded-full" style={{ background: 'rgba(0,0,0,0.12)' }} /></div>

                <div className="px-5 pt-2 pb-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, #3395FF, ${LG.blue})`, boxShadow: `0 2px 10px rgba(0,122,255,0.3)` }}>
                        <span className="text-white text-[17px] font-bold">J</span>
                      </div>
                      <div>
                        <p className="text-[17px] font-semibold" style={{ color: LG.label }}>JenilPay</p>
                        <p className="text-[11px] uppercase tracking-wider" style={{ color: LG.labelTertiary }}>Receipt</p>
                      </div>
                    </div>
                    <button onClick={() => setShowReceipt(false)} className="bubble-icon w-[30px] h-[30px]" style={{ color: LG.labelSecondary }}>
                      <X size={16} />
                    </button>
                  </div>

                  <div className="lg-card p-3 text-center text-[13px] space-y-0.5" style={{ color: LG.labelSecondary }}>
                    <p>Table {session.tableNumber} &bull; {session.guestCount} Guests &bull; {selectedWaiter}</p>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>

                  <div className="lg-card">
                    {session.orders.map((item, idx) => (
                      <div key={item.id}>
                        <div className="flex justify-between py-2.5 px-4 text-[15px]">
                          <div className="flex-1">
                            <span style={{ color: LG.label }}>{idx + 1}. {item.name}</span>
                            {item.assignedGuests.length > 1 && <span className="text-[11px] ml-1" style={{ color: LG.green }}>Shared {item.assignedGuests.length}x</span>}
                          </div>
                          <span className="ml-4" style={{ color: LG.label }}>{item.price} &#8376;</span>
                        </div>
                        {idx < session.orders.length - 1 && <div className="lg-separator" />}
                      </div>
                    ))}
                  </div>

                  <div className="lg-card">
                    {Array.from({ length: session.guestCount }).map((_, i) => {
                      const gId = `Client_${i + 1}` as GuestId;
                      return (
                        <div key={gId}>
                          <div className="flex justify-between py-2.5 px-4 text-[15px]">
                            <span className="flex items-center gap-2" style={{ color: LG.label }}><CircleCheckBig size={14} style={{ color: LG.green }} /> Guest {i + 1}</span>
                            <span className="font-bold" style={{ color: LG.green }}>{calculateGuestTotal(gId).toFixed(0)} &#8376;</span>
                          </div>
                          {i < session.guestCount - 1 && <div className="lg-separator" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="lg-card p-4 space-y-2.5">
                    <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Subtotal</span><span>{subtotal} &#8376;</span></div>
                    <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Service (10%)</span><span>{serviceFee.toFixed(0)} &#8376;</span></div>
                    <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Server (2%)</span><span>{serverFee.toFixed(0)} &#8376;</span></div>
                    <div className="h-[0.5px]" style={{ background: LG.separator }} />
                    <div className="flex justify-between text-[24px] font-bold tracking-tight">
                      <span style={{ color: LG.label }}>Total</span>
                      <span style={{ color: LG.green }}>{total.toFixed(0)} &#8376;</span>
                    </div>
                  </div>

                  <p className="text-center text-[12px]" style={{ color: LG.labelTertiary }}>Thank you for dining with us! &bull; Powered by JenilPay</p>

                  <div className="flex gap-2.5">
                    <button onClick={() => window.print()} className="lg-btn lg-btn-glass flex-1 flex items-center justify-center gap-2 text-[15px] py-3">
                      <Printer size={16} /> Print
                    </button>
                    <button onClick={() => setShowReceipt(false)} className="lg-btn lg-btn-blue flex-1 flex items-center justify-center gap-2 text-[15px] py-3">
                      <Check size={16} /> Done
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ===== MAIN =====
  return (
    <div className="h-screen w-full select-none scene-default">
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} className="h-full w-full">
          {step === 'login' && renderLogin()}
          {step === 'table_select' && renderTableSelect()}
          {step === 'guest_count' && renderGuestCount()}
          {step === 'ordering' && renderOrdering()}
          {step === 'review' && renderReview()}
          {step === 'bill' && renderBill()}
          {step === 'payment_tracker' && renderPaymentTracker()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};