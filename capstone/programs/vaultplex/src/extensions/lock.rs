use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

use crate::error::VaultError;

#[derive(BorshSerialize, BorshDeserialize, Default, Clone, Debug)]
pub struct LockExtension {
    pub is_initialized: bool,  // Required to solve the Default issue
    pub lock_authority: Pubkey, // Authority to lock/unlock the vault
    pub is_locked: bool,        // Status indicating if the vault is locked
}

impl LockExtension {
    pub fn new(lock_authority: Pubkey) -> Self {
        Self {
            lock_authority,
            is_locked: false,
            is_initialized: true,
        }
    }

    // Check if the vault is locked
    pub fn check_lock(&self) -> Result<()> {
        if self.is_initialized && self.is_locked {
            return Err(VaultError::VaultLocked.into());
        }
        Ok(())
    }
}
