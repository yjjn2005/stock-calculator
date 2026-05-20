import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getStockPrice } from '../services/yahooFinance';

interface StockWithPrice {
  id?: string;
  ticker: string;
  koreanName?: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currency: 'KRW' | 'USD';
  totalCost: number;
  totalValue: number;
  profit: number;
  returnRate: number;
}

export function Portfolio() {
  const { stocks, transactions } = useAppStore();
  const [stocksWithPrice, setStocksWithPrice] = useState<StockWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const updated = await Promise.all(
          stocks.map(async stock => {
            const price = await getStockPrice(stock.ticker, stock.currency);
            const currentPrice = price || stock.avgCost;
            const totalCost = stock.avgCost * stock.quantity;
            const totalValue = currentPrice * stock.quantity;
            const profit = totalValue - totalCost;
            const returnRate = stock.avgCost > 0
              ? ((currentPrice - stock.avgCost) / stock.avgCost) * 100
              : 0;

            return {
              ...stock,
              currentPrice,
              totalCost,
              totalValue,
              profit,
              returnRate,
            };
          })
        );
        setStocksWithPrice(updated);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [stocks]);

  const totalCost = stocksWithPrice.reduce((sum, s) => sum + s.totalCost, 0);
  const totalValue = stocksWithPrice.reduce((sum, s) => sum + s.totalValue, 0);
  const totalProfit = totalValue - totalCost;
  const totalReturnRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">💼 포트폴리오</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-sm text-gray-600 mb-2">총 취득액</p>
            <p className="text-2xl font-bold text-gray-900">{totalCost.toFixed(0)}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-sm text-gray-600 mb-2">총 평가액</p>
            <p className="text-2xl font-bold text-blue-600">{totalValue.toFixed(0)}</p>
          </div>
          <div className={`bg-white rounded-lg p-6 shadow-md`}>
            <p className="text-sm text-gray-600 mb-2">총 손익</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(0)}
            </p>
          </div>
          <div className={`bg-white rounded-lg p-6 shadow-md`}>
            <p className="text-sm text-gray-600 mb-2">수익률</p>
            <p className={`text-2xl font-bold ${totalReturnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturnRate >= 0 ? '+' : ''}{totalReturnRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">보유 종목</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500">로드 중...</div>
          ) : stocksWithPrice.length === 0 ? (
            <div className="p-6 text-center text-gray-500">보유 종목이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">종목</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">주수</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">평균가</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">현재가</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">평가액</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">손익</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {stocksWithPrice.map(stock => (
                    <tr key={stock.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{stock.koreanName || stock.ticker}</div>
                        <div className="text-sm text-gray-500">{stock.ticker}</div>
                      </td>
                      <td className="px-6 py-4 text-right">{stock.quantity}</td>
                      <td className="px-6 py-4 text-right">{stock.avgCost}</td>
                      <td className="px-6 py-4 text-right">{stock.currentPrice.toFixed(0)}</td>
                      <td className="px-6 py-4 text-right font-medium">{stock.totalValue.toFixed(0)}</td>
                      <td className={`px-6 py-4 text-right font-medium ${stock.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.profit >= 0 ? '+' : ''}{stock.profit.toFixed(0)}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${stock.returnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.returnRate >= 0 ? '+' : ''}{stock.returnRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">최근 거래</h2>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">거래 기록이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">날짜</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">유형</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">종목</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">주수</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">가격</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">금액</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {tx.date instanceof Date ? tx.date.toLocaleDateString('ko-KR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          tx.type === 'BUY' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {tx.type === 'BUY' ? '매수' : '매도'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {tx.koreanName || tx.ticker}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">{tx.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm">{tx.price.toFixed(0)}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">{tx.amount.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
