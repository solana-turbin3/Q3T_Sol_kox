use anchor_lang::prelude::*;

use borsh::{BorshDeserialize, BorshSerialize};

use crate::error::VaultError;

#[derive(BorshSerialize, BorshDeserialize, Default, Clone, Debug)]
pub struct DepositPeriodExtension {
    pub is_initialized: bool,   // Required to solve the Default issue
    pub start_slot: u64,        // Starting slot for deposits
    pub end_slot: u64,          // Ending slot for deposits
}

impl DepositPeriodExtension {
    pub fn new(start_slot: u64, end_slot: u64) -> Self {
        Self {
            start_slot,
            end_slot,
            is_initialized: true,
        }
    }

    // Check if the current slot is within the allowed deposit window
    // Check if the deposit window is open, returns `None` if the extension doesn't exist
    pub fn is_deposit_allowed(&self, current_slot: u64) -> Result<()> {
        if self.is_initialized && current_slot < self.start_slot {
            return Err(VaultError::ExtensionDepositPeriodNotOpenYet.into());
        } else if self.is_initialized && current_slot > self.end_slot {
            return Err(VaultError::ExtensionDepositPeriodEnded.into());
        }

        Ok(())
    }
}
