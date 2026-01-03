'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  ArrowLeft,
  Download,
  Eye,
  Trash2,
  FileCheck,
  Clock,
  Calendar,
  FileIcon,
  Users,
  MoreVertical,
  Plus
} from 'lucide-react';
import { pdfApi, formatFileSize, formatDate } from '../../../lib/api';
import SummaryModal from '../../../components/SummaryModal';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pdfApi.getPDF(params.id);
      
      // Transform the response to match the expected format
      const transformedDoc = {
        id: response.id,
        name: response.title || response.filename,
        filename: response.filename,
        size: formatFileSize(response.file_size),
        pages: response.page_count,
        uploadedAt: response.created_at,
        updatedAt: response.updated_at,
        summaries: response.summaries || [],
      };
      
      setDocument(transformedDoc);
    } catch (err) {
      setError(err.message);
      console.error('Document fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const handleDownload = async () => {
    try {
      const response = await pdfApi.downloadPDF(params.id);
      
      // Get the filename from the Content-Disposition header or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = document.name + '.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download document: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) return;

    try {
      await pdfApi.deletePDF(params.id);
      router.push('/documents');
    } catch (err) {
      alert('Failed to delete document: ' + err.message);
    }
  };

  const handleGenerateSummary = () => {
    setSummaryModalOpen(true);
  };

  const handleSummaryGenerated = () => {
    fetchDocument(); // Refresh to get updated summaries
    alert('Summary generated successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <header className="border-b border-[#1F2937] backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[#3B82F6] rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#3B82F6] stroke-1.5" />
                </div>
                <h1 className="text-xl font-medium text-white">AI PDF Management</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-[#D1D5DB] hover:text-white transition-colors font-normal">Home</a>
                <a href="/documents" className="text-[#3B82F6] font-normal">Documents</a>
                <a href="/summaries" className="text-[#D1D5DB] hover:text-white transition-colors font-normal">Summaries</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 bg-[#1F2937] rounded"></div>
              <div className="h-8 bg-[#1F2937] rounded w-64"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="border border-[#1F2937] rounded-lg p-6">
                  <div className="h-6 bg-[#1F2937] rounded mb-4"></div>
                  <div className="h-4 bg-[#1F2937] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#1F2937] rounded w-1/2"></div>
                </div>
              </div>
              <div>
                <div className="border border-[#1F2937] rounded-lg p-6">
                  <div className="h-6 bg-[#1F2937] rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-[#1F2937] rounded"></div>
                    <div className="h-4 bg-[#1F2937] rounded"></div>
                    <div className="h-4 bg-[#1F2937] rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <header className="border-b border-[#1F2937] backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-[#3B82F6] rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#3B82F6] stroke-1.5" />
                </div>
                <h1 className="text-xl font-medium text-white">AI PDF Management</h1>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-[#D1D5DB] hover:text-white transition-colors font-normal">Home</a>
                <a href="/documents" className="text-[#3B82F6] font-normal">Documents</a>
                <a href="/summaries" className="text-[#D1D5DB] hover:text-white transition-colors font-normal">Summaries</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="text-[#D1D5DB] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6 stroke-1.5" />
            </button>
            <h2 className="text-3xl font-medium text-white">Document Not Found</h2>
          </div>
          
          <div className="border border-[#EF4444] rounded-lg p-8 text-center">
            <div className="w-16 h-16 border border-[#EF4444] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#EF4444] stroke-1.5" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Error Loading Document</h3>
            <p className="text-[#D1D5DB] font-normal mb-6">{error}</p>
            <button 
              onClick={() => router.push('/documents')}
              className="border border-[#3B82F6] text-[#3B82F6] px-6 py-3 rounded font-normal transition-all duration-200 hover:border-[#2563EB] hover:text-[#2563EB] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              Back to Documents
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-[#1F2937] backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#3B82F6] rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#3B82F6] stroke-1.5" />
              </div>
              <h1 className="text-xl font-medium text-white">AI PDF Management</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-[#D1D5DB] hover:text-white transition-colors font-normal">Home</a>
              <a href="/documents" className="text-[#3B82F6] font-normal">Documents</a>
              <a href="/summaries" className="text-[#D1D5DB] hover:text-white transition-colors font-normal">Summaries</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="text-[#D1D5DB] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 stroke-1.5" />
          </button>
          <h2 className="text-3xl font-medium text-white">{document.name}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Info */}
            <div className="border border-[#1F2937] rounded-lg p-6">
              <h3 className="text-xl font-medium text-white mb-4">Document Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#9CA3AF] block mb-1">File Name</label>
                  <p className="text-white font-normal">{document.filename}</p>
                </div>
                <div>
                  <label className="text-sm text-[#9CA3AF] block mb-1">File Size</label>
                  <p className="text-white font-normal">{document.size}</p>
                </div>
                <div>
                  <label className="text-sm text-[#9CA3AF] block mb-1">Pages</label>
                  <p className="text-white font-normal">{document.pages} pages</p>
                </div>
                <div>
                  <label className="text-sm text-[#9CA3AF] block mb-1">Summaries</label>
                  <p className="text-white font-normal">{document.summaries.length} summaries</p>
                </div>
                <div>
                  <label className="text-sm text-[#9CA3AF] block mb-1">Uploaded</label>
                  <p className="text-white font-normal">{formatDate(document.uploadedAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-[#9CA3AF] block mb-1">Last Modified</label>
                  <p className="text-white font-normal">{formatDate(document.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Summaries */}
            <div className="border border-[#1F2937] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium text-white">AI Summaries</h3>
                <button 
                  onClick={handleGenerateSummary}
                  className="border border-[#10B981] text-[#10B981] px-4 py-2 rounded font-normal transition-all duration-200 hover:border-[#059669] hover:text-[#059669] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-1.5" />
                  Generate Summary
                </button>
              </div>
              
              {document.summaries.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border border-[#1F2937] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-6 h-6 text-[#9CA3AF] stroke-1.5" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">No Summaries Yet</h4>
                  <p className="text-[#D1D5DB] font-normal mb-4">Generate AI summaries to better understand this document.</p>
                  <button 
                    onClick={handleGenerateSummary}
                    className="border border-[#10B981] text-[#10B981] px-6 py-3 rounded font-normal transition-all duration-200 hover:border-[#059669] hover:text-[#059669] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4 stroke-1.5" />
                    Generate First Summary
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {document.summaries.map((summary) => (
                    <div key={summary.id} className="border border-[#1F2937] rounded-lg p-4 hover:border-[#374151] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border border-[#10B981] rounded flex items-center justify-center">
                            <FileCheck className="w-4 h-4 text-[#10B981] stroke-1.5" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium capitalize">{summary.style} Summary</h4>
                            <p className="text-sm text-[#9CA3AF]">{summary.language} • {formatDate(summary.created_at)}</p>
                          </div>
                        </div>
                        <button className="text-[#9CA3AF] hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4 stroke-1.5" />
                        </button>
                      </div>
                      <p className="text-[#D1D5DB] font-normal leading-relaxed line-clamp-3">
                        {summary.content}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1F2937]">
                        <span className="text-xs text-[#9CA3AF]">
                          Processing time: {summary.summary_time?.toFixed(2) || 'N/A'}s
                        </span>
                        <a href={`/summaries/${summary.id}`} className="text-[#3B82F6] hover:text-[#2563EB] text-sm font-normal transition-colors">
                          View Full Summary
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="border border-[#1F2937] rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleDownload}
                  className="w-full border border-[#1F2937] text-[#D1D5DB] py-3 px-4 rounded hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-200 flex items-center gap-3"
                >
                  <Download className="w-4 h-4 stroke-1.5" />
                  Download PDF
                </button>
                <button className="w-full border border-[#1F2937] text-[#D1D5DB] py-3 px-4 rounded hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-200 flex items-center gap-3">
                  <Eye className="w-4 h-4 stroke-1.5" />
                  Preview Document
                </button>
                <button 
                  onClick={handleGenerateSummary}
                  className="w-full border border-[#1F2937] text-[#D1D5DB] py-3 px-4 rounded hover:border-[#10B981] hover:text-[#10B981] transition-all duration-200 flex items-center gap-3"
                >
                  <FileCheck className="w-4 h-4 stroke-1.5" />
                  Generate Summary
                </button>
                <button 
                  onClick={handleDelete}
                  className="w-full border border-[#1F2937] text-[#D1D5DB] py-3 px-4 rounded hover:border-[#EF4444] hover:text-[#EF4444] transition-all duration-200 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4 stroke-1.5" />
                  Delete Document
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border border-[#1F2937] rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF] flex items-center gap-2">
                    <FileIcon className="w-4 h-4 stroke-1.5" />
                    File Size
                  </span>
                  <span className="text-white font-normal">{document.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF] flex items-center gap-2">
                    <FileText className="w-4 h-4 stroke-1.5" />
                    Pages
                  </span>
                  <span className="text-white font-normal">{document.pages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF] flex items-center gap-2">
                    <Users className="w-4 h-4 stroke-1.5" />
                    Summaries
                  </span>
                  <span className="text-white font-normal">{document.summaries.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF] flex items-center gap-2">
                    <Calendar className="w-4 h-4 stroke-1.5" />
                    Uploaded
                  </span>
                  <span className="text-white font-normal">{formatDate(document.uploadedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Summary Generation Modal */}
      <SummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        document={document}
        onSummaryGenerated={handleSummaryGenerated}
      />
    </div>
  );
}