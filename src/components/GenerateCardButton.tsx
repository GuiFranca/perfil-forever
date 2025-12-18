import React from 'react';
import { Sparkles } from 'lucide-react';

interface GenerateCardButtonProps {
    isGenerating: boolean;
    onGenerate: () => void;
}

const GenerateCardButton: React.FC<GenerateCardButtonProps> = ({ isGenerating, onGenerate }) => {
    return (
        <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 py-6 rounded-2xl font-bold text-2xl hover:from-yellow-300 hover:to-orange-400 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
            <Sparkles size={32} />
            {isGenerating ? 'Gerando Carta Mágica...' : 'Sortear Nova Carta'}
        </button>
    );
};

export default GenerateCardButton;
