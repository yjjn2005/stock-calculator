import { create } from 'zustand';

export interface Stock {
  id: string;
  ticker: string;
  koreanName: string;
  quantity: number;
  avgCost: number;
  currency: 'KRW' | 'USD';
  purchaseDate: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  ticker: string;
  quantity: number;
  price: number;
  amount: number;
  currency: 'KRW' | 'USD';
  date: string;
  notes?: string;
}

export interface AppState {
  stocks: Stock[];
  transactions: Transaction[];
  exchangeRate: number;
  currency: 'KRW' | 'USD';

  // Actions
  setStocks: (stocks: Stock[]) => void;
  addStock: (stock: Stock) => void;
  updateStock: (id: string, stock: Partial<Stock>) => void;
  deleteStock: (id: string) => void;

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;

  setExchangeRate: (rate: number) => void;
  setCurrency: (currency: 'KRW' | 'USD') => void;
}

export const useAppStore = create<AppState>((set) => ({
  stocks: [],
  transactions: [],
  exchangeRate: 1200,
  currency: 'KRW',

  setStocks: (stocks) => set({ stocks }),
  addStock: (stock) => set((state) => ({ stocks: [...state.stocks, stock] })),
  updateStock: (id, stock) => set((state) => ({
    stocks: state.stocks.map((s) => s.id === id ? { ...s, ...stock } : s),
  })),
  deleteStock: (id) => set((state) => ({
    stocks: state.stocks.filter((s) => s.id !== id),
  })),

  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, transaction],
  })),

  setExchangeRate: (rate) => set({ exchangeRate: rate }),
  setCurrency: (currency) => set({ currency }),
}));
