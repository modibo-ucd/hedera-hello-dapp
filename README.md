# Hello Hedera - DApp Project

Complete project using Hedera Hashgraph, Hardhat, OpenZeppelin, SolidJS and ethers.js to deploy and interact with a smart contract on Hedera Testnet.

## Description

This project allows you to deploy a HelloHedera smart contract on the Hedera test network and interact with it through a decentralized web application (DApp) built with SolidJS.

The smart contract allows storing and reading a message, with pause functionality and permission management using OpenZeppelin.

## Prerequisites

- Node.js >= 18
- pnpm package manager
- A Hedera Testnet account with:
  - An EVM address
  - An ECDSA private key (hexadecimal format)

## Installation

Clone the project and install dependencies:

```bash
pnpm install
```

## Configuration

Create a .env file at the project root with the following variables:

```env
EVM_ADDRESS=your_evm_address
HEX_PRIVATE_KEY=your_hex_private_key
TESTNET_ENDPOINT=https://testnet.hashio.io/api
CONTRACT_ADDRESS=
```

## Smart Contract Usage

### 1. Compile the Hardhat project

```bash
npm run compile
```

This command compiles the HelloHedera.sol smart contract and generates the necessary artifacts.

### 2. Deploy the smart contract

```bash
npm run deploy
```

This command deploys the contract to Hedera Testnet. The deployed contract address will be automatically saved in the .env file.

### 3. Copy the deployed contract address

After deployment, verify that the CONTRACT_ADDRESS variable in the .env file contains the contract address.

### 4. Read the message

```bash
npm run get:message
```

This command displays the message currently stored in the smart contract.

### 5. Update the message

```bash
npm run set:message
```

This command allows you to modify the message stored in the contract (requires being the contract owner).

## DApp Usage

### 1. Convert the ABI

After compiling the contract, convert the ABI for use in the DApp:

```bash
npm run convert:abi
```

This command copies the smart contract ABI to the dapp/src/abis folder.

### 2. Configure the DApp

Create a .env file in the dapp folder with the following variables:

```env
VITE_EVM_ADDRESS=your_evm_address
VITE_HEX_PRIVATE_KEY=your_hex_private_key
VITE_TESTNET_ENDPOINT=https://testnet.hashio.io/api
VITE_CONTRACT_ADDRESS=deployed_contract_address
```

### 3. Install DApp dependencies

```bash
cd dapp
pnpm install
```

### 4. Run the DApp

```bash
npm run dev
```

The application will be accessible at:

```
Local:   http://localhost:3000/
Network: use --host to expose
press h + enter to show help
```

## Development Shortcuts

When the development server is running, you can use the following shortcuts:

- r + enter: restart the server
- u + enter: show server url
- o + enter: open in browser
- c + enter: clear console
- q + enter: quit

## Project Structure

```
hedera-hello-project/
├── contracts/
│   └── HelloHedera.sol          # Main smart contract
├── scripts/
│   ├── deploy.js                # Deployment script
│   ├── getMessage.js            # Script to read message
│   ├── setMessage.js            # Script to update message
│   └── convert-abi.js           # ABI conversion script
├── dapp/
│   ├── src/
│   │   ├── App.jsx              # SolidJS application
│   │   └── abis/
│   │       └── abi.jsx          # Contract ABI
│   ├── .env                     # DApp environment variables
│   └── package.json
├── .env                         # Project environment variables
├── hardhat.config.js            # Hardhat configuration
└── package.json
```

## Technologies Used

- Hardhat 2.26.0 - Ethereum development framework
- OpenZeppelin Contracts 5.4.0 - Secure smart contract library
- ethers.js 5.7.2 - Library for interacting with Ethereum/Hedera
- Hedera SDK 2.75.0 - Official Hedera SDK
- SolidJS - Reactive JavaScript framework

## Smart Contract Features

- getMessage(): Retrieves the stored message
- setMessage(string): Modifies the message (owner only)
- pause(): Pauses the contract (owner only)
- unpause(): Reactivates the contract (owner only)

## Security

- The contract uses OpenZeppelin's Ownable to restrict certain functions to the owner
- The contract can be paused via Pausable to block modifications in case of emergency
- Never commit your .env files containing private keys

## Troubleshooting

If you encounter problems, try cleaning and reinstalling:

```bash
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules, cache, artifacts
pnpm install
pnpm exec hardhat compile
```

## License

MIT

## Author

SISSOKO Modibo / Hashgraph Lab
