import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NegotiationParameters } from 'src/app/core/defns';

@Component({
  selector: 'app-parameters-selector',
  templateUrl: './parameters-selector.component.html',
  styleUrls: ['./parameters-selector.component.sass']
})
export class ParametersSelectorComponent {

  @Input()
  mentorPreferredTermValue: number = 0;

  @Input()
  apprenticePreferredTermValue: number = 0;

  currentParams: NegotiationParameters = {};

  setParametersState(value: any) {

  }

  @Output()
  onParametersChange: EventEmitter<NegotiationParameters> = new EventEmitter();
}
