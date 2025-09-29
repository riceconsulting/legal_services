

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
    
    // Check for standard JS Error object for other issues (e.g., our own JSON.parse failing)
    if (error instanceof Error) {
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
    You are an expert Indonesian legal consultant. Analyze the following legal document and provide two summaries in Bahasa Indonesia:
    1. An "Executive Summary" that gives a high-level overview of the document's purpose, parties involved, and key outcomes.
    2. A "Key Clauses & Terms" summary presented as a structured list, identifying essential Indonesian legal concepts like payment terms, termination clauses, object of the agreement, etc.

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
        return JSON.parse(text) as Summary;
    } catch (error) {
        throw handleApiError(error, 'generateSummary');
    }
};

export const analyzeRisks = async (documentText: string): Promise<Risk[]> => {
    const prompt = `
    You are a senior Indonesian legal consultant. Analyze the provided legal document. 
    Act as a "second pair of eyes" to identify potential risks, missing clauses, unusual provisions, and compliance issues against Indonesian law (e.g., UU ITE, UU Cipta Kerja, OJK regulations).
    For each issue found, provide a risk level (High, Medium, Low, Info), a description of the issue, the relevant clause, and a concrete recommendation for improvement.

    Return ONLY a JSON array of objects, where each object represents a single identified risk. If no risks are found, return an empty array [].

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
    As an expert legal translator, translate the following legal document to ${targetLanguage}. 
    Your task is to provide a clean, direct translation.
    - Accurately translate complex legal jargon and structures.
    - Maintain the original legal intent and nuance.
    - IMPORTANT: Return ONLY the translated text. Do not include any introductory phrases, explanations, markdown formatting (like '---'), or any content other than the direct translation of the document.

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
    You are an expert Indonesian legal consultant. Answer the following question based ONLY on the provided document text. 
    Provide a direct answer in Bahasa Indonesia and include the exact, verbatim quote from the document that contains the answer.
    If the answer is not in the document, state that clearly in the 'answer' field and leave the 'quote' field empty.

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
        return JSON.parse(jsonStr) as QnAResponse;
    } catch (error) {
        throw handleApiError(error, 'answerQuestion');
    }
};

export const extractClause = async (documentText: string, clauseDescription: string): Promise<string> => {
    const prompt = `
    From the legal document provided below, find and extract the exact clause(s) related to "${clauseDescription}".
    If you find the clause, return it. If not, state that the clause could not be found.

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
    You are an expert Indonesian legal consultant specializing in data privacy.
    Your task is to analyze the following document and identify all Personally Identifiable Information (PII) without redacting the document itself.
    For each piece of PII found, identify the text, explain the potential risk or concern associated with its presence, and provide a clear recommendation.
    
    PII to look for includes, but is not limited to:
    - Full names of individuals (e.g., Budi Santoso, Citra Lestari)
    - National Identity Numbers (Nomor KTP)
    - Taxpayer Identification Numbers (NPWP)
    - Phone numbers
    - Email addresses
    - Physical addresses
    - Bank account numbers
    - Signatures or references to signatures

    Do NOT redact or change the original document. Only identify the PII and explain the associated risks.
    Return ONLY a JSON array of objects. Each object should represent one piece of identified PII and its analysis. If no PII is found, return an empty array [].

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