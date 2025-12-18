import React, { useState } from 'react';
import { ViewMode } from './types/game';
import { useGameStorage } from './hooks/useGameStorage';
import { useCardGenerator } from './hooks/useCardGenerator';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import GameConfig from './components/GameConfig';
import GenerateCardButton from './components/GenerateCardButton';
import CardInfo from './components/CardInfo';
import TipsContainer from './components/TipsContainer';
import NewCardButton from './components/NewCardButton';

const PerfilGame = () => {
    // State
    const [revealedClues, setRevealedClues] = useState<number[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedDifficulties, setSelectedDifficulties] = useState(['facil', 'medio', 'dificil']);
    const [category, setCategory] = useState('todos');
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    // Hooks
    const { usedCards, saveUsedCard, clearHistory } = useGameStorage();
    const { currentCard, isGenerating, shuffledOrder, generateCard, resetCard } = useCardGenerator({
        usedCards,
        saveUsedCard
    });

    // Handlers
    const toggleDifficulty = (diff: string) => {
        setSelectedDifficulties(prev => {
            if (prev.includes(diff)) {
                if (prev.length === 1) return prev;
                return prev.filter(d => d !== diff);
            } else {
                return [...prev, diff];
            }
        });
    };

    const handleGenerateCard = async () => {
        setRevealedClues([]);
        setShowAnswer(false);
        await generateCard(category, selectedDifficulties);
    };

    const handleResetGame = () => {
        resetCard();
        setRevealedClues([]);
        setShowAnswer(false);
    };

    const revealClue = (index: number) => {
        if (!revealedClues.includes(index)) {
            setRevealedClues([...revealedClues, index].sort((a, b) => a - b));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
            <div className="max-w-4xl mx-auto">
                <Header />

                {/* Configurações (apenas quando não há carta) */}
                {!currentCard && (
                    <>
                        <GameConfig
                            selectedDifficulties={selectedDifficulties}
                            category={category}
                            usedCardsCount={usedCards.length}
                            onToggleDifficulty={toggleDifficulty}
                            onCategoryChange={setCategory}
                            onResetHistory={clearHistory}
                        />

                        <GenerateCardButton
                            isGenerating={isGenerating}
                            onGenerate={handleGenerateCard}
                        />
                    </>
                )}

                {/* Carta Atual */}
                {currentCard && (
                    <div className="space-y-6">
                        <CardInfo
                            card={currentCard}
                            revealedCount={revealedClues.length}
                            showAnswer={showAnswer}
                            onToggleAnswer={() => setShowAnswer(!showAnswer)}
                        />

                        <TipsContainer
                            card={currentCard}
                            viewMode={viewMode}
                            revealedClues={revealedClues}
                            shuffledOrder={shuffledOrder}
                            onViewModeChange={setViewMode}
                            onRevealClue={revealClue}
                        />

                        <NewCardButton onReset={handleResetGame} />
                    </div>
                )}

                <Footer usedCardsCount={usedCards.length} />
            </div>
        </div>
    );
};

export default PerfilGame;
