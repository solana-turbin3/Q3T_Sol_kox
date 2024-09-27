import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";
import { BN } from '@coral-xyz/anchor';

interface FeeExtensionFields {
  isInitialized: boolean;
  feeAuthority: PublicKey;
  depositFeeBasisPoints: number;
  maxDepositFee: BN;
  /* bump: number; */
}

export class FeeExtension {
  isInitialized: boolean;
  feeAuthority: PublicKey;
  depositFeeBasisPoints: number;
  maxDepositFee: BN;
  /* bump: number; */

  constructor(fields: FeeExtensionFields) {
    this.isInitialized = fields.isInitialized;
    this.feeAuthority = new PublicKey(fields.feeAuthority);
    this.depositFeeBasisPoints = fields.depositFeeBasisPoints; 
    this.maxDepositFee = fields.maxDepositFee; 
    /* this.bump = fields.bump;  */
  }

  static fromBuffer(buffer: Buffer): FeeExtension {
    const decoded = borsh.deserialize(
      FeeExtensionSchema,
      buffer
    ) as FeeExtensionFields;

    return new FeeExtension(decoded);
  }

  static toBuffer(FeeExtension: FeeExtension): Buffer {
    // Serialize the object to a buffer
    return Buffer.from(
      borsh.serialize(FeeExtensionSchema, {
        isInitialized: FeeExtension.isInitialized,
        feeAuthority: FeeExtension.feeAuthority,
        depositFeeBasisPoints: FeeExtension.depositFeeBasisPoints,
        maxDepositFee: FeeExtension.maxDepositFee,
        /* bump: FeeExtension.bump, */
      })
    );
  }
}

// Define the schema for FeeExtension using Borsh
const FeeExtensionSchema: borsh.Schema = {
  struct: {
    isInitialized: "u8",
    feeAuthority: { array: { type: "u8", len: 32 } },
    depositFeeBasisPoints: "u16",
    maxDepositFee: "u64",
    /* bump: "u8", */
  },
};
