pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod extensions;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use extensions::*;

declare_id!("9a8aV7w4h7xpoFKnCuXvwef3pXexBbeJBUmMh79sQ5xb");

#[program]
pub mod vaultplex {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, seed: u64) -> Result<()> {
        ctx.accounts.initialize_vault(seed, &ctx.bumps)
        
    }

    pub fn initialize_lock_extension(ctx: Context<InitializeLockExtension>, lock_authority: Pubkey) -> Result<()> {
        ctx.accounts.initialize_lock_extension(lock_authority)
    }

    pub fn lock_vault(ctx: Context<LockVault>) -> Result<()> {
        ctx.accounts.lock_vault()
    }

    pub fn unlock_vault(ctx: Context<LockVault>) -> Result<()> {
        ctx.accounts.unlock_vault()
    }

    pub fn deposit_sol(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
        ctx.accounts.deposit_sol(amount)
    }

    pub fn initialize_deposit_period_extension(ctx: Context<InitializeDepositPeriodExtension>, start_slot: u64, end_slot: u64) -> Result<()> {
        ctx.accounts.initialize_deposit_period_extension(start_slot, end_slot)
    }

    pub fn initialize_access_control_extension(ctx: Context<InitializeAccessControlExtension>, access_control_authority: Pubkey, access_control_type: AccessControlType) -> Result<()> {
        ctx.accounts.initialize_access_control_extension(access_control_authority, access_control_type)
    }

    pub fn initialize_fee_extension(ctx: Context<InitializeFeeExtension>, fee_authority: Pubkey, fee_collector: Pubkey, deposit_fee_basis_points: u16, max_deposit_fee: u64) -> Result<()> {
        ctx.accounts.initialize_fee_extension(fee_authority, fee_collector, deposit_fee_basis_points, max_deposit_fee, &ctx.bumps)
    }
}