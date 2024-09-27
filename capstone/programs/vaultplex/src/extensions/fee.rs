use std::cmp;
use anchor_lang::prelude::*;

/// Maximum possible fee in basis points is 100%, aka 10_000 basis points
pub const MAX_FEE_BASIS_POINTS: u16 = 10_000;
const ONE_IN_BASIS_POINTS: u128 = MAX_FEE_BASIS_POINTS as u128;

/// Fee Extension for Vaultplex
#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone, Debug)]
pub struct FeeExtension {
    // Provides a check if the extension has been initialized and makes sense to read its bytes
    pub is_initialized: bool,
    /// The authority that can modify the fee settings
    pub fee_authority: Pubkey,
    /// Deposit fee in basis points (0.01%)
    pub deposit_fee_basis_points: u16,
    /// Maximum deposit fee allowed (in tokens)
    pub max_deposit_fee: u64,
/* 
    /// Withdrawal fee in basis points (0.01%)
    pub withdrawal_fee_basis_points: u16,
    /// Maximum withdrawal fee allowed (in tokens)
    pub max_withdrawal_fee: u64,
    /// The account where fees are collected (PDA or treasury)
    pub fee_collector: Pubkey, */
}

impl FeeExtension {
    /// Initialize a new FeeExtension
    pub fn new(
        fee_authority: Pubkey,
        deposit_fee_basis_points: u16,
        max_deposit_fee: u64,
        /* withdrawal_fee_basis_points: u16,
        max_withdrawal_fee: u64,
        fee_collector: Pubkey, */
    ) -> Self {
        Self {
            is_initialized: true,
            fee_authority,
            deposit_fee_basis_points,
            max_deposit_fee,
            /* withdrawal_fee_basis_points,
            max_withdrawal_fee,
            fee_collector, */
        }
    }

    /// Calculate ceiling-division
    ///
    /// Ceiling-division
    ///     `ceil[ numerator / denominator ]`
    /// can be represented as a floor-division
    ///     `floor[ (numerator + denominator - 1) / denominator]`
    fn ceil_div(numerator: u128, denominator: u128) -> Option<u128> {
        numerator
            .checked_add(denominator)?
            .checked_sub(1)?
            .checked_div(denominator)
    }

    pub fn calculate_fee(&self, pre_fee_amount: u64, fee_basis_points: u16, maximum_fee: u16) -> Option<u64> {
        let transfer_fee_basis_points = u16::from(fee_basis_points) as u128;

        if transfer_fee_basis_points == 0 || pre_fee_amount == 0 {
            Some(0)
        } else {
            let numerator = (pre_fee_amount as u128).checked_mul(transfer_fee_basis_points)?;
            let raw_fee = Self::ceil_div(numerator, ONE_IN_BASIS_POINTS)?
                .try_into() // guaranteed to be okay
                .ok()?;

            Some(cmp::min(raw_fee, u64::from(maximum_fee)))
        }
    }


    /// Calculate the fee for deposits
    pub fn calculate_deposit_fee(&self, amount: u64) -> Option<u64> {
        let fee_basis_points = self.deposit_fee_basis_points as u128;
        let fee = if fee_basis_points == 0 || amount == 0 {
            Some(0)
        } else {
            let numerator = (amount as u128).checked_mul(fee_basis_points)?;

            let raw_fee = Self::ceil_div(numerator, ONE_IN_BASIS_POINTS)?
                .try_into()
                .ok()?;

            Some(cmp::min(raw_fee, self.max_deposit_fee))
        };
        fee
    }

    

    /// Calculate the post-fee amount (net deposit or withdrawal)
    pub fn calculate_post_fee_amount(&self, pre_fee_amount: u64, is_deposit: bool) -> Option<u64> {
        let fee = if is_deposit {
            self.calculate_deposit_fee(pre_fee_amount)?
        } else {
            self.calculate_deposit_fee(pre_fee_amount)?
            /* self.calculate_withdrawal_fee(pre_fee_amount)? */
        };
        pre_fee_amount.checked_sub(fee)
    }

    /// Calculate the pre-fee amount needed to reach a specific net amount (post-fee)
    pub fn calculate_pre_fee_amount(&self, post_fee_amount: u64, is_deposit: bool) -> Option<u64> {
        let max_fee = if is_deposit {
            self.max_deposit_fee
        } else {
            self.max_deposit_fee
            /* self.max_withdrawal_fee */
        };
        let fee_basis_points = if is_deposit {
            self.deposit_fee_basis_points as u128
        } else {
            self.deposit_fee_basis_points as u128
            /* self.withdrawal_fee_basis_points as u128 */
        };

        match (fee_basis_points, post_fee_amount) {
            (0, _) => Some(post_fee_amount),
            (_, 0) => Some(0),
            (ONE_IN_BASIS_POINTS, _) => max_fee.checked_add(post_fee_amount),
            _ => {
                let numerator = (post_fee_amount as u128).checked_mul(ONE_IN_BASIS_POINTS)?;
                let denominator = ONE_IN_BASIS_POINTS.checked_sub(fee_basis_points)?;
                let raw_pre_fee_amount = Self::ceil_div(numerator, denominator)?;
                if raw_pre_fee_amount.checked_sub(post_fee_amount as u128)? >= max_fee as u128 {
                    post_fee_amount.checked_add(max_fee)
                } else {
                    u64::try_from(raw_pre_fee_amount).ok()
                }
            }
        }
    }
    
    /// Calculate the inverse fee based on post-fee amount
    pub fn calculate_inverse_fee(&self, post_fee_amount: u64, is_deposit: bool) -> Option<u64> {
        let pre_fee_amount = self.calculate_pre_fee_amount(post_fee_amount, is_deposit)?;
        if is_deposit {
            self.calculate_deposit_fee(pre_fee_amount)
        } else {
            self.calculate_deposit_fee(pre_fee_amount)
            /* self.calculate_withdrawal_fee(pre_fee_amount) */
        }
    }

    // Calculate the fee for withdrawals
    /* pub fn calculate_withdrawal_fee(&self, amount: u64) -> Option<u64> {
        let fee_basis_points = self.withdrawal_fee_basis_points as u128;
        let fee = if fee_basis_points == 0 || amount == 0 {
            Some(0)
        } else {
            let numerator = (amount as u128).checked_mul(fee_basis_points)?;
            let raw_fee = Self::ceil_div(numerator, ONE_IN_BASIS_POINTS)?.try_into().ok()?;
            Some(cmp::min(raw_fee, self.max_withdrawal_fee))
        };
        fee
    } */
}
