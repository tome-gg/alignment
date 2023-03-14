import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlignmentNegotiationState } from 'src/app/core/alignment-client';
import StaticContent from '../../../assets/options.json';

@Component({
  selector: 'app-term-and-protocol-selector',
  templateUrl: './term-and-protocol-selector.component.html',
  styleUrls: ['./term-and-protocol-selector.component.sass']
})
export class TermAndProtocolSelectorComponent {
  negotiationTerms: any[] = [];
  protocols: any[] = [];

  @Input()
  alignmentNegotiationPublicKey: string = "";

  @Input()
  alignment?: AlignmentNegotiationState;

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

  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    let currentProtocol = this.alignment?.protocol?.toString();

    console.log("current proposal", currentProtocol);

    if (currentProtocol !== null && currentProtocol !== undefined) {
      let p = this.protocols.find(p => p.value === currentProtocol?.toString()) as any;
      if (p){
        p.selected = true;
        p.disabled = this.alignment?.isComplete;
      }
      return;
    }
  }

  selectTerm(term: any) {
    this.termSelectedEvent.emit(term.value);
  }

  selectProtocol(protocol: any) {
    this.protocolSelectedEvent.emit(protocol.value);
  }

  setTermState(state: any) {
    this.termStateSelectedEvent.emit(state);
  }

  setProtocolState(state: any) {
    this.protocolStateSelectedEvent.emit(state);
  }
}
