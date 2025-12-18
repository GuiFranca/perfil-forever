import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '../types/game';
import { getCategoryColor, getCategoryName } from '../constants/categories';

interface CardInfoProps {
    card: Card;
    revealedCount: number;
    showAnswer: boolean;
    onToggleAnswer: () => void;
}

const CardInfo: React.FC<CardInfoProps> = ({
    card,
    revealedCount,
    showAnswer,
    onToggleAnswer
}) => {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <span className={`inline-block ${getCategoryColor(card.categoria)} text-white px-4 py-2 rounded-full font-bold text-lg`}>
                        {getCategoryName(card.categoria).toUpperCase()}
                    </span>
                </div>
                <div className="text-white text-right">
                    <div className="text-sm opacity-75">Dicas Reveladas</div>
                    <div className="text-3xl font-bold">{revealedCount}/20</div>
                </div>
            </div>

            {/* Botão Revelar Resposta */}
            <button
                onClick={onToggleAnswer}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
                {showAnswer ? <EyeOff size={20} /> : <Eye size={20} />}
                {showAnswer ? 'Ocultar Resposta' : 'Revelar Resposta'}
            </button>

            {showAnswer && (
                <div className="mt-4 bg-green-500/20 border-2 border-green-400 rounded-xl p-4 text-center">
                    <div className="text-green-300 text-sm font-medium mb-1">RESPOSTA</div>
                    <div className="text-white text-3xl font-bold">{card.resposta}</div>
                </div>
            )}
        </div>
    );
};

export default CardInfo;
