import { Component, Input } from '@angular/core';
import { AlignmentNegotiationState } from 'src/app/core/alignment-client';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.sass']
})
export class SummaryCardComponent {
  @Input()
  alignment?: AlignmentNegotiationState;

  @Input()
  isDirty?: boolean;
}
