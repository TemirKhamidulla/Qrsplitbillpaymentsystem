import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, ChevronRight, ArrowLeft, Info, CircleCheck,
  Smartphone, Monitor, Share2, Copy
} from 'lucide-react';
import { useSharedState } from '../../SharedStateProvider';
import { GuestId } from '../../types';
import { LG } from '../../ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SVG Logo Components ---
const KaspiLogo = () => (
  <svg viewBox="0 0 200 60" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" rx="10" fill="#F04E37"/>
    <text x="16" y="43" fill="white" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="38" letterSpacing="-1">k</text>
    <text x="38" y="43" fill="white" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="38" letterSpacing="-1">a</text>
    <text x="62" y="43" fill="white" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="38" letterSpacing="-1">s</text>
    <text x="82" y="43" fill="white" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="38" letterSpacing="-1">p</text>
    <text x="106" y="43" fill="white" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="38" letterSpacing="-1">i</text>
    <circle cx="111" cy="14" r="5" fill="#00AEEF"/>
    <text x="120" y="43" fill="rgba(255,255,255,0.9)" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="28" letterSpacing="-0.5">.kz</text>
  </svg>
);

const VisaLogo = () => (
  <svg viewBox="0 0 50 30" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="30" rx="4" fill="white"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#1a1f71" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic">VISA</text>
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 50 30" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="30" rx="4" fill="#222"/>
    <circle cx="18" cy="15" r="10" fill="#EB001B" />
    <circle cx="32" cy="15" r="10" fill="#F79E1B" fillOpacity="0.85"/>
  </svg>
);

const ApplePayLogo = () => (
  <svg viewBox="0 0 60 30" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="30" rx="4" fill="black"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="bold" fontSize="14">Pay</text>
  </svg>
);

const GooglePayLogo = () => (
  <svg viewBox="0 0 60 30" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="30" rx="4" fill="white" stroke="#e0e0e0"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#5F6368" fontFamily="sans-serif" fontWeight="bold" fontSize="14">GPay</text>
  </svg>
);

type GuestStep = 'select_client' | 'personal_bill' | 'payment_method' | 'success';

interface GuestAppProps {
  tableId: number | null;
  onBack: () => void;
}

