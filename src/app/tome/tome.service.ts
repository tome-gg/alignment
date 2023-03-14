import { Injectable } from '@angular/core';
import { AnchorProvider, Program, Provider, setProvider, Wallet} from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { defer, from } from 'rxjs';
import { AlignmentNegotiation, IDL } from 'src/defn/alignment_negotiation';
import { NegotiationParameters } from '../core/alignment-client';

const ALIGNMENT_NEGOTIATION_PROGRAM_ID = '5v2iHnzVvmqoYXva1CaDLToUNdwjo1ZHuyMicfokaXBn';

@Injectable({
  providedIn: 'root'
})
export class TomeService {

  program?: Program<AlignmentNegotiation>;
  programProvider?: Provider;

  constructor() { 

  }

  init() {
    console.log('init start');
    try {
      const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
      
      this.program = new Program<AlignmentNegotiation>(IDL, ALIGNMENT_NEGOTIATION_PROGRAM_ID, { connection });
      this.programProvider = this.program?.provider;
      setProvider(this.programProvider);
    }catch(e) {
      console.error('Init failed', e);
    }
  }

  // Gets information about an alignment negotiation
  fetchAlignmentNegotiation(alignmentNegotiationPublicKey: string) {
    return from(
      defer(
        () => from(this.program!.account.alignmentNegotiation.fetch(alignmentNegotiationPublicKey))
      )
    )
  }

  // Constructs the setup negotiation instruction.
  createTxnSetupNegotiation(apprenticePublicKey: web3.PublicKey, mentorPublicKey: web3.PublicKey, negotiationPublicKey: web3.PublicKey) {
    return this.program?.methods
      .setupNegotation(mentorPublicKey)
      .accounts({
        negotiation: negotiationPublicKey,
        apprentice: apprenticePublicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
  }

  // Constructs the send proposal instruction.
  createTxnSendProposal(proposal: NegotiationParameters, negotiationPublicKey: web3.PublicKey, initiatorPublicKey: web3.PublicKey) {
    return this.program?.methods
      .propose(proposal)
      .accounts({
        negotiation: negotiationPublicKey,
        player: initiatorPublicKey,
      })
      .instruction();
  }

  requestAirdrop() {
    async function requestAirdrop(programProvider: AnchorProvider, walletAddress: web3.PublicKey, airdropAmount: number) {
      console.log(`🌧️ Requesting airdrop for ${walletAddress}`);
      // 1 - Request Airdrop
    
      const SOLANA_CONNECTION = programProvider.connection; // new web3.Connection(web3.clusterApiUrl("devnet"));
      const signature = await SOLANA_CONNECTION.requestAirdrop(
        walletAddress,
        airdropAmount
      );
      // 2 - Fetch the latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await SOLANA_CONNECTION.getLatestBlockhash();
      // 3 - Confirm transaction success
      await SOLANA_CONNECTION.confirmTransaction(
        {
          blockhash,
          lastValidBlockHeight,
          signature,
        },
        "finalized"
      );
      // 4 - Log results
      console.log(
        `✅ txn complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    }
  }
}
