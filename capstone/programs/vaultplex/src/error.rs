use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Unauthorized access to lock or unlock the vault")]
    Unauthorized,
    #[msg("The vault is currently locked")]
    VaultLocked,
    #[msg("The vault operation just overflowed")]
    Overflow,
    #[msg("The vault is closed for deposits at the current slot")]
    VaultClosedForDeposits,
    #[msg("Extension not found in the vault data")]
    ExtensionNotFound,
    #[msg("Writing in Extension failed. No offset found")]
    ExtensionOffsetFailed,
    #[msg("That instruction is not supported for the current Vault Type")]
    WrongType,
    #[msg("Deserialiasdasd failed")]
    ExtensionDeserializationFailed,
    #[msg("Vault deposits are not yet opened")]
    ExtensionDepositPeriodNotOpenYet,
    #[msg("Vault deposits are ended")]
    ExtensionDepositPeriodEnded,
    #[msg("Vault deposits extension failed")]
    ExtensionDepositPeriodFailed,
    #[msg("You don't have permission to deposit into the vault")]
    ExtensionDepositDenied,
    #[msg("The fee treasury account wasn't provided")]
    FeeTreasuryNotProvided,

}
