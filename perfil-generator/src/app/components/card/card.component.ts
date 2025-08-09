import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() categoria!: string;
  @Input() resposta!: string;
  @Input() dicas!: string[];
}
