import { useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { parseExcelFile, validateExcelFile } from '@/services/excelParser';

export function FileImporter() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addStock, addTransaction } = useAppStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    const validation = validateExcelFile(file);
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error || 'Invalid file' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { stocks, transactions } = await parseExcelFile(file);

      // Add stocks
      stocks.forEach(stock => {
        addStock(stock);
      });

      // Add transactions
      transactions.forEach(transaction => {
        addTransaction(transaction);
      });

      setMessage({
        type: 'success',
        text: `✅ 성공! 종목 ${stocks.length}개, 거래 기록 ${transactions.length}개가 추가되었습니다.`,
      });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ 파일 처리 실패: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Excel 파일을 드래그앤드롭하세요
            </p>
            <p className="text-sm text-gray-600 mb-4">
              또는 클릭하여 파일을 선택하세요
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isLoading ? '처리 중...' : '파일 선택'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            지원 형식: .xlsx, .xls, .csv (최대 5MB)
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
