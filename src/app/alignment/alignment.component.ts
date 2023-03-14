import { Component } from '@angular/core';
import { AlignmentNegotiation } from 'src/defn/alignment_negotiation';
import * as web3 from '@solana/web3.js';
import { PhantomService } from '../wallet/phantom.service';

enum ComponentState {
  // Means the user is not connected yet
  Disconnected = "disconnected", 
  // 
  Connected = "connected"
}

@Component({
  selector: 'app-alignment',
  templateUrl: './alignment.component.html',
  styleUrls: ['./alignment.component.sass']
})
export class AlignmentComponent {
  // True if the user has already connected their wallet to the mobile app.
  isConnected: boolean = false;

  // The user's public key from their connected wallet.
  userWalletPublicKey: string|null = null;

  currentState : ComponentState = ComponentState.Disconnected;

  // alignmentNegotiation: web3.DecodeStruct<AlignmentNegotiation>|null = null;

  constructor(private phantomService: PhantomService) {
    // this.connect();
  }

  disconnect() {
    this.userWalletPublicKey = "";
    this.isConnected = false;
    this.currentState = ComponentState.Disconnected;
    this.phantomService.disconnect();
  }

  connect() {
    this.phantomService.connect().subscribe(publicKey => {
      this.currentState = ComponentState.Connected;
      this.userWalletPublicKey = publicKey.toString();
      console.log("Connected!", publicKey);
    })
  }

  setTerm(event: string) {
    console.log(event, "term")
  }

  setProtocol(event: string|null) {
    console.log(event, "protocol")
  }
}
