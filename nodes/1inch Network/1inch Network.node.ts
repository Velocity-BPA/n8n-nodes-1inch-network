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
      // Resource selector
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
            name: 'LimitOrder',
            value: 'limitOrder',
          },
          {
            name: 'FusionOrder',
            value: 'fusionOrder',
          },
          {
            name: 'Portfolio',
            value: 'portfolio',
          },
          {
            name: 'CrossChain',
            value: 'crossChain',
          }
        ],
        default: 'swap',
      },
      // Operation dropdowns per resource
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
      description: 'Get swap quote without fees',
      action: 'Get swap quote',
    },
    {
      name: 'Get Swap',
      value: 'getSwap',
      description: 'Get swap transaction data',
      action: 'Get swap transaction data',
    },
    {
      name: 'Get Tokens',
      value: 'getTokens',
      description: 'Get supported tokens for chain',
      action: 'Get supported tokens',
    },
    {
      name: 'Get Protocols',
      value: 'getProtocols',
      description: 'Get available DEX protocols',
      action: 'Get available DEX protocols',
    },
    {
      name: 'Get Presets',
      value: 'getPresets',
      description: 'Get routing presets',
      action: 'Get routing presets',
    },
  ],
  default: 'getQuote',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
    },
  },
  options: [
    {
      name: 'Create Order',
      value: 'createOrder',
      description: 'Create a new limit order',
      action: 'Create limit order',
    },
    {
      name: 'Get Order',
      value: 'getOrder',
      description: 'Get order details by hash',
      action: 'Get order details',
    },
    {
      name: 'Get Orders',
      value: 'getOrders',
      description: 'Get orders by maker address',
      action: 'Get orders by maker',
    },
    {
      name: 'Cancel Order',
      value: 'cancelOrder',
      description: 'Cancel an existing order',
      action: 'Cancel order',
    },
    {
      name: 'Get Order Book',
      value: 'getOrderBook',
      description: 'Get order book for trading pair',
      action: 'Get order book',
    },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
    },
  },
  options: [
    {
      name: 'Create Fusion Order',
      value: 'createFusionOrder',
      description: 'Create a gasless fusion order',
      action: 'Create fusion order',
    },
    {
      name: 'Get Fusion Order',
      value: 'getFusionOrder',
      description: 'Get fusion order status by hash',
      action: 'Get fusion order',
    },
    {
      name: 'Get Fusion Orders',
      value: 'getFusionOrders',
      description: 'Get fusion orders by wallet address',
      action: 'Get fusion orders',
    },
    {
      name: 'Cancel Fusion Order',
      value: 'cancelFusionOrder',
      description: 'Cancel a fusion order',
      action: 'Cancel fusion order',
    },
    {
      name: 'Get Fusion Quote',
      value: 'getFusionQuote',
      description: 'Get fusion swap quote',
      action: 'Get fusion quote',
    },
  ],
  default: 'createFusionOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['portfolio'],
    },
  },
  options: [
    {
      name: 'Get Portfolio Overview',
      value: 'getPortfolioOverview',
      description: 'Get wallet token portfolio',
      action: 'Get portfolio overview',
    },
    {
      name: 'Get Protocol Balances',
      value: 'getProtocolBalances',
      description: 'Get protocol-specific balances',
      action: 'Get protocol balances',
    },
    {
      name: 'Get Value Chart',
      value: 'getValueChart',
      description: 'Get portfolio value over time',
      action: 'Get value chart',
    },
    {
      name: 'Get Current Value',
      value: 'getCurrentValue',
      description: 'Get current portfolio value',
      action: 'Get current value',
    },
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get transaction history',
      action: 'Get transactions',
    },
  ],
  default: 'getPortfolioOverview',
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
      description: 'Get cross-chain swap quote between different chains',
      action: 'Get cross-chain quote',
    },
    {
      name: 'Create Cross-Chain Swap',
      value: 'createCrossChainSwap',
      description: 'Execute cross-chain swap transaction',
      action: 'Create cross-chain swap',
    },
    {
      name: 'Get Cross-Chain Status',
      value: 'getCrossChainStatus',
      description: 'Get cross-chain transaction status by hash',
      action: 'Get cross-chain status',
    },
    {
      name: 'Get Supported Chains',
      value: 'getSupportedChains',
      description: 'Get list of supported chains for cross-chain operations',
      action: 'Get supported chains',
    },
    {
      name: 'Get Cross-Chain Tokens',
      value: 'getCrossChainTokens',
      description: 'Get supported tokens for a specific chain',
      action: 'Get cross-chain tokens',
    },
  ],
  default: 'getCrossChainQuote',
},
      // Parameter definitions
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'getSwap', 'getTokens', 'getProtocols', 'getPresets'],
    },
  },
  default: '1',
  description: 'The blockchain chain ID (e.g., 1 for Ethereum mainnet, 56 for BSC)',
},
{
  displayName: 'Source Token',
  name: 'src',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'getSwap'],
    },
  },
  default: '',
  description: 'Source token address (checksummed Ethereum address)',
},
{
  displayName: 'Destination Token',
  name: 'dst',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'getSwap'],
    },
  },
  default: '',
  description: 'Destination token address (checksummed Ethereum address)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote', 'getSwap'],
    },
  },
  default: '',
  description: 'Amount of source token to swap (in token units)',
},
{
  displayName: 'Protocols',
  name: 'protocols',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getQuote'],
    },
  },
  default: '',
  description: 'Comma-separated list of protocols to use for routing (optional)',
},
{
  displayName: 'From Address',
  name: 'from',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getSwap'],
    },
  },
  default: '',
  description: 'Wallet address that will perform the swap (checksummed Ethereum address)',
},
{
  displayName: 'Slippage',
  name: 'slippage',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['swap'],
      operation: ['getSwap'],
    },
  },
  default: '1',
  description: 'Maximum acceptable slippage percentage (e.g., 1 for 1%)',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
    },
  },
  options: [
    { name: 'Ethereum', value: '1' },
    { name: 'Binance Smart Chain', value: '56' },
    { name: 'Polygon', value: '137' },
    { name: 'Arbitrum', value: '42161' },
    { name: 'Optimism', value: '10' },
    { name: 'Avalanche', value: '43114' },
  ],
  default: '1',
  description: 'The blockchain network chain ID',
},
{
  displayName: 'Maker Asset',
  name: 'makerAsset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder', 'getOrderBook'],
    },
  },
  default: '',
  description: 'Token address that the maker wants to sell (checksummed address)',
},
{
  displayName: 'Taker Asset',
  name: 'takerAsset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder', 'getOrderBook'],
    },
  },
  default: '',
  description: 'Token address that the maker wants to receive (checksummed address)',
},
{
  displayName: 'Maker Address',
  name: 'maker',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder', 'getOrders'],
    },
  },
  default: '',
  description: 'Address of the order maker (checksummed address)',
},
{
  displayName: 'Receiver Address',
  name: 'receiver',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'Address that will receive the taker asset (checksummed address)',
},
{
  displayName: 'Making Amount',
  name: 'makingAmount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'Amount of maker asset to sell (in wei)',
},
{
  displayName: 'Taking Amount',
  name: 'takingAmount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'Amount of taker asset to receive (in wei)',
},
{
  displayName: 'Order Hash',
  name: 'orderHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getOrder', 'cancelOrder'],
    },
  },
  default: '',
  description: 'Hash of the order to retrieve or cancel',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['cancelOrder'],
    },
  },
  default: '',
  description: 'Wallet signature for order cancellation verification',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getOrders'],
    },
  },
  default: 100,
  description: 'Maximum number of orders to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['limitOrder'],
      operation: ['getOrders'],
    },
  },
  default: 0,
  description: 'Number of orders to skip for pagination',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
    },
  },
  options: [
    {
      name: 'Ethereum',
      value: '1',
    },
    {
      name: 'Binance Smart Chain',
      value: '56',
    },
    {
      name: 'Polygon',
      value: '137',
    },
    {
      name: 'Arbitrum',
      value: '42161',
    },
    {
      name: 'Optimism',
      value: '10',
    },
  ],
  default: '1',
  description: 'The blockchain network to use',
},
{
  displayName: 'From Token Address',
  name: 'fromTokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['createFusionOrder', 'getFusionQuote'],
    },
  },
  default: '',
  description: 'The checksummed address of the token to swap from',
},
{
  displayName: 'To Token Address',
  name: 'toTokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['createFusionOrder', 'getFusionQuote'],
    },
  },
  default: '',
  description: 'The checksummed address of the token to swap to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['createFusionOrder', 'getFusionQuote'],
    },
  },
  default: '',
  description: 'The amount of tokens to swap (in wei)',
},
{
  displayName: 'Wallet Address',
  name: 'walletAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['createFusionOrder'],
    },
  },
  default: '',
  description: 'The checksummed wallet address to create the order for',
},
{
  displayName: 'Order Hash',
  name: 'orderHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['getFusionOrder', 'cancelFusionOrder'],
    },
  },
  default: '',
  description: 'The hash of the fusion order',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['getFusionOrders'],
    },
  },
  default: '',
  description: 'The checksummed wallet address to get orders for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['getFusionOrders'],
    },
  },
  default: 50,
  description: 'Maximum number of orders to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['getFusionOrders'],
    },
  },
  default: 0,
  description: 'Number of orders to skip',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fusionOrder'],
      operation: ['cancelFusionOrder'],
    },
  },
  default: '',
  description: 'The wallet signature for order cancellation',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['portfolio'],
      operation: ['getPortfolioOverview', 'getProtocolBalances', 'getValueChart', 'getCurrentValue', 'getTransactions'],
    },
  },
  default: '',
  description: 'Comma-separated list of wallet addresses (checksummed)',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['portfolio'],
      operation: ['getPortfolioOverview', 'getProtocolBalances', 'getValueChart', 'getCurrentValue', 'getTransactions'],
    },
  },
  default: 1,
  description: 'The blockchain network ID (1 for Ethereum, 56 for BSC, etc.)',
},
{
  displayName: 'Protocol Names',
  name: 'protocolNames',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['portfolio'],
      operation: ['getProtocolBalances'],
    },
  },
  default: '',
  description: 'Comma-separated list of protocol names',
},
{
  displayName: 'Time Range',
  name: 'timerange',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['portfolio'],
      operation: ['getValueChart'],
    },
  },
  options: [
    {
      name: '1 Day',
      value: '1day',
    },
    {
      name: '1 Week',
      value: '1week',
    },
    {
      name: '1 Month',
      value: '1month',
    },
    {
      name: '3 Months',
      value: '3months',
    },
    {
      name: '1 Year',
      value: '1year',
    },
  ],
  default: '1week',
  description: 'Time range for portfolio value chart',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['portfolio'],
      operation: ['getTransactions'],
    },
  },
  default: 100,
  description: 'Number of transactions to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['portfolio'],
      operation: ['getTransactions'],
    },
  },
  default: 0,
  description: 'Number of transactions to skip',
},
{
  displayName: 'From Chain ID',
  name: 'fromChainId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainQuote', 'createCrossChainSwap'],
    },
  },
  default: 1,
  description: 'Source blockchain chain ID (e.g., 1 for Ethereum, 56 for BSC)',
},
{
  displayName: 'To Chain ID',
  name: 'toChainId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainQuote', 'createCrossChainSwap'],
    },
  },
  default: 56,
  description: 'Destination blockchain chain ID',
},
{
  displayName: 'From Token Address',
  name: 'fromTokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainQuote', 'createCrossChainSwap'],
    },
  },
  default: '',
  description: 'Source token contract address (checksummed)',
},
{
  displayName: 'To Token Address',
  name: 'toTokenAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainQuote', 'createCrossChainSwap'],
    },
  },
  default: '',
  description: 'Destination token contract address (checksummed)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainQuote', 'createCrossChainSwap'],
    },
  },
  default: '',
  description: 'Amount to swap in wei or token units',
},
{
  displayName: 'Receiver',
  name: 'receiver',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['createCrossChainSwap'],
    },
  },
  default: '',
  description: 'Recipient address on destination chain (checksummed)',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainStatus'],
    },
  },
  default: '',
  description: 'Transaction hash to check status',
},
{
  displayName: 'From Chain ID',
  name: 'fromChainId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainStatus'],
    },
  },
  default: 1,
  description: 'Source chain ID for the transaction',
},
{
  displayName: 'Chain ID',
  name: 'chainId',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['crossChain'],
      operation: ['getCrossChainTokens'],
    },
  },
  default: 1,
  description: 'Chain ID to get supported tokens for',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'swap':
        return [await executeSwapOperations.call(this, items)];
      case 'limitOrder':
        return [await executeLimitOrderOperations.call(this, items)];
      case 'fusionOrder':
        return [await executeFusionOrderOperations.call(this, items)];
      case 'portfolio':
        return [await executePortfolioOperations.call(this, items)];
      case 'crossChain':
        return [await executeCrossChainOperations.call(this, items)];
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
      const chainId = this.getNodeParameter('chainId', i) as string;
      const baseUrl = 'https://api.1inch.dev';

      switch (operation) {
        case 'getQuote': {
          const src = this.getNodeParameter('src', i) as string;
          const dst = this.getNodeParameter('dst', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const protocols = this.getNodeParameter('protocols', i) as string;

          const queryParams = new URLSearchParams({
            src,
            dst,
            amount,
          });

          if (protocols) {
            queryParams.append('protocols', protocols);
          }

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/swap/v6.0/${chainId}/quote?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSwap': {
          const src = this.getNodeParameter('src', i) as string;
          const dst = this.getNodeParameter('dst', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const slippage = this.getNodeParameter('slippage', i) as string;

          const queryParams = new URLSearchParams({
            src,
            dst,
            amount,
            from,
            slippage,
          });

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/swap/v6.0/${chainId}/swap?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokens': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/swap/v6.0/${chainId}/tokens`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProtocols': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/swap/v6.0/${chainId}/protocols`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPresets': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/swap/v6.0/${chainId}/presets`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
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
        case 'createOrder': {
          const makerAsset = this.getNodeParameter('makerAsset', i) as string;
          const takerAsset = this.getNodeParameter('takerAsset', i) as string;
          const maker = this.getNodeParameter('maker', i) as string;
          const receiver = this.getNodeParameter('receiver', i) as string;
          const makingAmount = this.getNodeParameter('makingAmount', i) as string;
          const takingAmount = this.getNodeParameter('takingAmount', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/order`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              makerAsset,
              takerAsset,
              maker,
              receiver,
              makingAmount,
              takingAmount,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/order/${orderHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrders': {
          const maker = this.getNodeParameter('maker', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams({
            maker,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/orders?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;
          const signature = this.getNodeParameter('signature', i) as string;

          const queryParams = new URLSearchParams({
            signature,
          });

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/order/${orderHash}?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrderBook': {
          const makerAsset = this.getNodeParameter('makerAsset', i) as string;
          const takerAsset = this.getNodeParameter('takerAsset', i) as string;

          const queryParams = new URLSearchParams({
            makerAsset,
            takerAsset,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/orderbook/v4.0/${chainId}/orders/book?${queryParams.toString()}`,
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
        pairedItem: { item: i } 
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response && error.response.status) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
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
        case 'createFusionOrder': {
          const fromTokenAddress = this.getNodeParameter('fromTokenAddress', i) as string;
          const toTokenAddress = this.getNodeParameter('toTokenAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const walletAddress = this.getNodeParameter('walletAddress', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/fusion/orders`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              fromTokenAddress,
              toTokenAddress,
              amount,
              walletAddress,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFusionOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/fusion/orders/${orderHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFusionOrders': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams({
            address,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/fusion/orders?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelFusionOrder': {
          const orderHash = this.getNodeParameter('orderHash', i) as string;
          const signature = this.getNodeParameter('signature', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/fusion/orders/${orderHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              signature,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFusionQuote': {
          const fromTokenAddress = this.getNodeParameter('fromTokenAddress', i) as string;
          const toTokenAddress = this.getNodeParameter('toTokenAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const queryParams = new URLSearchParams({
            fromTokenAddress,
            toTokenAddress,
            amount,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/swap/v6.0/${chainId}/fusion/quoter/v1.0/quote?${queryParams.toString()}`,
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

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
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
        case 'getPortfolioOverview': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/portfolio/portfolio/v4/overview/erc20`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              addresses,
              chainId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProtocolBalances': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as number;
          const protocolNames = this.getNodeParameter('protocolNames', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/portfolio/portfolio/v4/overview/protocols/${protocolNames}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              addresses,
              chainId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getValueChart': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as number;
          const timerange = this.getNodeParameter('timerange', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/portfolio/portfolio/v4/general/value_chart`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              addresses,
              chainId,
              timerange,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCurrentValue': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/portfolio/portfolio/v4/general/current_value`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              addresses,
              chainId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactions': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chainId = this.getNodeParameter('chainId', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/portfolio/portfolio/v4/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              addresses,
              chainId,
              limit,
              offset,
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
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
          const fromChainId = this.getNodeParameter('fromChainId', i) as number;
          const toChainId = this.getNodeParameter('toChainId', i) as number;
          const fromTokenAddress = this.getNodeParameter('fromTokenAddress', i) as string;
          const toTokenAddress = this.getNodeParameter('toTokenAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/cross-chain/v1.0/quote`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              fromChainId: fromChainId,
              toChainId: toChainId,
              fromTokenAddress: fromTokenAddress,
              toTokenAddress: toTokenAddress,
              amount: amount,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCrossChainSwap': {
          const fromChainId = this.getNodeParameter('fromChainId', i) as number;
          const toChainId = this.getNodeParameter('toChainId', i) as number;
          const fromTokenAddress = this.getNodeParameter('fromTokenAddress', i) as string;
          const toTokenAddress = this.getNodeParameter('toTokenAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const receiver = this.getNodeParameter('receiver', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/cross-chain/v1.0/swap`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              fromChainId: fromChainId,
              toChainId: toChainId,
              fromTokenAddress: fromTokenAddress,
              toTokenAddress: toTokenAddress,
              amount: amount,
              receiver: receiver,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCrossChainStatus': {
          const txHash = this.getNodeParameter('txHash', i) as string;
          const fromChainId = this.getNodeParameter('fromChainId', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/cross-chain/v1.0/status/${txHash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              fromChainId: fromChainId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSupportedChains': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/cross-chain/v1.0/chains`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCrossChainTokens': {
          const chainId = this.getNodeParameter('chainId', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/cross-chain/v1.0/tokens`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              chainId: chainId,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}
