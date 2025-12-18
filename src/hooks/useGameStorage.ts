import { useState, useEffect } from 'react';

const STORAGE_KEY = 'perfil-used-cards';

export const useGameStorage = () => {
    const [usedCards, setUsedCards] = useState<string[]>([]);

    // Carregar cartas usadas ao iniciar
    useEffect(() => {
        const loadUsedCards = async () => {
            try {
                const result = await (window as any).storage.get(STORAGE_KEY);
                if (result && result.value) {
                    setUsedCards(JSON.parse(result.value));
                }
            } catch (error) {
                console.log('Nenhuma carta usada anteriormente');
            }
        };
        loadUsedCards();
    }, []);

    const saveUsedCard = async (cardAnswer: string) => {
        const newUsedCards = [...usedCards, cardAnswer];
        setUsedCards(newUsedCards);

        try {
            await (window as any).storage.set(STORAGE_KEY, JSON.stringify(newUsedCards));
        } catch (error) {
            console.error('Erro ao salvar cartas usadas:', error);
        }
    };

    const clearHistory = async () => {
        if (window.confirm(`Tem certeza que deseja limpar o histórico?\n\n${usedCards.length} cartas serão removidas e poderão aparecer novamente.`)) {
            setUsedCards([]);
            try {
                await (window as any).storage.delete(STORAGE_KEY);
                alert('Histórico limpo com sucesso!');
            } catch (error) {
                console.error('Erro ao limpar histórico:', error);
            }
        }
    };

    return {
        usedCards,
        saveUsedCard,
        clearHistory
    };
};
