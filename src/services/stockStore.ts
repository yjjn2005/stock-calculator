import { Stock, Transaction } from '@/store/useAppStore';

const STOCKS_KEY = 'stocks';
const TRANSACTIONS_KEY = 'transactions';

export async function saveStock(stock: Stock): Promise<string> {
  const stocks = getStocksFromStorage();
  const id = stock.id || Date.now().toString();
  const newStock = { ...stock, id };
  stocks.push(newStock);
  localStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
  return id;
}

export async function updateStock(id: string, stock: Stock): Promise<void> {
  const stocks = getStocksFromStorage();
  const index = stocks.findIndex(s => s.id === id);
  if (index !== -1) {
    stocks[index] = { ...stock, id };
    localStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
  }
}

export async function deleteStock(id: string): Promise<void> {
  const stocks = getStocksFromStorage().filter(s => s.id !== id);
  localStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
}

export async function loadStocks(): Promise<Stock[]> {
  return getStocksFromStorage();
}

export function watchStocks(callback: (stocks: Stock[]) => void): () => void {
  callback(getStocksFromStorage());

  const handleStorageChange = () => {
    callback(getStocksFromStorage());
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

export async function saveTransaction(transaction: Transaction): Promise<string> {
  const transactions = getTransactionsFromStorage();
  const id = transaction.id || Date.now().toString();
  const newTransaction = {
    ...transaction,
    id,
    date: new Date().toISOString(),
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  return id;
}

export async function loadTransactions(): Promise<Transaction[]> {
  return getTransactionsFromStorage();
}

export function watchTransactions(callback: (transactions: Transaction[]) => void): () => void {
  callback(getTransactionsFromStorage());

  const handleStorageChange = () => {
    callback(getTransactionsFromStorage());
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

function getStocksFromStorage(): Stock[] {
  try {
    const data = localStorage.getItem(STOCKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Failed to load stocks from storage');
    return [];
  }
}

function getTransactionsFromStorage(): Transaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Failed to load transactions from storage');
    return [];
  }
}
