'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '@/utils/excelParser';
import { ProfessorData } from '@/types/professor';

interface FileUploadProps {
  onUploadSuccess: (professors: ProfessorData[]) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Check file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (!validExtensions.includes(extension)) {
      setError('Please upload an Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const professors = await parseExcelFile(file);
      onUploadSuccess(professors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600">Processing file...</p>
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-100 rounded-full">
                <FileSpreadsheet size={40} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Drop your Excel spreadsheet here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Upload size={16} />
                <span>Supports .xlsx, .xls, .csv</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-700">Upload Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Expected Columns Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-700 mb-2">Expected Spreadsheet Columns:</p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Name - First</li>
          <li>Name - Last</li>
          <li>Email</li>
          <li>For which semester you are declaring Office Hours?</li>
          <li>Where is your office (building and room number)?</li>
          <li>Please declare your Office Hours</li>
          <li>Meeting link for Online Office hours (Optional)</li>
          <li>Office Hours by appointment (checkbox)</li>
        </ul>
      </div>
    </div>
  );
}
