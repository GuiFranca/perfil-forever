import { Card } from '../types/game';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const generateWithOpenRouter = async (prompt: string): Promise<Card> => {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY não configurada');
    }

    console.log('🔄 Tentando com OpenRouter (fallback - Xiaomi MiMo V2 Flash)...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Perfil Game'
        },
        body: JSON.stringify({
            model: 'xiaomi/mimo-v2-flash:free',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Resposta inválida da API OpenRouter');
    }

    let content = data.choices[0].message.content.trim();
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(content);
};
