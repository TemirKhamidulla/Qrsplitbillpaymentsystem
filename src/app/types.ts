export type GuestId = 'Client_1' | 'Client_2' | 'Client_3' | 'Client_4' | 'Client_5' | 'Client_6';

export interface OrderItem {
  id: string; // unique instance id
  menuId: string;
  name: string;
  price: number;
  assignedGuests: GuestId[];
}

export interface TableSession {
  tableNumber: number;
  guestCount: number;
  orders: OrderItem[];
  status: 'active' | 'generating_bill' | 'paid';
  paidGuests: GuestId[];
}

export interface SharedStateContextType {
  activeTables: Record<number, TableSession>;
  startNewSession: (table: number, guests: number) => void;
  updateGuestCount: (table: number, count: number) => void;
  addToOrder: (table: number, item: OrderItem) => void;
  removeItem: (table: number, orderId: string) => void;
  markGuestPaid: (table: number, guestId: GuestId) => void;
  closeTable: (table: number) => void;
  resetSystem: () => void;
}