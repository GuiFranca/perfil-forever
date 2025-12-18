import React from 'react';
import { Card } from '../types/game';

interface TipsGridProps {
    card: Card;
    revealedClues: number[];
    shuffledOrder: number[];
    onRevealClue: (index: number) => void;
}

const TipsGrid: React.FC<TipsGridProps> = ({
    card,
    revealedClues,
    shuffledOrder,
    onRevealClue
}) => {
    return (
        <>
            <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: 20 }, (_, i) => i).map(i => (
                    <button
                        key={i}
                        onClick={() => onRevealClue(i)}
                        disabled={revealedClues.includes(i)}
                        className={`aspect-square rounded-lg font-bold text-xl transition-all ${revealedClues.includes(i)
                            ? 'bg-green-500 text-white shadow-lg'
                            : 'bg-white/10 text-white hover:bg-white/30 hover:scale-105 border border-white/5'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Dicas Reveladas (Modo Grid) */}
            {revealedClues.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-white font-semibold text-lg mb-3">Dicas Reveladas:</h4>
                    {revealedClues.map(index => {
                        const originalIndex = shuffledOrder[index];
                        return (
                            <div
                                key={index}
                                className="bg-white/10 rounded-lg p-4 text-white border border-white/10"
                            >
                                <span className="font-bold text-yellow-300">#{index + 1}</span> {card.dicas[originalIndex]}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default TipsGrid;
