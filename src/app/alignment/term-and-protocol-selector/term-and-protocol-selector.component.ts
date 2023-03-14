import { Component, EventEmitter, Output } from '@angular/core';
import StaticContent from '../../../assets/options.json';

@Component({
  selector: 'app-term-and-protocol-selector',
  templateUrl: './term-and-protocol-selector.component.html',
  styleUrls: ['./term-and-protocol-selector.component.sass']
})
export class TermAndProtocolSelectorComponent {
  negotiationTerms: any[] = [];
  protocols: any[] = [];

  @Output()
  termSelectedEvent = new EventEmitter<string>();

  @Output()
  termStateSelectedEvent = new EventEmitter<string>();

  @Output()
  protocolSelectedEvent = new EventEmitter<string|null>();

  @Output()
  protocolStateSelectedEvent = new EventEmitter<string>();

  constructor() {
    this.negotiationTerms = StaticContent.filter(c => c.tag === "tnp_term");
    
    this.protocols = [
      StaticContent.find(c => c.id === "null"),
      ...StaticContent.filter(c => c.tag === "tnp_protocol"),
    ];
    console.log(this.negotiationTerms);
  }

  selectTerm(term: any) {
    this.termSelectedEvent.emit(term.value);
  }

  selectProtocol(protocol: any) {
    this.protocolSelectedEvent.emit(protocol.value);
  }

  setTermState(state: any) {
    this.termStateSelectedEvent.emit(state);
    console.log(state, "term");
  }

  setProtocolState(state: any) {
    this.protocolStateSelectedEvent.emit(state);
    console.log(state, "protocol");
  }
}
