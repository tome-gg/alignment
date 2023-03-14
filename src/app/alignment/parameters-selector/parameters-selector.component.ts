import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlignmentNegotiationState, NegotiationParameters } from 'src/app/core/alignment-client';


@Component({
  selector: 'app-parameters-selector',
  templateUrl: './parameters-selector.component.html',
  styleUrls: ['./parameters-selector.component.sass']
})
export class ParametersSelectorComponent {

  @Input()
  alignment?: AlignmentNegotiationState;

  @Input()
  mentorPreferredTermValue: number = 0;

  @Input()
  apprenticePreferredTermValue: number = 0;

  currentParams: NegotiationParameters = {
    altProtocol: null,
    altTerm: null,
    parameters: null,
    protocol: null,
    stakes: null,
    term: null,
    events: 0,
  };

  setParametersState(value: any) {

  }

  @Output()
  onParametersChange: EventEmitter<NegotiationParameters> = new EventEmitter();
}
