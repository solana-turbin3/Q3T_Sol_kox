use anchor_lang::prelude::*;
use crate::{ DepositPeriodExtension, VaultConfig, DEPOSIT_PERIOD_EXTENSION_OFFSET };

// Accounts context for initializing the deposit period extension
#[derive(Accounts)]
pub struct InitializeDepositPeriodExtension<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        has_one = authority,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeDepositPeriodExtension<'info> {
    pub fn initialize_deposit_period_extension(&mut self,  start_slot: u64, end_slot: u64) -> Result<()> {
        let deposit_period_extension = DepositPeriodExtension::new(start_slot, end_slot);

        // Write the deposit period extension to the vault's predefined slot for DepositPeriodExtension
        self.vault_config.write_extension(DEPOSIT_PERIOD_EXTENSION_OFFSET, &deposit_period_extension)
    }
}
