import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

import { CardGeneratorService } from './services/card-generator.service';

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  providers: [CardGeneratorService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  carta: any;

  constructor(private gerador: CardGeneratorService) {
    this.carta = this.gerador.gerarCarta();
  }

  novaCarta() {
    this.carta = this.gerador.gerarCarta();
  }
}
