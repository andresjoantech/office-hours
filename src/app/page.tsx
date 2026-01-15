'use client';

import { useState } from 'react';
import { ProfessorData } from '@/types/professor';
import FileUpload from '@/components/FileUpload';
import ManualForm from '@/components/ManualForm';
import SignCarousel from '@/components/SignCarousel';
import { FileSpreadsheet, User, ArrowLeft, RefreshCw } from 'lucide-react';

type AppView = 'landing' | 'upload' | 'manual' | 'preview';

export default function Home() {
  const [view, setView] = useState<AppView>('landing');
  const [professors, setProfessors] = useState<ProfessorData[]>([]);

  const handleUploadSuccess = (data: ProfessorData[]) => {
    setProfessors(data);
    setView('preview');
  };

  const handleManualSubmit = (professor: ProfessorData) => {
    setProfessors([professor]);
    setView('preview');
  };

  const handleUpdateProfessor = (index: number, updated: ProfessorData) => {
    setProfessors((prev) => {
      const newProfessors = [...prev];
      newProfessors[index] = updated;
      return newProfessors;
    });
  };

  const handleReset = () => {
    setProfessors([]);
    setView('landing');
  };

  const handleBack = () => {
    if (view === 'preview') {
      setView(professors.length > 1 ? 'upload' : 'manual');
    } else {
      setView('landing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-[#081E3F] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {view !== 'landing' && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Office Hours Sign Builder
                </h1>
                <p className="text-sm text-gray-300 hidden sm:block">
                  Create professional office hours signs
                </p>
              </div>
            </div>
            {view === 'preview' && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Landing View */}
        {view === 'landing' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Create Professional Office Hours Signs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Generate beautifully formatted office hours signs for professors.
                Upload a spreadsheet for bulk generation or create a single sign manually.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Bulk Upload Option */}
              <button
                onClick={() => setView('upload')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#081E3F]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                    <FileSpreadsheet size={48} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Bulk Generation
                  </h3>
                  <p className="text-gray-600">
                    Upload an Excel spreadsheet with multiple professors&apos; office hours
                    to generate signs in bulk.
                  </p>
                  <span className="mt-4 text-blue-600 font-medium group-hover:underline">
                    Upload Spreadsheet &rarr;
                  </span>
                </div>
              </button>

              {/* Manual Entry Option */}
              <button
                onClick={() => setView('manual')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#B6862C]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-amber-100 rounded-full mb-4 group-hover:bg-amber-200 transition-colors">
                    <User size={48} className="text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Create Single Sign
                  </h3>
                  <p className="text-gray-600">
                    Fill out a form with your office hours information
                    to generate a personalized sign.
                  </p>
                  <span className="mt-4 text-amber-600 font-medium group-hover:underline">
                    Fill Out Form &rarr;
                  </span>
                </div>
              </button>
            </div>

            {/* Features Section */}
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
                Features
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'QR Code Support', desc: 'Automatically generates QR codes for online meeting links' },
                  { title: 'PDF Export', desc: 'Download signs as PDF files ready for printing' },
                  { title: 'Bulk Export', desc: 'Download all signs as a single PDF or individual images' },
                  { title: 'Edit In-Place', desc: 'Make corrections directly on the sign preview' },
                ].map((feature, i) => (
                  <div key={i} className="p-4 bg-white rounded-lg shadow">
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload View */}
        {view === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Spreadsheet
              </h2>
              <p className="text-gray-600">
                Upload your Excel file containing professor office hours data
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}

        {/* Manual Form View */}
        {view === 'manual' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Your Office Hours Sign
              </h2>
              <p className="text-gray-600">
                Fill in your information below to generate your sign
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <ManualForm onSubmit={handleManualSubmit} />
            </div>
          </div>
        )}

        {/* Preview View */}
        {view === 'preview' && professors.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {professors.length === 1
                  ? 'Your Office Hours Sign'
                  : `${professors.length} Office Hours Signs Generated`}
              </h2>
              <p className="text-gray-600">
                {professors.length === 1
                  ? 'Review and download your sign'
                  : 'Navigate through signs, edit as needed, and export'}
              </p>
            </div>
            <SignCarousel
              professors={professors}
              onUpdateProfessor={handleUpdateProfessor}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>
            Office Hours Sign Builder
          </p>
        </div>
      </footer>
    </div>
  );
}
