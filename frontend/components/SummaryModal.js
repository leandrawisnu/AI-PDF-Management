'use client';

import { useState } from 'react';
import { X, FileText, Sparkles, Languages, Zap, FileCheck } from 'lucide-react';
import { pdfApi } from '../lib/api';

export default function SummaryModal({ isOpen, onClose, document, onSummaryGenerated }) {
  const [style, setStyle] = useState('general');
  const [language, setLanguage] = useState('english');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await pdfApi.generateSummary(document.id, {
        style,
        language
      });

      if (onSummaryGenerated) {
        onSummaryGenerated(response);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border border-[#1F2937] rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white">Generate Summary</h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X className="w-5 h-5 stroke-1.5" />
          </button>
        </div>

        {/* Document Info */}
        <div className="border border-[#1F2937] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#3B82F6] stroke-1.5" />
            <div>
              <h3 className="text-white font-medium truncate">{document?.name}</h3>
              <p className="text-[#9CA3AF] text-sm">{document?.pages} pages • {document?.size}</p>
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Summary Style</label>
          <div className="space-y-2">
            {[
              { value: 'short', label: 'Short', icon: Zap, description: 'Brief overview of key points' },
              { value: 'general', label: 'General', icon: FileCheck, description: 'Balanced summary with main insights' },
              { value: 'detailed', label: 'Detailed', icon: FileText, description: 'Comprehensive analysis with explanations' }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all duration-200 ${
                  style === option.value
                    ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                    : 'border-[#1F2937] hover:border-[#374151]'
                }`}
              >
                <input
                  type="radio"
                  name="style"
                  value={option.value}
                  checked={style === option.value}
                  onChange={(e) => setStyle(e.target.value)}
                  className="sr-only"
                />
                <option.icon className={`w-4 h-4 stroke-1.5 ${
                  style === option.value ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'
                }`} />
                <div>
                  <div className={`font-medium ${
                    style === option.value ? 'text-[#3B82F6]' : 'text-white'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-[#9CA3AF] text-sm">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Language</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'english', label: 'English' },
              { value: 'indonesian', label: 'Indonesian' }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center gap-2 p-3 border rounded cursor-pointer transition-all duration-200 ${
                  language === option.value
                    ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-[#3B82F6]'
                    : 'border-[#1F2937] hover:border-[#374151] text-white'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={option.value}
                  checked={language === option.value}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="sr-only"
                />
                <Languages className="w-4 h-4 stroke-1.5" />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-[#EF4444] rounded-lg p-3 mb-6 bg-[#EF4444]/5">
            <div className="text-[#EF4444] text-sm">{error}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={generating}
            className="flex-1 border border-[#1F2937] text-[#D1D5DB] py-3 px-4 rounded font-normal transition-all duration-200 hover:border-[#374151] hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex-1 border border-[#10B981] text-[#10B981] py-3 px-4 rounded font-normal transition-all duration-200 hover:border-[#059669] hover:text-[#059669] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 stroke-1.5" />
                Generate Summary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}