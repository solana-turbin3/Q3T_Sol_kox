![Turbin3-Cohort-PoW](https://github.com/solana-turbin3/Q3T_Sol_kox/blob/e824e102c50ef114c7f901815c50824e0dd61579/turbin3_banner.png?raw=true)


# Hi there 👋, kox here 
[![GitHub followers](https://img.shields.io/github/followers/kox.svg?style=social&label=Follow)](https://github.com/kox?tab=followers)  ![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UCaOQstxSGKT-W1xYa9PuVKQ)
 ![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/enekoox)
<br/>


Welcome to my PoW ! I'm a passionate developer focused on building and  contributing to the Solana ecosystem. Below, you'll find a collection of projects I've worked during last months related with Turbin3, with a focus on the Q3 Cohort.

I also included my participation in the Talent Olympics during the 4 days in which I earned a bronze medal.

Please, don't hesitate to drop some comments, open issues, follow or contribute.

---
##  📚 Projects


<details>
<summary>Bridge To Turbin3</summary>


[comment]: <> (Describe)
### Introduction

The "Bridge to Turbin3" course was designed to facilitate a starting point for learning how to use Solana and interact with programs

Key Features

* Creation Keypairs
* Airdroping
* Transfer SOL
* Enroll to Turbin3

Technologies Used

* Solana
* Typescript


[comment]: <> (Extend Catistics)

<br />
</details>

---


<details>
<summary>turbin3-cli</summary>

[comment]: <> (Describe)
### Introduction

Quite similar to "Bridge to Turbin3" but using Rust instead.

Key Features

* CLI integration
* Creation Keypairs
* Airdroping
* Transfer SOL
* Enroll to Turbin3

Technologies Used

* Solana
* Rust


[comment]: <> (Extend Catistics)

<br />
</details>

---


<details>
<summary>Talent Olympics - Mint, Lock, Swap NFTs</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Talent Olympics - Dao Voting</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Talent Olympics - Whitelist Gated</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Talent Olympics - Two-sided Marketplace</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Talent Olympics - Meme Predictions - 🥉 Winner </summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Solana Starter</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Solana Blinks</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor Vote</summary>

<br />

https://github.com/kox/turbin3-vote

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor Vault</summary>

<br />

https://github.com/kox/anchor-vault/blob/main/README.md

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor Escrow</summary>

<br />

https://github.com/kox/anchor-escrow/blob/main/README.md

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor AMM</summary>

<br />

[comment]: <> (Describe)
### Introduction

TBD

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor NFT Staking</summary>

<br />

https://github.com/kox/anchor-nft-stake/blob/main/README.md


[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor Core NFT Staking</summary>

<br />

https://github.com/kox/anchor-nft-core-stake/blob/main/README.md

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Anchor Dice Game</summary>

<br />

https://github.com/kox/anchor-dice-game/blob/main/README.md

[comment]: <> (Extend Catistics)
</details>

---

<details>
<summary>Capstone</summary>

<br />

[comment]: <> (Describe)
### Introduction

My capstone project aims to create a platform that allows users to deploy customizable vaults on Solana. The platform is designed to start with simple vault structures that can be tailored to meet various needs and strategies.

### Goal

The primary objective is to offer a flexible platform for building and managing vaults, while also providing tools for options, analytics, and strategy development. 

The platform will integrate  Solana Blinks for facilitating the customer acquisition. 

### Technology Stack

* Blockchain: Solana
* Smart Contracts: Anchor
* Customer Acquisition: Solana Blinks
* Frontend: React
* Backend: Fastify

The roadmap is pretty extensive so I hope to keep it simple and see where it takes me.

## User Stories

## A) Solana Program


### **Vault Creation and Management**

1. **Vault Creation**
    
    - As a **vault creator**, I want to create a new tokenize vault, so that I can manage shared assets securely.
    - **Acceptance Criteria:**
        - The vault can be created with a unique identifier.
        - The vault creator is automatically assigned as the initial owner.
    
1. **Shared Funding Setup**
    
    - As a **vault creator**, I want to enable shared funding for my vault, so that multiple users can contribute to the vault.
    - **Acceptance Criteria:**
        - The vault creator can specify the shared funding option during vault creation.
        - Multiple vault users can deposit assets into the vault.
        - The vault tracks individual contributions.
    
1. **kTokens or NFTs for Shared Weight**
    
    - As a **vault creator**, I want to issue kTokens or NFTs to contributors, so that their share in the vault is tracked accurately.
    - **Acceptance Criteria:**
        - Contributors receive kTokens or NFTs proportional to their contribution.
        - The kTokens or NFTs represent the contributor's share and can be transferred.

1. **Whitelist Management**
    
    - As a **vault creator**, I want to manage a whitelist of users, so that only authorized users can interact with the vault.
    - **Acceptance Criteria:**
        - The vault creator can add or remove users from the whitelist.
        - Only whitelisted users can deposit, withdraw, or interact with the vault.
        
1. **Lock Vault Functionality**
    
    - As a **vault creator**, I want to lock the vault, so that no further deposits or withdrawals can be made.
    - **Acceptance Criteria:**
        - The vault creator can lock and unlock the vault.
        - Once locked, no deposits or withdrawals are allowed until it is unlocked.

1. **Contribution Interval of Time **
    
    - As a **vault creator**, I want to be able to set an open and close timestamp to restrict users, so that no further deposits or withdrawals can be made before or after the interval.
    - **Acceptance Criteria:**
        - The vault creator can add an opening and closing timestamp for deposits.
        - Once out of the interval, no deposits are allowed.

### **Basic Vault Usage. Deposits and Withdrawals**

7. **Deposit Assets**
    
    - As a **vault user**, I want to deposit assets into the vault, so that I can contribute to the shared pool.
    - **Acceptance Criteria:**
        - Vault users can deposit supported tokens or NFTs into the vault.
        - Depositors receive kTokens or NFTs representing their contribution.
        
1. **Withdraw Assets**
    
    - As a **vault user**, I want to withdraw my share of assets from the vault, so that I can access my contributed funds.
    - **Acceptance Criteria:**
        - Vault users can withdraw assets proportional to their kTokens or NFTs.
        - The withdrawal amount is correctly calculated based on the user's share.

1. **Partial Withdrawals**
    
    - As a **vault user**, I want to make partial withdrawals from the vault, so that I can access some of my funds while leaving the rest in the vault.
    - **Acceptance Criteria:**
        - Vault users can specify the amount to withdraw.
        - The corresponding kTokens or NFTs are burned or adjusted based on the withdrawal amount.
        
1. **View Deposit and Withdrawal History**
    
    - As a **vault user**, I want to view my deposit and withdrawal history, so that I can track my interactions with the vault.
    - **Acceptance Criteria:**
        - Vault users can view a list of all their deposit and withdrawal transactions.
        - Each transaction includes details such as date, amount, and type of asset.
        - This data should be saved in a off-chain database

1. **Automated Distribution of Returns**
    
    - As a **vault creator**, I want to automate the distribution of returns or profits to users based on their share, so that all contributors are fairly compensated.
    - **Acceptance Criteria:**
	    - The returns or profits should be calculated automatically based on the share represented.
        - Vault users should get updated periodically their portion of returns without manual intervention.

1. **Include the minimum and maximum amount per transfer**
    
    - As a **vault user**, I want to avoid deposits or withdraws smaller or higher than some amounts, so it doesn't impact the vault in a negative way.
    - **Acceptance Criteria:**
        - Vault creators can include a min and max per transfer in the vault configuration.
        - Every deposit or withdraw has to check if exceed the limit.
        - A clear message to the user should be notified.

### **Advanced Vault Features**

13. **Vault Maturity Date**
    
    - As a **vault creator**, I want to set a maturity date for the vault, so that the assets can only be withdrawn after a certain period.
    - **Acceptance Criteria:**
        - The vault creator can set a maturity date during creation.
        - Withdrawals are restricted until the maturity date is reached.
    
1. **Early Withdrawal Penalty**
    
    - As a **vault creator**, I want to implement an early withdrawal penalty, so that users are discouraged from withdrawing before the maturity date.
    - **Acceptance Criteria:**
        - The vault applies a penalty fee to withdrawals made before the maturity date.
        - The penalty fee is configurable by the vault creator.
        
1. **Vault Performance Metrics**
    
    - As a **vault user**, I want to view performance metrics of the vault, so that I can assess the growth and returns on my contribution.
    - **Acceptance Criteria:**
        - Vault users can access metrics such as total assets, return on investment (ROI), and historical performance.
        - The metrics are updated in real-time based on vault activities.
        
1. **Transfer kTokens or NFTs**
    
    - As a **vault user**, I want to transfer my kTokens or NFTs to another user, so that I can transfer my share of the vault.
    - **Acceptance Criteria:**
        - Vault users can transfer their kTokens or NFTs to any other user.
        - The recipient inherits the share of the vault represented by the transferred tokens.
        
1. **Convert kTokens to Underlying Assets**
    
    - As a **vault user**, I want to convert my kTokens back to the underlying assets, so that I can exit the vault.
    - **Acceptance Criteria:**
        - Vault users can redeem their kTokens for the corresponding amount of assets.
        - The vault's total supply is updated accordingly after conversion.
        - The tokens or NFT could be burn or sent to shared vault.
        

### **User Roles and Permissions**

18. **Assign Multiple Vault Administrators**
    
    - As a **vault creator**, I want to assign multiple administrators to the vault, so that they can help manage the vault.
    - **Acceptance Criteria:**
        - The vault creator can assign and revoke administrative roles to other users.
        - Administrators have the same permissions as the vault creator, excluding the ability to delete the vault.
        - A multi-sign mechanism should get implemented for security reasons.
     
1. **Restrict Withdrawals to Whitelisted Addresses**
    
    - As a **vault creator**, I want to restrict withdrawals to specific whitelisted addresses, so that I can control where assets are sent.
    - **Acceptance Criteria:**
        - The vault creator can specify a list of addresses that are allowed to receive withdrawals.
        - Withdrawals can only be made to whitelisted addresses.
        
1. **Lock Vault After a Certain Number of Transactions**
    
    - As a **vault creator**, I want to automatically lock the vault after a certain number of transactions, so that I can limit vault activity.
    - **Acceptance Criteria:**
        - The vault locks automatically after a predefined number of transactions.
        - Further deposits or withdrawals are blocked until the vault is unlocked.
    - 
1. **Transfer Vault Ownership**
    
    - As a **vault creator**, I want to transfer ownership of the vault to another user, so that they can take over the management of the vault.
    - **Acceptance Criteria:**
        - The vault creator can transfer ownership to any other user.
        - The new owner inherits all rights and permissions of the vault creator.
        -
1. **Delete Vault**
    
    - As a **vault creator**, I want to delete a vault, so that I can remove it from the platform if it is no longer needed.
    - **Acceptance Criteria:**
        - The vault creator can delete the vault only if all assets have been withdrawn.
        - Deleting the vault removes all associated data and transactions from the platform.

## B) Platform 

### Administration

1. **Set Platform Fee**

    - As a platform admin user, I want to set a platform fee for all vault transactions, so that the platform can generate revenue.
    - **Acceptance Criteria:**
        - The platform user can define a fee percentage to be applied to all vault transactions.
        - The fee is automatically deducted from each transaction.

1. **Manage Platform Settings**
    - As a platform user, I want to manage basic platform settings, so that I can configure the overall platform behavior.
    - **Acceptance Criteria:**
        - The platform user can configure global settings such as maximum vault creation limits, supported token types, and access permissions.
        - Changes to settings are applied globally and immediately.

1. **View Platform Metrics** 
    - As a platform user, I want to view key metrics such as total vaults created, total platform fees collected, and active users, so that I can monitor the platform's performance.
    - **Acceptance Criteria:**
        - The platform displays real-time metrics, including the number of vaults, total transactions, and fees collected.
        - Metrics can be filtered by date and user activity.

### Vault Creation

4. **Create a Vault**
    - As a vault creator user, I want to create a new vault on the platform, so that I can manage shared assets.
    - **Acceptance Criteria:**
        - The vault creator can create a vault with basic options like vault name and initial deposit.
        - The vault is created successfully and listed under the vault creator's account.

1. **Set Vault Parameters**
    - As a vault creator user, I want to set vault parameters like whitelisted users and shared funding options, so that I can control who interacts with the vault.
    - **Acceptance Criteria:**
        - The vault creator can whitelist specific users and enable or disable shared funding.
        - Parameters can be modified at any time with immediate effect.

1. **View Vault Details**
        As a vault creator user, I want to view detailed information about my vault, so that I can monitor its status and activity.
        Acceptance Criteria:
            The vault creator can access a dashboard showing vault balances, user contributions, and transaction history.
            All information is presented in a clean and organized manner.

1. **Delete Vault**
        As a vault creator user, I want to delete a vault if it is no longer needed, so that I can manage my vaults efficiently.
    - **Acceptance Criteria:**
            The vault creator can delete a vault, but only if all assets have been withdrawn.
            Deleting the vault removes it from the platform, along with its data.

### Vault User 

8. **Deposit into Vault**
    - As a vault user, I want to deposit tokens into a vault, so that I can contribute to shared assets.
    - **Acceptance Criteria:**
        - The vault user can deposit supported tokens into any vault they have access to.
        - Deposits are tracked and reflected in the user's share of the vault.

1. **Withdraw from Vault**
    - As a vault user, I want to withdraw tokens from a vault, so that I can access my share of the assets.
    - **Acceptance Criteria:**
        -  The vault user can withdraw tokens proportional to their contribution.
        -  The user's vault balance is updated after the withdrawal.

1. **View Vault Participation**
    - As a vault user, I want to view my participation in various vaults, so that I can track my contributions and returns.
    - **Acceptance Criteria:**
        - The vault user can see a list of vaults they are involved in, along with their contributions and current balances.
        - The information is updated in real-time and presented clearly.

1. **Transfer kTokens or NFTs**
    - As a vault user, I want to transfer my kTokens or NFTs to another user, so that I can transfer my vault share.
    - **Acceptance Criteria:**
        - The vault user can transfer kTokens or NFTs representing their share to any other user.
        - The recipient inherits the vault share associated with the transferred tokens.

1. **Redeem kTokens for Assets**
    - As a vault user, I want to redeem my kTokens for the underlying assets in the vault, so that I can exit the vault.
    - **Acceptance Criteria:**
        - The vault user can redeem their kTokens for an equivalent amount of the vault's assets.
        - The vault's total supply is updated after redemption.

1. **View Transaction History**
    - As a vault user, I want to view my transaction history within a vault, so that I can keep track of my deposits and withdrawals.
    - **Acceptance Criteria:**
        - The vault user can access a detailed transaction history, including dates, amounts, and types of transactions.
        - The history is filterable by date and transaction type.





[comment]: <> (Extend Catistics)
</details>

---
