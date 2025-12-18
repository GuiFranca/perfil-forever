import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Eye, EyeOff } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PerfilGame = () => {
    const [currentCard, setCurrentCard] = useState<any>(null);
    const [revealedClues, setRevealedClues] = useState<number[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedDifficulties, setSelectedDifficulties] = useState(['facil', 'medio', 'dificil']);
    const [category, setCategory] = useState('todos');
    const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
    const [usedCards, setUsedCards] = useState<string[]>([]);

    // Carregar cartas já usadas do storage ao iniciar
    useEffect(() => {
        const loadUsedCards = async () => {
            try {
                const result = await (window as any).storage.get('perfil-used-cards');
                if (result && result.value) {
                    setUsedCards(JSON.parse(result.value));
                }
            } catch (error) {
                console.log('Nenhuma carta usada anteriormente');
            }
        };
        loadUsedCards();
    }, []);

    const categories = [
        { id: 'todos', name: 'Todas', color: 'bg-purple-500' },
        { id: 'pessoa', name: 'Pessoa', color: 'bg-blue-500' },
        { id: 'lugar', name: 'Lugar', color: 'bg-green-500' },
        { id: 'objeto', name: 'Objeto', color: 'bg-yellow-500' },
        { id: 'ano', name: 'Ano', color: 'bg-red-500' }
    ];

    // Função para embaralhar array
    const shuffleArray = (array: any[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const toggleDifficulty = (diff: string) => {
        setSelectedDifficulties(prev => {
            if (prev.includes(diff)) {
                // Não permitir desmarcar se for a única selecionada
                if (prev.length === 1) return prev;
                return prev.filter(d => d !== diff);
            } else {
                return [...prev, diff];
            }
        });
    };

    const generateCard = async () => {
        setIsGenerating(true);
        setRevealedClues([]);
        setShowAnswer(false);

        const categoryMap: { [key: string]: string } = {
            'pessoa': 'uma pessoa famosa (celebridade, personagem histórico, atleta, etc)',
            'lugar': 'um lugar (cidade, país, ponto turístico, etc)',
            'objeto': 'um objeto ou coisa (produto, invenção, comida, animal, etc)',
            'ano': 'um ano específico (evento histórico marcante)'
        };

        const selectedCategory = category === 'todos'
            ? ['pessoa', 'lugar', 'objeto', 'ano'][Math.floor(Math.random() * 4)]
            : category;

        // Sorteia uma dificuldade aleatória das selecionadas
        const randomDifficulty = selectedDifficulties[Math.floor(Math.random() * selectedDifficulties.length)];

        const difficultyText = randomDifficulty === 'facil' ? 'temas conhecidos e populares' :
            randomDifficulty === 'medio' ? 'temas variados' :
                'temas obscuros e desafiadores';

        // Lista de cartas já usadas para evitar repetições
        const usedList = usedCards.length > 0
            ? `\n\nIMPORTANTE: NÃO use nenhuma destas respostas que já foram usadas: ${usedCards.join(', ')}`
            : '';

        try {
            if (!GEMINI_API_KEY) {
                alert("Por favor, configure sua API Key no arquivo .env (variável VITE_GEMINI_API_KEY)");
                setIsGenerating(false);
                return;
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Crie uma carta do jogo Perfil sobre ${categoryMap[selectedCategory]}. Dificuldade: ${difficultyText}.${usedList}

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

Responda APENAS com o JSON, nada mais.`
                        }]
                    }]
                })
            });

            const data = await response.json();
            let content = data.candidates[0].content.parts[0].text.trim();

            // Remove markdown e limpa o conteúdo
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const cardData = JSON.parse(content);

            // Adiciona a resposta à lista de cartas usadas
            const newUsedCards = [...usedCards, cardData.resposta];
            setUsedCards(newUsedCards);

            // Salva no storage
            try {
                await (window as any).storage.set('perfil-used-cards', JSON.stringify(newUsedCards));
            } catch (error) {
                console.error('Erro ao salvar cartas usadas:', error);
            }

            // Embaralha a ordem das dicas (mantém o conteúdo, mas muda a posição)
            const shuffled = shuffleArray(Array.from({ length: 20 }, (_, i) => i));
            setShuffledOrder(shuffled);

            setCurrentCard(cardData);
        } catch (error) {
            console.error('Erro ao gerar carta:', error);
            // Carta de exemplo em caso de erro
            const exampleCard = {
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

            // Embaralha a ordem das dicas
            const shuffled = shuffleArray(Array.from({ length: 20 }, (_, i) => i));
            setShuffledOrder(shuffled);

            setCurrentCard(exampleCard);
        }

        setIsGenerating(false);
    };

    const revealClue = (index: number) => {
        if (!revealedClues.includes(index)) {
            setRevealedClues([...revealedClues, index].sort((a, b) => a - b));
        }
    };

    const resetGame = () => {
        setCurrentCard(null);
        setRevealedClues([]);
        setShowAnswer(false);
        setShuffledOrder([]);
    };

    const getCategoryColor = (cat: string) => {
        return categories.find(c => c.id === cat)?.color || 'bg-purple-500';
    };

    const getCategoryName = (cat: string) => {
        return categories.find(c => c.id === cat)?.name || 'Categoria';
    };

    const resetHistory = async () => {
        if (window.confirm(`Tem certeza que deseja limpar o histórico?\n\n${usedCards.length} cartas serão removidas e poderão aparecer novamente.`)) {
            setUsedCards([]);
            try {
                await (window as any).storage.delete('perfil-used-cards');
                alert('Histórico limpo com sucesso!');
            } catch (error) {
                console.error('Erro ao limpar histórico:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 pt-6">
                    <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-400" size={48} />
                        PERFIL
                        <Trophy className="text-yellow-400" size={48} />
                    </h1>
                    <p className="text-purple-200 text-lg">Gerador Infinito de Cartas</p>
                </div>

                {/* Configurações */}
                {!currentCard && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white text-xl font-semibold">Configurações</h3>
                            {usedCards.length > 0 && (
                                <div className="text-right">
                                    <div className="text-purple-200 text-sm">Cartas jogadas</div>
                                    <div className="text-white text-2xl font-bold">{usedCards.length}</div>
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="text-white text-sm font-medium mb-2 block">
                                Dificuldades <span className="text-purple-300 text-xs">(selecione uma ou mais)</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'facil', label: 'Fácil', emoji: '😊' },
                                    { id: 'medio', label: 'Médio', emoji: '🤔' },
                                    { id: 'dificil', label: 'Difícil', emoji: '🤯' }
                                ].map(d => (
                                    <button
                                        key={d.id}
                                        onClick={() => toggleDifficulty(d.id)}
                                        className={`py-3 px-4 rounded-lg font-medium transition-all ${selectedDifficulties.includes(d.id)
                                            ? 'bg-yellow-400 text-purple-900 shadow-lg scale-105'
                                            : 'bg-white/20 text-white hover:bg-white/30 opacity-50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{d.emoji}</div>
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                            {selectedDifficulties.length > 1 && (
                                <p className="text-purple-200 text-xs mt-2 text-center">
                                    🎲 Sortearemos entre: {selectedDifficulties.map(d =>
                                        d.charAt(0).toUpperCase() + d.slice(1)
                                    ).join(', ')}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">Categoria</label>
                            <div className="grid grid-cols-5 gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${category === cat.id
                                            ? `${cat.color} text-white shadow-lg scale-105`
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {usedCards.length > 0 && (
                            <button
                                onClick={resetHistory}
                                className="w-full mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-200 py-2 px-4 rounded-lg font-medium transition-all border border-red-400/30"
                            >
                                🗑️ Limpar Histórico ({usedCards.length} cartas)
                            </button>
                        )}
                    </div>
                )}

                {/* Botão Sortear */}
                {!currentCard && (
                    <button
                        onClick={generateCard}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 py-6 rounded-2xl font-bold text-2xl hover:from-yellow-300 hover:to-orange-400 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        <Sparkles size={32} />
                        {isGenerating ? 'Gerando Carta Mágica...' : 'Sortear Nova Carta'}
                    </button>
                )}

                {/* Carta Atual */}
                {currentCard && (
                    <div className="space-y-6">
                        {/* Info da Carta */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className={`inline-block ${getCategoryColor(currentCard.categoria)} text-white px-4 py-2 rounded-full font-bold text-lg`}>
                                        {getCategoryName(currentCard.categoria).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-white text-right">
                                    <div className="text-sm opacity-75">Dicas Reveladas</div>
                                    <div className="text-3xl font-bold">{revealedClues.length}/20</div>
                                </div>
                            </div>

                            {/* Botão Revelar Resposta */}
                            <button
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                {showAnswer ? <EyeOff size={20} /> : <Eye size={20} />}
                                {showAnswer ? 'Ocultar Resposta' : 'Revelar Resposta'}
                            </button>

                            {showAnswer && (
                                <div className="mt-4 bg-green-500/20 border-2 border-green-400 rounded-xl p-4 text-center">
                                    <div className="text-green-300 text-sm font-medium mb-1">RESPOSTA</div>
                                    <div className="text-white text-3xl font-bold">{currentCard.resposta}</div>
                                </div>
                            )}
                        </div>

                        {/* Grid de Dicas */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white text-xl font-semibold mb-4">Escolha um Número</h3>
                            <div className="grid grid-cols-5 gap-2 mb-6">
                                {Array.from({ length: 20 }, (_, i) => i).map(i => (
                                    <button
                                        key={i}
                                        onClick={() => revealClue(i)}
                                        disabled={revealedClues.includes(i)}
                                        className={`aspect-square rounded-lg font-bold text-xl transition-all ${revealedClues.includes(i)
                                            ? 'bg-green-500 text-white shadow-lg'
                                            : 'bg-white/30 text-white hover:bg-white/50 hover:scale-105'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Dicas Reveladas */}
                            {revealedClues.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-white font-semibold text-lg mb-3">Dicas Reveladas:</h4>
                                    {revealedClues.map(index => {
                                        const originalIndex = shuffledOrder[index];
                                        return (
                                            <div
                                                key={index}
                                                className="bg-white/20 rounded-lg p-4 text-white border border-white/30"
                                            >
                                                <span className="font-bold text-yellow-300">#{index + 1}</span> {currentCard.dicas[originalIndex]}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Botão Nova Carta */}
                        <button
                            onClick={resetGame}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-xl hover:from-red-400 hover:to-pink-400 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            <RotateCcw size={24} />
                            Nova Carta
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-8 text-purple-300 text-sm">
                    <p>🎮 Cartas geradas por IA • Diversão infinita!</p>
                    {usedCards.length > 0 && (
                        <p className="mt-1 opacity-75">✨ {usedCards.length} cartas únicas jogadas</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerfilGame;