export const GuestApp: React.FC<GuestAppProps> = ({ tableId, onBack }) => {
  const { activeTables, markGuestPaid } = useSharedState();
  const session = tableId ? activeTables[tableId] : null;

  const [step, setStep] = useState<GuestStep>('select_client');
  const [selectedGuest, setSelectedGuest] = useState<GuestId | null>(null);
  const [tipPercent, setTipPercent] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center p-8 text-center relative overflow-hidden scene-default">
        <div className="ambient-orb w-[250px] h-[250px] top-20 right-10" style={{ background: LG.purple, opacity: 0.15 }} />
        <div className="lg-card p-8 max-w-sm relative z-10">
          <div className="bubble-icon w-[56px] h-[56px] mx-auto mb-4" style={{ color: LG.labelTertiary, cursor: 'default' }}>
            <Smartphone size={28} />
          </div>
          <h2 className="text-[22px] font-bold mb-2" style={{ color: LG.label }}>No Active Session</h2>
          <p className="text-[15px] mb-6" style={{ color: LG.labelSecondary }}>Ask the waiter to generate a QR code.</p>
          <button onClick={onBack} className="lg-btn lg-btn-glass lg-btn-sm">Back</button>
        </div>
      </div>
    );
  }

  const getGuestItems = (guestId: GuestId) =>
    session.orders.filter(item => item.assignedGuests.includes(guestId));

  const calculateGuestTotal = (guestId: GuestId) => {
    const guestItems = getGuestItems(guestId);
    let subtotal = 0;
    guestItems.forEach(item => { subtotal += item.price / item.assignedGuests.length; });
    const serviceFee = subtotal * 0.10;
    const serverFee = subtotal * 0.02;
    const tipAmount = tipPercent !== null ? (subtotal * (tipPercent / 100)) : parseFloat(customTip || '0');
    return { subtotal, serviceFee, serverFee, tipAmount, total: subtotal + serviceFee + serverFee + tipAmount };
  };

  const guestStats = selectedGuest ? calculateGuestTotal(selectedGuest) : null;

  // Floating glass nav with bubble back
  const GuestNav = ({ title, onBack: goBack }: { title: string; onBack: () => void }) => (
    <div className="px-4 pt-3 pb-2 sticky top-0 z-20">
      <div className="liquid-nav flex items-center px-3 h-[48px]">
        <button onClick={goBack} className="bubble-nav flex items-center gap-0 mr-auto" style={{ color: LG.blue }}>
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <h3 className="text-[17px] font-semibold absolute left-1/2 -translate-x-1/2" style={{ color: LG.label }}>{title}</h3>
      </div>
    </div>
  );

  // ===== SELECT CLIENT — bubble rows =====
  const renderSelectClient = () => (
    <div className="flex flex-col h-full relative overflow-hidden scene-default">
      <div className="ambient-orb w-[300px] h-[300px] -top-20 -right-20" style={{ background: LG.blue, opacity: 0.12 }} />
      <div className="ambient-orb w-[200px] h-[200px] bottom-20 left-10" style={{ background: LG.mint, opacity: 0.15 }} />

      <div className="px-5 pt-14 pb-3 relative z-10">
        <h1 className="text-[36px] font-bold tracking-tight leading-tight" style={{ color: LG.label }}>Table {session.tableNumber}</h1>
        <p className="text-[15px] mt-1" style={{ color: LG.labelSecondary }}>Select who you are</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 relative z-10">
        <div className="space-y-2">
          {Array.from({ length: session.guestCount }).map((_, i) => {
            const guestId = `Client_${i + 1}` as GuestId;
            const items = getGuestItems(guestId);
            const hasPaid = session.paidGuests.includes(guestId);

            return (
              <button key={guestId} disabled={hasPaid}
                onClick={() => { setSelectedGuest(guestId); setStep('personal_bill'); }}
                className={cn("w-full bubble-row flex items-center justify-between py-3.5 px-4", hasPaid && "opacity-55")}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                    style={hasPaid
                      ? { background: `linear-gradient(135deg, ${LG.green}, #28B54E)`, color: 'white', boxShadow: `0 2px 10px ${LG.green}40` }
                      : { background: 'rgba(120,120,128,0.06)', color: LG.labelSecondary }
                    }
                  >
                    {hasPaid ? <CircleCheck size={18} /> : <Users size={18} />}
                  </div>
                  <div className="text-left">
                    <p className="text-[17px]" style={{ color: LG.label }}>Guest {i + 1}</p>
                    <p className="text-[13px]" style={{ color: hasPaid ? LG.green : LG.labelSecondary }}>
                      {hasPaid ? 'Paid' : `${items.length} items`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  {hasPaid ? (
                    <span className="lg-badge text-white" style={{ background: `linear-gradient(135deg, ${LG.green}, #28B54E)` }}>Done</span>
                  ) : (
                    <>
                      {items.length > 0 && <span className="text-[15px] font-bold" style={{ color: LG.blue }}>{calculateGuestTotal(guestId).total.toFixed(0)} &#8376;</span>}
                      <ChevronRight size={18} style={{ color: LG.labelQuaternary }} />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-20 relative z-10">
        <button onClick={onBack} className="lg-btn lg-btn-glass w-full flex items-center justify-center gap-2 text-[15px]">
          <Monitor size={16} /> Back to Bill Overview
        </button>
      </div>
    </div>
  );

  // ===== PERSONAL BILL =====
  const renderPersonalBill = () => (
    <div className="flex flex-col h-full relative overflow-hidden scene-default">
      <div className="ambient-orb w-[250px] h-[250px] top-0 -right-10" style={{ background: LG.green, opacity: 0.1 }} />

      <GuestNav title={`${selectedGuest?.replace('_', ' ')}'s Bill`} onBack={() => setStep('select_client')} />

      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-4 relative z-10">
        {/* Items — bubble rows */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.12em] font-semibold ml-2 mb-1" style={{ color: LG.labelTertiary }}>Your Items</p>
          {getGuestItems(selectedGuest!).map((item) => {
            const isShared = item.assignedGuests.length > 1;
            return (
              <div key={item.id} className="bubble-row flex items-center justify-between py-3 px-4" style={{ cursor: 'default' }}>
                <div className="flex-1 relative z-10">
                  <p className="text-[17px]" style={{ color: LG.label }}>{item.name}</p>
                  <p className="text-[13px] flex items-center gap-1 mt-0.5" style={{ color: isShared ? LG.green : LG.labelSecondary }}>
                    {isShared ? <><Share2 size={11} /> Split {item.assignedGuests.length} ways</> : <><Copy size={11} /> Individual</>}
                  </p>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-[17px] font-bold" style={{ color: LG.label }}>{(item.price / item.assignedGuests.length).toFixed(0)} &#8376;</p>
                  {isShared && <p className="text-[12px] line-through" style={{ color: LG.labelTertiary }}>{item.price} &#8376;</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip — bubble segments */}
        <div className="lg-card p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-center mb-3" style={{ color: LG.labelTertiary }}>Add a Tip</p>
          <div className="flex p-[3px] rounded-[16px] mb-3 gap-1" style={{ background: 'rgba(120,120,128,0.06)' }}>
            {[0, 5, 10, 15].map(p => (
              <button key={p}
                onClick={() => { setTipPercent(p); setCustomTip(''); }}
                className={cn(
                  "flex-1 py-2.5 text-[15px] font-semibold text-center bubble-seg",
                  tipPercent === p && "bubble-seg-active"
                )}
                style={{ color: tipPercent === p ? LG.blue : 'rgba(0,0,0,0.3)' }}
              >
                {p}%
              </button>
            ))}
          </div>
          <input type="number" placeholder="Custom amount (₸)" value={customTip}
            onChange={(e) => { setCustomTip(e.target.value); setTipPercent(null); }}
            className="w-full py-3 px-4 rounded-[14px] text-[17px] text-center outline-none placeholder:text-black/18"
            style={{ background: 'rgba(120,120,128,0.06)', color: LG.label }}
          />
        </div>

        {/* Totals */}
        <div className="lg-card p-5 space-y-2.5">
          <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Subtotal</span><span>{guestStats?.subtotal.toFixed(0)} &#8376;</span></div>
          <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}>
            <span className="flex items-center gap-1">Service (10%) <Info size={13} /></span>
            <span>{guestStats?.serviceFee.toFixed(0)} &#8376;</span>
          </div>
          <div className="flex justify-between text-[15px]" style={{ color: LG.labelSecondary }}><span>Server (2%)</span><span>{guestStats?.serverFee.toFixed(0)} &#8376;</span></div>
          {(guestStats?.tipAmount ?? 0) > 0 && (
            <div className="flex justify-between text-[15px] font-semibold" style={{ color: LG.green }}><span>Tip</span><span>+{guestStats?.tipAmount.toFixed(0)} &#8376;</span></div>
          )}
          <div className="h-[0.5px]" style={{ background: LG.separator }} />
          <div className="flex justify-between text-[30px] font-bold tracking-tight">
            <span style={{ color: LG.label }}>Total</span>
            <span style={{ color: LG.label }}>{guestStats?.total.toFixed(0)} &#8376;</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 relative z-10">
        <button onClick={() => setStep('payment_method')} className="lg-btn lg-btn-green w-full flex items-center justify-center gap-2">
          Proceed to Pay
        </button>
      </div>
    </div>
  );

  // ===== PAYMENT METHOD — bubble rows =====
  const renderPaymentMethod = () => (
    <div className="flex flex-col h-full relative overflow-hidden scene-default">
      <div className="ambient-orb w-[300px] h-[300px] top-10 -right-20" style={{ background: LG.purple, opacity: 0.1 }} />

      <GuestNav title="Payment" onBack={() => setStep('personal_bill')} />

      <div className="px-4 pt-6 flex-1 overflow-y-auto relative z-10">
        <p className="text-center mb-6">
          <span className="text-[15px]" style={{ color: LG.labelSecondary }}>Pay </span>
          <span className="text-[30px] font-bold tracking-tight" style={{ color: LG.label }}>{guestStats?.total.toFixed(0)} &#8376;</span>
        </p>

        <div className="space-y-2">
          {[
            { id: 'kaspi', name: 'Kaspi QR', logo: <KaspiLogo /> },
            { id: 'card', name: 'Card Payment', logo: <div className="flex gap-1.5 h-5"><VisaLogo /><MastercardLogo /></div> },
            { id: 'apple', name: 'Apple Pay', logo: <ApplePayLogo /> },
            { id: 'google', name: 'Google Pay', logo: <GooglePayLogo /> },
          ].map((method) => (
            <button key={method.id}
              onClick={() => { setPaymentMethod(method.id); setTimeout(() => setStep('success'), 2000); }}
              className="w-full bubble-row flex items-center justify-between py-3.5 px-4"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-[38px] w-[58px] flex items-center justify-center rounded-[12px] p-1 bubble-icon" style={{ borderRadius: 12 }}>
                  {method.logo}
                </div>
                <span className="text-[17px]" style={{ color: LG.label }}>{method.name}</span>
              </div>
              <ChevronRight size={18} className="relative z-10" style={{ color: LG.labelQuaternary }} />
            </button>
          ))}
        </div>
      </div>

      {/* Processing overlay */}
      {paymentMethod && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'rgba(242,242,247,0.85)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}>
          <div className="bubble-icon w-[60px] h-[60px] mb-6" style={{ cursor: 'default' }}>
            <div className="w-[28px] h-[28px] border-[3px] rounded-full animate-spin" style={{ borderColor: `${LG.blue} transparent transparent transparent` }} />
          </div>
          <h3 className="text-[20px] font-semibold mb-1" style={{ color: LG.label }}>Processing...</h3>
          <p className="text-[15px]" style={{ color: LG.labelSecondary }}>Connecting to {paymentMethod}</p>
        </motion.div>
      )}
    </div>
  );

  // ===== SUCCESS =====
  const renderSuccess = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden scene-default">
      <div className="ambient-orb w-[400px] h-[400px] top-1/4 left-1/4" style={{ background: LG.green, opacity: 0.12 }} />

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 18 }} className="w-full max-w-sm relative z-10">

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
          className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto mb-6"
          style={{
            background: `linear-gradient(135deg, ${LG.green}, #28B54E)`,
            boxShadow: `0 8px 32px ${LG.green}40`,
            color: 'white',
          }}>
          <CircleCheck size={42} />
        </motion.div>

        <h1 className="text-[30px] font-bold tracking-tight mb-2" style={{ color: LG.label }}>Payment Successful!</h1>
        <p className="text-[15px] mb-8" style={{ color: LG.labelSecondary }}>Your receipt has been sent.</p>

        <div className="lg-card p-5 mb-8 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] uppercase tracking-[0.12em] font-semibold" style={{ color: LG.labelTertiary }}>Reference</span>
            <span className="text-[15px] font-mono" style={{ color: LG.label }}>#KS-8271-X</span>
          </div>
          <div className="h-[0.5px]" style={{ background: LG.separator }} />
          <div className="flex justify-between items-center mt-3">
            <span className="text-[11px] uppercase tracking-[0.12em] font-semibold" style={{ color: LG.labelTertiary }}>Paid</span>
            <span className="text-[24px] font-bold tracking-tight" style={{ color: LG.green }}>{guestStats?.total.toFixed(0)} &#8376;</span>
          </div>
        </div>

        <button onClick={() => {
            if (tableId && selectedGuest) markGuestPaid(tableId, selectedGuest);
            setSelectedGuest(null); setTipPercent(null); setCustomTip('');
            setPaymentMethod(null); setStep('select_client');
          }}
          className="lg-btn lg-btn-blue w-full">Done</button>
      </motion.div>
    </div>
  );

  // ===== MAIN =====
  return (
    <div className="h-screen w-full max-w-md mx-auto relative overflow-hidden scene-default md:my-6 md:h-[calc(100vh-48px)] md:rounded-[40px] md:border md:border-white/30"
      style={{ boxShadow: '0 0 60px rgba(0,0,0,0.06)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }} className="h-full w-full">
          {step === 'select_client' && renderSelectClient()}
          {step === 'personal_bill' && renderPersonalBill()}
          {step === 'payment_method' && renderPaymentMethod()}
          {step === 'success' && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};