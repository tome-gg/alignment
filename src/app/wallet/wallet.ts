import { Observable } from "rxjs";
import * as web3 from '@solana/web3.js';

export interface SolanaWalletAppInterface {
  // Emits true if the wallet application does exist in the user's browser.
  exists(): Observable<boolean>

  // Redirects user to download specified wallet. Opens a new window.
  redirect_to_download(): void

  // Connects to a user's wallet, and returns the user's public key.
  connect(): Observable<web3.PublicKey>
}