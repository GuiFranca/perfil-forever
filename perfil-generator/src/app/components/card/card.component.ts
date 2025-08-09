import { Component, Input } from '@angular/core';
import { Linha } from '../../services/card-generator.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() categoria!: string;
  @Input() resposta!: string;
  @Input() linhas!: Linha[];
}
