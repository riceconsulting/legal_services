

import { GoogleGenAI, Type } from "@google/genai";
import type { Risk, Summary, QnAResponse, PIIConcern } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Throw an informative error if the API key is missing.
  throw new Error("Missing Google Gemini API Key. Please ensure the API_KEY environment variable is set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

/**
 * A centralized error handler for API calls.
 * @param error The catched error.
 * @param functionName The name of the function where the error occurred.
 * @returns A new Error object with a user-friendly message.
 */
const handleApiError = (error: any, functionName: string): Error => {
    console.error(`Error in ${functionName}:`, error);

    // Check for Gemini API's specific error structure in the SDK's response
    if (error instanceof Error && error.message.includes('FetchError')) {
        try {
            const jsonString = error.message.substring(error.message.indexOf('{'));
            const parsed = JSON.parse(jsonString);
            if (parsed?.error?.code) {
                const apiError = parsed.error;
                if (apiError.status === 'RESOURCE_EXHAUSTED' || apiError.code === 429) {
                    return new Error("You have exceeded your API quota. For a higher limit, please get in touch with us using the 'Contact Us' button in the footer.");
                }
                return new Error(`An API error occurred: ${apiError.message || 'Unknown API error'}`);
            }
        } catch (e) {
            // Fall through if parsing fails
        }
    }

    // Handle JSON parsing errors specifically for better user feedback
    if (error instanceof SyntaxError && error.message.toLowerCase().includes('json')) {
        return new Error("The AI returned an invalid response format. It was expected to be JSON, but something went wrong. Please try again.");
    }
    
    // Check for standard JS Error object for other issues (e.g., our own custom errors)
    if (error instanceof Error) {
        // A more generic JSON error check, just in case
        if (error.message.toLowerCase().includes('json')) {
             return new Error("Failed to process the AI's response. The format was unexpected.");
        }
        return new Error(`An unexpected error occurred: ${error.message}`);
    }

    // Fallback for unknown errors
    return new Error("An unknown error occurred while communicating with the AI service.");
}


export const extractTextFromFile = async (base64Data: string, mimeType: string): Promise<string> => {
    const prompt = "Extract all text content from this document. Return only the raw text, without any additional formatting, commentary, or explanations.";

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
        });
        return response.text;
    } catch (error) {
        throw handleApiError(error, 'extractTextFromFile');
    }
};

export const generateSummary = async (documentText: string): Promise<Summary> => {
    const prompt = `
    As an expert Indonesian legal analyst, your task is to meticulously analyze the following legal document. Base your analysis STRICTLY on the text provided. Do not infer or add information not present in the document.

    Provide the following two summaries in Bahasa Indonesia:
    1.  **Executive Summary**: A concise overview of the document's main purpose, the parties involved, and the primary legal outcomes or obligations.
    2.  **Key Clauses & Terms**: A structured list identifying and explaining the most critical clauses. Focus on Indonesian legal concepts such as payment terms (ketentuan pembayaran), termination clauses (klausul pengakhiran), object of the agreement (objek perjanjian), dispute resolution (penyelesaian sengketa), etc.

    If a standard clause is missing, do not invent it. Your output must be grounded exclusively in the provided text.

    DOCUMENT:
    ---
    ${documentText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        executive: { type: Type.STRING },
                        keyClauses: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    detail: { type: Type.STRING },
                                },
                                required: ["title", "detail"]
                            }
                        }
                    },
                    required: ["executive", "keyClauses"]
                }
            }
        });
        const text = response.text.trim().replace(/^```json\s*|```\s*$/g, '');
        if (!text) {
            throw new Error("The AI returned an empty summary. Please try again.");
        }
        return JSON.parse(text) as Summary;
    } catch (error) {
        throw handleApiError(error, 'generateSummary');
    }
};

export const analyzeRisks = async (documentText: string): Promise<Risk[]> => {
    const prompt = `
    As a senior Indonesian legal risk analyst, your task is to conduct a thorough risk assessment of the following legal document. Your analysis must be objective and based ONLY on the provided text and your knowledge of Indonesian law (e.g., UU ITE, UU Cipta Kerja, KUHPerdata, OJK regulations).

    Identify potential risks, ambiguities, missing clauses that are standard for this type of document, unusual provisions, and potential compliance issues.
    
    For each identified issue, you must:
    1.  Quote the specific clause or explicitly state if a clause is missing.
    2.  Provide a clear, concise description of the risk.
    3.  Assign a risk level: 'High', 'Medium', 'Low', or 'Info'.
    4.  Offer a concrete, actionable recommendation for mitigation or improvement.

    Do not invent risks or speculate beyond the document's content. If no significant risks are found, return an empty array [].

    Return ONLY a valid JSON array of objects.

    DOCUMENT:
    ---
    ${documentText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "A unique identifier for the risk" },
                            riskLevel: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Info'] },
                            description: { type: Type.STRING },
                            clause: { type: Type.STRING },
                            recommendation: { type: Type.STRING },
                        },
                        required: ["id", "riskLevel", "description", "clause", "recommendation"]
                    },
                },
            }
        });
        const jsonStr = response.text.trim();
        const cleanedJsonStr = jsonStr.replace(/^```json\s*|```\s*$/g, '');
        if (!cleanedJsonStr) {
          return [];
        }
        
        const parsedData = JSON.parse(cleanedJsonStr);

        if (Array.isArray(parsedData)) {
            return parsedData as Risk[];
        } else {
            return [parsedData] as Risk[];
        }
    } catch (error) {
        throw handleApiError(error, 'analyzeRisks');
    }
};

