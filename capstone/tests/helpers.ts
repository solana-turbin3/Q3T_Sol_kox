// test-helpers.ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vaultplex } from "../target/types/vaultplex";
import { BN } from "bn.js";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LockExtension } from './LockExtension';
import { assert } from "chai";
import { DepositPeriodExtension } from "./DepositPeriodExtension";
import { AccessControlExtension, AccessControlType } from "./AccessControlExtension";
import { FeeExtension } from "./FeeExtension";


// Anchor setup
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);
const connection = provider.connection;
const program = anchor.workspace.Vaultplex as Program<Vaultplex>;

export const confirmTx = async (signature: string) => {
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

export const logTx = async (signature: string): Promise<string> => {
    /* console.log(
        `Your transaction signature: https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    ); */
    return signature;
};

// Helper function to airdrop SOL
export const airdropSOL = async (user: Keypair, amountInSOL: number) => {
    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: user.publicKey,
            lamports: amountInSOL * LAMPORTS_PER_SOL,
        })
    );
    await provider.sendAndConfirm(tx).then(logTx);
    const balance = await connection.getBalance(user.publicKey);
    assert.equal(balance, amountInSOL * LAMPORTS_PER_SOL);
};

// Initialize the Vault
export const initializeVault = async (user: Keypair, seed: BN, vaultConfig: PublicKey) => {
    const tx = await program.methods
        .initializeVault(seed)
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
    assert.equal(vaultAccountData.authority.toString(), user.publicKey.toString());
    assert.equal(vaultAccountData.seed.toString(), seed.toString());
    return vaultAccountData;
};

// Initialize Lock Extension
export const initializeLockExtension = async (user: Keypair, vaultConfig: PublicKey) => {
    const tx = await program.methods
        .initializeLockExtension(user.publicKey)
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
    return vaultAccountData;
};

// Read Lock Extension and assert locked/unlocked status
export const assertLockExtension = (vaultAccountData: any, expectedLockStatus: boolean) => {
    const extensionsData = vaultAccountData.extensions as unknown as Buffer;
    const lockExtensionOffset = 0;
    const lockExtensionSize = 34;
    const lockExtensionData = extensionsData.slice(
        lockExtensionOffset,
        lockExtensionOffset + lockExtensionSize
    );
    const lockExtension = LockExtension.fromBuffer(lockExtensionData);
    assert.equal(lockExtension.isLocked, expectedLockStatus);
};

// Lock the vault
export const lockVault = async (user: Keypair, vaultConfig: PublicKey) => {
    const tx = await program.methods
        .lockVault()
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    return program.account.vaultConfig.fetch(vaultConfig);
};

// unLock the vault
export const unlockVault = async (user: Keypair, vaultConfig: PublicKey) => {
    const tx = await program.methods
        .unlockVault()
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    return program.account.vaultConfig.fetch(vaultConfig);
};

// Lock the vault
export const depositSol = async (user: Keypair, vaultConfig: PublicKey, vault: PublicKey, feeTreasury: PublicKey | null, amount: anchor.BN) => {
    const tx = await program.methods
        .depositSol(amount)
        .accounts({
            user: user.publicKey,
            vaultConfig,
            vault,
            feeTreasury,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    return program.account.vaultConfig.fetch(vaultConfig);
};

export const initializeDepositPeriodExtension = async (user: Keypair, vaultConfig: PublicKey, startSlot: number, endSlot: number) => {
    const startSlotBN = new BN(startSlot);
    const endSlotBN = new BN(endSlot);

    const tx = await program.methods
        .initializeDepositPeriodExtension(startSlotBN, endSlotBN)
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
    return vaultAccountData;
};

export const assertDepositPeriodExtension = (vaultAccountData: any, startSlot: number, endSlot: number) => {
    const extensionsData = vaultAccountData.extensions as unknown as Buffer;
    const extensionOffset = 35;
    const extensionSize = 24;
    const extensionDataSliced = extensionsData.slice(
        extensionOffset,
        extensionOffset + extensionSize
    );
    const extension = DepositPeriodExtension.fromBuffer(extensionDataSliced);
    assert.equal(extension.startSlot, startSlot);
    assert.equal(extension.endSlot, endSlot);
};

export const initializeAccessControlExtension = async (
    user: Keypair, 
    vaultConfig: PublicKey, 
    accessControlAuthority: PublicKey, 
    accessControlType: { public: {} } | { private: {} }
) => {

    const tx = await program.methods
        .initializeAccessControlExtension(accessControlAuthority, accessControlType)
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
    return vaultAccountData;
};

export const assertAccessControExtension = (vaultAccountData: any, accessControlAuthority: PublicKey, accessControlType: boolean ) => {
    const extensionsData = vaultAccountData.extensions as unknown as Buffer;
    const extensionOffset = 60;
    const extensionSize = 33;
    const extensionDataSliced = extensionsData.slice(
        extensionOffset,
        extensionOffset + extensionSize
    );
    const extension = AccessControlExtension.fromBuffer(extensionDataSliced);
    assert.equal(extension.accessControlAuthority.toString(), accessControlAuthority.toString());
    /* TODO: Fix the enum / boolean / private / public 
     assert.equal(extension.accessControlType, accessControlType); */
};


export const initializeFeeExtension = async (
    user: Keypair, 
    vaultConfig: PublicKey, 
    feeAuthority: PublicKey, 
    feeCollector: PublicKey,
    depositFeeBasisPoints: number,
    maxDepositFee: anchor.BN,
) => {

    const tx = await program.methods
        .initializeFeeExtension(feeAuthority, feeCollector, depositFeeBasisPoints, maxDepositFee)
        .accounts({
            authority: user.publicKey,
            vaultConfig,
        })
        .signers([user])
        .rpc()
        .then(confirmTx)
        .then(logTx);

    const vaultAccountData = await program.account.vaultConfig.fetch(vaultConfig);
    return vaultAccountData;
};

export const assertFeeExtension = (vaultAccountData: any, feeAuthority: PublicKey, depositFeeBasisPoints: number, maxDepositFee: anchor.BN,) => {
    const extensionsData = vaultAccountData.extensions as unknown as Buffer;
    const extensionOffset = 94;
    const extensionSize = 48;
    const extensionDataSliced = extensionsData.slice(
        extensionOffset,
        extensionOffset + extensionSize
    );
    const extension = FeeExtension.fromBuffer(extensionDataSliced);
    assert.equal(extension.feeAuthority.toString(), feeAuthority.toString());
    assert.equal(extension.depositFeeBasisPoints, depositFeeBasisPoints);
    assert.equal(extension.maxDepositFee, maxDepositFee);
};
