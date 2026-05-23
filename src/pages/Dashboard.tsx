import { useAppStore } from '@/store/useAppStore';

export function Dashboard() {
  const stocks = useAppStore((state) => state.stocks);
  const transactions = useAppStore((state) => state.transactions);

  const totalValue = stocks.reduce(
    (sum, stock) => sum + stock.quantity * stock.avgCost,
    0
  );

  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 보유 종목 수 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-gray-600 text-sm font-medium">보유 종목</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stocks.length}</div>
        </div>

        {/* 평가액 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-gray-600 text-sm font-medium">평가액</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {totalValue.toLocaleString()}
          </div>
        </div>

        {/* 거래 건수 */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="text-gray-600 text-sm font-medium">거래 기록</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{transactions.length}</div>
        </div>
      </div>

      {/* 최근 거래 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 거래</h2>

        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">거래 기록이 없습니다</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">날짜</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">종목</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">종류</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-700">주수</th>
                  <th className="text-right px-4 py-2 font-medium text-gray-700">가격</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{typeof tx.date === 'string' ? tx.date : new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-900">{tx.ticker}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.type === 'BUY'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {tx.type === 'BUY' ? '매수' : '매도'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{tx.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {tx.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
