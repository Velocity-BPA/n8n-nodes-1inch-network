# n8n-nodes-1inch-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node integrates with 1inch Network, the leading DeFi aggregator protocol. With 5 powerful resources (Swap, LimitOrder, FusionOrder, Portfolio, CrossChain), it enables seamless token swaps, advanced order management, portfolio tracking, and cross-chain operations across multiple blockchains.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Aggregator-green)
![1inch](https://img.shields.io/badge/1inch-Network-blue)
![Multi-Chain](https://img.shields.io/badge/Multi--Chain-Supported-purple)

## Features

- **Token Swapping** - Execute optimal token swaps with automatic routing across 200+ DEX protocols
- **Advanced Order Management** - Create and manage limit orders with precise execution parameters
- **Fusion Orders** - Access next-generation gasless swaps with Dutch auction mechanics
- **Portfolio Analytics** - Track token balances, positions, and transaction history across wallets
- **Cross-Chain Operations** - Bridge tokens seamlessly between Ethereum, Polygon, BSC, and other chains
- **Real-time Price Data** - Get accurate token prices and market data from aggregated sources
- **Gas Optimization** - Minimize transaction costs with intelligent gas estimation and routing
- **MEV Protection** - Protect trades from front-running with advanced order execution

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-1inch-network`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-1inch-network
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-1inch-network.git
cd n8n-nodes-1inch-network
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-1inch-network
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your 1inch Network API key from the developer portal | Yes |
| Environment | API environment (mainnet/testnet) | Yes |
| Rate Limit | Requests per second limit (default: 10) | No |

## Resources & Operations

### 1. Swap

| Operation | Description |
|-----------|-------------|
| Get Quote | Retrieve optimal swap quote for token pair |
| Execute Swap | Perform token swap with specified parameters |
| Get Swap History | Fetch historical swap transactions |
| Get Supported Tokens | List all supported tokens for swapping |
| Get Protocols | Retrieve available DEX protocols for routing |

### 2. Limit Order

| Operation | Description |
|-----------|-------------|
| Create Order | Create a new limit order with specified parameters |
| Cancel Order | Cancel an existing limit order |
| Get Order Status | Check the status of a specific limit order |
| List Orders | Retrieve all limit orders for an address |
| Get Order Events | Fetch order execution events and updates |

### 3. Fusion Order

| Operation | Description |
|-----------|-------------|
| Create Fusion Order | Create a gasless fusion order with Dutch auction |
| Get Fusion Quote | Get quote for fusion order execution |
| Cancel Fusion Order | Cancel an active fusion order |
| Get Fusion Status | Check execution status of fusion order |
| List Fusion Orders | Retrieve all fusion orders for an address |

### 4. Portfolio

| Operation | Description |
|-----------|-------------|
| Get Balance | Fetch token balances for a wallet address |
| Get Portfolio Value | Calculate total portfolio value in USD |
| Get Transaction History | Retrieve transaction history for an address |
| Get Token Allowances | Check token approval allowances |
| Get Profit Loss | Calculate profit/loss analytics for positions |

### 5. CrossChain

| Operation | Description |
|-----------|-------------|
| Get Bridge Quote | Get quote for cross-chain token bridge |
| Execute Bridge | Initiate cross-chain token transfer |
| Get Bridge Status | Check status of cross-chain transaction |
| Get Supported Chains | List supported blockchain networks |
| Get Bridge History | Retrieve cross-chain transaction history |

## Usage Examples

```javascript
// Execute a token swap from ETH to USDC
{
  "fromToken": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "toToken": "0xA0b86a33E6417C4BA474E9Fc4f95E4f5C4a96B50",
  "amount": "1000000000000000000",
  "fromAddress": "0x742d35Cc6634C0532925a3b8D6AdCF546F",
  "slippage": 1,
  "gasPrice": "fast"
}
```

```javascript
// Create a limit order to sell 100 USDT for ETH
{
  "makerAsset": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "takerAsset": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "makingAmount": "100000000",
  "takingAmount": "45000000000000000000",
  "maker": "0x742d35Cc6634C0532925a3b8D6AdCF546F"
}
```

```javascript
// Get portfolio balance for a wallet
{
  "address": "0x742d35Cc6634C0532925a3b8D6AdCF546F",
  "chainId": 1,
  "includeUsdValue": true
}
```

```javascript
// Create fusion order for gasless swap
{
  "fromToken": "0xA0b86a33E6417C4BA474E9Fc4f95E4f5C4a96B50",
  "toToken": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  "amount": "1000000000",
  "wallet": "0x742d35Cc6634C0532925a3b8D6AdCF546F",
  "enableEstimate": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Insufficient Liquidity | Not enough liquidity for requested swap amount | Reduce swap amount or try different token pair |
| Gas Estimation Failed | Unable to estimate gas for transaction | Check network status and wallet balance |
| Order Not Found | Specified order ID does not exist | Verify order ID and ensure it belongs to your address |
| Unsupported Chain | Blockchain network not supported for operation | Use supported chain ID (1, 56, 137, etc.) |
| Rate Limit Exceeded | Too many API requests in short period | Implement request throttling or upgrade plan |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-1inch-network/issues)
- **1inch API Documentation**: [1inch Developer Portal](https://portal.1inch.dev)
- **1inch Discord Community**: [1inch Discord](https://discord.gg/1inch)