use anchor_lang::prelude::*;
use crate::{VaultConfig, LockExtension, LOCK_EXTENSION_OFFSET};

// Accounts context for initializing the lock extension
#[derive(Accounts)]
pub struct InitializeLockExtension<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Vault creator or existing authority

    #[account(
        mut,
        has_one = authority,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeLockExtension<'info> {
    pub fn initialize_lock_extension(&mut self, lock_authority: Pubkey) -> Result<()> {
        let lock_extension = LockExtension::new(lock_authority);

        // Write the lock extension to the vault's predefined slot for LockExtension
        self.vault_config.write_extension(LOCK_EXTENSION_OFFSET, &lock_extension)
    }
}
