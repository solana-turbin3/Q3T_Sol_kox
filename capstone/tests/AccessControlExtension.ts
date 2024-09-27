import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";

export interface AccessControlExtensionFields {
  // Type of access control (0 public - 1 Private)
  accessControlType: number;  
  accessControlAuthority: PublicKey;
}

export enum AccessControlType {
  Public = 0,  // Corresponds to the Rust variant
  Private = 1, // Corresponds to the Rust variant
}

export class AccessControlExtension {
  accessControlType: AccessControlType;
  accessControlAuthority: PublicKey;

  constructor(fields: AccessControlExtensionFields) {
    this.accessControlType = fields.accessControlType;
    this.accessControlAuthority = new PublicKey(fields.accessControlAuthority); 
  }

  static fromBuffer(buffer: Buffer): AccessControlExtension {
    const decoded = borsh.deserialize(
      AccessControlExtensionSchema,
      buffer
    ) as AccessControlExtensionFields;

    return new AccessControlExtension(decoded);
  }

  static toBuffer(accessControlExtension: AccessControlExtension): Buffer {
    // Serialize the object to a buffer
    return Buffer.from(
      borsh.serialize(AccessControlExtensionSchema, {
        accessControlType: accessControlExtension.accessControlType,
        accessControlAuthority: accessControlExtension.accessControlAuthority.toBytes(),
      })
    );
  }
}

// Define the schema for DepositPeriodExtension using Borsh
const AccessControlExtensionSchema: borsh.Schema = {
  struct: {
    accessControlType: "u8",
    accessControlAuthority: { array: { type: "u8", len: 32 } },
  },
};
