import { GoogleGenAI } from '@google/genai';
import { Card } from '../types/game';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateWithGemini = async (prompt: string): Promise<Card> => {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY não configurada');
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    if (!response.text) {
        throw new Error('Resposta vazia da API Gemini');
    }

    let content = response.text.trim();
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(content);
};
