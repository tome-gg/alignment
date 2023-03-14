import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AlignmentNegotiation } from 'src/defn/alignment_negotiation';
import * as web3 from '@solana/web3.js';
import { PhantomService } from '../wallet/phantom.service';
import { AlignmentNegotiationState, NegotiationParameters } from '../core/alignment-client';
import { TomeService } from '../tome/tome.service';
import { BN } from '@coral-xyz/anchor';
import { TermAndProtocolSelectorComponent } from './term-and-protocol-selector/term-and-protocol-selector.component';

declare var gtag : any;

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
  userWalletPublicKey: string = "";

  // The user's mentor's public key from their connected wallet.
  mentorWalletPublicKey: string = "";

  alignmentNegotiationPublicKey : string = "";
  
  currentState : ComponentState = ComponentState.Disconnected;

  alignmentNegotiation?: AlignmentNegotiationState = {
    alternatives: new web3.PublicKey(new BN(0)),
    isComplete: false,
    mentoringNft: new web3.PublicKey(new BN(0)),
    parties: [],
    
    term: new web3.PublicKey(new BN(0)),
    termState: {},
    
    protocol: new web3.PublicKey(new BN(0)),
    protocolState: {},

    parameters: [],
    parametersState: {},
    
    stakes: 0,
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
    gtag('event', 'DISCONNECT_WALLET', {
      'event_category': 'DISCONNECT',
      'event_label': 'User wallet was disconnected',
      'value': 1 })
  }

  connect() {
    this.phantomService.connect().subscribe(publicKey => {
      this.currentState = ComponentState.Unset;
      this.userWalletPublicKey = publicKey.toString();
      console.log("Connected!", publicKey);
      gtag('event', 'CONNECT_WALLET', {
        'event_category': 'CONNECT',
        'event_label': 'User wallet was connected',
        'value': 1 })
    })
  }

  onChange() {
    this.isDirty = true;
    this.currentState = ComponentState.Editing;
  }

  async setup(){
    if (this.userWalletPublicKey === undefined || this.userWalletPublicKey === null){
      console.error("User wallet not authorized.");
      return;
    }

    if (this.mentorWalletPublicKey === undefined || this.mentorWalletPublicKey === null){
      console.error("Mentor public key not specified.");
      return;
    }

    if (false) {

      const newNegotiation = new web3.Keypair();

      const txnSetup = await this.tome.createTxnSetupNegotiation(
        // TODO: These appear to be broken
        // new web3.PublicKey(this.userWalletPublicKey),
        // new web3.PublicKey(this.mentorWalletPublicKey),
        this.userWalletPublicKey as any,
        this.mentorWalletPublicKey as any,
        newNegotiation.publicKey,
      );

      const provider = this.phantomService.getPhantomProvider();
      console.log("Requesting sign and send transaction");

      const signedTransaction = await provider.signTransaction(txnSetup);
      console.log("signed txn", signedTransaction);
      const signature = await this.tome.sendTransaction(signedTransaction);
      console.log("Result of transaction", signature);
    }

    gtag('event', 'INITIATE_ALIGNMENT', {
      'event_category': 'ALIGNMENT',
      'event_label': 'User initiated alignment (mock)',
      'value': 1 })

    this.alignmentNegotiation = {
      alternatives: new web3.PublicKey(new BN(0)),
      mentoringNft: new web3.PublicKey(new BN(0)),
      isComplete: false,
      parameters: [],
      parametersState: {},
      parties: [this.userWalletPublicKey as any],
      protocol: new web3.PublicKey(new BN(0)),
      protocolState: {},
      stakes: 0,
      stakesState: {},
      term: new web3.PublicKey(new BN(0)),
      termState: {},
      turn: 0,
      version: 0
    }

    this.currentState = ComponentState.Viewing;
  }

  view(){

    // TODO: Verify if valid
    const isInvalid = false;
    if (isInvalid) {
      return;
    }


    gtag('event', 'VIEW_ALIGNMENT', {
      'event_category': 'ALIGNMENT',
      'event_label': 'User viewed alignment',
      'value': this.alignmentNegotiationPublicKey })

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

  setParameters(event: any) {
    console.log(event, "params")
  }

  setStakes(event: any) {
    console.log(event, "stakes")
  }
}
