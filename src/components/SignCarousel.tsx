'use client';

import { useRef, useState, useCallback } from 'react';
import { ProfessorData } from '@/types/professor';
import SignCard from './SignCard';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  FileDown,
  Archive,
} from 'lucide-react';
import {
  exportSignToPdf,
  exportAllSignsToPdf,
  exportAllSignsAsZip,
  downloadBlob,
  printElement,
} from '@/utils/pdfExport';

interface SignCarouselProps {
  professors: ProfessorData[];
  onUpdateProfessor: (index: number, updated: ProfessorData) => void;
}

export default function SignCarousel({
  professors,
  onUpdateProfessor,
}: SignCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const signRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const setSignRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      signRefs.current.set(index, element);
    } else {
      signRefs.current.delete(index);
    }
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : professors.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < professors.length - 1 ? prev + 1 : 0));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrint = () => {
    const element = signRefs.current.get(currentIndex);
    if (element) {
      printElement(element);
    }
  };

  const handleDownloadCurrent = async () => {
    const element = signRefs.current.get(currentIndex);
    if (!element) return;

    setIsExporting(true);
    try {
      const blob = await exportSignToPdf(element, professors[currentIndex]);
      const filename = `${professors[currentIndex].lastName}_${professors[currentIndex].firstName}_office_hours.pdf`.replace(
        /\s+/g,
        '_'
      );
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAllPdf = async () => {
    setIsExporting(true);
    try {
      // We need to ensure all signs are rendered
      const elements: HTMLElement[] = [];
      for (let i = 0; i < professors.length; i++) {
        const element = signRefs.current.get(i);
        if (element) {
          elements.push(element);
        }
      }

      if (elements.length !== professors.length) {
        alert('Please wait for all signs to load before exporting.');
        setIsExporting(false);
        return;
      }

      const blob = await exportAllSignsToPdf(elements, professors);
      downloadBlob(blob, 'office_hours_signs.pdf');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    try {
      const elements: HTMLElement[] = [];
      for (let i = 0; i < professors.length; i++) {
        const element = signRefs.current.get(i);
        if (element) {
          elements.push(element);
        }
      }

      if (elements.length !== professors.length) {
        alert('Please wait for all signs to load before exporting.');
        setIsExporting(false);
        return;
      }

      const blob = await exportAllSignsAsZip(elements, professors);
      downloadBlob(blob, 'office_hours_signs.zip');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export ZIP. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const currentProfessor = professors[currentIndex];

  return (
    <div className="w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Previous sign"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-500">Professor</p>
            <p className="font-semibold text-lg">
              {currentProfessor.firstName} {currentProfessor.lastName}
            </p>
            <p className="text-sm text-gray-400">
              {currentIndex + 1} of {professors.length}
            </p>
          </div>
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Next sign"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            title="Print current sign"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownloadCurrent}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            title="Download current sign as PDF"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>

          {professors.length > 1 && (
            <div className="relative group">
              <button
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                title="Bulk download options"
              >
                <FileDown size={18} />
                <span className="hidden sm:inline">Bulk Download</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button
                  onClick={handleDownloadAllPdf}
                  disabled={isExporting}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                >
                  <FileDown size={16} />
                  All as single PDF
                </button>
                <button
                  onClick={handleDownloadAllZip}
                  disabled={isExporting}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 rounded-b-lg"
                >
                  <Archive size={16} />
                  All as ZIP (PNGs)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professor Quick Navigation */}
      {professors.length > 1 && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-2">Quick Navigation</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {professors.map((prof, index) => (
              <button
                key={prof.id}
                onClick={() => goToIndex(index)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-[#081E3F] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {prof.lastName}, {prof.firstName.charAt(0)}.
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-lg">Generating export...</p>
          </div>
        </div>
      )}

      {/* Sign Display - Show current sign prominently */}
      <div className="overflow-auto pb-8">
        <SignCard
          key={currentProfessor.id}
          professor={currentProfessor}
          onUpdate={(updated) => onUpdateProfessor(currentIndex, updated)}
          ref={(el) => setSignRef(currentIndex, el)}
        />
      </div>

      {/* Hidden signs for bulk export - render all others off-screen */}
      <div className="absolute left-[-9999px] top-0">
        {professors.map((professor, index) =>
          index !== currentIndex ? (
            <SignCard
              key={professor.id}
              professor={professor}
              showEditButton={false}
              ref={(el) => setSignRef(index, el)}
            />
          ) : null
        )}
      </div>

      {/* Page Dots */}
      {professors.length > 1 && professors.length <= 20 && (
        <div className="flex justify-center gap-2 mt-6">
          {professors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-[#081E3F]' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to sign ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
