import * as web3 from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { NegotiationStateType } from './defns';


export type AlignmentNegotiationState = {
  alternatives: web3.PublicKey;
  isComplete: boolean;
  mentoringNft: web3.PublicKey;
  parties: web3.PublicKey[];
  
  term: web3.PublicKey;
  termState: NegotiationStateType;
  
  protocol: web3.PublicKey;
  protocolState: NegotiationStateType;

  parameters: number[];
  parametersState: NegotiationStateType;
  
  stakes: number;
  stakesState: NegotiationStateType;

  turn: number;
  version: number;
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