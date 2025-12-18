# Perfil Forever - Gerador Infinito de Cartas

"Perfil Forever" é uma versão web infinita e inteligente do clássico jogo de tabuleiro "Perfil". Este projeto utiliza Inteligência Artificial (Anthropic Claude) para gerar cartas de jogo dinamicamente, garantindo que você nunca fique sem novos desafios.

## 🎮 Como Jogar

O objetivo é descobrir a **Pessoa**, **Lugar**, **Objeto** ou **Ano** secreto com o menor número de dicas possível.

1.  **Sorteio**: Clique em "Sortear Nova Carta". A IA irá gerar um perfil secreto com 20 dicas.
2.  **Dicas**: Você verá um painel com botões numerados de 1 a 20.
    *   Ao clicar em um número, uma dica é revelada.
    *   **Atenção**: As dicas são apresentadas em ordem aleatória para você (o botão 1 pode ser uma dica fácil ou difícil), mas a IA gera as dicas seguindo uma lógica de dificuldade.
3.  **Palpite**: A qualquer momento, tente adivinhar quem ou o que é o perfil com base nas dicas reveladas.
4.  **Resposta**: Clique em "Revelar Resposta" para conferir se acertou.

## ✨ Funcionalidades

*   **Geração Infinita via IA**: Utiliza a API da Anthropic (Claude) para criar cartas únicas e criativas sempre que você joga.
*   **Categorias**: Escolha entre:
    *   👤 Pessoa
    *   🌍 Lugar
    *   📦 Objeto
    *   📅 Ano
    *   🔀 Todas (sorteio aleatório)
*   **Níveis de Dificuldade**: Configure entre Fácil, Médio e Difícil para ajustar o desafio das cartas geradas.
*   **Sistema de Dicas Inteligente**: A IA gera 20 dicas progressivas.
*   **Histórico de Partidas**: O jogo rastreia quais cartas já foram jogadas para evitar repetições.
*   **Interface Moderna**: Design responsivo, colorido e animado, construído com Tailwind CSS.

## 🛠️ Tecnologias Utilizadas

*   [React](https://react.dev/) - Biblioteca para construção da interface.
*   [Vite](https://vitejs.dev/) - Ferramenta de build rápida e leve.
*   [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário para estilização.
*   [Lucide React](https://lucide.dev/) - Biblioteca de ícones.
*   [Anthropic API](https://www.anthropic.com/api) - Modelo Claude Sonnet para geração de conteúdo.

## 🚀 Instalação e Execução

Para rodar o projeto localmente:

1.  Clone o repositório:
    ```bash
    git clone <seu-repositorio>
    cd perfil-forever
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## ⚠️ Notas Técnicas Importantes

Este projeto foi originalmente concebido para um ambiente de desenvolvimento assistido por IA que injeta certas capacidades globais. Para executá-lo em um ambiente padrão (localhost ou produção), considere as seguintes adaptações necessárias em `src/App.tsx`:

### 1. Chave da API (Anthropic)
O código atual faz chamadas diretas para `https://api.anthropic.com/v1/messages`. Em um ambiente padrão, isso falhará sem autenticação.
*   **Solução**: Você precisará adicionar o header `x-api-key` com sua chave da Anthropic ou configurar um proxy backend para proteger sua chave.

### 2. Persistência de Dados
O código utiliza uma API global customizada `(window as any).storage` para salvar o histórico de cartas usadas.
*   **Solução**: Substitua as chamadas de `storage.get` e `storage.set` por `localStorage` do navegador para garantir que o histórico funcione em navegadores comuns.

---

Divirta-se jogando Perfil infinitamente! 🎲
