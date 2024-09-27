import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";

interface DepositPeriodExtensionFields {
  isInitialized: boolean;
  startSlot: number;
  endSlot: number;
}

export class DepositPeriodExtension {
  isInitialized: boolean;
  startSlot: number;
  endSlot: number;

  constructor(fields: DepositPeriodExtensionFields) {
    this.isInitialized = fields.isInitialized;
    this.startSlot = fields.startSlot; 
    this.endSlot = fields.endSlot;
  }

  static fromBuffer(buffer: Buffer): DepositPeriodExtension {
    const decoded = borsh.deserialize(
      DepositPeriodExtensionSchema,
      buffer
    ) as DepositPeriodExtensionFields;

    return new DepositPeriodExtension(decoded);
  }

  static toBuffer(depositPeriodExtension: DepositPeriodExtension): Buffer {
    // Serialize the object to a buffer
    return Buffer.from(
      borsh.serialize(DepositPeriodExtensionSchema, {
        isInitialized: depositPeriodExtension.isInitialized,
        startSlot: depositPeriodExtension.startSlot,
        endSlot: depositPeriodExtension.endSlot,
      })
    );
  }
}

// Define the schema for DepositPeriodExtension using Borsh
const DepositPeriodExtensionSchema: borsh.Schema = {
  struct: {
    isInitialized: "u8",
    startSlot: "u64",
    endSlot: "u64",
  },
};
