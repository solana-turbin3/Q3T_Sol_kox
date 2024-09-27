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
} from "./helpers";
import { assert } from "chai";
import { Vaultplex } from "../target/types/vaultplex";

describe("vaultplex - Deposit Period Extension", () => {
  const user = Keypair.generate();
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
  });

  it("should initialize the vault with balance 0", async () => {
    await initializeVault(user, seed, vaultConfig);
  });

  it("should initialize the Deposit Period Extension for an not opened vault", async () => {
    const currentSlot = await connection.getSlot() + 100;
    const endSlot = currentSlot + 5;
    
    const vaultAccountData = await initializeDepositPeriodExtension(user, vaultConfig, currentSlot, endSlot);
    assertDepositPeriodExtension(vaultAccountData, currentSlot, endSlot);
  });

  it("should try to deposit while the vault is not yet opened and catch the error", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    try {
        await depositSol(user, vaultConfig, vault, null, amount);

        assert.fail("Deposit should have failed because the vault is not open");
    } catch (err) {
      assert.include(err.toString(), "ExtensionDepositPeriodNotOpenYet"); // Expect the VaultLocked error
    }
  });

  it("should initialize the Deposit Period Extension for a already ended vault", async () => {
    const currentSlot = 0;
    const endSlot = currentSlot;
    
    const vaultAccountData = await initializeDepositPeriodExtension(user, vaultConfig, currentSlot, endSlot);
    assertDepositPeriodExtension(vaultAccountData, currentSlot, endSlot);
  });

  it("should try to deposit while the vault is already ended and catch the error", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    try {
        await depositSol(user, vaultConfig, vault, null, amount);

        assert.fail("Deposit should have failed because the vault has ended");
    } catch (err) {
      assert.include(err.toString(), "ExtensionDepositPeriodEnded"); // Expect the VaultLocked error
    }
  });

  it("should initialize the Deposit Period Extension for valid period", async () => {
    const currentSlot = await connection.getSlot();
    const endSlot = currentSlot + 10;
    
    const vaultAccountData = await initializeDepositPeriodExtension(user, vaultConfig, currentSlot, endSlot);
    assertDepositPeriodExtension(vaultAccountData, currentSlot, endSlot);
  });

  it("deposit while the vault is opened", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, null, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, LAMPORTS_PER_SOL);
  });
});
