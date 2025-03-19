
import { pipeline } from '@huggingface/transformers';
import localforage from 'localforage';
import { DocumentChunk } from './pdfUtils';

// Interface for vector store item
export interface VectorStoreItem extends DocumentChunk {
  id: string;
  embedding: number[];
}

// Configure localforage instance for vector storage
const vectorStore = localforage.createInstance({
  name: 'dku-course-advisor',
  storeName: 'vector-store'
});

// Generate embeddings using HuggingFace Transformers.js
let embeddingModel: any = null;

export async function getEmbeddingModel() {
  if (!embeddingModel) {
    console.log('Initializing embedding model...');
    try {
      embeddingModel = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1'
      );
      console.log('Embedding model initialized successfully');
    } catch (error) {
      console.error('Error initializing embedding model:', error);
      throw new Error('Failed to initialize embedding model');
    }
  }
  return embeddingModel;
}

// Create embeddings for a text
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbeddingModel();
    const embeddings = await model(text, { pooling: 'mean', normalize: true });
    return embeddings.tolist()[0];
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw new Error('Failed to create embedding');
  }
}

// Store document chunks with their embeddings
export async function storeDocumentChunks(chunks: DocumentChunk[]): Promise<void> {
  try {
    console.log(`Processing ${chunks.length} document chunks...`);
    
    // Process chunks in batches to prevent memory issues
    const batchSize = 5;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const promises = batch.map(async (chunk, index) => {
        const id = `chunk_${Date.now()}_${i + index}`;
        const embedding = await createEmbedding(chunk.text);
        
        const vectorItem: VectorStoreItem = {
          ...chunk,
          id,
          embedding
        };
        
        await vectorStore.setItem(id, vectorItem);
        return id;
      });
      
      await Promise.all(promises);
      console.log(`Processed chunks ${i} to ${Math.min(i + batchSize, chunks.length)}`);
    }
    
    console.log('All document chunks processed and stored successfully');
  } catch (error) {
    console.error('Error storing document chunks:', error);
    throw new Error('Failed to store document chunks');
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Retrieve relevant context based on a query
export async function retrieveContext(query: string, topK: number = 3): Promise<DocumentChunk[]> {
  try {
    const queryEmbedding = await createEmbedding(query);
    
    const items: VectorStoreItem[] = [];
    await vectorStore.iterate((value: VectorStoreItem) => {
      items.push(value);
    });
    
    // Calculate similarity scores
    const itemsWithScores = items.map(item => ({
      ...item,
      score: cosineSimilarity(queryEmbedding, item.embedding)
    }));
    
    // Sort by similarity score (descending)
    itemsWithScores.sort((a, b) => b.score - a.score);
    
    // Return top K results
    return itemsWithScores.slice(0, topK).map(item => ({
      text: item.text,
      metadata: item.metadata
    }));
  } catch (error) {
    console.error('Error retrieving context:', error);
    return [];
  }
}

// Clear all stored vectors (useful for resetting or updating the knowledge base)
export async function clearVectorStore(): Promise<void> {
  try {
    await vectorStore.clear();
    console.log('Vector store cleared successfully');
  } catch (error) {
    console.error('Error clearing vector store:', error);
  }
}
