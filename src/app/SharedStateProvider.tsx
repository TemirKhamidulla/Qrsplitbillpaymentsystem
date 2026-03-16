import React, { createContext, useContext, useState } from 'react';
import { TableSession, OrderItem, SharedStateContextType, GuestId } from './types';

const SharedStateContext = createContext<SharedStateContextType | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTables, setActiveTables] = useState<Record<number, TableSession>>({});

  const startNewSession = (table: number, guests: number) => {
    const newSession: TableSession = {
      tableNumber: table,
      guestCount: guests,
      orders: [],
      status: 'active',
      paidGuests: []
    };
    setActiveTables(prev => ({ ...prev, [table]: newSession }));
  };

  const updateGuestCount = (table: number, count: number) => {
    setActiveTables(prev => {
      const session = prev[table];
      if (!session) return prev;
      return { ...prev, [table]: { ...session, guestCount: count } };
    });
  };

  const addToOrder = (table: number, item: OrderItem) => {
    setActiveTables(prev => {
      const session = prev[table];
      if (!session) return prev;
      return {
        ...prev,
        [table]: { ...session, orders: [...session.orders, item] }
      };
    });
  };

  const removeItem = (table: number, orderId: string) => {
    setActiveTables(prev => {
      const session = prev[table];
      if (!session) return prev;
      return {
        ...prev,
        [table]: { ...session, orders: session.orders.filter(o => o.id !== orderId) }
      };
    });
  };

  const closeTable = (table: number) => {
    setActiveTables(prev => {
      const newTables = { ...prev };
      delete newTables[table];
      return newTables;
    });
  };

  const markGuestPaid = (table: number, guestId: GuestId) => {
    setActiveTables(prev => {
      const session = prev[table];
      if (!session) return prev;
      if (session.paidGuests.includes(guestId)) return prev;
      return {
        ...prev,
        [table]: { ...session, paidGuests: [...session.paidGuests, guestId] }
      };
    });
  };

  const resetSystem = () => {
    setActiveTables({});
  };

  return (
    <SharedStateContext.Provider value={{
      activeTables,
      startNewSession,
      updateGuestCount,
      addToOrder,
      removeItem,
      markGuestPaid,
      closeTable,
      resetSystem
    }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};
