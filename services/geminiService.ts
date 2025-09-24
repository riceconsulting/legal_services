import { GoogleGenAI, Type } from "@google/genai";
import type { Risk, Summary, QnAResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Throw an informative error if the API key is missing.
  throw new Error("Missing Google Gemini API Key. Please ensure the API_KEY environment variable is set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const generateSummary = async (documentText: string): Promise<Summary> => {
    const prompt = `
    You are an expert Indonesian legal assistant. Analyze the following legal document and provide two summaries in Bahasa Indonesia:
    1. An "Executive Summary" that gives a high-level overview of the document's purpose, parties involved, and key outcomes.
    2. A "Key Clauses & Terms" summary presented as a structured list, identifying essential Indonesian legal concepts like payment terms, termination clauses, object of the agreement, etc.

    DOCUMENT:
    ---
    ${documentText}
    ---
    
    Return the output in a JSON object with the following structure:
    {
      "executive": "string",
      "keyClauses": [{ "title": "string", "detail": "string" }]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const text = response.text.trim();
        return JSON.parse(text) as Summary;
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to communicate with AI service.");
    }
};

export const analyzeRisks = async (documentText: string): Promise<Risk[]> => {
    const prompt = `
    You are a senior Indonesian legal professional. Analyze the provided legal document. 
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
        // The API response might be wrapped in markdown, or be empty.
        const cleanedJsonStr = jsonStr.replace(/^```json\s*|```\s*$/g, '');
        if (!cleanedJsonStr) {
          return [];
        }
        
        const parsedData = JSON.parse(cleanedJsonStr);

        // The API might return a single object if only one risk is found. We ensure it's always an array.
        if (Array.isArray(parsedData)) {
            return parsedData as Risk[];
        } else {
            return [parsedData] as Risk[];
        }
    } catch (error) {
        console.error("Error analyzing risks:", error);
        throw new Error("Failed to communicate with AI service.");
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
        console.error("Error translating text:", error);
        throw new Error("Failed to communicate with AI service.");
    }
}

export const answerQuestion = async (documentText: string, question: string): Promise<QnAResponse> => {
    const prompt = `
    You are a helpful Q&A assistant for legal documents. Answer the following question based ONLY on the provided document text. 
    Provide a direct answer in Bahasa Indonesia and include the exact, verbatim quote from the document that contains the answer.
    If the answer is not in the document, state that clearly in the 'answer' field and leave the 'quote' field empty.

    Return a JSON object with this exact structure: { "answer": "...", "quote": "..." }

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
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as QnAResponse;
    } catch (error) {
        console.error("Error answering question:", error);
        throw new Error("Failed to communicate with AI service.");
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
        console.error("Error extracting clause:", error);
        throw new Error("Failed to communicate with AI service.");
    }
};