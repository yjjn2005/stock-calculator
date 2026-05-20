import * as XLSX from 'xlsx';
import { Stock, Transaction } from '@/store/useAppStore';

export interface ExcelData {
  stocks: Stock[];
  transactions: Transaction[];
}

export function parseExcelFile(file: File): Promise<ExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });

        const stocks: Stock[] = [];
        const transactions: Transaction[] = [];

        // Parse 주식 sheet
        if (workbook.SheetNames.includes('주식') || workbook.SheetNames.includes('stocks')) {
          const sheetName = workbook.SheetNames.find(name =>
            name.toLowerCase().includes('주식') || name.toLowerCase().includes('stock')
          ) || workbook.SheetNames[0];

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          jsonData.forEach((row: any) => {
            if (row.ticker || row.종목번호) {
              stocks.push({
                id: Date.now().toString() + Math.random(),
                ticker: row.ticker || row.종목번호 || '',
                koreanName: row.koreanName || row.종목명 || '',
                quantity: parseInt(row.quantity || row.보유주수 || 0),
                avgCost: parseFloat(row.avgCost || row.평균가 || 0),
                currency: row.currency || row.통화 || 'KRW',
                purchaseDate: new Date(row.purchaseDate || row.매수일 || Date.now()),
                notes: row.notes || row.비고 || '',
              });
            }
          });
        }

        // Parse 거래 sheet
        const transactionSheetName = workbook.SheetNames.find(name =>
          name.toLowerCase().includes('거래') || name.toLowerCase().includes('transaction')
        );

        if (transactionSheetName) {
          const worksheet = workbook.Sheets[transactionSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          jsonData.forEach((row: any) => {
            if (row.ticker || row.종목번호) {
              transactions.push({
                id: Date.now().toString() + Math.random(),
                type: (row.type || row.거래유형 || 'BUY').toUpperCase() as 'BUY' | 'SELL',
                ticker: row.ticker || row.종목번호 || '',
                koreanName: row.koreanName || row.종목명 || '',
                quantity: parseInt(row.quantity || row.주수 || 0),
                price: parseFloat(row.price || row.가격 || 0),
                amount: parseFloat(row.amount || row.금액 || 0),
                currency: row.currency || row.통화 || 'KRW',
                date: new Date(row.date || row.거래일 || Date.now()),
                notes: row.notes || row.비고 || '',
              });
            }
          });
        }

        resolve({ stocks, transactions });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function validateExcelFile(file: File): { valid: boolean; error?: string } {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
  ];

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Excel or CSV 파일만 지원됩니다' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 5MB 이하여야 합니다' };
  }

  return { valid: true };
}
