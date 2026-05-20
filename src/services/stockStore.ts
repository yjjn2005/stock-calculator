import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Stock {
  id?: string;
  ticker: string;
  koreanName?: string;
  quantity: number;
  avgCost: number;
  currency: 'KRW' | 'USD';
  purchaseDate: Timestamp | Date;
  notes?: string;
}

export interface Transaction {
  id?: string;
  type: 'BUY' | 'SELL';
  ticker: string;
  koreanName?: string;
  quantity: number;
  price: number;
  amount: number;
  currency: 'KRW' | 'USD';
  date: Timestamp | Date;
  notes?: string;
}

export async function saveStock(userId: string, stock: Stock): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(db, `users/${userId}/stocks`),
      {
        ...stock,
        purchaseDate: stock.purchaseDate instanceof Timestamp ? stock.purchaseDate : new Date(stock.purchaseDate),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('Failed to save stock:', error);
    throw error;
  }
}

export async function updateStock(userId: string, stockId: string, stock: Partial<Stock>): Promise<void> {
  try {
    await updateDoc(doc(db, `users/${userId}/stocks/${stockId}`), {
      ...stock,
      purchaseDate: stock.purchaseDate instanceof Timestamp ? stock.purchaseDate : new Date(stock.purchaseDate),
    });
  } catch (error) {
    console.error('Failed to update stock:', error);
    throw error;
  }
}

export async function deleteStock(userId: string, stockId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, `users/${userId}/stocks/${stockId}`));
  } catch (error) {
    console.error('Failed to delete stock:', error);
    throw error;
  }
}

export async function loadStocks(userId: string): Promise<Stock[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/stocks`)
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Stock));
  } catch (error) {
    console.error('Failed to load stocks:', error);
    return [];
  }
}

export function watchStocks(
  userId: string,
  callback: (stocks: Stock[]) => void
): () => void {
  try {
    const q = query(collection(db, `users/${userId}/stocks`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stocks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Stock));
      callback(stocks);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Failed to watch stocks:', error);
    return () => {};
  }
}

export async function saveTransaction(userId: string, transaction: Transaction): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(db, `users/${userId}/transactions`),
      {
        ...transaction,
        date: transaction.date instanceof Timestamp ? transaction.date : new Date(transaction.date),
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('Failed to save transaction:', error);
    throw error;
  }
}

export async function loadTransactions(userId: string): Promise<Transaction[]> {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/transactions`)
    );
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Transaction))
      .sort((a, b) => {
        const timeA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
        const timeB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
        return timeB - timeA;
      });
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
}

export function watchTransactions(
  userId: string,
  callback: (transactions: Transaction[]) => void
): () => void {
  try {
    const q = query(collection(db, `users/${userId}/transactions`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Transaction))
        .sort((a, b) => {
          const timeA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
          const timeB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
          return timeB - timeA;
        });
      callback(transactions);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Failed to watch transactions:', error);
    return () => {};
  }
}
