import React from 'react';

interface FooterProps {
    usedCardsCount: number;
}

const Footer: React.FC<FooterProps> = ({ usedCardsCount }) => {
    return (
        <div className="text-center mt-8 text-purple-300 text-sm">
            <p>🎮 Cartas geradas por IA • Diversão infinita!</p>
            {usedCardsCount > 0 && (
                <p className="mt-1 opacity-75">✨ {usedCardsCount} cartas únicas jogadas</p>
            )}
        </div>
    );
};

export default Footer;
