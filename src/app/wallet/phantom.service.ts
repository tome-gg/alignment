import { Injectable } from '@angular/core';
import { defer, from, map, Observable, of, throwError } from 'rxjs';
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

  disconnect() {
    const provider = this.getPhantomProvider();
    provider.disconnect();
  }

  connect(): Observable<web3.PublicKey> {

    const provider = this.getPhantomProvider();

    if (provider === null || provider === undefined) {
      return throwError(() => new Error("Unable to connect to Phantom wallet; is it installed?"));
    }

    const publicKey$ : Observable<any> = from(defer(() => provider.connect())) as Observable<any>;

    return publicKey$.pipe(
      map((k) => k.publicKey.toString())
    );
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
