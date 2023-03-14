import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NegotiationEvent, NegotiationState, NegotiationStateType } from '../core/defns';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.sass']
})
export class StateSelectorComponent {
  @Input()
  property: String = "";

  description: String = "";

  @Input()
  state?: NegotiationStateType;

  @Input()
  isAlignmentComplete?: boolean;

  @Output()
  stateSelectedEvent: EventEmitter<string|null> = new EventEmitter();

  get allowedOptions(): {label: string, value: string}[] {

    let discuss = {
      label: "Discuss",
      value: NegotiationEvent.Discuss
    }

    let propose = {
      label: "Propose",
      value: NegotiationEvent.Propose
    }

    let review = {
      label: "Review",
      value: NegotiationEvent.Review
    }

    let accept = {
      label: "Accept",
      value: NegotiationEvent.Accept
    }

    switch (this.currentState) {
      case "discussion": return [discuss, propose];
      case "proposed":  return [discuss, propose, review];
      case "reviewed": return [discuss, propose, accept];
      case "accepted": return [propose];
    }

  };

  get currentState(): NegotiationState {
    if (this.state) {
      
      if (this.state?.discussion) return "discussion";
      if (this.state?.proposed) return "proposed";
      if (this.state?.reviewed) return "reviewed";
      if (this.state?.accepted) return "accepted";
    }

    return "discussion";
  }

  onSelect(option: any|null) {
    this.stateSelectedEvent.emit(option?.value);
    switch (option?.value) {
      case "discuss": 
      this.description = "Discuss is to give suggestions without commitment.";
      break;
      case "propose": 
      this.description = "Propose is to confirm this as your primary proposal.";
      break;
      case "review": 
      this.description = "Review is to acknowledge receipt of a proposal.";
      break;
      case "accept": 
      this.description = "Accept is to complete the review and finalize this proposal.";
      break;
    }
  }
}