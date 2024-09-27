use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

use crate::error::VaultError;
use crate::{state::*, LockExtension};
use crate::{AccessControlExtension, DepositPeriodExtension, FeeExtension};

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"vault_config", vault_config.seed.to_le_bytes().as_ref()],
        bump = vault_config.bump
    )]
    pub vault_config: Account<'info, VaultConfig>,

    #[account(
        mut,
        seeds = [b"vault", vault_config.seed.to_le_bytes().as_ref()],
        bump = vault_config.vault_bump,
    )]
    pub vault: SystemAccount<'info>, // PDA where SOL is stored

    /// CHECK: Optional fee treasury account, passed only if fee extension is initialized
    #[account(
        mut,
        seeds = [b"fee_treasury", vault_config.key().as_ref()],
        bump = fee_treasury.bump,
    )]
    pub fee_treasury: Option<Account<'info, TreasuryData>>,

    pub system_program: Program<'info, System>,
}

impl<'info> DepositSol<'info> {
    pub fn deposit_sol(&mut self, amount: u64) -> Result<()> {
        let vault_config = &mut self.vault_config;

        // Check if the vault is locked
        if let Ok(lock_extension) =
            vault_config.read_extension::<LockExtension>(LOCK_EXTENSION_OFFSET)
        {
            // If the extension exists, check if the vault is locked
            lock_extension.check_lock()?; // Vault is locked if `is_locked` is true
        }

        if let Ok(access_control_extension) =
            vault_config.read_extension::<AccessControlExtension>(ACCESS_CONTROL_EXTENSION_OFFSET)
        {
            // If the extension exists, check if the vault is locked
            access_control_extension.is_depositor_allowed(&self.user.key())?;
        }

        // Get the current slot
        let current_slot = Clock::get()?.slot;

        // Check if the deposit period is open
        if let Ok(deposit_period_extension) =
            vault_config.read_extension::<DepositPeriodExtension>(DEPOSIT_PERIOD_EXTENSION_OFFSET)
        {
            // If the extension exists, check if the deposit period is open
            deposit_period_extension.is_deposit_allowed(current_slot)?;
        }

        let fee_extension = vault_config.read_extension::<FeeExtension>(FEE_EXTENSION_OFFSET).unwrap();

        // Let's transfer the SOL. First we will check if the Fee Extension is initialized
        if fee_extension.is_initialized {
            require!(self.fee_treasury.is_some(), VaultError::FeeTreasuryNotProvided);

            let fee_treasury = &mut self.fee_treasury.as_ref().unwrap();

            // Use the calculate_deposit_fee method
            let deposit_fee = fee_extension
                .calculate_deposit_fee(amount)
                .ok_or(VaultError::Overflow)?;

            // Use the calculate_post_fee_amount to get the net amount
            let net_deposit_amount = fee_extension
                .calculate_post_fee_amount(amount, true)
                .ok_or(VaultError::Overflow)?;

            // Transfer the fee to the treasury PDA
            let cpi_ctx_fee = CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.user.to_account_info(),
                    to: fee_treasury.to_account_info(),
                },
            );
            transfer(cpi_ctx_fee, deposit_fee)?;

            // Transfer the remaining amount to the vault
            let cpi_ctx_vault = CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.user.to_account_info(),
                    to: self.vault.to_account_info(),
                },
            );
            transfer(cpi_ctx_vault, net_deposit_amount)?;

            return Ok(());
        } 

        // Transfer SOL from the user to the vault's PDA
        let cpi_context = CpiContext::new(
            self.system_program.to_account_info(),
            Transfer {
                from: self.user.to_account_info(),
                to: self.vault.to_account_info(),
            },
        );

        transfer(cpi_context, amount)?;
        
        Ok(())
    }
}
