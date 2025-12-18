import React from 'react';
import { Trophy } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <div className="text-center mb-8 pt-6">
            <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Trophy className="text-yellow-400" size={48} />
                PERFIL
                <Trophy className="text-yellow-400" size={48} />
            </h1>
            <p className="text-purple-200 text-lg">Gerador Infinito de Cartas</p>
        </div>
    );
};

export default Header;
