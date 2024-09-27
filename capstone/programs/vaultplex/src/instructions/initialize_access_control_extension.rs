use anchor_lang::prelude::*;
use crate::{ AccessControlExtension, AccessControlType, VaultConfig, ACCESS_CONTROL_EXTENSION_OFFSET };

// Accounts context for initializing the deposit period extension
#[derive(Accounts)]
pub struct InitializeAccessControlExtension<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        has_one = authority,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeAccessControlExtension<'info> {
    pub fn initialize_access_control_extension(&mut self,  access_control_authority: Pubkey, access_control_type: AccessControlType) -> Result<()> {
        let access_control_extension = AccessControlExtension::new(access_control_authority, access_control_type);

        // Write the deposit period extension to the vault's predefined slot for AccessControlExtension
        self.vault_config.write_extension(ACCESS_CONTROL_EXTENSION_OFFSET, &access_control_extension)
    }
}
