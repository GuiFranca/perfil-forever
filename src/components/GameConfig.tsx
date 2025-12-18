import React from 'react';
import { categories, difficulties } from '../constants/categories';

interface GameConfigProps {
    selectedDifficulties: string[];
    category: string;
    usedCardsCount: number;
    onToggleDifficulty: (diff: string) => void;
    onCategoryChange: (cat: string) => void;
    onResetHistory: () => void;
}

const GameConfig: React.FC<GameConfigProps> = ({
    selectedDifficulties,
    category,
    usedCardsCount,
    onToggleDifficulty,
    onCategoryChange,
    onResetHistory
}) => {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-semibold">Configurações</h3>
                {usedCardsCount > 0 && (
                    <div className="text-right">
                        <div className="text-purple-200 text-sm">Cartas jogadas</div>
                        <div className="text-white text-2xl font-bold">{usedCardsCount}</div>
                    </div>
                )}
            </div>

            {/* Dificuldades */}
            <div className="mb-4">
                <label className="text-white text-sm font-medium mb-2 block">
                    Dificuldades <span className="text-purple-300 text-xs">(selecione uma ou mais)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {difficulties.map(d => (
                        <button
                            key={d.id}
                            onClick={() => onToggleDifficulty(d.id)}
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

            {/* Categorias */}
            <div>
                <label className="text-white text-sm font-medium mb-2 block">Categoria</label>
                <div className="grid grid-cols-5 gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
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

            {/* Botão Limpar Histórico */}
            {usedCardsCount > 0 && (
                <button
                    onClick={onResetHistory}
                    className="w-full mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-200 py-2 px-4 rounded-lg font-medium transition-all border border-red-400/30"
                >
                    🗑️ Limpar Histórico ({usedCardsCount} cartas)
                </button>
            )}
        </div>
    );
};

export default GameConfig;
