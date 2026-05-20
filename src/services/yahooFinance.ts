import axios from 'axios';

const CACHE_DURATION = 60000; // 1분
const cache = new Map<string, { data: number; timestamp: number }>();

// 한글 종목명을 티커로 변환
const koreanToTicker: Record<string, string> = {
  '삼성전자': '005930.KS',
  '현대모비스': '012330.KS',
  '삼성증권': '016360.KS',
  'SK하이닉스': '000660.KS',
  '현대차': '005380.KS',
  'LG에너지솔루션': '373220.KS',
  'NVIDIA': 'NVDA',
  'Apple': 'AAPL',
  'Microsoft': 'MSFT',
  'Google': 'GOOGL',
  'Tesla': 'TSLA',
};

function getTicker(input: string): string {
  // 이미 티커인 경우
  if (input.includes('.') || input.length <= 5) {
    return input;
  }

  // 한글명 변환
  if (koreanToTicker[input]) {
    return koreanToTicker[input];
  }

  // 기본: 입력값이 티커라고 가정
  return input.toUpperCase();
}

export async function getStockPrice(
  ticker: string,
  currency: 'KRW' | 'USD' = 'KRW'
): Promise<number | null> {
  try {
    const normalizedTicker = getTicker(ticker);

    // 캐시 확인
    if (cache.has(normalizedTicker)) {
      const cached = cache.get(normalizedTicker)!;
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }

    // Yahoo Finance API (무료 대안)
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${normalizedTicker}?modules=price`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const price = response.data?.quoteSummary?.result?.[0]?.price?.regularMarketPrice?.raw;

    if (price) {
      cache.set(normalizedTicker, { data: price, timestamp: Date.now() });
      return price;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch price for ${ticker}:`, error);
    return null;
  }
}

export async function getMultiplePrices(
  tickers: string[]
): Promise<Record<string, number | null>> {
  const results: Record<string, number | null> = {};

  for (const ticker of tickers) {
    results[ticker] = await getStockPrice(ticker);
  }

  return results;
}

// 기본 환율 (실제로는 API에서 조회하지만, 간단히 고정값 사용)
export async function getExchangeRate(): Promise<number> {
  try {
    // 예: 1 USD = 1300 KRW
    // 실제로는 외부 API에서 조회할 수 있음
    return 1300;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 1300; // 기본값
  }
}
