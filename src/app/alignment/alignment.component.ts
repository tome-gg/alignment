import { Component } from '@angular/core';
import { AlignmentNegotiation } from 'src/defn/alignment_negotiation';

enum AlignmentNegotiationState {
  // Means the user is not connected yet
  Disconnected, 
  // 
  Connected
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

  alignmentNegotiation: AlignmentNegotiation|null = null;

  setTerm(event: string) {
    
    this.alignmentNegotiation
    console.log(event, "term")
  }

  setProtocol(event: string|null) {
    console.log(event, "protocol")
  }
}
