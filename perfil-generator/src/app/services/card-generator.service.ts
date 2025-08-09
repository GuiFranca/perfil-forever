import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Linha {
  tipo: 'dica' | 'acao';
  texto: string;
  dificuldade: 'facil' | 'media' | 'dificil' | 'n/a';
}

export interface Carta {
  categoria: string;
  resposta: string;
  linhas: Linha[];
}

@Injectable({ providedIn: 'root' })
export class CardGeneratorService {
  private apiUrl = 'http://localhost:3001/cards';

  constructor(private http: HttpClient) {}

  gerarCarta(categoria?: string, resposta?: string): Observable<Carta> {
    return this.http.post<Carta>(this.apiUrl, { categoria, resposta });
  }
}
