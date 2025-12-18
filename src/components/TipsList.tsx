import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '../types/game';

interface TipsListProps {
    card: Card;
    revealedClues: number[];
    shuffledOrder: number[];
    onRevealClue: (index: number) => void;
}

const TipsList: React.FC<TipsListProps> = ({
    card,
    revealedClues,
    shuffledOrder,
    onRevealClue
}) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: 20 }, (_, i) => i).map(i => {
                const isRevealed = revealedClues.includes(i);
                const originalIndex = shuffledOrder[i];
                return (
                    <div
                        key={i}
                        onClick={() => !isRevealed && onRevealClue(i)}
                        className={`relative rounded-2xl p-4 transition-all border ${isRevealed
                            ? 'bg-white/10 border-white/20'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 cursor-pointer'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Número */}
                            <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-lg ${isRevealed
                                ? 'bg-green-500 text-white'
                                : 'bg-[#4c4c8a] text-white/50'
                                }`}>
                                {i + 1}
                            </div>

                            {/* Texto - Ocupa o espaço restante */}
                            <div className="flex-1 py-1">
                                {isRevealed ? (
                                    <p className="text-white font-medium leading-snug">
                                        {card.dicas[originalIndex]}
                                    </p>
                                ) : (
                                    <p className="text-white/30 font-medium">
                                        Toque para revelar a dica {i + 1}...
                                    </p>
                                )}
                            </div>

                            {/* Ícone de Check (apenas se revelado) */}
                            {isRevealed && (
                                <div className="flex-shrink-0 text-green-500 mt-1">
                                    <CheckCircle size={20} fill="currentColor" className="text-green-900" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TipsList;
