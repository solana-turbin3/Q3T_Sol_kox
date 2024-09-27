use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

use crate::error::VaultError;

// Constants
pub const LOCK_EXTENSION_OFFSET: usize = 0; // Fixed offset for LockExtension
pub const LOCK_EXTENSION_SIZE: usize = 34; // Pubkey (32 bytes) + bool (1 byte) + bool (1 byte)

pub const DEPOSIT_PERIOD_EXTENSION_OFFSET: usize = 35;
pub const DEPOSIT_PERIOD_EXTENSION_SIZE: usize = 24;

pub const ACCESS_CONTROL_EXTENSION_OFFSET: usize = 60;
pub const ACCESS_CONTROL_EXTENSION_SIZE: usize = 33;

pub const FEE_EXTENSION_OFFSET: usize = 94;
pub const FEE_EXTENSION_SIZE: usize = 48;

pub const TOTAL_EXTENSION_SIZE: usize = FEE_EXTENSION_OFFSET + FEE_EXTENSION_SIZE;

pub const VAULT_CONFIG_BASE_SIZE: usize = 50; // Account discriminator (8) + authority (32) + seed (8) + bump (1) + vault_bump (1)

// Vault struct with predefined extensions space
#[account]
pub struct VaultConfig  {
    pub authority: Pubkey,                     // Authority of the vault
    pub seed: u64,                             // Seed for uniqueness
    pub bump: u8,                              // Bump for the PDA
    pub vault_bump: u8,                        // Bump for the Vault PDA 
    pub extensions: [u8; TOTAL_EXTENSION_SIZE], // Fixed-size array to hold extensions data (adjust size as needed)
}

impl VaultConfig  {
    pub const TOTAL_SIZE: usize = VAULT_CONFIG_BASE_SIZE + TOTAL_EXTENSION_SIZE; // Adjust the size as needed for all extensions

    // Read an extension from the extensions array using Borsh
    pub fn read_extension<T: BorshSerialize + BorshDeserialize + Default>(
        &self,
        offset: usize,
    ) -> Result<T> {
        // Determine the size of the extension by serializing the default instance
        let serialized_size = T::default()
            .try_to_vec()
            .map_err(|_| error!(VaultError::ExtensionDeserializationFailed))?
            .len();

        // Extract the correct slice from the extensions array
        let data = &self.extensions[offset..offset + serialized_size];

        // Deserialize the extension from the slice
        T::try_from_slice(data).map_err(|_| error!(VaultError::ExtensionDeserializationFailed))
    }

    // Write an extension to the extensions array using Borsh
    pub fn write_extension<T: BorshSerialize>(
        &mut self,
        offset: usize,
        extension: &T,
    ) -> Result<()> {
        let serialized_data = extension
            .try_to_vec()
            .map_err(|_| error!(VaultError::ExtensionDeserializationFailed))?;
        let extension_slice = &mut self.extensions[offset..offset + serialized_data.len()];
        extension_slice.copy_from_slice(&serialized_data);
        Ok(())
    }
}