export const translateText = async (documentText: string, targetLanguage: 'english' | 'bahasa indonesia'): Promise<string> => {
    const prompt = `
    You are an expert legal translator specializing in Indonesian and English legal documents. Your task is to perform a high-fidelity translation of the following text into ${targetLanguage}.

    Your translation must:
    1.  Be precise and accurate, correctly translating complex legal terminology and sentence structures.
    2.  Preserve the original legal meaning, intent, and nuance without adding any interpretation.
    3.  Maintain the document's original formatting (paragraphs, lists, etc.) as closely as possible.

    CRITICAL: Your output must contain ONLY the translated text. Do not include any introductory phrases, explanations, markdown, or any content other than the direct translation.

    DOCUMENT TO TRANSLATE:
    ---
    ${documentText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        throw handleApiError(error, 'translateText');
    }
}

export const answerQuestion = async (documentText: string, question: string): Promise<QnAResponse> => {
    const prompt = `
    As an AI legal assistant, your task is to answer a specific question based SOLELY on the content of the provided legal document. You must not use any external knowledge or make assumptions.

    1.  Read the user's question carefully.
    2.  Search the document for the information needed to answer the question.
    3.  If a direct answer is found, provide a concise answer in Bahasa Indonesia.
    4.  Then, you MUST provide the exact, verbatim quote from the document that directly supports your answer.
    5.  If the information to answer the question is NOT present in the document, you MUST state "Informasi tidak ditemukan di dalam dokumen." in the 'answer' field and leave the 'quote' field empty. Do not attempt to guess or infer an answer.

    DOCUMENT:
    ---
    ${documentText}
    ---

    QUESTION:
    ${question}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        answer: { type: Type.STRING },
                        quote: { type: Type.STRING },
                    },
                    required: ["answer", "quote"]
                }
            }
        });
        const jsonStr = response.text.trim().replace(/^```json\s*|```\s*$/g, '');
        if (!jsonStr) {
            throw new Error("The AI returned an empty answer. Please try again.");
        }
        return JSON.parse(jsonStr) as QnAResponse;
    } catch (error) {
        throw handleApiError(error, 'answerQuestion');
    }
};

export const extractClause = async (documentText: string, clauseDescription: string): Promise<string> => {
    const prompt = `
    Your task is to act as a clause extraction tool. From the legal document provided, find and extract the verbatim clause(s) that are most relevant to the following description: "${clauseDescription}".

    - Search the entire document for the most relevant section(s).
    - Return ONLY the exact text of the clause(s) you find. Include the full paragraph or section.
    - If no relevant clause is found after a thorough search, return the exact string: "Klausul yang relevan tidak dapat ditemukan di dalam dokumen."
    - Do not summarize, explain, or add any text other than the extracted clause or the "not found" message.

    DOCUMENT:
    ---
    ${documentText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        throw handleApiError(error, 'extractClause');
    }
};

export const redactPII = async (documentText: string): Promise<PIIConcern[]> => {
    const prompt = `
    As an AI data privacy analyst for Indonesian legal documents, your task is to meticulously scan the following document and identify all instances of Personally Identifiable Information (PII). Your analysis must be based strictly on the text provided.

    Do NOT redact or alter the document. Your goal is to identify and report on the PII found.

    For each piece of PII identified, you must provide:
    1.  \`pii\`: The exact, verbatim text of the PII found.
    2.  \`concern\`: A brief explanation of the privacy or security risk associated with this piece of data being exposed.
    3.  \`recommendation\`: An actionable recommendation, such as "Consider redacting before external sharing" or "Verify if this information is necessary for the document's purpose."

    Search for, but do not limit your search to:
    - Full names of individuals (e.g., Budi Santoso, Citra Lestari)
    - National Identity Numbers (Nomor Induk Kependudukan / KTP)
    - Taxpayer Identification Numbers (NPWP)
    - Phone numbers
    - Email addresses
    - Complete physical addresses
    - Bank account numbers
    - Signature placeholders or names associated with signatures

    Return ONLY a valid JSON array of objects. If no PII is found after a thorough analysis, return an empty array [].

    DOCUMENT:
    ---
    ${documentText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "A unique identifier for the PII concern" },
                            pii: { type: Type.STRING, description: "The exact PII text found in the document." },
                            concern: { type: Type.STRING, description: "The privacy or legal concern related to this PII." },
                            recommendation: { type: Type.STRING, description: "Recommendation on how to handle this PII (e.g., 'Consider redacting before sharing externally')." },
                        },
                        required: ["id", "pii", "concern", "recommendation"]
                    },
                },
            }
        });
        const jsonStr = response.text.trim();
        const cleanedJsonStr = jsonStr.replace(/^```json\s*|```\s*$/g, '');
        if (!cleanedJsonStr) {
          return [];
        }
        return JSON.parse(cleanedJsonStr) as PIIConcern[];
    } catch (error) {
        throw handleApiError(error, 'redactPII');
    }
};
