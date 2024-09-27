use anchor_lang::prelude::*;

#[account]
pub struct TreasuryData {
    pub bump: u8,            // The bump seed for the treasury PDA
    pub authority: Pubkey,    // The authority allowed to withdraw funds from the treasury
}

impl TreasuryData {
    pub const SIZE: usize = 8 + 1 + 32; 
}
