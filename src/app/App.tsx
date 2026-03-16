import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { WaiterApp } from './components/waiter/WaiterApp';
import { GuestApp } from './components/guest/GuestApp';
import { AdminApp } from './components/admin/AdminApp';
import { SharedStateProvider } from './SharedStateProvider';
import { ThemeProvider } from './ThemeContext';
import { Monitor, Smartphone, Settings } from 'lucide-react';
import "../styles/fonts.css";

const AppInner: React.FC = () => {
  const [mode, setMode] = useState<'waiter' | 'guest' | 'admin'>('waiter');
  const [guestTableId, setGuestTableId] = useState<number | null>(null);
  const [waiterReturnStep, setWaiterReturnStep] = useState<string | null>(null);

  const handleOpenGuest = (tableId: number) => {
    setGuestTableId(tableId);
    setMode('guest');
  };

  const handleBackToBill = useCallback(() => {
    setWaiterReturnStep('bill');
    setMode('waiter');
  }, []);

  const handleWaiterConsumedStep = useCallback(() => {
    setWaiterReturnStep(null);
  }, []);

  return (
    <div className="min-h-screen font-sans relative scene-default">
      {/* iOS 26 Liquid Glass Floating Tab — bottom left */}
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 260, delay: 0.5 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="liquid-tab flex p-[3px] relative">
          {/* Floating selection pill */}
          <motion.div
            className="absolute top-[3px] bottom-[3px] rounded-[25px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.9) inset',
            }}
            animate={{
              left: mode === 'waiter' ? 3 : mode === 'guest' ? 'calc(33.33% + 1.5px)' : 'calc(66.66% + 1px)',
              width: 'calc(33.33% - 4.5px)',
            }}
            transition={{ type: "spring", damping: 26, stiffness: 380 }}
          />
          <button
            onClick={() => setMode('waiter')}
            className={`relative z-10 flex items-center gap-1.5 px-5 py-2.5 rounded-[25px] text-[13px] font-semibold bubble-seg ${
              mode === 'waiter' ? 'bubble-seg-active text-black/85' : 'text-black/35'
            }`}
          >
            <Monitor size={14} />
            Waiter
          </button>
          <button
            onClick={() => setMode('guest')}
            className={`relative z-10 flex items-center gap-1.5 px-5 py-2.5 rounded-[25px] text-[13px] font-semibold bubble-seg ${
              mode === 'guest' ? 'bubble-seg-active text-black/85' : 'text-black/35'
            }`}
          >
            <Smartphone size={14} />
            Guest
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`relative z-10 flex items-center gap-1.5 px-5 py-2.5 rounded-[25px] text-[13px] font-semibold bubble-seg ${
              mode === 'admin' ? 'bubble-seg-active text-black/85' : 'text-black/35'
            }`}
          >
            <Settings size={14} />
            Admin
          </button>
        </div>
      </motion.div>

      <div className={mode === 'waiter' ? '' : 'hidden'}>
        <WaiterApp
          onOpenGuest={handleOpenGuest}
          returnToStep={waiterReturnStep}
          onConsumeReturnStep={handleWaiterConsumedStep}
        />
      </div>
      <div className={mode === 'guest' ? '' : 'hidden'}>
        <GuestApp tableId={guestTableId} onBack={handleBackToBill} />
      </div>
      <div className={mode === 'admin' ? '' : 'hidden'}>
        <AdminApp />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SharedStateProvider>
        <AppInner />
      </SharedStateProvider>
    </ThemeProvider>
  );
};

export default App;