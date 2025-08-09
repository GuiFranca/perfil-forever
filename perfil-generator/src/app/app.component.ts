import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CardGeneratorService, Carta } from './services/card-generator.service';

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  carta: Carta | null = null;

  constructor(private gerador: CardGeneratorService) {}

  ngOnInit() {
    this.novaCarta();
  }

  novaCarta() {
    this.gerador.gerarCarta().subscribe((c) => this.carta = c);
  }
}
