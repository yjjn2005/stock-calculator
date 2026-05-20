import { useAppStore } from '@/store/useAppStore';

export function Settings() {
  const { currency, exchangeRate, setCurrency, setExchangeRate } = useAppStore();
  const [rate, setRate] = React.useState(exchangeRate.toString());

  const handleSaveRate = () => {
    const numRate = parseFloat(rate) || 0;
    setExchangeRate(numRate);
    alert('환율이 저장되었습니다');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">⚙️ 설정</h1>

        <div className="space-y-6">
          {/* 기본 통화 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기본 통화
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currency"
                  value="KRW"
                  checked={currency === 'KRW'}
                  onChange={(e) => setCurrency(e.target.value as 'KRW' | 'USD')}
                  className="mr-2"
                />
                <span className="text-gray-700">대한민국 원 (KRW)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={currency === 'USD'}
                  onChange={(e) => setCurrency(e.target.value as 'KRW' | 'USD')}
                  className="mr-2"
                />
                <span className="text-gray-700">미국 달러 (USD)</span>
              </label>
            </div>
          </div>

          {/* 환율 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              USD → KRW 환율
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveRate}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                저장
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">예: 1,200 (1 USD = 1,200 KRW)</p>
          </div>

          {/* 데이터 관리 */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">데이터 관리</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition">
                📥 데이터 내보내기
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition">
                📤 데이터 불러오기
              </button>
              <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition">
                🗑️ 모든 데이터 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
