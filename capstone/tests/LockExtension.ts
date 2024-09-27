import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";

// Define the interface for the fields used in LockExtension
interface LockExtensionFields {
  isInitialized: boolean;
  lockAuthority: Uint8Array; // PublicKey stored as a Uint8Array
  isLocked: boolean; // 'isLocked' as a number for serialization
}

// Define the LockExtension class
export class LockExtension {
  isInitialized: boolean;
  lockAuthority: PublicKey; // Store PublicKey as PublicKey type
  isLocked: boolean; // Use number for serialization compatibility with `borsh`

  constructor(fields: LockExtensionFields) {
    this.isInitialized = fields.isInitialized;
    this.lockAuthority = new PublicKey(fields.lockAuthority); // Convert Uint8Array to PublicKey
    this.isLocked = fields.isLocked;
  }

  // Method to deserialize Buffer into LockExtension using Borsh
  static fromBuffer(buffer: Buffer): LockExtension {
    // Deserialize the buffer using Borsh and the schema
    const decoded = borsh.deserialize(
      LockExtensionSchema,
      buffer
    ) as LockExtensionFields;

    // Return a new LockExtension instance
    return new LockExtension(decoded);
  }

  // Method to serialize LockExtension to Buffer using Borsh
  static toBuffer(lockExtension: LockExtension): Buffer {
    // Serialize the object to a buffer
    return Buffer.from(
      borsh.serialize(LockExtensionSchema, {
        isInitialized: lockExtension.isInitialized,
        lockAuthority: lockExtension.lockAuthority.toBytes(), // Convert PublicKey to Uint8Array for serialization
        isLocked: lockExtension.isLocked,
      })
    );
  }
}

// Define the schema for LockExtension using Borsh
const LockExtensionSchema: borsh.Schema = {
  struct: {
    isInitialized: "u8",
    lockAuthority: { array: { type: "u8", len: 32 } }, // Fixed 32-byte array
    isLocked: "bool", // Boolean value stored as u8 (1 byte)
  },
};
