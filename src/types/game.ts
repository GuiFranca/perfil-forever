// Tipos do jogo Perfil

export interface Card {
    categoria: string;
    resposta: string;
    dicas: string[];
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface Difficulty {
    id: string;
    label: string;
    emoji: string;
}

export type ViewMode = 'list' | 'grid';
