import React from 'react';
import { RotateCcw } from 'lucide-react';

interface NewCardButtonProps {
    onReset: () => void;
}

const NewCardButton: React.FC<NewCardButtonProps> = ({ onReset }) => {
    return (
        <button
            onClick={onReset}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-xl hover:from-red-400 hover:to-pink-400 transition-all shadow-xl flex items-center justify-center gap-3"
        >
            <RotateCcw size={24} />
            Nova Carta
        </button>
    );
};

export default NewCardButton;
