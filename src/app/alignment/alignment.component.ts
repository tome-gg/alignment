import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AlignmentNegotiation } from 'src/defn/alignment_negotiation';
import * as web3 from '@solana/web3.js';
import { PhantomService } from '../wallet/phantom.service';
import { AlignmentNegotiationState, NegotiationParameters } from '../core/alignment-client';
import { TomeService } from '../tome/tome.service';
import { BN } from '@coral-xyz/anchor';
import { TermAndProtocolSelectorComponent } from './term-and-protocol-selector/term-and-protocol-selector.component';

enum ComponentState {
  // Means the user is not connected yet
  Disconnected = "disconnected", 
  // Empty means that ...
  // - user's wallet is already connected
  // 
  // but the alignment negotiation is not yet selected.
  Unset = "unset",
  // Viewing means that ...
  // - user's wallet is already connected
  // - the alignment negotiation is selected
  //
  // but there are currently no changes to the proposal.
  Viewing = "viewing",
  // Editing means that ...
  // - user's wallet is already connected
  // - the alignment negotiation is selected
  // - there are existing changes on the proposal 
  //
  // but those changes are not yet submitted.
  Editing = "editing",
  // Loading means that ...
  // - user's wallet is already connected
  // - the alignment negotiation is selected
  // 
  // but we're giving it a short timeout to waiting to confirm
  // the instructions. Once confirmed, the state will be returned
  // to Viewing.
  Loading = "loading"
}

@Component({
  selector: 'app-alignment',
  templateUrl: './alignment.component.html',
  styleUrls: ['./alignment.component.sass']
})
export class AlignmentComponent {


  @ViewChild('termAndProtocolSelector') termAndProtocolSelector?: TermAndProtocolSelectorComponent;


  // The user's public key from their connected wallet.
  userWalletPublicKey: string|null = null;

  alignmentNegotiationPublicKey : string = "";
  
  currentState : ComponentState = ComponentState.Disconnected;

  alignmentNegotiation?: AlignmentNegotiationState = {
    alternatives: new web3.PublicKey(new BN(0)),
    isComplete: false,
    mentoringNft: new web3.PublicKey(new BN(0)),
    parties: [],
    
    term: [],
    termState: {},
    
    protocol: new web3.PublicKey(new BN(0)),
    protocolState: {},

    parameters: [],
    parametersState: {},
    
    stakes: [],
    stakesState: {},

    turn: 0,
    version: 0
  };

  proposal: NegotiationParameters = {
    protocol: null,
    term: null,
    parameters: null,
    stakes: null,
    events: 0,
    altProtocol: null,
    altTerm: null
  }

  isDirty: boolean = false;

  constructor(private phantomService: PhantomService, private tome: TomeService, private changeDetectorRef: ChangeDetectorRef) {
    // this.connect();
  }

  disconnect() {
    this.userWalletPublicKey = "";
    this.alignmentNegotiationPublicKey = "";
    this.currentState = ComponentState.Disconnected;
    this.phantomService.disconnect();
    this.isDirty = false;
  }

  connect() {
    this.phantomService.connect().subscribe(publicKey => {
      this.currentState = ComponentState.Unset;
      this.userWalletPublicKey = publicKey.toString();
      console.log("Connected!", publicKey);
    })
  }

  onChange() {
    this.isDirty = true;
    this.currentState = ComponentState.Editing;
  }

  setup(){

  }

  view(){

    // TODO: Verify if valid
    const isInvalid = false;
    if (isInvalid) {
      return;
    }

    console.log("Initializing tome service")
    this.tome.init();
    
    console.log("Fetching alignment negotiation")
    this.tome.fetchAlignmentNegotiation(this.alignmentNegotiationPublicKey).subscribe((data) => {
      this.alignmentNegotiation = data as unknown as AlignmentNegotiationState;
      for (const prop in this.alignmentNegotiation) {
        let ref = this.alignmentNegotiation as any;
        ref[prop] = (data as any)[prop]
      }
      this.reload();
    })

    this.currentState = ComponentState.Viewing;
  }

  reload() {
    this.changeDetectorRef.detectChanges();
    this.termAndProtocolSelector?.reload();
  }

  fetch() {
    
  }

  setTerm(event: string) {
    console.log(event, "term")
  }

  setProtocol(event: string|null) {
    console.log(event, "protocol")
  }
}
