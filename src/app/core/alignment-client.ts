import * as web3 from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';


export type AlignmentNegotiation = {

}

export type NegotiationParameters = {
    protocol: web3.PublicKey|null,
    term: web3.PublicKey|null,
    parameters: number[]|null,
    stakes: anchor.BN|null,
    events: number|0,
    altProtocol: web3.PublicKey|null,
    altTerm: web3.PublicKey|null,
}
