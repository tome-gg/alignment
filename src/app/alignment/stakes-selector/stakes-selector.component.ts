import { Component, Input } from '@angular/core';
import { AlignmentNegotiationState } from 'src/app/core/alignment-client';

@Component({
  selector: 'app-stakes-selector',
  templateUrl: './stakes-selector.component.html',
  styleUrls: ['./stakes-selector.component.sass']
})
export class StakesSelectorComponent {
  @Input()
  alignment?: AlignmentNegotiationState;
}
