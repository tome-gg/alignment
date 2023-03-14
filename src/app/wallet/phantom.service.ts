import { Injectable } from '@angular/core';
import { defer, from, map, Observable, of } from 'rxjs';
import { SolanaWalletAppInterface } from './wallet';
import * as web3 from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class PhantomService implements SolanaWalletAppInterface {

  constructor() { }

  exists(): Observable<boolean> {
    return of(this.doesPhantomExist());
  }

  doesPhantomExist(): boolean {
    return (window as any)?.phantom?.solana?.isPhantom;
  }

  connect(): Observable<web3.PublicKey> {

    const provider = this.getPhantomProvider();

    const publicKey$ : Observable<web3.PublicKey> = from(defer(() => provider.connect())) as Observable<web3.PublicKey>;

    return publicKey$;
  }

  redirect_to_download(): void {
    window.open('https://phantom.app/', '_blank');
  }

  getPhantomProvider(): any {

    if (this.doesPhantomExist() === false) {
      this.redirect_to_download();
      return;
    }
    return (window as any)?.phantom?.solana;
  }


}
