import { Category, Difficulty } from '../types/game';

export const categories: Category[] = [
    { id: 'todos', name: 'Todas', color: 'bg-purple-500' },
    { id: 'pessoa', name: 'Pessoa', color: 'bg-blue-500' },
    { id: 'lugar', name: 'Lugar', color: 'bg-green-500' },
    { id: 'objeto', name: 'Objeto', color: 'bg-yellow-500' },
    { id: 'ano', name: 'Ano', color: 'bg-red-500' }
];

export const difficulties: Difficulty[] = [
    { id: 'facil', label: 'Fácil', emoji: '😊' },
    { id: 'medio', label: 'Médio', emoji: '🤔' },
    { id: 'dificil', label: 'Difícil', emoji: '🤯' }
];

export const categoryMap: { [key: string]: string } = {
    'pessoa': 'uma pessoa famosa (celebridade, personagem histórico, atleta, etc)',
    'lugar': 'um lugar (cidade, país, ponto turístico, etc)',
    'objeto': 'um objeto ou coisa (produto, invenção, comida, animal, etc)',
    'ano': 'um ano específico (evento histórico marcante)'
};

export const getCategoryColor = (cat: string): string => {
    return categories.find(c => c.id === cat)?.color || 'bg-purple-500';
};

export const getCategoryName = (cat: string): string => {
    return categories.find(c => c.id === cat)?.name || 'Categoria';
};
