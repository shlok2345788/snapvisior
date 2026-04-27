/**
 * LOCAL AI BRIDGE (Python/DeepFace)
 */

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

/**
 * Interface for AI service response
 */
export interface AIResult<T> {
  data: T;
  error?: {
    code: string | number;
    message: string;
    status?: number;
    isBillingError?: boolean;
  };
}

/**
 * Extracts face embeddings using the local Python AI service
 */
export async function extractFaceEmbeddings(imageBuffer: Buffer): Promise<AIResult<number[][]>> {
  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' });
    formData.append('file', blob, 'image.jpg');

    const response = await fetch(`${PYTHON_API_URL}/represent`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let message = `Python service error (${response.status})`;

      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          message = errorData.detail;
        }
      } catch {
        // Keep the fallback message when the response body isn't JSON.
      }

      return {
        data: [],
        error: {
          code: 'LOCAL_AI_HTTP_ERROR',
          message,
          status: response.status,
        },
      };
    }

    const result = await response.json();
    const embeddings = result.faces.map((f: any) => f.embedding);

    return { data: embeddings };
  } catch (error: any) {
    console.error('Local AI Error:', error);

    const isConnectionRefused =
      error?.cause?.code === 'ECONNREFUSED' ||
      error?.message?.includes('fetch failed') ||
      error?.message?.includes('ECONNREFUSED');

    if (isConnectionRefused) {
      return {
        data: [],
        error: {
          code: 'LOCAL_AI_UNAVAILABLE',
          message: `Cannot connect to local AI service at ${PYTHON_API_URL}. Please start backend/ai_service.py.`,
          status: 503,
        },
      };
    }

    return { 
      data: [], 
      error: { 
        code: 'LOCAL_AI_ERROR', 
        message: error.message || 'Error occurred during local AI processing',
        status: 500,
      } 
    };
  }
}

/**
 * Calculates cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Matches a target face against a list of media records
 */
export function matchFaces(targetEmbedding: number[], mediaRecords: any[], threshold = 0.5) {
  // Note: Threshold might need adjustment for DeepFace models (Facenet)
  const matches = [];

  for (const record of mediaRecords) {
    const faces = record.faces as number[][] | null;
    if (!faces || !Array.isArray(faces)) continue;

    let maxSim = 0;
    for (const faceVec of faces) {
      if (!faceVec || !Array.isArray(faceVec)) continue;
      
      const sim = cosineSimilarity(targetEmbedding, faceVec);
      if (sim > maxSim) maxSim = sim;
    }

    if (maxSim >= threshold) {
      matches.push({ ...record, confidence: maxSim });
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
}
