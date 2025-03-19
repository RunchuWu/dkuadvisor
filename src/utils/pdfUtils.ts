
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set the worker source
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(window as any).pdfjsLib?.version || '3.11.174'}/pdf.worker.min.js`;

export interface DocumentChunk {
  text: string;
  metadata: {
    page: number;
    source: string;
  };
}

export async function parsePdf(file: File): Promise<DocumentChunk[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    const chunks: DocumentChunk[] = [];
    const numPages = pdf.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Extract text from the page
      const pageText = content.items
        .map((item: TextItem) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Split text into manageable chunks (approximately 1000 characters each)
      const textChunks = splitTextIntoChunks(pageText, 1000);
      
      textChunks.forEach(chunk => {
        chunks.push({
          text: chunk,
          metadata: {
            page: i,
            source: file.name
          }
        });
      });
    }
    
    return chunks;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}

// Split text into chunks with some overlap
function splitTextIntoChunks(text: string, chunkSize: number, overlap: number = 200): string[] {
  const chunks: string[] = [];
  
  if (text.length <= chunkSize) {
    return [text];
  }
  
  let startIndex = 0;
  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + chunkSize, text.length);
    
    // Try to end at a sentence or paragraph boundary if possible
    if (endIndex < text.length) {
      const potentialBreakpoints = ['. ', '! ', '? ', '\n\n', '\n'];
      
      for (const breakpoint of potentialBreakpoints) {
        const breakpointIndex = text.lastIndexOf(breakpoint, endIndex);
        if (breakpointIndex > startIndex && breakpointIndex <= endIndex - breakpoint.length) {
          endIndex = breakpointIndex + breakpoint.length;
          break;
        }
      }
    }
    
    chunks.push(text.substring(startIndex, endIndex).trim());
    startIndex = endIndex - overlap;
  }
  
  return chunks;
}
