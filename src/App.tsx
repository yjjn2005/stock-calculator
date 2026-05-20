import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useAppStore } from '@/store/useAppStore';
import { loadStocks, loadTransactions } from '@/services/stockStore';

import { Dashboard } from '@/pages/Dashboard';
import { BuyCalculator } from '@/pages/BuyCalculator';
import { SellByShares } from '@/pages/SellByShares';
import { SellByAmount } from '@/pages/SellByAmount';
import { Portfolio } from '@/pages/Portfolio';
import { Settings } from '@/pages/Settings';

function App() {
  const { setStocks, setTransactions } = useAppStore();

  useEffect(() => {
    const initializeData = async () => {
      const stocks = await loadStocks();
      const transactions = await loadTransactions();
      setStocks(stocks);
      setTransactions(transactions);
    };

    initializeData();
  }, [setStocks, setTransactions]);

  return (
    <Router basename="/stock-calculator">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buy" element={<BuyCalculator />} />
            <Route path="/sell-by-shares" element={<SellByShares />} />
            <Route path="/sell-by-amount" element={<SellByAmount />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
