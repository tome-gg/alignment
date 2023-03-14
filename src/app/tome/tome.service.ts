import { Injectable } from '@angular/core';
import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import { AlignmentNegotiation } from 'src/defn/alignment_negotiation';
import { NegotiationParameters } from '../core/alignment-client';

@Injectable({
  providedIn: 'root'
})
export class TomeService {

  program?: anchor.Program<AlignmentNegotiation>;
  programProvider?: anchor.AnchorProvider;

  constructor() { 

  }

  init() {
    anchor.setProvider(anchor.AnchorProvider.env());
    this.program = anchor.workspace.AlignmentNegotiation as anchor.Program<AlignmentNegotiation>;
    this.programProvider = this.program.provider as anchor.AnchorProvider;
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
    async function requestAirdrop(programProvider: anchor.AnchorProvider, walletAddress: web3.PublicKey, airdropAmount: number) {
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
