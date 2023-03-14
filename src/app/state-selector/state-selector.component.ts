import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-state-selector',
  templateUrl: './state-selector.component.html',
  styleUrls: ['./state-selector.component.sass']
})
export class StateSelectorComponent {
  @Input()
  property: String = "";

  description: String = "";

  @Output()
  stateSelectedEvent: EventEmitter<string|null> = new EventEmitter();

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