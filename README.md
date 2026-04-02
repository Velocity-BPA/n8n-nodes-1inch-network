# n8n-nodes-1inch-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for seamless integration with the 1inch Network, providing access to 7 resources including token swaps, portfolio management, limit orders, fusion orders, cross-chain operations, and transaction history. This node enables automated DeFi operations, trading strategies, and portfolio monitoring with the leading DEX aggregator.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Enabled-green)
![DEX](https://img.shields.io/badge/DEX-Aggregator-orange)
![Web3](https://img.shields.io/badge/Web3-Compatible-purple)

## Features

- **Token Swaps** - Execute optimal token swaps across multiple DEXs with best price discovery
- **Portfolio Tracking** - Monitor token balances and portfolio performance across wallets
- **Limit Orders** - Create and manage conditional orders for automated trading strategies
- **Fusion Orders** - Access gasless swaps with MEV protection and competitive rates
- **Cross-Chain Operations** - Bridge tokens seamlessly between supported blockchain networks
- **Transaction History** - Retrieve comprehensive swap and transaction data for analysis
- **Real-time Quotes** - Get instant price quotes with slippage protection
- **Gas Optimization** - Minimize transaction costs through intelligent routing algorithms

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
| Base URL | API endpoint (defaults to official 1inch API) | No |
| Timeout | Request timeout in milliseconds (default: 30000) | No |

## Resources & Operations

### 1. Swap

| Operation | Description |
|-----------|-------------|
| Get Quote | Retrieve optimal swap quote with routing information |
| Execute Swap | Perform token swap transaction |
| Get Allowance | Check token allowance for spender address |
| Set Allowance | Approve token spending for swap contracts |

### 2. Token

| Operation | Description |
|-----------|-------------|
| List Tokens | Get all supported tokens for a specific chain |
| Get Token Info | Retrieve detailed information about a specific token |
| Get Token Price | Fetch current market price for token |
| Search Tokens | Find tokens by symbol or name |

### 3. Portfolio

| Operation | Description |
|-----------|-------------|
| Get Balances | Retrieve token balances for wallet address |
| Get Portfolio Value | Calculate total portfolio value in USD |
| Track Wallet | Monitor wallet for balance changes |
| Get Token Holdings | List all token positions with quantities |

### 4. Limit Order

| Operation | Description |
|-----------|-------------|
| Create Order | Place a new limit order |
| Cancel Order | Cancel existing limit order |
| Get Order | Retrieve order details and status |
| List Orders | Get all orders for an address |
| Get Order Events | Fetch order execution history |

### 5. Fusion Order

| Operation | Description |
|-----------|-------------|
| Create Fusion Order | Place gasless swap order with MEV protection |
| Get Order Status | Check fusion order execution status |
| Cancel Fusion Order | Cancel pending fusion order |
| List Active Orders | Get all active fusion orders |
| Get Fill Events | Retrieve order fill history |

### 6. Cross-Chain

| Operation | Description |
|-----------|-------------|
| Get Bridge Quote | Retrieve cross-chain bridge quote |
| Execute Bridge | Perform cross-chain token transfer |
| Get Bridge Status | Check bridge transaction status |
| List Supported Chains | Get all supported blockchain networks |
| Get Bridge History | Retrieve cross-chain transaction history |

### 7. History

| Operation | Description |
|-----------|-------------|
| Get Swap History | Retrieve historical swap transactions |
| Get Transaction Details | Get detailed transaction information |
| Export History | Download transaction history as CSV |
| Get Statistics | Fetch trading statistics and analytics |

## Usage Examples

```javascript
// Get optimal swap quote
{
  "fromTokenAddress": "0xA0b86a33E6441Cc7D16Dc63c4B3b72E5b4e4a72a",
  "toTokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "amount": "1000000000000000000",
  "fromAddress": "0x742E5de39746A7b36A04Fcf2D2D8C5E9D7b4F2C4"
}
```

```javascript
// Execute token swap
{
  "fromTokenAddress": "0xA0b86a33E6441Cc7D16Dc63c4B3b72E5b4e4a72a",
  "toTokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "amount": "1000000000000000000",
  "fromAddress": "0x742E5de39746A7b36A04Fcf2D2D8C5E9D7b4F2C4",
  "slippage": 1
}
```

```javascript
// Create limit order
{
  "makerAsset": "0xA0b86a33E6441Cc7D16Dc63c4B3b72E5b4e4a72a",
  "takerAsset": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "makerAmount": "1000000000000000000",
  "takerAmount": "2000000000000000000",
  "maker": "0x742E5de39746A7b36A04Fcf2D2D8C5E9D7b4F2C4"
}
```

```javascript
// Get portfolio balances
{
  "address": "0x742E5de39746A7b36A04Fcf2D2D8C5E9D7b4F2C4",
  "chainId": 1
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided API key | Verify API key in 1inch developer portal |
| Insufficient Balance | Wallet has insufficient token balance for operation | Check wallet balance and reduce swap amount |
| Slippage Too High | Price moved beyond acceptable slippage tolerance | Increase slippage tolerance or retry |
| Network Congestion | Transaction failed due to network congestion | Increase gas price or retry later |
| Token Not Supported | Requested token is not available on this network | Check supported tokens list for the chain |
| Rate Limited | API rate limit exceeded | Implement request throttling or upgrade plan |

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
- **1inch API Documentation**: [1inch Developer Portal](https://docs.1inch.io/)
- **1inch Community**: [1inch Discord](https://discord.gg/1inch)