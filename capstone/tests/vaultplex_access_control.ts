import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { randomBytes } from "crypto";
import {
  airdropSOL,
  initializeVault,
  assertLockExtension,
  lockVault,
  depositSol,
  unlockVault,
  initializeDepositPeriodExtension,
  assertDepositPeriodExtension,
  initializeAccessControlExtension,
  assertAccessControExtension,
} from "./helpers";
import { assert } from "chai";
import { Vaultplex } from "../target/types/vaultplex";

describe("vaultplex - Access Control Extension", () => {
  const user = Keypair.generate();
  const badUser = Keypair.generate();
  const seed = new BN(randomBytes(8));

  const connection = anchor.getProvider().connection;
  const program = anchor.workspace.Vaultplex as anchor.Program<Vaultplex>;

  const vaultConfig = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_config"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  it("should get some SOL for testing", async () => {
    await airdropSOL(user, 10); // 10 SOL
    await airdropSOL(badUser, 10); // 10 SOL
  });

  it("should initialize the vault with balance 0", async () => {
    await initializeVault(user, seed, vaultConfig);
  });

  it("deposit while the vault don't have access control", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, null, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, LAMPORTS_PER_SOL);
  });

  it("should initialize the Access Control Period Extension for a public vault", async () => {
    const vaultAccountData = await initializeAccessControlExtension(user, vaultConfig, user.publicKey, { public: {}});
    assertAccessControExtension(vaultAccountData, user.publicKey, { public: {}} );
  });

  it("deposit while the vault is public", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, null, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, 2 * LAMPORTS_PER_SOL);
  });

  it("should initialize the Access Control Period Extension for a private vault", async () => {
    const vaultAccountData = await initializeAccessControlExtension(user, vaultConfig, user.publicKey, { private: {}});
    assertAccessControExtension(vaultAccountData, user.publicKey, true);
  });

  it("should try to deposit while the vault is private and catch the error", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    try {
        await depositSol(badUser, vaultConfig, vault, null, amount);

        assert.fail("Deposit should have failed because the vault is private");
    } catch (err) {
      assert.include(err.toString(), "ExtensionDepositDenied"); // Expect the VaultLocked error
    }
  });

  it("should deposit while using a user with access control authorization", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, null, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, 3 * LAMPORTS_PER_SOL);
  });
});
