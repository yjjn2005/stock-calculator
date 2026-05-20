import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { saveStock, saveTransaction } from '@/services/stockStore';

export function BuyCalculator() {
  const [stockName, setStockName] = useState('');
  const [ticker, setTicker] = useState('');
  const [investAmount, setInvestAmount] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addStock, addTransaction } = useAppStore();

  const calculateQuantity = () => {
    const amount = parseFloat(investAmount) || 0;
    const price = parseFloat(currentPrice) || 0;
    return price > 0 ? Math.floor(amount / price) : 0;
  };

  const quantity = calculateQuantity();
  const usedAmount = quantity * (parseFloat(currentPrice) || 0);
  const remainingAmount = (parseFloat(investAmount) || 0) - usedAmount;

  const handleSave = async () => {
    if (!stockName || !ticker || !investAmount || !currentPrice) {
      alert('모든 필수 항목을 입력하세요');
      return;
    }

    setIsSubmitting(true);

    try {
      const stock = {
        ticker,
        koreanName: stockName,
        quantity,
        avgCost: parseFloat(currentPrice),
        currency,
        purchaseDate: new Date(),
        notes,
      };

      const stockId = await saveStock(stock);
      addStock({ ...stock, id: stockId });

      const transaction = {
        type: 'BUY' as const,
        ticker,
        koreanName: stockName,
        quantity,
        price: parseFloat(currentPrice),
        amount: usedAmount,
        currency,
        date: new Date(),
        notes: notes || `Bought ${quantity} shares at ${currentPrice}`,
      };

      await saveTransaction(transaction);
      addTransaction(transaction);

      // Reset form
      setStockName('');
      setTicker('');
      setInvestAmount('');
      setCurrentPrice('');
      setNotes('');

      alert('저장되었습니다');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📈 매수 계산기</h1>

        <div className="space-y-6">
          {/* 종목 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종목명 (한글)
              </label>
              <input
                type="text"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                placeholder="예: 삼성전자"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종목번호/티커
              </label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="예: 005930"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 투자 정보 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              투자 금액
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="0"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'KRW' | 'USD')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="KRW">KRW</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* 현재가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재가
            </label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 계산 결과 */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">매수 가능 주수</p>
                <p className="text-2xl font-bold text-blue-600">{quantity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">실제 사용금액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usedAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">잔여금액</p>
                <p className="text-2xl font-bold text-red-600">
                  {remainingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 비고 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비고 (선택사항)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="메모를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
