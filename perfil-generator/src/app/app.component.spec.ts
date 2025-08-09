import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { CardGeneratorService, Carta } from './services/card-generator.service';

class MockCardGeneratorService {
  gerarCarta() {
    return of({ categoria: 'Digital', resposta: 'Exemplo', linhas: [] } as Carta);
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: CardGeneratorService, useClass: MockCardGeneratorService }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
