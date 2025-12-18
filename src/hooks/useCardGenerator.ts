import { useState } from 'react';
import { Card } from '../types/game';
import { categoryMap } from '../constants/categories';
import { generateWithGemini } from '../services/geminiService';
import { generateWithOpenRouter } from '../services/openRouterService';

// Função para embaralhar array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Carta de exemplo para fallback
const exampleCard: Card = {
    categoria: 'pessoa',
    resposta: 'Albert Einstein',
    dicas: [
        '1. Revolucionou uma área do conhecimento humano',
        '2. Seu trabalho mudou nossa compreensão do universo',
        '3. Era conhecido por sua aparência peculiar',
        '4. Nasceu na Europa no século XIX',
        '5. Sua teoria é estudada até hoje',
        '6. Ganhou um prêmio Nobel',
        '7. Tinha cabelos muito característicos',
        '8. É sinônimo de genialidade',
        '9. Trabalhou com física teórica',
        '10. Sua equação mais famosa tem 5 caracteres',
        '11. Fugiu da Alemanha nazista',
        '12. Viveu nos Estados Unidos',
        '13. Trabalhou em Princeton',
        '14. Sua língua para fora é icônica',
        '15. E=mc² é sua criação',
        '16. Desenvolveu a teoria da relatividade',
        '17. É alemão de nascimento',
        '18. Tem um nome que começa com A',
        '19. Seu sobrenome é sinônimo de gênio',
        '20. Albert _______, físico mais famoso do século XX'
    ]
};

interface UseCardGeneratorProps {
    usedCards: string[];
    saveUsedCard: (answer: string) => Promise<void>;
}

export const useCardGenerator = ({ usedCards, saveUsedCard }: UseCardGeneratorProps) => {
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);

    const generateCard = async (
        category: string,
        selectedDifficulties: string[]
    ) => {
        setIsGenerating(true);

        const selectedCategory = category === 'todos'
            ? ['pessoa', 'lugar', 'objeto', 'ano'][Math.floor(Math.random() * 4)]
            : category;

        const randomDifficulty = selectedDifficulties[Math.floor(Math.random() * selectedDifficulties.length)];

        const difficultyText = randomDifficulty === 'facil' ? 'temas conhecidos e populares' :
            randomDifficulty === 'medio' ? 'temas variados' :
                'temas obscuros e desafiadores';

        const usedList = usedCards.length > 0
            ? `\n\nIMPORTANTE: NÃO use nenhuma destas respostas que já foram usadas: ${usedCards.join(', ')}`
            : '';

        const prompt = `Crie uma carta do jogo Perfil sobre ${categoryMap[selectedCategory]}. Dificuldade: ${difficultyText}.${usedList}

IMPORTANTE: Responda APENAS com um JSON válido, sem qualquer texto adicional, sem markdown, sem explicações. O JSON deve ter exatamente esta estrutura:

{
  "categoria": "${selectedCategory}",
  "resposta": "nome da resposta",
  "dicas": ["dica 1", "dica 2", ..., "dica 20"]
}

Regras para as dicas:
1. Criar exatamente 20 dicas
2. Numerar de 1 a 20
3. Dicas 1-5: muito genéricas e difíceis
4. Dicas 6-10: intermediárias
5. Dicas 11-15: mais específicas
6. Dicas 16-20: muito óbvias e fáceis
7. A última dica (20) deve praticamente entregar a resposta
8. Cada dica deve ser uma frase completa e interessante
9. Não revelar a resposta nas primeiras dicas

Exemplo de progressão:
- Dica 1: "Isso está relacionado com entretenimento"
- Dica 10: "É conhecido mundialmente desde os anos 90"
- Dica 20: "É o ratinho mais famoso do mundo, mascote da Disney"

Responda APENAS com o JSON, nada mais.`;

        try {
            let cardData: Card;

            // Tenta primeiro com Gemini
            try {
                cardData = await generateWithGemini(prompt);
                console.log('✅ Carta gerada com Gemini');
            } catch (geminiError) {
                console.warn('⚠️ Gemini falhou:', geminiError);

                // Fallback para OpenRouter
                try {
                    cardData = await generateWithOpenRouter(prompt);
                    console.log('✅ Carta gerada com OpenRouter (fallback)');
                } catch (openrouterError) {
                    console.error('❌ OpenRouter também falhou:', openrouterError);
                    throw new Error('Ambas APIs (Gemini e OpenRouter) falharam');
                }
            }

            await saveUsedCard(cardData.resposta);

            const shuffled = shuffleArray(Array.from({ length: 20 }, (_, i) => i));
            setShuffledOrder(shuffled);
            setCurrentCard(cardData);

        } catch (error) {
            console.error('Erro ao gerar carta (DETALHES):', error);
            if (error instanceof Error) {
                console.error('Mensagem de erro:', error.message);
                console.error('Stack trace:', error.stack);
            }

            alert('⚠️ Erro ao gerar carta.\n\nVerifique se suas API Keys estão configuradas no arquivo .env:\n- VITE_GEMINI_API_KEY\n- VITE_OPENROUTER_API_KEY (fallback)');

            const shuffled = shuffleArray(Array.from({ length: 20 }, (_, i) => i));
            setShuffledOrder(shuffled);
            setCurrentCard(exampleCard);
        }

        setIsGenerating(false);
    };

    const resetCard = () => {
        setCurrentCard(null);
        setShuffledOrder([]);
    };

    return {
        currentCard,
        isGenerating,
        shuffledOrder,
        generateCard,
        resetCard
    };
};
