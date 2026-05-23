import React, { useState, useEffect } from 'react';
import { calcAll, calcETFDetails, formatAmount, ETFRates, ETFCalculationResult } from '@/utils/etfCalculations';

export function ETFProjection() {
  const [tab, setTab] = useState('summary');
  const [rates, setRates] = useState<ETFRates>({
    qqqm: 12,
    splg: 10,
    schd: 8,
    kdx: 5,
  });
  const [result, setResult] = useState<ETFCalculationResult>(calcAll(rates));

  useEffect(() => {
    setResult(calcAll(rates));
  }, [rates]);

  const handleRateChange = (etf: keyof ETFRates, value: number) => {
    setRates((prev) => ({ ...prev, [etf]: value }));
  };

  const details = calcETFDetails(rates);
  const totalPrin = details.reduce((sum, d) => sum + d.totalPrin, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-amber-200 mb-3">
            일반계좌 · 5-YEAR PROJECTION
          </div>
          <h1 className="text-3xl font-bold mb-2">ETF 5년 수익 추계 & 세후 실수령 분석</h1>
          <p className="text-sm text-blue-100">
            월 650만원 일반계좌 전액 운용 · QQQM · SPLG · SCHD · KODEX 200 · 보수적 수익률 가정
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-blue-900 shadow-lg">
        <div className="max-w-4xl mx-auto flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'summary', label: '📊 종합 요약' },
            { id: 'projection', label: '📈 수익 추계' },
            { id: 'tax', label: '💰 세금 계산' },
            { id: 'simulator', label: '🔢 시뮬레이터' },
            { id: 'tips', label: '💡 절세 전략' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'text-amber-300 border-amber-400 bg-blue-950/50'
                  : 'text-blue-100 border-transparent hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Summary Tab */}
        {tab === 'summary' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-blue-900 pb-3 border-b-2 border-amber-500">
              📊 5년 투자 결과 종합 요약
            </h2>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
                <div className="text-xs text-blue-200 mb-2">5년 총 납입 원금</div>
                <div className="text-2xl font-bold font-serif mb-1">{formatAmount(result.totPrin)}</div>
                <div className="text-xs text-blue-300">650만 × 60개월</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
                <div className="text-xs text-blue-200 mb-2">세전 총 평가액</div>
                <div className="text-2xl font-bold font-serif mb-1">{formatAmount(result.totFv)}</div>
                <div className="text-xs text-blue-300">월 복리 FV 합산</div>
              </div>
              <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-4 text-white">
                <div className="text-xs text-red-200 mb-2">세금 합계</div>
                <div className="text-2xl font-bold font-serif mb-1">{formatAmount(result.totalTax)}</div>
                <div className="text-xs text-red-300">양도세 + 배당세</div>
              </div>
              <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-lg p-4 text-white">
                <div className="text-xs text-green-200 mb-2">세후 실수령 평가액</div>
                <div className="text-2xl font-bold font-serif mb-1">{formatAmount(result.netFv)}</div>
                <div className="text-xs text-green-300">원금 대비 세후 +{result.netRet.toFixed(1)}%</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
                <div className="text-xs text-blue-200 mb-2">세후 순이익</div>
                <div className="text-2xl font-bold font-serif mb-1">{formatAmount(result.netProfit)}</div>
                <div className="text-xs text-blue-300">세전 대비</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 text-white">
                <div className="text-xs text-blue-200 mb-2">실효 세율</div>
                <div className="text-2xl font-bold font-serif mb-1">{result.eff.toFixed(1)}%</div>
                <div className="text-xs text-blue-300">세금/세전수익</div>
              </div>
            </div>

            {/* Portfolio Composition */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                📐 포트폴리오 구성 비중
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <DonutChart details={details} totalPrin={totalPrin} />
                </div>
                <div className="space-y-3">
                  {details.map((d) => (
                    <div key={d.ticker} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: getETFColor(d.ticker) }}></div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-blue-900">{d.name}</div>
                        <div className="text-xs text-gray-500">
                          {((d.totalPrin / totalPrin) * 100).toFixed(1)}% · {formatAmount(d.totalPrin)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-4">해외직구 양도소득세</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">해외 자본차익 합계</span>
                    <span className="font-semibold text-blue-900">{formatAmount(details.slice(0, 3).reduce((s, d) => s + d.capitalGain, 0))}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>5년 기본공제 (250만×5)</span>
                    <span className="font-semibold">△{formatAmount(1250)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-blue-900">
                    <span>양도소득세 22%</span>
                    <span className="text-red-600">{formatAmount(result.yangTax)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-bold text-green-700 mb-4">배당소득세</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">5년 배당 합계</span>
                    <span className="font-semibold text-blue-900">{formatAmount(details.reduce((s, d) => s + d.dividend, 0))}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>연평균 배당</span>
                    <span className="font-semibold">약 {formatAmount(details.reduce((s, d) => s + d.dividend, 0) / 5)}/년 ✅</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-green-700">
                    <span>배당소득세 15.4%</span>
                    <span className="text-red-600">{formatAmount(result.divTax)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projection Tab */}
        {tab === 'projection' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-blue-900 pb-3 border-b-2 border-amber-500">
              📈 ETF별 5년 수익 추계
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-3 py-2 text-left">ETF</th>
                    <th className="px-3 py-2 text-center">월 투자액</th>
                    <th className="px-3 py-2 text-center">수익률</th>
                    <th className="px-3 py-2 text-center">5년 원금</th>
                    <th className="px-3 py-2 text-center">평가액</th>
                    <th className="px-3 py-2 text-center">자본차익</th>
                    <th className="px-3 py-2 text-center">배당</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d) => (
                    <tr key={d.ticker} className={d.isTaxFree ? 'bg-green-50' : 'bg-blue-50'}>
                      <td className="px-3 py-2 font-semibold text-blue-900">{d.name}</td>
                      <td className="px-3 py-2 text-center">{formatAmount(d.monthlyAmount)}</td>
                      <td className="px-3 py-2 text-center">{d.rate.toFixed(1)}%</td>
                      <td className="px-3 py-2 text-center">{formatAmount(d.totalPrin)}</td>
                      <td className="px-3 py-2 text-center font-bold">{formatAmount(d.totalFv)}</td>
                      <td className="px-3 py-2 text-center">{formatAmount(d.capitalGain)}</td>
                      <td className="px-3 py-2 text-center">{formatAmount(d.dividend)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 font-bold">
                    <td className="px-3 py-2">전체 합계</td>
                    <td className="px-3 py-2 text-center">{formatAmount(650)}</td>
                    <td className="px-3 py-2 text-center">—</td>
                    <td className="px-3 py-2 text-center">{formatAmount(result.totPrin)}</td>
                    <td className="px-3 py-2 text-center">{formatAmount(result.totFv)}</td>
                    <td className="px-3 py-2 text-center">{formatAmount(details.reduce((s, d) => s + d.capitalGain, 0))}</td>
                    <td className="px-3 py-2 text-center">{formatAmount(details.reduce((s, d) => s + d.dividend, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tax Tab */}
        {tab === 'tax' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-blue-900 pb-3 border-b-2 border-amber-500">
              💰 세금 계산 상세
            </h2>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                해외직구 양도소득세(22% 분류과세) · 배당소득세(15.4%) · KODEX 200 매매차익 비과세
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-blue-900 mb-4">해외직구 양도소득세</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">QQQM 자본차익</span>
                    <span className="text-blue-900 font-semibold">{formatAmount(details[0].capitalGain)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">SPLG 자본차익</span>
                    <span className="text-blue-900 font-semibold">{formatAmount(details[1].capitalGain)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">SCHD 자본차익</span>
                    <span className="text-blue-900 font-semibold">{formatAmount(details[2].capitalGain)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold pb-2 border-b">
                    <span>5년 기본공제</span>
                    <span>△{formatAmount(1250)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold pt-2">
                    <span>양도소득세 (22%)</span>
                    <span>{formatAmount(result.yangTax)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-green-700 mb-4">배당소득세</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-gray-600">5년 배당 합계</span>
                    <span className="text-blue-900 font-semibold">{formatAmount(details.reduce((s, d) => s + d.dividend, 0))}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold pb-2 border-b">
                    <span>연평균 배당</span>
                    <span>약 {formatAmount(details.reduce((s, d) => s + d.dividend, 0) / 5)}/년 ✅</span>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 border border-blue-200 mb-2">
                    종합과세 2,000만원 한도 내 안전
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>배당소득세 (15.4%)</span>
                    <span>{formatAmount(result.divTax)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4">💡 절세 포인트</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="text-amber-600 font-bold">1</div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">연 250만원 기본공제 매년 확정</div>
                    <p className="text-gray-600">
                      매년 12월 해외주식 수익 250만원 확정 후 재매수 → 연 55만원 절세 · 5년 누적 275만원
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-green-600 font-bold">2</div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">KODEX 200 매매차익 비과세 ✅</div>
                    <p className="text-gray-600">
                      국내 상장 ETF 매매차익은 양도세 없음 → 자본차익 674만원 전액 비과세
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simulator Tab */}
        {tab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-blue-900 pb-3 border-b-2 border-amber-500">
              🔢 수익률 시뮬레이터
            </h2>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-blue-900 mb-6">수익률 가정 조정 (슬라이더)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { key: 'qqqm', label: 'QQQM 연 수익률', min: 5, max: 25 },
                  { key: 'splg', label: 'SPLG 연 수익률', min: 3, max: 18 },
                  { key: 'schd', label: 'SCHD 연 수익률', min: 3, max: 14 },
                  { key: 'kdx', label: 'KODEX 연 수익률', min: 1, max: 12 },
                ].map((cfg) => (
                  <div key={cfg.key} className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <label className="font-semibold text-blue-900 text-sm">{cfg.label}</label>
                      <span className="font-bold text-lg text-blue-900">{rates[cfg.key as keyof ETFRates]}%</span>
                    </div>
                    <input
                      type="range"
                      min={cfg.min}
                      max={cfg.max}
                      value={rates[cfg.key as keyof ETFRates]}
                      onChange={(e) => handleRateChange(cfg.key as keyof ETFRates, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">세전 총 평가액</div>
                  <div className="font-bold text-blue-900">{formatAmount(result.totFv)}</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">세금 합계</div>
                  <div className="font-bold text-red-600">{formatAmount(result.totalTax)}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">세후 실수령</div>
                  <div className="font-bold text-green-600">{formatAmount(result.netFv)}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">세후 수익률</div>
                  <div className="font-bold text-amber-700">+{result.netRet.toFixed(1)}%</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-600 mb-1">실효 세율</div>
                  <div className="font-bold text-gray-800">{result.eff.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-3 py-2 text-left">시나리오</th>
                    <th className="px-3 py-2 text-center">세전 평가액</th>
                    <th className="px-3 py-2 text-center">세금</th>
                    <th className="px-3 py-2 text-center">세후 평가액</th>
                    <th className="px-3 py-2 text-center">원금 대비</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-red-50">
                    <td className="px-3 py-2 font-semibold">🔻 보수 (약세장)</td>
                    <td className="px-3 py-2 text-center text-sm">약 4.4억</td>
                    <td className="px-3 py-2 text-center text-sm">약 900만</td>
                    <td className="px-3 py-2 text-center text-sm">약 4.3억</td>
                    <td className="px-3 py-2 text-center text-green-600 font-semibold">+10%</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="px-3 py-2 font-semibold">📊 기준 (현재)</td>
                    <td className="px-3 py-2 text-center text-sm">{formatAmount(result.totFv)}</td>
                    <td className="px-3 py-2 text-center text-sm">{formatAmount(result.totalTax)}</td>
                    <td className="px-3 py-2 text-center text-sm">{formatAmount(result.netFv)}</td>
                    <td className="px-3 py-2 text-center text-green-600 font-semibold">+{result.netRet.toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-2 font-semibold">🚀 낙관 (강세장)</td>
                    <td className="px-3 py-2 text-center text-sm">약 5.7억</td>
                    <td className="px-3 py-2 text-center text-sm">약 2,300만</td>
                    <td className="px-3 py-2 text-center text-sm">약 5.5억</td>
                    <td className="px-3 py-2 text-center text-green-600 font-semibold">+41%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {tab === 'tips' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-blue-900 pb-3 border-b-2 border-amber-500">
              💡 절세 전략 핵심 가이드
            </h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                <h3 className="font-bold text-blue-900 mb-3">Tip 1 — 연 250만원 기본공제 매년 확정</h3>
                <p className="text-gray-700 text-sm mb-4">
                  QQQM·SPLG의 매매차익은 <span className="font-semibold">22% 양도소득세 분류과세</span> → 종합과세 2,000만원 계산에서 완전 제외됩니다.
                </p>
                <div className="bg-amber-50 border border-amber-300 rounded p-3">
                  <div className="text-sm text-amber-900">
                    💰 매년 12월 수익 250만원 확정 후 재매수 → 연 <span className="font-bold">55만원</span> 절세 · 5년 누계 <span className="font-bold">275만원</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <h3 className="font-bold text-blue-900 mb-3">Tip 2 — 배우자 증여 후 매도 (양도세 제로화)</h3>
                <p className="text-gray-700 text-sm mb-4">
                  큰 수익 발생 시 매도 전 배우자에게 증여하세요. 10년간 6억원 공제, 증여 후 취득 단가가 시가로 재설정됩니다.
                </p>
                <div className="bg-green-50 border border-green-300 rounded p-3">
                  <div className="text-sm text-green-900">
                    예시: QQQM 2억 평가 · 원금 1.5억 → 배우자 증여 후 매도 시 양도세 <span className="font-bold">≈ 0원</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-900 mb-3">Tip 3 — 배당 종합과세 모니터링</h3>
                <p className="text-gray-700 text-sm mb-4">
                  현재 연평균 배당 약 290만원 수준으로 2,000만원 한도 내 안전합니다. <span className="font-semibold">SCHD 비중을 확대할 경우 재확인</span>이 필요합니다.
                </p>
                <div className="bg-blue-50 border border-blue-300 rounded p-3">
                  <div className="text-sm text-blue-900">
                    ⚠️ 연 배당 합산 2,000만원 초과 시 → 종합과세 대상 (최대 세율 49.5%) · SCHD 비중 조절 필요
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow p-6 text-white">
                <h3 className="font-bold mb-4 text-amber-300">📝 실행 체크리스트</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="text-amber-300">☑</span>
                    <span>매년 12월 해외주식 수익 250만원 확정·재매수 (기본공제 활용)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-300">☑</span>
                    <span>큰 수익 시 배우자 증여 후 매도 → 양도세 제로화 전략</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-blue-300">☑</span>
                    <span>배당 연간 합산액 모니터링 (현재 약 290만원 · 안전 구간)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-purple-300">☑</span>
                    <span>QQQM/SPLG 비중 유지 → 양도세 22% 분류과세 (종합과세 비합산)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Donut Chart Component
function DonutChart({ details, totalPrin }: any) {
  const colors = ['#1A2D5A', '#2980B9', '#C9A84C', '#1A7F37'];
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;

    const cx = 80, cy = 80, ro = 66, ri = 42;
    const segs = details.map((d: any, i: number) => ({
      v: (d.totalPrin / totalPrin) * 100,
      c: colors[i],
    }));

    let s = -Math.PI / 2;
    segs.forEach((d: any) => {
      const a = (d.v / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, ro, s, s + a);
      ctx.closePath();
      ctx.fillStyle = d.c;
      ctx.fill();
      s += a;
    });

    ctx.beginPath();
    ctx.arc(cx, cy, ri, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#0D1B3E';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('650만/월', cx, cy);
  }, [details, totalPrin]);

  return <canvas ref={canvas} width="160" height="160" />;
}

function getETFColor(ticker: string): string {
  const colors: Record<string, string> = {
    QQQM: '#1A2D5A',
    SPLG: '#2980B9',
    SCHD: '#C9A84C',
    KODEX: '#1A7F37',
  };
  return colors[ticker] || '#999';
}
