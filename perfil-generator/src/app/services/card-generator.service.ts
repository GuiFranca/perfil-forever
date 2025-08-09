import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CardGeneratorService {

  private categorias = ['Digital', 'Pessoa', 'Lugar', 'Coisa', 'Ano'];

  private acoesEspeciais = [
    'Perca sua vez',
    'Avance 1 casa',
    'Avance 2 casas',
    'Avance 3 casas',
    'Volte 1 casa',
    'Volte 2 casas',
    'Volte 3 casas',
    'Ganhe uma ficha azul'
  ];

  gerarCarta(): any {
    const categoria = this.sortearCategoria();
    const resposta = this.gerarRespostaExemplo(categoria); // futuramente, IA ou lista
    const dicas = this.gerarDicas(categoria, resposta);

    return { categoria, resposta, dicas };
  }

  private sortearCategoria() {
    return this.categorias[Math.floor(Math.random() * this.categorias.length)];
  }

  private gerarRespostaExemplo(categoria: string): string {
    const exemplos: any = {
      Digital: ['Instagram', 'Pix', 'Google', 'TikTok'],
      Pessoa: ['Albert Einstein', 'Ayrton Senna', 'Harry Potter', 'Cleópatra'],
      Lugar: ['Gotham City', 'Paris', 'Deserto do Saara', 'Capivari'],
      Coisa: ['Molho Barbecue', 'Cafeteira Elétrica', 'Violão', 'Skate'],
      Ano: ['1969', '2000', '1985', '2020']
    };
    const lista = exemplos[categoria];
    return lista[Math.floor(Math.random() * lista.length)];
  }

  private gerarDicas(categoria: string, resposta: string): string[] {
    const dicasGeradas: string[] = [];

    // Criar dicas simuladas (aqui será a IA futuramente)
    for (let i = 0; i < 14; i++) {
      dicasGeradas.push(this.gerarDicaFake(categoria, resposta));
    }

    // Adicionar ações especiais
    const totalAcoes = Math.floor(Math.random() * 3) + 4; // entre 4 e 6
    for (let i = 0; i < totalAcoes; i++) {
      dicasGeradas.push(this.sortearAcaoEspecial());
    }

    // Embaralhar
    return this.embaralharArray(dicasGeradas).slice(0, 20);
  }

  private gerarDicaFake(categoria: string, resposta: string): string {
    const niveis = ['(difícil)', '(média)', '(fácil)'];
    const nivel = niveis[Math.floor(Math.random() * niveis.length)];
    return `Dica sobre ${categoria} ${nivel}`;
  }

  private sortearAcaoEspecial(): string {
    return this.acoesEspeciais[Math.floor(Math.random() * this.acoesEspeciais.length)];
  }

  private embaralharArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
