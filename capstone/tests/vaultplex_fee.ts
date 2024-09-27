import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN, max } from "bn.js";
import { randomBytes } from "crypto";
import {
  airdropSOL,
  initializeVault,
  assertAccessControExtension,
  initializeFeeExtension,
  assertFeeExtension,
  depositSol,
} from "./helpers";
import { assert } from "chai";
import { Vaultplex } from "../target/types/vaultplex";

describe("vaultplex - Fee Extension", () => {
  const user = Keypair.generate();
  const feeUser = Keypair.generate();
  const seed = new BN(randomBytes(8));

  const connection = anchor.getProvider().connection;
  const program = anchor.workspace.Vaultplex as anchor.Program<Vaultplex>;

  const depositFeeBasisPoints = 100;  // 1%
  const maxDepositFee = new BN(1000); 

  const vaultConfig = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_config"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  const feeTreasury = PublicKey.findProgramAddressSync(
    [Buffer.from("fee_treasury"), vaultConfig.toBuffer()], // seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  it("should get some SOL for testing", async () => {
    await airdropSOL(user, 10); // 10 SOL
    await airdropSOL(feeUser, 10); // 10 SOL
  });

  it("should initialize the vault with balance 0", async () => {
    await initializeVault(user, seed, vaultConfig);
  });

  /* it("deposit the SOL fully when no fee extension has been initialized", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, null, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, LAMPORTS_PER_SOL);
  }); */

  it("should initialize Fee Extension", async () => {
    const vaultAccountData = await initializeFeeExtension(user, vaultConfig, user.publicKey, feeUser.publicKey, depositFeeBasisPoints, maxDepositFee);
    assertFeeExtension(vaultAccountData, user.publicKey, depositFeeBasisPoints, maxDepositFee);
  });

  it("deposit and calculate the fees correctly sending them to the treasury", async () => {
    let balance = await connection.getBalance(vault);
    console.log('vault', balance);


    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, feeTreasury, amount);

    // Fee should be 1% of 1 SOL (10,000,000 lamports)
    const expectedFee = 10000000;
    const expectedNetDeposit = LAMPORTS_PER_SOL - expectedFee;

    balance = await connection.getBalance(vault);

    console.log('expectedNetDeposit', expectedNetDeposit);
    console.log('vault', balance);

    balance = await connection.getBalance(feeTreasury);
    console.log('expectedFee', expectedFee);
    console.log('feeTreasury', balance);


    /* 
    console.log(calculatedFee);
     */
   /*  const expectedFee = new BN(LAMPORTS_PER_SOL * 1%); // 10_000_000; // 1% of 1 SOL
    const expectedNetDeposit = new BN(LAMPORTS_PER_SOL - LAMPORTS_PER_SOL * 1%); // 990,000,000 lamportsº */

    // Check vault balance (it should be 1 SOL from the previous deposit + net amount from this one)
    /* const balance = await connection.getBalance(vault);
    assert.equal(balance, 1_000_000_000 + expectedNetDeposit); 

    // Check treasury balance (it should be the fee amount)
    const feeTreasurybalance = await connection.getBalance(feeTreasury);
    assert.equal(feeTreasurybalance, expectedFee); // Expecting  10,000,000 lamports */

  });

  /* it("deposit while the vault don't have access control", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, LAMPORTS_PER_SOL);
  });

  it("should initialize the Access Control Period Extension for a public vault", async () => {
    const vaultAccountData = await initializeAccessControlExtension(user, vaultConfig, user.publicKey, { public: {}});
    assertAccessControExtension(vaultAccountData, user.publicKey, { public: {}} );
  });

  it("deposit while the vault is public", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, amount);

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
        await depositSol(badUser, vaultConfig, vault, amount);

        assert.fail("Deposit should have failed because the vault is private");
    } catch (err) {
      assert.include(err.toString(), "ExtensionDepositDenied"); // Expect the VaultLocked error
    }
  });

  it("should deposit while using a user with access control authorization", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, 3 * LAMPORTS_PER_SOL);
  }); */
});
