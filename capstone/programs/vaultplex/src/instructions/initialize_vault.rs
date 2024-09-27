use anchor_lang::prelude::*;
use crate::state::*;  // Import state definitions

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = VaultConfig::TOTAL_SIZE,
        seeds = [b"vault_config", seed.to_le_bytes().as_ref()],
        bump
    )]
    pub vault_config: Account<'info, VaultConfig>,

    #[account(
        seeds=[b"vault", seed.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeVault<'info> {
    pub fn initialize_vault(&mut self, seed: u64, bumps: &InitializeVaultBumps) -> Result<()> {
        self.vault_config.set_inner(VaultConfig {
            authority: self.authority.key(),
            seed,
            bump: bumps.vault_config,
            vault_bump: bumps.vault,
            extensions: [0u8; TOTAL_EXTENSION_SIZE],
        });

        Ok(())
    }
}
