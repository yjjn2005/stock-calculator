import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeAuth } from '@/services/firebase';
import { Navigation } from '@/components/Navigation';

import { Dashboard } from '@/pages/Dashboard';
import { BuyCalculator } from '@/pages/BuyCalculator';
import { SellByShares } from '@/pages/SellByShares';
import { SellByAmount } from '@/pages/SellByAmount';
import { Portfolio } from '@/pages/Portfolio';
import { Settings } from '@/pages/Settings';

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
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
