use anchor_lang::prelude::*;

use crate::error::VaultError;

// Access Control Type Enum
#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone, PartialEq)]
pub enum AccessControlType {
    #[default]
    Public = 0,   // Anyone can add funds
    Private,  // Only the creator (authority) can add funds
}

// Access Control Extension Definition
#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct AccessControlExtension {  
    pub access_control_type: AccessControlType,  // Type of access control
    pub access_control_authority: Pubkey,        // Authority to manage the access control extension
}

impl AccessControlExtension {
    // Initialize a new AccessControlExtension
    pub fn new(access_control_authority: Pubkey, access_control_type: AccessControlType) -> Self {
        Self {
            access_control_type,
            access_control_authority,
        }
    }

    // Check if a depositor is allowed based on the access type
    pub fn is_depositor_allowed(&self, depositor: &Pubkey) -> Result<()> {
        match self.access_control_type {
            AccessControlType::Public => Ok(()),  // Anyone can deposit
            AccessControlType::Private => {
                if depositor == &self.access_control_authority {
                    Ok(())
                } else {
                    Err(VaultError::ExtensionDepositDenied.into())
                }
            }
        }
    }
}
