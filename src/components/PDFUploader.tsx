
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText, Check, X } from 'lucide-react';
import { toast } from "sonner";
import { parsePdf } from '@/utils/pdfUtils';
import { storeDocumentChunks, clearVectorStore } from '@/utils/embeddingUtils';

const PDFUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check if file is a PDF
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    
    try {
      setProgress(30);
      // Parse the PDF into chunks
      const chunks = await parsePdf(file);
      setProgress(60);
      
      // Clear previous vector store
      await clearVectorStore();
      setProgress(70);
      
      // Store document chunks with embeddings
      setIsProcessing(true);
      await storeDocumentChunks(chunks);
      setProgress(100);
      
      toast.success(`Successfully processed ${chunks.length} chunks from ${file.name}`);
      
      // Save file name to localStorage to show it's been processed
      localStorage.setItem('dku-course-pdf', file.name);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process PDF file');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setFile(null);
    }
  };

  const handleReset = async () => {
    try {
      await clearVectorStore();
      localStorage.removeItem('dku-course-pdf');
      toast.success('Knowledge base has been reset');
    } catch (error) {
      console.error('Error resetting knowledge base:', error);
      toast.error('Failed to reset knowledge base');
    }
  };

  // Check if a PDF has already been processed
  const processedPdfName = localStorage.getItem('dku-course-pdf');

  return (
    <div className="w-full max-w-md p-4 border border-assistant-border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">DKU Course Knowledge Base</h3>
      
      {processedPdfName ? (
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md">
            <Check size={16} className="text-green-500" />
            <span className="text-sm flex-1 truncate">{processedPdfName}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="h-8 px-2"
            >
              <X size={14} />
            </Button>
          </div>
          <p className="text-xs text-assistant-placeholder mt-2">
            Course information has been loaded. You can now ask questions about DKU courses.
          </p>
        </div>
      ) : (
        <>
          <div className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4" onClick={() => document.getElementById('pdf-upload')?.click()}>
            <input 
              type="file" 
              id="pdf-upload" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange} 
              disabled={isUploading || isProcessing}
            />
            
            <div className="flex flex-col items-center justify-center py-2">
              <Upload size={24} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium">Upload DKU course PDF</p>
              <p className="text-xs text-gray-500 mt-1">Click to browse or drag and drop</p>
            </div>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md mb-4">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm flex-1 truncate">{file.name}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFile(null)}
                className="h-8 px-2"
                disabled={isUploading || isProcessing}
              >
                <X size={14} />
              </Button>
            </div>
          )}
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-duke-blue h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading || isProcessing}
            className="w-full"
          >
            {isUploading || isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                {isProcessing ? 'Processing' : 'Uploading'}
              </>
            ) : (
              'Process PDF'
            )}
          </Button>
          
          <p className="text-xs text-assistant-placeholder mt-2">
            Upload a PDF with DKU course information to enhance the AI's knowledge.
          </p>
        </>
      )}
    </div>
  );
};

export default PDFUploader;
