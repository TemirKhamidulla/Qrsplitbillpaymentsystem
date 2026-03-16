export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

export const MENU_DATA: MenuItem[] = [
  // Appetizers
  { id: 'a1', name: 'Baursak Basket', price: 1200, category: 'Appetizers', description: 'Traditional Kazakh fried dough' },
  { id: 'a2', name: 'Horse Meat Carpaccio', price: 3500, category: 'Appetizers', description: 'Thinly sliced kazy with arugula' },
  { id: 'a3', name: 'Greek Salad', price: 2800, category: 'Appetizers', description: 'Fresh vegetables with feta' },
  
  // Mains
  { id: 'm1', name: 'Beshbarmak', price: 5800, category: 'Mains', description: 'Traditional meat with pasta sheets' },
  { id: 'm2', name: 'Grilled Ribeye', price: 12500, category: 'Mains', description: 'Local beef steak with vegetables' },
  { id: 'm3', name: 'Manty (5 pcs)', price: 3200, category: 'Mains', description: 'Steamed dumplings with meat' },
  { id: 'm4', name: 'Plov', price: 3800, category: 'Mains', description: 'Uzbek style rice with lamb' },
  
  // Drinks
  { id: 'd1', name: 'Black Tea with Milk', price: 800, category: 'Drinks', description: 'Pot of traditional tea' },
  { id: 'd2', name: 'Fresh Orange Juice', price: 1800, category: 'Drinks', description: '250ml' },
  { id: 'd3', name: 'Wine Glass (Saperavi)', price: 2500, category: 'Drinks', description: 'Red dry wine' },
  { id: 'd4', name: 'Local Beer (Draft)', price: 1500, category: 'Drinks', description: '0.5L' },
  
  // Desserts
  { id: 'ds1', name: 'Honey Cake', price: 2200, category: 'Desserts', description: 'Classic medovik' },
  { id: 'ds2', name: 'Kurt Selection', price: 1500, category: 'Desserts', description: 'Assorted dry cheese' },
];

export const CATEGORIES = ['Appetizers', 'Mains', 'Drinks', 'Desserts'];
