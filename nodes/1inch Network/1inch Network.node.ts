/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-1inchnetwork/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class 1inchNetwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: '1inch Network',
    name: '1inchnetwork',
    icon: 'file:1inchnetwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the 1inch Network API',
    defaults: {
      name: '1inch Network',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: '1inchnetworkApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Swap',
            value: 'swap',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'Portfolio',
            value: 'portfolio',
          },
          {
            name: 'LimitOrder',
            value: 'limitOrder',
          },
          {
            name: 'FusionOrder',
            value: 'fusionOrder',
          },
          {
            name: 'Cross-Chain',
            value: 'crossChain',
          },
          {
            name: 'History',
            value: 'history',
          }
        ],
        default: 'swap',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['swap'],
    },
  },
  options: [
    {
      name: 'Get Quote',
      value: 'getQuote',
      description: 'Get quote for token swap',
      action: 'Get quote for token swap',
    },
    {
      name: 'Build Swap',
      value: 'buildSwap',
      description: 'Build transaction for token swap',
      action: 'Build transaction for token swap',
    },
  ],
  default: 'getQuote',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['token'] } },
  options: [
    { name: 'Get All Tokens', value: 'getAllTokens', description: 'Get all supported tokens for a network', action: 'Get all supported tokens' },
    { name: 'Search Tokens', value: 'searchTokens', description: 'Search for tokens by query', action: 'Search for tokens' },
    { name: 'Get Custom Tokens', value: 'getCustomTokens', description: 'Get custom token information', action: 'Get custom token information' },
  ],
  default: 'getAllTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['portfolio'] } },
  options: [
    { name: 'Get Portfolio Details', value: 'getPortfolioDetails', description: 'Get detailed portfolio information', action: 'Get portfolio details' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get token balances for wallet', action: 'Get balance' },
    { name: 'Get Balances', value: 'getBalances', description: 'Get balances for multiple wallets', action: 'Get balances' },
  ],
  default: 'getPortfolioDetails',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['limitOrder'] } },
  options: [
    { name: 'Get All Orders', value: 'getAllOrders', description: 'Get limit orders', action: 'Get all orders' },
    { name: 'Create Order', value: 'createOrder', description: 'Create a new limit order', action: 'Create order' },
    { name: 'Get Order', value: 'getOrder', description: 'Get specific limit order', action: 'Get order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel limit order', action: 'Cancel order' },
    { name: 'Get Orders Count', value: 'getOrdersCount', description: 'Get count of orders', action: 'Get orders count' }
  ],
  default: 'getAllOrders',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['fusionOrder'] } },
  options: [
    { name: 'Get Fusion Orders', value: 'getFusionOrders', description: 'Get list of Fusion orders', action: 'Get Fusion orders' },
    { name: 'Create Fusion Order', value: 'createFusionOrder', description: 'Create a new Fusion order', action: 'Create Fusion order' },
    { name: 'Get Fusion Order', value: 'getFusionOrder', description: 'Get specific Fusion order by hash', action: 'Get Fusion order' },
    { name: 'Cancel Fusion Order', value: 'cancelFusionOrder', description: 'Cancel a Fusion order', action: 'Cancel Fusion order' },
    { name: 'Get Fusion Quote', value: 'getFusionQuote', description: 'Get quote for Fusion swap', action: 'Get Fusion quote' },
  ],
  default: 'getFusionOrders',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
		},
	},
	options: [
		{
			name: 'Get Cross-Chain Quote',
			value: 'getCrossChainQuote',
			description: 'Get quote for cross-chain swap',
			action: 'Get cross-chain quote',
		},
		{
			name: 'Build Cross-Chain Swap',
			value: 'buildCrossChainSwap',
			description: 'Build cross-chain swap transaction',
			action: 'Build cross-chain swap',
		},
		{
			name: 'Get Cross-Chain Status',
			value: 'getCrossChainStatus',
			description: 'Get status of cross-chain transaction',
			action: 'Get cross-chain status',
		},
	],
	default: 'getCrossChainQuote',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['history'],
		},
	},
	options: [
		{
			name: 'Get Transaction History',
			value: 'getTransactionHistory',
			description: 'Get transaction history for wallet',
			action: 'Get transaction history',
		},
		{
			name: 'Get Interventions',
			value: 'getInterventions',
			description: 'Get intervention history',
			action: 'Get interventions',
		},
	],
	default: 'getTransactionHistory',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'BSC', value: '56' },
    { name: 'Polygon', value: '137' },
    { name: 'Arbitrum One', value: '42161' },
    { name: 'Optimism', value: '10' },
    { name: 'Avalanche', value: '43114' },
    { name: 'Fantom', value: '250' },
  ],
  default: '1',
  description: 'The blockchain network to use for the swap',
},
{
  displayName: 'Source Token Address',
  name: 'src',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: '0xA0b86a33E6411a3bbaeA62A94529A49FCE06CBf0',
  description: 'Contract address of the source token',
},
{
  displayName: 'Destination Token Address',
  name: 'dst',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  description: 'Contract address of the destination token',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: '1000000000000000000',
  description: 'Amount of source token to swap (in wei/smallest unit)',
},
{
  displayName: 'From Address',
  name: 'from',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['buildSwap'],
    },
  },
  default: '',
  placeholder: '0x742d35Cc6634C0532925a3b8D54C4a3b1e9C7c31',
  description: 'Address of the sender',
},
{
  displayName: 'Slippage Tolerance',
  name: 'slippage',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['buildSwap'],
    },
  },
  default: 1,
  typeOptions: {
    minValue: 0,
    maxValue: 50,
  },
  description: 'Maximum acceptable slippage percentage (0-50)',
},
{
  displayName: 'Protocols',
  name: 'protocols',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: 'UNISWAP_V2,SUSHISWAP',
  description: 'Comma-separated list of protocols to use (leave empty for all)',
},
{
  displayName: 'Fee',
  name: 'fee',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: 0,
  typeOptions: {
    minValue: 0,
    maxValue: 3,
  },
  description: 'Fee percentage (0-3)',
},
{
  displayName: 'Gas Price',
  name: 'gasPrice',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: '20000000000',
  description: 'Gas price in wei (leave empty for automatic)',
},
{
  displayName: 'Complexity Level',
  name: 'complexityLevel',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  options: [
    { name: '0', value: '0' },
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
  ],
  default: '2',
  description: 'Complexity level for routing (0-3)',
},
{
  displayName: 'Parts',
  name: 'parts',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: 10,
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
  description: 'Number of parts for split routing',
},
{
  displayName: 'Main Route Parts',
  name: 'mainRouteParts',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: 10,
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
  description: 'Number of main route parts',
},
{
  displayName: 'Gas Limit',
  name: 'gasLimit',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: '750000',
  description: 'Gas limit for the transaction',
},
{
  displayName: 'Include Tokens Info',
  name: 'includeTokensInfo',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: false,
  description: 'Whether to include token information in response',
},
{
  displayName: 'Include Protocols',
  name: 'includeProtocols',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: false,
  description: 'Whether to include protocol information in response',
},
{
  displayName: 'Include Gas',
  name: 'includeGas',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: false,
  description: 'Whether to include gas estimation in response',
},
{
  displayName: 'Connector Tokens',
  name: 'connectorTokens',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'buildSwap'],
    },
  },
  default: '',
  placeholder: '0xA0b86a33E6411a3bbaeA62A94529A49FCE06CBf0',
  description: 'Comma-separated list of connector tokens',
},
{
  displayName: 'Allow Partial Fill',
  name: 'allowPartialFill',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['buildSwap'],
    },
  },
  default: false,
  description: 'Whether to allow partial fills',
},
{
  displayName: 'Disable Estimate',
  name: 'disableEstimate',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['buildSwap'],
    },
  },
  default: false,
  description: 'Whether to disable gas estimation',
},
{
  displayName: 'Use Patching',
  name: 'usePatching',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['buildSwap'],
    },
  },
  default: false,
  description: 'Whether to use patching for the swap',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['getAllTokens', 'searchTokens', 'getCustomTokens'] } },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'BSC', value: '56' },
    { name: 'Polygon', value: '137' },
    { name: 'Optimism', value: '10' },
    { name: 'Arbitrum', value: '42161' },
    { name: 'Gnosis', value: '100' },
    { name: 'Avalanche', value: '43114' },
    { name: 'Fantom', value: '250' },
    { name: 'Klaytn', value: '8217' },
    { name: 'Aurora', value: '1313161554' },
  ],
  default: '1',
  description: 'The blockchain network to query',
},
{
  displayName: 'Search Query',
  name: 'query',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['searchTokens'] } },
  default: '',
  description: 'Token symbol, name or address to search for',
},
{
  displayName: 'Ignore Listed',
  name: 'ignoreListed',
  type: 'boolean',
  displayOptions: { show: { resource: ['token'], operation: ['searchTokens'] } },
  default: false,
  description: 'Whether to ignore tokens that are in default lists',
},
{
  displayName: 'Only Positive Rating',
  name: 'onlyPositiveRating',
  type: 'boolean',
  displayOptions: { show: { resource: ['token'], operation: ['searchTokens'] } },
  default: false,
  description: 'Whether to return only tokens with positive rating',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['token'], operation: ['searchTokens'] } },
  default: 10,
  typeOptions: { minValue: 1, maxValue: 100 },
  description: 'Maximum number of tokens to return',
},
{
  displayName: 'Token Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['token'], operation: ['getCustomTokens'] } },
  default: '',
  description: 'Comma-separated list of token addresses to get information for',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['portfolio'], operation: ['getPortfolioDetails'] } },
  default: '',
  placeholder: '0x123...',
  description: 'Comma-separated list of wallet addresses',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['portfolio'], operation: ['getPortfolioDetails', 'getBalance', 'getBalances'] } },
  options: [
    { name: 'Ethereum', value: 1 },
    { name: 'BSC', value: 56 },
    { name: 'Polygon', value: 137 },
    { name: 'Optimism', value: 10 },
    { name: 'Arbitrum', value: 42161 },
    { name: 'Gnosis', value: 100 },
    { name: 'Avalanche', value: 43114 },
    { name: 'Fantom', value: 250 },
    { name: 'Klaytn', value: 8217 },
    { name: 'Aurora', value: 1313161554 },
    { name: 'ZkSync Era', value: 324 },
  ],
  default: 1,
  description: 'The blockchain network ID',
},
{
  displayName: 'Time Range',
  name: 'timeRange',
  type: 'options',
  displayOptions: { show: { resource: ['portfolio'], operation: ['getPortfolioDetails'] } },
  options: [
    { name: '1 Day', value: '1d' },
    { name: '1 Week', value: '1w' },
    { name: '1 Month', value: '1m' },
    { name: '3 Months', value: '3m' },
    { name: '6 Months', value: '6m' },
    { name: '1 Year', value: '1y' },
  ],
  default: '1d',
  description: 'Time range for portfolio data',
},
{
  displayName: 'Wallet Address',
  name: 'walletAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['portfolio'], operation: ['getBalance'] } },
  default: '',
  placeholder: '0x123...',
  description: 'The wallet address to get balance for',
},
{
  displayName: 'Wallet Addresses',
  name: 'walletAddresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['portfolio'], operation: ['getBalances'] } },
  default: '',
  placeholder: '["0x123...", "0x456..."]',
  description: 'JSON array of wallet addresses to get balances for',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders', 'createOrder', 'getOrder', 'cancelOrder', 'getOrdersCount']
    }
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'BSC', value: '56' },
    { name: 'Polygon', value: '137' },
    { name: 'Arbitrum', value: '42161' },
    { name: 'Optimism', value: '10' }
  ],
  default: '1',
  description: 'The blockchain network to use'
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders']
    }
  },
  default: 1,
  description: 'Page number for pagination'
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders']
    }
  },
  default: 100,
  description: 'Number of orders per page'
},
{
  displayName: 'Statuses',
  name: 'statuses',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders', 'getOrdersCount']
    }
  },
  default: '',
  description: 'Comma-separated list of order statuses to filter by'
},
{
  displayName: 'Maker Asset',
  name: 'makerAsset',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders', 'getOrdersCount']
    }
  },
  default: '',
  description: 'Token address of the maker asset'
},
{
  displayName: 'Taker Asset',
  name: 'takerAsset',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders', 'getOrdersCount']
    }
  },
  default: '',
  description: 'Token address of the taker asset'
},
{
  displayName: 'Maker',
  name: 'maker',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders', 'getOrdersCount']
    }
  },
  default: '',
  description: 'Address of the order maker'
},
{
  displayName: 'Taker',
  name: 'taker',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders', 'getOrdersCount']
    }
  },
  default: '',
  description: 'Address of the order taker'
},
{
  displayName: 'Sort By',
  name: 'sortBy',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getAllOrders']
    }
  },
  options: [
    { name: 'Created At', value: 'createdAt' },
    { name: 'Maker Amount', value: 'makerAmount' },
    { name: 'Taker Amount', value: 'takerAmount' }
  ],
  default: 'createdAt',
  description: 'Field to sort results by'
},
{
  displayName: 'Order Data',
  name: 'orderData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder']
    }
  },
  default: '{}',
  description: 'The order data as JSON object'
},
{
  displayName: 'Order Hash',
  name: 'orderHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getOrder', 'cancelOrder']
    }
  },
  default: '',
  description: 'The hash of the order'
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  displayOptions: { show: { resource: ['fusionOrder'] } },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'BSC', value: '56' },
    { name: 'Polygon', value: '137' },
    { name: 'Arbitrum', value: '42161' },
    { name: 'Optimism', value: '10' },
    { name: 'Avalanche', value: '43114' },
  ],
  default: '1',
  description: 'The blockchain network ID',
  required: true,
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionOrders'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionOrders'] } },
  default: 100,
  description: 'Number of orders to return per page',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionOrders'] } },
  default: '',
  description: 'Filter orders by maker address',
},
{
  displayName: 'Sort By',
  name: 'sortBy',
  type: 'options',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionOrders'] } },
  options: [
    { name: 'Created At', value: 'createDateTime' },
    { name: 'Amount', value: 'makerAmount' },
    { name: 'Order Hash', value: 'orderHash' },
  ],
  default: 'createDateTime',
  description: 'Field to sort orders by',
},
{
  displayName: 'Order Data',
  name: 'orderData',
  type: 'json',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['createFusionOrder'] } },
  default: '{}',
  description: 'The order data object for creating a Fusion order',
  required: true,
},
{
  displayName: 'Order Hash',
  name: 'orderHash',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionOrder', 'cancelFusionOrder'] } },
  default: '',
  description: 'The hash of the Fusion order',
  required: true,
},
{
  displayName: 'Source Token Address',
  name: 'srcTokenAddress',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: '',
  description: 'Address of the source token',
  required: true,
},
{
  displayName: 'Destination Token Address',
  name: 'dstTokenAddress',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: '',
  description: 'Address of the destination token',
  required: true,
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: '',
  description: 'Amount of source token to swap',
  required: true,
},
{
  displayName: 'Wallet Address',
  name: 'walletAddress',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: '',
  description: 'Wallet address for the quote',
  required: true,
},
{
  displayName: 'Enable Estimate',
  name: 'enableEstimate',
  type: 'boolean',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: false,
  description: 'Whether to enable gas estimation',
},
{
  displayName: 'Preset',
  name: 'preset',
  type: 'options',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  options: [
    { name: 'Fast', value: 'fast' },
    { name: 'Medium', value: 'medium' },
    { name: 'Slow', value: 'slow' },
  ],
  default: 'medium',
  description: 'Preset for quote parameters',
},
{
  displayName: 'Fee',
  name: 'fee',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: '',
  description: 'Fee amount for the quote',
},
{
  displayName: 'Permit',
  name: 'permit',
  type: 'string',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: '',
  description: 'Permit data for gasless approval',
},
{
  displayName: 'Is Ledger Live',
  name: 'isLedgerLive',
  type: 'boolean',
  displayOptions: { show: { resource: ['fusionOrder'], operation: ['getFusionQuote'] } },
  default: false,
  description: 'Whether the request is from Ledger Live',
},
{
	displayName: 'Source Token',
	name: 'src',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap'],
		},
	},
	default: '',
	description: 'Contract address of the source token',
},
{
	displayName: 'Destination Token',
	name: 'dst',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap'],
		},
	},
	default: '',
	description: 'Contract address of the destination token',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap'],
		},
	},
	default: '',
	description: 'Amount of tokens to swap (in wei for ETH)',
},
{
	displayName: 'Source Chain ID',
	name: 'srcChainId',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap', 'getCrossChainStatus'],
		},
	},
	options: [
		{ name: 'Ethereum', value: '1' },
		{ name: 'BSC', value: '56' },
		{ name: 'Polygon', value: '137' },
		{ name: 'Optimism', value: '10' },
		{ name: 'Arbitrum', value: '42161' },
		{ name: 'Gnosis', value: '100' },
		{ name: 'Avalanche', value: '43114' },
		{ name: 'Fantom', value: '250' },
		{ name: 'Klaytn', value: '8217' },
		{ name: 'Aurora', value: '1313161554' },
	],
	default: '1',
	description: 'Source blockchain network ID',
},
{
	displayName: 'Destination Chain ID',
	name: 'dstChainId',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap', 'getCrossChainStatus'],
		},
	},
	options: [
		{ name: 'Ethereum', value: '1' },
		{ name: 'BSC', value: '56' },
		{ name: 'Polygon', value: '137' },
		{ name: 'Optimism', value: '10' },
		{ name: 'Arbitrum', value: '42161' },
		{ name: 'Gnosis', value: '100' },
		{ name: 'Avalanche', value: '43114' },
		{ name: 'Fantom', value: '250' },
		{ name: 'Klaytn', value: '8217' },
		{ name: 'Aurora', value: '1313161554' },
	],
	default: '56',
	description: 'Destination blockchain network ID',
},
{
	displayName: 'From Address',
	name: 'from',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap'],
		},
	},
	default: '',
	description: 'Address of the wallet initiating the swap',
},
{
	displayName: 'Slippage',
	name: 'slippage',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap'],
		},
	},
	default: 1,
	typeOptions: {
		minValue: 0,
		maxValue: 50,
	},
	description: 'Slippage tolerance percentage (0-50)',
},
{
	displayName: 'Enable Estimate',
	name: 'enableEstimate',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainQuote', 'buildCrossChainSwap'],
		},
	},
	default: false,
	description: 'Whether to enable gas estimation',
},
{
	displayName: 'Source Transaction Hash',
	name: 'srcTxHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['crossChain'],
			operation: ['getCrossChainStatus'],
		},
	},
	default: '',
	description: 'Hash of the source chain transaction',
},
{
	displayName: 'Wallet Address',
	name: 'walletAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['history'],
			operation: ['getTransactionHistory', 'getInterventions'],
		},
	},
	default: '',
	description: 'The wallet address to get history for',
},
{
	displayName: 'Chain ID',
	name: 'chainId',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['history'],
			operation: ['getTransactionHistory', 'getInterventions'],
		},
	},
	options: [
		{ name: 'Ethereum', value: '1' },
		{ name: 'BSC', value: '56' },
		{ name: 'Polygon', value: '137' },
		{ name: 'Optimism', value: '10' },
		{ name: 'Arbitrum', value: '42161' },
		{ name: 'Gnosis', value: '100' },
		{ name: 'Avalanche', value: '43114' },
		{ name: 'Fantom', value: '250' },
		{ name: 'Klaytn', value: '8217' },
		{ name: 'Aurora', value: '1313161554' },
	],
	default: '1',
	description: 'The chain ID for the network',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['history'],
			operation: ['getTransactionHistory', 'getInterventions'],
		},
	},
	typeOptions: {
		minValue: 1,
		maxValue: 500,
	},
	default: 100,
	description: 'Number of results to return (1-500)',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['history'],
			operation: ['getTransactionHistory', 'getInterventions'],
		},
	},
	typeOptions: {
		minValue: 0,
	},
	default: 0,
	description: 'Number of results to skip for pagination',
},
{
	displayName: 'Time Range',
	name: 'timeRange',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['history'],
			operation: ['getTransactionHistory'],
		},
	},
	default: '',
	placeholder: '2023-01-01,2023-12-31',
	description: 'Time range filter in format: start_date,end_date (YYYY-MM-DD)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'swap':
        return [await executeSwapOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'portfolio':
        return [await executePortfolioOperations.call(this, items)];
      case 'limitOrder':
        return [await executeLimitOrderOperations.call(this, items)];
      case 'fusionOrder':
        return [await executeFusionOrderOperations.call(this, items)];
      case 'crossChain':
        return [await executeCrossChainOperations.call(this, items)];
      case 'history':
        return [await executeHistoryOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeSwapOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('1inchnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getQuote': {
          const chainId = this.getNodeParameter('chainId', i) as string;
          const src = this.getNodeParameter('src', i) as string;
          const dst = this.getNodeParameter('dst', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const protocols = this.getNodeParameter('protocols', i, '') as string;
          const fee = this.getNodeParameter('fee', i, 0) as number;
          const gasPrice = this.getNodeParameter('gasPrice', i, '') as string;
          const complexityLevel = this.getNodeParameter('complexityLevel', i, '2') as string;
          const parts = this.getNodeParameter('parts', i, 10) as number;
          const mainRouteParts = this.getNodeParameter('mainRouteParts', i, 10) as number;
          const gasLimit = this.getNodeParameter('gasLimit', i, '') as string;
          const includeTokensInfo = this.getNodeParameter('includeTokensInfo', i, false) as boolean;
          const includeProtocols = this.getNodeParameter('includeProtocols', i, false) as boolean;
          const includeGas = this.getNodeParameter('includeGas', i, false) as boolean;
          const connectorTokens = this.getNodeParameter('connectorTokens', i, '') as string;

          const queryParams = new URLSearchParams({
            src,
            dst,
            amount,
            ...(protocols && { protocols }),
            ...(fee > 0 && { fee: fee.toString() }),
            ...(gasPrice && { gasPrice }),
            complexityLevel,
            parts: parts.toString(),
            mainRouteParts: mainRouteParts.toString(),
            ...(gasLimit && { gasLimit }),
            ...(includeTokensInfo && { includeTokensInfo: 'true' }),
            ...(includeProtocols && { includeProtocols: 'true' }),
            ...(includeGas && { includeGas: 'true' }),
            ...(connectorTokens && { connectorTokens }),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/quote?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'buildSwap': {
          const chainId = this.getNodeParameter('chainId', i) as string;
          const src = this.getNodeParameter('src', i) as string;
          const dst = this.getNodeParameter('dst', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const slippage = this.getNodeParameter('slippage', i) as number;
          const protocols = this.getNodeParameter('protocols', i, '') as string;
          const fee = this.getNodeParameter('fee', i, 0) as number;
          const gasPrice = this.getNodeParameter('gasPrice', i, '') as string;
          const complexityLevel = this.getNodeParameter('complexityLevel', i, '2') as string;
          const parts = this.getNodeParameter('parts', i, 10) as number;
          const mainRouteParts = this.getNodeParameter('mainRouteParts', i, 10) as number;
          const gasLimit = this.getNodeParameter('gasLimit', i, '') as string;
          const includeTokensInfo = this.getNodeParameter('includeTokensInfo', i, false) as boolean;
          const includeProtocols = this.getNodeParameter('includeProtocols', i, false) as boolean;
          const includeGas = this.getNodeParameter('includeGas', i, false) as boolean;
          const connectorTokens = this.getNodeParameter('connectorTokens', i, '') as string;
          const allowPartialFill = this.getNodeParameter('allowPartialFill', i, false) as boolean;
          const disableEstimate = this.getNodeParameter('disableEstimate', i, false) as boolean;
          const usePatching = this.getNodeParameter('usePatching', i, false) as boolean;

          const queryParams = new URLSearchParams({
            src,
            dst,
            amount,
            from,
            slippage: slippage.toString(),
            ...(protocols && { protocols }),
            ...(fee > 0 && { fee: fee.toString() }),
            ...(gasPrice && { gasPrice }),
            complexityLevel,
            parts: parts.toString(),
            mainRouteParts: mainRouteParts.toString(),
            ...(gasLimit && { gasLimit }),
            ...(includeTokensInfo && { includeTokensInfo: 'true' }),
            ...(includeProtocols && { includeProtocols: 'true' }),
            ...(includeGas && { includeGas: 'true' }),
            ...(connectorTokens && { connectorTokens }),
            ...(allowPartialFill && { allowPartialFill: 'true' }),
            ...(disableEstimate && { disableEstimate: 'true' }),
            ...(usePatching && { usePatching: 'true' }),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/swap?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTokenOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('1inchnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const chainId = this.getNodeParameter('chainId', i) as string;

      switch (operation) {
        case 'getAllTokens': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/tokens`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'searchTokens': {
          const query = this.getNodeParameter('query', i) as string;
          const ignoreListed = this.getNodeParameter('ignoreListed', i) as boolean;
          const onlyPositiveRating = this.getNodeParameter('onlyPositiveRating', i) as boolean;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams = new URLSearchParams({
            query: query,
            ignore_listed: ignoreListed.toString(),
            only_positive_rating: onlyPositiveRating.toString(),
            limit: limit.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/token/v1.2/${chainId}/search?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCustomTokens': {
          const addressesStr = this.getNodeParameter('addresses', i) as string;
          const addresses = addressesStr.split(',').map(addr => addr.trim()).join(',');

          const queryParams = new URLSearchParams({
            addresses: addresses,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/token/v1.2/${chainId}/custom?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePortfolioOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('1inchnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getPortfolioDetails': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as number;
          const timeRange = this.getNodeParameter('timeRange', i) as string;

          const queryParams = new URLSearchParams({
            addresses,
            chain_id: chainId.toString(),
            timeRange,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/portfolio/portfolio/v4/overview/erc20/details?${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearer_token}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalance': {
          const chainId = this.getNodeParameter('chainId', i) as number;
          const walletAddress = this.getNodeParameter('walletAddress', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/balance/v1.2/${chainId}/${walletAddress}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearer_token}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalances': {
          const chainId = this.getNodeParameter('chainId', i) as number;
          const walletAddresses = this.getNodeParameter('walletAddresses', i) as string;

          let parsedAddresses: string[];
          try {
            parsedAddresses = JSON.parse(walletAddresses);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON format for wallet addresses: ${walletAddresses}`);
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/balance/v1.2/${chainId}/balances`,
            headers: {
              'Authorization': `Bearer ${credentials.bearer_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addresses: parsedAddresses }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeLimitOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('1inchnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const chainId = this.getNodeParameter('chainId', i) as string;

      switch (operation) {
        case 'getAllOrders': {
          const page = this.getNodeParameter('page', i, 1) as number;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const statuses = this.getNodeParameter('statuses', i, '') as string;
          const makerAsset = this.getNodeParameter('makerAsset', i, '') as string;
          const takerAsset = this.getNodeParameter('takerAsset', i, '') as string;
          const maker = this.getNodeParameter('maker', i, '') as string;
          const taker = this.getNodeParameter('taker', i, '') as string;
          const sortBy = this.getNodeParameter('sortBy', i, 'createdAt') as string;

          const queryParams = new URLSearchParams();
          queryParams.append('page', page.toString());
          queryParams.append('limit', limit.toString());
          if (statuses) queryParams.append('statuses', statuses);
          if (makerAsset) queryParams.append('makerAsset', makerAsset);
          if (takerAsset) queryParams.append('takerAsset', takerAsset);
          if (maker) queryParams.append('maker', maker);
          if (taker) queryParams.append('taker', taker);
          queryParams.append('sortBy', sortBy);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/orders?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrder': {
          const orderData = this.getNodeParameter('orderData', i) as object;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/order`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: orderData,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/orders/${orderHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/orders/${orderHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrdersCount': {
          const statuses = this.getNodeParameter('statuses', i, '') as string;
          const makerAsset = this.getNodeParameter('makerAsset', i, '') as string;
          const takerAsset = this.getNodeParameter('takerAsset', i, '') as string;
          const maker = this.getNodeParameter('maker', i, '') as string;
          const taker = this.getNodeParameter('taker', i, '') as string;

          const queryParams = new URLSearchParams();
          if (statuses) queryParams.append('statuses', statuses);
          if (makerAsset) queryParams.append('makerAsset', makerAsset);
          if (takerAsset) queryParams.append('takerAsset', takerAsset);
          if (maker) queryParams.append('maker', maker);
          if (taker) queryParams.append('taker', taker);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/orders/count?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFusionOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('1inchnetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const chainId = this.getNodeParameter('chainId', i) as string;

      switch (operation) {
        case 'getFusionOrders': {
          const page = this.getNodeParameter('page', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const address = this.getNodeParameter('address', i) as string;
          const sortBy = this.getNodeParameter('sortBy', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('page', page.toString());
          queryParams.append('limit', limit.toString());
          if (address) queryParams.append('address', address);
          queryParams.append('sortBy', sortBy);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fusion/orders/v1.0/${chainId}?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createFusionOrder': {
          const orderData = this.getNodeParameter('orderData', i) as object;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/fusion/orders/v1.0/${chainId}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            body: orderData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFusionOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fusion/orders/v1.0/${chainId}/${orderHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelFusionOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/fusion/orders/v1.0/${chainId}/${orderHash}/cancel`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFusionQuote': {
          const srcTokenAddress = this.getNodeParameter('srcTokenAddress', i) as string;
          const dstTokenAddress = this.getNodeParameter('dstTokenAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const walletAddress = this.getNodeParameter('walletAddress', i) as string;
          const enableEstimate = this.getNodeParameter('enableEstimate', i) as boolean;
          const preset = this.getNodeParameter('preset', i) as string;
          const fee = this.getNodeParameter('fee', i) as string;
          const permit = this.getNodeParameter('permit', i) as string;
          const isLedgerLive = this.getNodeParameter('isLedgerLive', i) as boolean;

          const queryParams = new URLSearchParams();
          queryParams.append('srcTokenAddress', srcTokenAddress);
          queryParams.append('dstTokenAddress', dstTokenAddress);
          queryParams.append('amount', amount);
          queryParams.append('walletAddress', walletAddress);
          queryParams.append('enableEstimate', enableEstimate.toString());
          queryParams.append('preset', preset);
          if (fee) queryParams.append('fee', fee);
          if (permit) queryParams.append('permit', permit);
          queryParams.append('isLedgerLive', isLedgerLive.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fusion/quoter/v1.0/${chainId}/quote?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCrossChainOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('1inchnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getCrossChainQuote': {
					const src = this.getNodeParameter('src', i) as string;
					const dst = this.getNodeParameter('dst', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const srcChainId = this.getNodeParameter('srcChainId', i) as string;
					const dstChainId = this.getNodeParameter('dstChainId', i) as string;
					const from = this.getNodeParameter('from', i) as string;
					const slippage = this.getNodeParameter('slippage', i) as number;
					const enableEstimate = this.getNodeParameter('enableEstimate', i) as boolean;

					const queryParams = new URLSearchParams({
						src,
						dst,
						amount,
						srcChainId,
						dstChainId,
						from,
						slippage: slippage.toString(),
						enableEstimate: enableEstimate.toString(),
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/swap/v6.0/1/cross-chain/quote?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'buildCrossChainSwap': {
					const src = this.getNodeParameter('src', i) as string;
					const dst = this.getNodeParameter('dst', i) as string;
					const amount = this.getNodeParameter('amount', i) as string;
					const srcChainId = this.getNodeParameter('srcChainId', i) as string;
					const dstChainId = this.getNodeParameter('dstChainId', i) as string;
					const from = this.getNodeParameter('from', i) as string;
					const slippage = this.getNodeParameter('slippage', i) as number;
					const enableEstimate = this.getNodeParameter('enableEstimate', i) as boolean;

					const queryParams = new URLSearchParams({
						src,
						dst,
						amount,
						srcChainId,
						dstChainId,
						from,
						slippage: slippage.toString(),
						enableEstimate: enableEstimate.toString(),
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/swap/v6.0/1/cross-chain/swap?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCrossChainStatus': {
					const srcTxHash = this.getNodeParameter('srcTxHash', i) as string;
					const srcChainId = this.getNodeParameter('srcChainId', i) as string;
					const dstChainId = this.getNodeParameter('dstChainId', i) as string;

					const queryParams = new URLSearchParams({
						srcTxHash,
						srcChainId,
						dstChainId,
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/swap/v6.0/1/cross-chain/status?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeHistoryOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('1inchnetworkApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const walletAddress = this.getNodeParameter('walletAddress', i) as string;
			const chainId = this.getNodeParameter('chainId', i) as string;

			switch (operation) {
				case 'getTransactionHistory': {
					const limit = this.getNodeParameter('limit', i, 100) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const timeRange = this.getNodeParameter('timeRange', i, '') as string;

					const queryParams = new URLSearchParams({
						chainId,
						limit: limit.toString(),
						offset: offset.toString(),
					});

					if (timeRange) {
						queryParams.append('timeRange', timeRange);
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/history/v2.0/history/${walletAddress}/events?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInterventions': {
					const limit = this.getNodeParameter('limit', i, 100) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;

					const queryParams = new URLSearchParams({
						chainId,
						limit: limit.toString(),
						offset: offset.toString(),
					});

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/history/v2.0/history/${walletAddress}/interventions?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
