import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getStockPrice } from '../services/yahooFinance';
import { saveTransaction } from '../services/stockStore';
import { useNavigate } from 'react-router-dom';

export function SellByAmount() {
  const navigate = useNavigate();
  const { stocks, addTransaction } = useAppStore();
  const [selectedStock, setSelectedStock] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceError, setPriceError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedStockData = stocks.find(s => s.id === selectedStock);

  useEffect(() => {
    if (!selectedStockData) return;

    const fetchPrice = async () => {
      setIsPriceLoading(true);
      setPriceError('');
      try {
        const price = await getStockPrice(selectedStockData.ticker, selectedStockData.currency);
        if (price) {
          setCurrentPrice(price.toString());
        } else {
          setPriceError('Failed to fetch current price. Please enter manually.');
        }
      } catch (error) {
        setPriceError('Error fetching price. Please enter manually.');
        console.error(error);
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchPrice();
  }, [selectedStock, selectedStockData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStockData || !targetAmount || !currentPrice) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(targetAmount);
    const price = parseFloat(currentPrice);

    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const requiredShares = Math.floor(amount / price);

    if (requiredShares <= 0 || requiredShares > selectedStockData.quantity) {
      alert(
        `Amount requires ${requiredShares} shares, but you only have ${selectedStockData.quantity} shares.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const actualAmount = requiredShares * price;
      const profit = (price - selectedStockData.avgCost) * requiredShares;
      const returnRate = selectedStockData.avgCost > 0
        ? ((price - selectedStockData.avgCost) / selectedStockData.avgCost) * 100
        : 0;

      const transaction = {
        type: 'SELL' as const,
        ticker: selectedStockData.ticker,
        koreanName: selectedStockData.koreanName,
        quantity: requiredShares,
        price,
        amount: actualAmount,
        currency: selectedStockData.currency,
        date: new Date(),
        notes: `Sold ${requiredShares} shares (목표금액: ${amount}) at ${price}. Profit: ${profit.toFixed(0)}`,
      };

      await saveTransaction(transaction);
      addTransaction(transaction);

      setSuccessMessage(
        `Successfully sold ${requiredShares} shares for ${actualAmount.toFixed(0)} ${selectedStockData.currency}!`
      );

      // Reset form
      setSelectedStock('');
      setTargetAmount('');
      setCurrentPrice('');

      // Navigate to portfolio after 2 seconds
      setTimeout(() => navigate('/portfolio'), 2000);
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredShares = selectedStockData && targetAmount && currentPrice
    ? Math.floor(parseFloat(targetAmount) / parseFloat(currentPrice))
    : 0;

  const actualAmount = requiredShares && currentPrice
    ? requiredShares * parseFloat(currentPrice)
    : 0;

  const profit = selectedStockData && requiredShares && currentPrice
    ? (parseFloat(currentPrice) - selectedStockData.avgCost) * requiredShares
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">💰 매도 계산기 (금액 기준)</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종목 선택
            </label>
            <select
              value={selectedStock}
              onChange={(e) => {
                setSelectedStock(e.target.value);
                setCurrentPrice('');
                setPriceError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- 종목을 선택하세요 --</option>
              {stocks.map(stock => (
                <option key={stock.id} value={stock.id}>
                  {stock.koreanName || stock.ticker} ({stock.quantity}주)
                </option>
              ))}
            </select>
          </div>

          {selectedStockData && (
            <>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">평균 취득 단가</p>
                  <p className="text-lg font-semibold">{selectedStockData.avgCost} {selectedStockData.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">보유 주수</p>
                  <p className="text-lg font-semibold">{selectedStockData.quantity}주</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 금액
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="목표 금액을 입력하세요"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    현재가
                  </label>
                  {isPriceLoading && <span className="text-sm text-blue-600">조회 중...</span>}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => {
                    setCurrentPrice(e.target.value);
                    setPriceError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="현재가를 입력하세요"
                />
                {priceError && <p className="text-sm text-red-600 mt-1">{priceError}</p>}
              </div>

              {targetAmount && currentPrice && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-700">필요 주수</span>
                    <span className="font-semibold">
                      {requiredShares}주 {requiredShares > selectedStockData.quantity && '(⚠️ 부족)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">실제 매도액</span>
                    <span className="font-semibold">{actualAmount.toFixed(0)} {selectedStockData.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">예상 손익</span>
                    <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profit >= 0 ? '+' : ''}{profit.toFixed(0)} {selectedStockData.currency}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !targetAmount || !currentPrice || (requiredShares > selectedStockData.quantity)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {isSubmitting ? '처리 중...' : '매도 완료'}
              </button>
            </>
          )}
        </form>

        {stocks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">보유 중인 종목이 없습니다. 먼저 매수해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
