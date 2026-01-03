'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Search, Eye, FileCheck, Sparkles } from 'lucide-react';
import { pdfApi, formatFileSize, formatDate } from '../lib/api';

export default function DocumentSelectionModal({ isOpen, onClose, onDocumentSelected }) {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fetchDocuments = async (search = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await pdfApi.getPDFs({
        page: 1,
        itemsPerPage: 50, // Show more documents in modal
        search: search
      });

      const formattedDocs = response.data?.map(doc => ({
        id: doc.id,
        name: doc.title || doc.filename,
        filename: doc.filename,
        size: formatFileSize(doc.file_size),
        pages: doc.page_count,
        uploadedAt: doc.created_at,
        summaries: doc.summaries?.length || 0
      })) || [];

      setDocuments(formattedDocs);
    } catch (err) {
      setError(err.message);
      console.error('Documents fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        fetchDocuments(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isOpen]);

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleProceed = () => {
    if (selectedDocument && onDocumentSelected) {
      onDocumentSelected(selectedDocument);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border border-[#1F2937] rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2937]">
          <h2 className="text-xl font-medium text-white">Select Document</h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X className="w-5 h-5 stroke-1.5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-[#1F2937]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9CA3AF] stroke-1.5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-[#1F2937] rounded pl-10 pr-4 py-3 text-white placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1),0_0_20px_rgba(59,130,246,0.3)] transition-all duration-200 font-normal"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="border border-[#EF4444] rounded-lg p-4 mb-4 bg-[#EF4444]/5">
              <div className="text-[#EF4444] text-sm">
                Error loading documents: {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border border-[#1F2937] rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1F2937] rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#1F2937] rounded mb-2"></div>
                      <div className="h-3 bg-[#1F2937] rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 border border-[#1F2937] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#9CA3AF] stroke-1.5" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Documents Found</h3>
              <p className="text-[#D1D5DB] font-normal">
                {searchQuery ? 'Try adjusting your search terms.' : 'Upload some PDF documents first.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentSelect(doc)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedDocument?.id === doc.id
                      ? 'border-[#3B82F6] bg-[#3B82F6]/5'
                      : 'border-[#1F2937] hover:border-[#374151]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 border rounded flex items-center justify-center flex-shrink-0 ${
                      selectedDocument?.id === doc.id
                        ? 'border-[#3B82F6] text-[#3B82F6]'
                        : 'border-[#1F2937] text-[#9CA3AF]'
                    }`}>
                      <FileText className="w-5 h-5 stroke-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${
                        selectedDocument?.id === doc.id ? 'text-[#3B82F6]' : 'text-white'
                      }`}>
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#9CA3AF] mt-1">
                        <span>{doc.size}</span>
                        <span>{doc.pages} pages</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                        {doc.summaries > 0 && (
                          <span className="text-[#10B981]">{doc.summaries} summaries</span>
                        )}
                      </div>
                    </div>
                    {selectedDocument?.id === doc.id && (
                      <div className="text-[#3B82F6]">
                        <FileCheck className="w-5 h-5 stroke-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-[#1F2937]">
          <button
            onClick={onClose}
            className="flex-1 border border-[#1F2937] text-[#D1D5DB] py-3 px-4 rounded font-normal transition-all duration-200 hover:border-[#374151] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            disabled={!selectedDocument}
            className="flex-1 border border-[#10B981] text-[#10B981] py-3 px-4 rounded font-normal transition-all duration-200 hover:border-[#059669] hover:text-[#059669] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4 stroke-1.5" />
            Generate Summary
          </button>
        </div>
      </div>
    </div>
  );
}