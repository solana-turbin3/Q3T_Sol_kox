use anchor_lang::prelude::*;
use crate::{FeeExtension, TreasuryData, VaultConfig, FEE_EXTENSION_OFFSET};

#[derive(Accounts)]
pub struct InitializeFeeExtension<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        has_one = authority,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    #[account(
        init_if_needed,
        payer = authority,
        seeds = [b"fee_treasury", vault_config.key().as_ref()],
        space = TreasuryData::SIZE,
        bump
    )]
    pub treasury: Account<'info, TreasuryData>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeFeeExtension<'info> {
    pub fn initialize_fee_extension(&mut self, fee_authority: Pubkey, fee_collector: Pubkey, deposit_fee_basis_points: u16, max_deposit_fee: u64, bumps: &InitializeFeeExtensionBumps) -> Result<()> {
        self.treasury.set_inner(TreasuryData {
            bump: bumps.treasury,
            authority: fee_collector,
        });

        let fee_extension = FeeExtension {
                is_initialized: true,
                fee_authority,
                deposit_fee_basis_points,
                max_deposit_fee,
                /* 
                withdrawal_fee_basis_points: withdrawal_fee,
                max_withdrawal_fee,
                */
            };

        self.vault_config.write_extension(FEE_EXTENSION_OFFSET, &fee_extension)
    }
}
