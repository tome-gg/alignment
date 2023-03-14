import { Component } from '@angular/core';
import { AlignmentNegotiation } from 'src/defn/alignment_negotiation';
import * as web3 from '@solana/web3.js';
import { PhantomService } from '../wallet/phantom.service';

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

  // The user's public key from their connected wallet.
  userWalletPublicKey: string|null = null;

  alignmentNegotiationPublicKey : string = "";
  
  currentState : ComponentState = ComponentState.Disconnected;

  // alignmentNegotiation: web3.DecodeStruct<AlignmentNegotiation>|null = null;

  constructor(private phantomService: PhantomService) {
    // this.connect();
  }

  disconnect() {
    this.userWalletPublicKey = "";
    this.alignmentNegotiationPublicKey = "";
    this.currentState = ComponentState.Disconnected;
    this.phantomService.disconnect();
  }

  connect() {
    this.phantomService.connect().subscribe(publicKey => {
      this.currentState = ComponentState.Unset;
      this.userWalletPublicKey = publicKey.toString();
      console.log("Connected!", publicKey);
    })
  }

  setup(){

  }

  view(){

    // TODO: Verify if valid
    const isInvalid = false;
    if (isInvalid) {

      return;
    }
    

    this.currentState = ComponentState.Viewing;
  }

  setTerm(event: string) {
    console.log(event, "term")
  }

  setProtocol(event: string|null) {
    console.log(event, "protocol")
  }
}
