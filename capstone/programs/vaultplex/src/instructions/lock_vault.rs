use anchor_lang::prelude::*;
use crate::{LockExtension, VaultConfig, LOCK_EXTENSION_OFFSET};

#[derive(Accounts)]
pub struct LockVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Authority allowed to modify the vault

    #[account(
        mut,
        has_one = authority,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    pub system_program: Program<'info, System>,
}

impl<'info> LockVault<'info> {
    pub fn lock_vault(&mut self) -> Result<()> {
        // Read the lock extension from the vault
        let mut lock_extension: LockExtension = self.vault_config.read_extension(LOCK_EXTENSION_OFFSET)?;

        // Lock the vault
        lock_extension.is_locked = true;
        
        // Write the updated lock extension back to the vault
        self.vault_config.write_extension(LOCK_EXTENSION_OFFSET, &lock_extension)?;

        Ok(())
    }

    pub fn unlock_vault(&mut self) -> Result<()> {
        // Read the lock extension from the vault
        let mut lock_extension: LockExtension = self.vault_config.read_extension(LOCK_EXTENSION_OFFSET)?;

        // Lock the vault
        lock_extension.is_locked = false;
        
        // Write the updated lock extension back to the vault
        self.vault_config.write_extension(LOCK_EXTENSION_OFFSET, &lock_extension)?;

        Ok(())
    }
}
