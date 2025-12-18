import React from 'react';
import { List, Grid } from 'lucide-react';
import { Card, ViewMode } from '../types/game';
import TipsGrid from './TipsGrid';
import TipsList from './TipsList';

interface TipsContainerProps {
    card: Card;
    viewMode: ViewMode;
    revealedClues: number[];
    shuffledOrder: number[];
    onViewModeChange: (mode: ViewMode) => void;
    onRevealClue: (index: number) => void;
}

const TipsContainer: React.FC<TipsContainerProps> = ({
    card,
    viewMode,
    revealedClues,
    shuffledOrder,
    onViewModeChange,
    onRevealClue
}) => {
    return (
        <div className="bg-[#2a2a6e] backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <List className="text-white" size={24} />
                    <h3 className="text-white text-xl font-bold">Lista de Dicas</h3>
                </div>
                <div className="flex flex-col gap-2 absolute right-0 top-0">
                    <button
                        onClick={() => onViewModeChange(viewMode === 'list' ? 'grid' : 'list')}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all backdrop-blur-sm"
                        title={viewMode === 'list' ? "Ver como Grade" : "Ver como Lista"}
                    >
                        {viewMode === 'list' ? <Grid size={20} /> : <List size={20} />}
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <TipsGrid
                    card={card}
                    revealedClues={revealedClues}
                    shuffledOrder={shuffledOrder}
                    onRevealClue={onRevealClue}
                />
            ) : (
                <TipsList
                    card={card}
                    revealedClues={revealedClues}
                    shuffledOrder={shuffledOrder}
                    onRevealClue={onRevealClue}
                />
            )}
        </div>
    );
};

export default TipsContainer;
