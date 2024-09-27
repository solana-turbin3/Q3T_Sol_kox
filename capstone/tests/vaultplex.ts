/* import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vaultplex } from "../target/types/vaultplex";
import { assert } from "chai";
import { BN } from "bn.js";
import { randomBytes } from "crypto";
import { Authorized, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LockExtension } from './LockExtension';

describe("vaultplex", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const connection = provider.connection;
  const program = anchor.workspace.Vaultplex as Program<Vaultplex>;

  const confirmTx = async (signature: string) => {
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      "confirmed"
    );
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  const user = Keypair.generate();

  // Generating a big number random to create a unique seed
  const seed = new BN(randomBytes(8));

  const vaultConfig = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_config"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultConfig.toBuffer()],
    program.programId
  )[0];

  it("should get some SOL for testing", async () => {
    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: user.publicKey,
        lamports: 10 * LAMPORTS_PER_SOL,
      })
    );

    await provider.sendAndConfirm(tx).then(log);

    const balance = await connection.getBalance(user.publicKey);
    assert.equal(balance, 10 * LAMPORTS_PER_SOL);
  });

  it("should initialize the vault with balance 0", async () => {
    try {
      const tx = await program.methods
        .initializeVault(seed)
        .accounts({
          authority: user.publicKey,
          vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(log);

      const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
      console.log(vaultAccountData);

      assert.equal(vaultAccountData.authority.toString(), user.publicKey.toString());
      assert.equal(vaultAccountData.seed.toString(), seed.toString());
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
 
  it("should initialize the Lock Extension", async () => {
    try {
      const lockAuthority = user.publicKey; // Set lock authority as the user
      const tx = await program.methods
        .initializeLockExtension(lockAuthority)
        .accounts({
          authority: user.publicKey,
          vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(log);
  
      // Fetch the updated Vault account data
      const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
      console.log(
        "Vault Account Data after initializing Lock Extension:",
        vaultAccountData
      );
  
      // Verify that the vault's authority and seed have not changed
      assert.equal(
        vaultAccountData.authority.toString(),
        user.publicKey.toString()
      );
      assert.equal(vaultAccountData.seed.toString(), seed.toString());
  
      // Extract the extensions data from the vault account
      const extensionsData = vaultAccountData.extensions as unknown as Buffer;

      // The offset for LockExtension in the extensions array (if it starts at 0)
      const lockExtensionOffset = 0;

      // The size of LockExtension: Pubkey (32 bytes) + is_locked (1 byte)
      const lockExtensionSize = 33; // 32 + 1;
  
      // Ensure the Buffer has enough data
    if (extensionsData.length < lockExtensionOffset + lockExtensionSize) {
      console.error("Buffer does not have enough data for LockExtension");
      console.log("Expected size:", lockExtensionOffset + lockExtensionSize);
      console.log("Actual size:", extensionsData.length);
      throw new Error("Buffer does not have enough data for LockExtension");
    }

    // Extract the LockExtension slice using the correct offset
    const lockExtensionData = extensionsData.slice(
      lockExtensionOffset,
      lockExtensionOffset + lockExtensionSize
    );

    // Deserialize LockExtension data (using Borsh or your chosen method)
    const lockExtension = LockExtension.fromBuffer(lockExtensionData); // Implement this deserialization method

    console.log("Lock Extension initialized correctly:", lockExtension);

    // Verify the lock extension contents
    assert.equal(
      lockExtension.lockAuthority.toString(),
      lockAuthority.toString()
    );
    assert.equal(lockExtension.isLocked, false);


    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  it("should lock the vault and verify it's locked", async () => {
    try {
      const tx = await program.methods
        .lockVault()
        .accounts({
          authority: user.publicKey,
          vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(log);

      // Fetch the updated Vault account data
      const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
      console.log("Vault Account Data after locking the vault:", vaultAccountData);

      // Extract the extensions data from the vault account
      const extensionsData = vaultAccountData.extensions as unknown as Buffer;

      // The offset for LockExtension in the extensions array (if it starts at 0)
      const lockExtensionOffset = 0;

      // The size of LockExtension: Pubkey (32 bytes) + is_locked (1 byte)
      const lockExtensionSize = 33; // 32 + 1;

      // Ensure the Buffer has enough data
      if (extensionsData.length < lockExtensionOffset + lockExtensionSize) {
        console.error("Buffer does not have enough data for LockExtension");
        console.log("Expected size:", lockExtensionOffset + lockExtensionSize);
        console.log("Actual size:", extensionsData.length);
        throw new Error("Buffer does not have enough data for LockExtension");
      }

      // Extract the LockExtension slice using the correct offset
      const lockExtensionData = extensionsData.slice(
        lockExtensionOffset,
        lockExtensionOffset + lockExtensionSize
      );

      // Deserialize LockExtension data (using Borsh)
      const lockExtension = LockExtension.fromBuffer(lockExtensionData); // Implement this deserialization method

      console.log("Lock Extension after locking:", lockExtension);

      // Verify the lock extension contents
      assert.equal(lockExtension.isLocked, true); // Should be 1 after locking
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});
 */