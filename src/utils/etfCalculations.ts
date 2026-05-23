// ETF 5년 수익 추계 계산 함수

export interface ETFRates {
  qqqm: number; // QQQM 연 수익률 (%)
  splg: number; // SPLG 연 수익률 (%)
  schd: number; // SCHD 연 수익률 (%)
  kdx: number;  // KODEX 연 수익률 (%)
}

export interface ETFCalculationResult {
  totFv: number;        // 세전 총 평가액
  totPrin: number;      // 총 원금
  totalProfit: number;  // 세전 총 수익
  totalTax: number;     // 세금 합계
  netFv: number;        // 세후 평가액
  netProfit: number;    // 세후 순이익
  yangTax: number;      // 양도소득세
  divTax: number;       // 배당소득세
  eff: number;          // 실효 세율 (%)
  netRet: number;       // 세후 수익률 (%)
}

// 월복리 미래가치 계산 (annuity formula)
export function fvAnn(pmt: number, ra: number, n: number = 60): number {
  const r = (1 + ra) ** (1 / 12) - 1;
  return pmt * (((1 + r) ** n - 1) / r);
}

// 전체 계산 (세금 포함)
export function calcAll(rates: ETFRates): ETFCalculationResult {
  const etfs = [
    { pmt: 250, r: rates.qqqm / 100, div: 0.004, name: 'QQQM' },   // 월 250만, 배당률 0.4%
    { pmt: 200, r: rates.splg / 100, div: 0.013, name: 'SPLG' },   // 월 200만, 배당률 1.3%
    { pmt: 50, r: rates.schd / 100, div: 0.034, name: 'SCHD' },    // 월 50만, 배당률 3.4%
    { pmt: 150, r: rates.kdx / 100, div: 0.020, name: 'KODEX' },   // 월 150만, 배당률 2.0%
  ];

  let totFv = 0;
  let totPrin = 0;
  let totOvCap = 0;  // 해외직구 자본차익만
  let totDiv = 0;

  etfs.forEach((e, i) => {
    const fv = fvAnn(e.pmt, e.r);
    const prin = e.pmt * 60;
    const gain = fv - prin;
    const divd = ((fv + prin) / 2) * e.div * 5;  // 평균 평가액 × 배당률 × 5년
    const cap = gain - divd;

    totFv += fv;
    totPrin += prin;
    totDiv += divd;

    if (i < 3) {
      // QQQM, SPLG, SCHD는 해외직구 (양도세 과세)
      totOvCap += cap;
    }
    // KODEX는 국내 상장 (매매차익 비과세)
  });

  // 양도소득세 (22% 분류과세)
  const deduction = 250 * 5; // 연 250만 × 5년 = 1250만
  const taxable = Math.max(totOvCap - deduction, 0);
  const yangTax = taxable * 0.22;

  // 배당소득세 (15.4%)
  const divTax = totDiv * 0.154;

  const totalTax = yangTax + divTax;
  const totalProfit = totFv - totPrin;
  const netProfit = totalProfit - totalTax;

  return {
    totFv,
    totPrin,
    totalProfit,
    totalTax,
    netFv: totFv - totalTax,
    netProfit,
    yangTax,
    divTax,
    eff: totalProfit > 0 ? (totalTax / totalProfit) * 100 : 0,
    netRet: totPrin > 0 ? (netProfit / totPrin) * 100 : 0,
  };
}

// 숫자 포맷 (억원/만원)
export function formatAmount(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toFixed(1) + '억';
  }
  return Math.round(n).toLocaleString() + '만';
}

// ETF별 상세 계산
export interface ETFDetail {
  name: string;
  ticker: string;
  monthlyAmount: number;
  rate: number;
  dividendRate: number;
  totalPrin: number;
  totalFv: number;
  gain: number;
  dividend: number;
  capitalGain: number;
  isTaxFree?: boolean;
}

export function calcETFDetails(rates: ETFRates): ETFDetail[] {
  const etfConfigs = [
    { name: 'QQQM 나스닥100', ticker: 'QQQM', pmt: 250, divRate: 0.004 },
    { name: 'SPLG S&P500', ticker: 'SPLG', pmt: 200, divRate: 0.013 },
    { name: 'SCHD 배당성장', ticker: 'SCHD', pmt: 50, divRate: 0.034 },
    { name: 'KODEX 200 국내', ticker: 'KODEX', pmt: 150, divRate: 0.020, isTaxFree: true },
  ];

  const ratesArray = [rates.qqqm, rates.splg, rates.schd, rates.kdx];

  return etfConfigs.map((cfg, i) => {
    const rate = ratesArray[i] / 100;
    const fv = fvAnn(cfg.pmt, rate);
    const prin = cfg.pmt * 60;
    const gain = fv - prin;
    const dividend = ((fv + prin) / 2) * cfg.divRate * 5;
    const capitalGain = gain - dividend;

    return {
      name: cfg.name,
      ticker: cfg.ticker,
      monthlyAmount: cfg.pmt,
      rate: ratesArray[i],
      dividendRate: cfg.divRate * 100,
      totalPrin: prin,
      totalFv: fv,
      gain,
      dividend,
      capitalGain,
      isTaxFree: cfg.isTaxFree,
    };
  });
}
