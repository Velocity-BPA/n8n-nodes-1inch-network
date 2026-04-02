/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { 1inchNetwork } from '../nodes/1inch Network/1inch Network.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('1inchNetwork Node', () => {
  let node: 1inchNetwork;

  beforeAll(() => {
    node = new 1inchNetwork();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('1inch Network');
      expect(node.description.name).toBe('1inchnetwork');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Swap Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.1inch.dev'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test 1inch Network Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getQuote operation', () => {
    it('should get token swap quote successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getQuote',
          chainId: '1',
          src: '0xA0b86a33E6411a3bbaeA62A94529A49FCE06CBf0',
          dst: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          amount: '1000000000000000000',
          protocols: '',
          fee: 0,
          gasPrice: '',
          complexityLevel: '2',
          parts: 10,
          mainRouteParts: 10,
          gasLimit: '',
          includeTokensInfo: false,
          includeProtocols: false,
          includeGas: false,
          connectorTokens: '',
        };
        return params[param];
      });

      const mockQuoteResponse = {
        toAmount: '2000000000000000000000',
        estimatedGas: 150000,
        protocols: [{ name: 'UNISWAP_V3', part: 100 }]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuoteResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/swap/v6.0/1/quote'),
          headers: { 'Authorization': 'Bearer test-api-key' },
        })
      );
    });

    it('should handle getQuote error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getQuote');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('buildSwap operation', () => {
    it('should build swap transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'buildSwap',
          chainId: '1',
          src: '0xA0b86a33E6411a3bbaeA62A94529A49FCE06CBf0',
          dst: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          amount: '1000000000000000000',
          from: '0x742d35Cc6634C0532925a3b8D54C4a3b1e9C7c31',
          slippage: 1,
          protocols: '',
          fee: 0,
          gasPrice: '',
          complexityLevel: '2',
          parts: 10,
          mainRouteParts: 10,
          gasLimit: '',
          includeTokensInfo: false,
          includeProtocols: false,
          includeGas: false,
          connectorTokens: '',
          allowPartialFill: false,
          disableEstimate: false,
          usePatching: false,
        };
        return params[param];
      });

      const mockSwapResponse = {
        toAmount: '2000000000000000000000',
        tx: {
          to: '0x1111111254eeb25477b68fb85ed929f73a960582',
          data: '0x...',
          value: '0',
          gas: 150000,
          gasPrice: '20000000000'
        }
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSwapResponse);

      const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockSwapResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/swap/v6.0/1/swap'),
          headers: { 'Authorization': 'Bearer test-api-key' },
        })
      );
    });

    it('should handle buildSwap error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('buildSwap');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insufficient liquidity'));

      const result = await executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Insufficient liquidity');
    });
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(executeSwapOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow(
      'Unknown operation: unknownOperation'
    );
  });
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.1inch.dev'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getAllTokens operation', () => {
    it('should get all tokens successfully', async () => {
      const mockTokens = { tokens: { '0x123': { symbol: 'TEST', name: 'Test Token' } } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllTokens')
        .mockReturnValueOnce('1');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTokens);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/swap/v6.0/1/tokens',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'accept': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockTokens, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getAllTokens', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllTokens')
        .mockReturnValueOnce('1');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('searchTokens operation', () => {
    it('should search tokens successfully', async () => {
      const mockSearchResult = [{ symbol: 'ETH', name: 'Ethereum' }];
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchTokens')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('ETH')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(10);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSearchResult);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/token/v1.2/1/search?query=ETH&ignore_listed=false&only_positive_rating=false&limit=10',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'accept': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockSearchResult, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in searchTokens', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchTokens')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('ETH')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(10);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Search Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Search Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCustomTokens operation', () => {
    it('should get custom tokens successfully', async () => {
      const mockCustomTokens = [{ address: '0x123', symbol: 'CUSTOM' }];
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCustomTokens')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('0x123,0x456');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCustomTokens);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/token/v1.2/1/custom?addresses=0x123%2C0x456',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'accept': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockCustomTokens, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getCustomTokens', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCustomTokens')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('0x123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Custom Token Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Custom Token Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Portfolio Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearer_token: 'test-token',
        baseUrl: 'https://api.1inch.dev'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getPortfolioDetails', () => {
    it('should get portfolio details successfully', async () => {
      const mockResponse = {
        result: [
          {
            address: '0x123...',
            chain_id: 1,
            balances: []
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPortfolioDetails')
        .mockReturnValueOnce('0x123...')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('1d');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePortfolioOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/portfolio/portfolio/v4/overview/erc20/details'),
        headers: {
          'Authorization': 'Bearer test-token',
        },
        json: true,
      });
    });

    it('should handle portfolio details error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPortfolioDetails')
        .mockReturnValueOnce('0x123...')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('1d');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePortfolioOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getBalance', () => {
    it('should get balance successfully', async () => {
      const mockResponse = {
        address: '0x123...',
        chain_id: 1,
        balances: []
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('0x123...');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePortfolioOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/balance/v1.2/1/0x123...',
        headers: {
          'Authorization': 'Bearer test-token',
        },
        json: true,
      });
    });
  });

  describe('getBalances', () => {
    it('should get balances successfully', async () => {
      const mockResponse = {
        result: []
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalances')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('["0x123...", "0x456..."]');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePortfolioOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.1inch.dev/balance/v1.2/1/balances',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresses: ['0x123...', '0x456...'] }),
        json: true,
      });
    });

    it('should handle invalid JSON in wallet addresses', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalances')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce('invalid-json');

      const items = [{ json: {} }];

      await expect(executePortfolioOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Invalid JSON format for wallet addresses');
    });
  });
});

describe('LimitOrder Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.1inch.dev' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all orders successfully', async () => {
    const mockResponse = { orders: [], total: 0 };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllOrders')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('createdAt');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/orderbook/v4.0/1/orders')
      })
    );
  });

  it('should create order successfully', async () => {
    const mockResponse = { success: true, orderHash: '0x123' };
    const orderData = { maker: '0x456', taker: '0x789' };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createOrder')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(orderData);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/orderbook/v4.0/1/order'),
        body: orderData
      })
    );
  });

  it('should get specific order successfully', async () => {
    const mockResponse = { order: { hash: '0x123' } };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrder')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('0x123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/orderbook/v4.0/1/orders/0x123')
      })
    );
  });

  it('should cancel order successfully', async () => {
    const mockResponse = { success: true };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelOrder')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('0x123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: expect.stringContaining('/orderbook/v4.0/1/orders/0x123')
      })
    );
  });

  it('should get orders count successfully', async () => {
    const mockResponse = { count: 42 };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrdersCount')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/orderbook/v4.0/1/orders/count')
      })
    );
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllOrders')
      .mockReturnValueOnce('1');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should handle errors with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllOrders')
      .mockReturnValueOnce('1');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ 
      json: { error: 'API Error' }, 
      pairedItem: { item: 0 } 
    }]);
  });
});

describe('FusionOrder Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-token',
        baseUrl: 'https://api.1inch.dev'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get fusion orders successfully', async () => {
    const mockResponse = { orders: [], totalCount: 0 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFusionOrders')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('createDateTime');

    const result = await executeFusionOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/fusion/orders/v1.0/1'),
      })
    );
  });

  it('should create fusion order successfully', async () => {
    const mockResponse = { orderHash: '0x123...', status: 'created' };
    const orderData = { srcToken: '0xabc...', dstToken: '0xdef...', amount: '1000' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createFusionOrder')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce(orderData);

    const result = await executeFusionOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/fusion/orders/v1.0/1'),
        body: orderData,
      })
    );
  });

  it('should get specific fusion order successfully', async () => {
    const mockResponse = { orderHash: '0x123...', status: 'active' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFusionOrder')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('0x123...');

    const result = await executeFusionOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/fusion/orders/v1.0/1/0x123...'),
      })
    );
  });

  it('should cancel fusion order successfully', async () => {
    const mockResponse = { orderHash: '0x123...', status: 'cancelled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelFusionOrder')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('0x123...');

    const result = await executeFusionOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/fusion/orders/v1.0/1/0x123.../cancel'),
      })
    );
  });

  it('should get fusion quote successfully', async () => {
    const mockResponse = { dstAmount: '950000', gas: '150000' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFusionQuote')
      .mockReturnValueOnce('1')
      .mockReturnValueOnce('0xabc...')
      .mockReturnValueOnce('0xdef...')
      .mockReturnValueOnce('1000000')
      .mockReturnValueOnce('0x123...')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('medium')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(false);

    const result = await executeFusionOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/fusion/quoter/v1.0/1/quote'),
      })
    );
  });

  it('should handle errors properly', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFusionOrders')
      .mockReturnValueOnce('1');

    const result = await executeFusionOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Cross-Chain Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.1inch.dev',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getCrossChainQuote', () => {
		it('should get cross-chain quote successfully', async () => {
			const mockResponse = {
				dstAmount: '1000000000000000000',
				srcAmount: '1000000',
				protocols: [],
				gas: 150000,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCrossChainQuote')
				.mockReturnValueOnce('0xA0b86a33E6441b8e47b11e6C8E6b0f56bE4ad1B9')
				.mockReturnValueOnce('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174')
				.mockReturnValueOnce('1000000')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('137')
				.mockReturnValueOnce('0x742d35Cc6638Cb8fE4fD4f9b4b8b1234567890ab')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('/cross-chain/quote'),
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when getting cross-chain quote fails', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getCrossChainQuote');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('buildCrossChainSwap', () => {
		it('should build cross-chain swap successfully', async () => {
			const mockResponse = {
				tx: {
					from: '0x742d35Cc6638Cb8fE4fD4f9b4b8b1234567890ab',
					to: '0x1111111254EEB25477B68fb85Ed929f73A960582',
					data: '0x...',
					value: '0',
					gas: 200000,
					gasPrice: '1000000000',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('buildCrossChainSwap')
				.mockReturnValueOnce('0xA0b86a33E6441b8e47b11e6C8E6b0f56bE4ad1B9')
				.mockReturnValueOnce('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174')
				.mockReturnValueOnce('1000000')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('137')
				.mockReturnValueOnce('0x742d35Cc6638Cb8fE4fD4f9b4b8b1234567890ab')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('/cross-chain/swap'),
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when building cross-chain swap fails', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('buildCrossChainSwap');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insufficient liquidity'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'Insufficient liquidity' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getCrossChainStatus', () => {
		it('should get cross-chain status successfully', async () => {
			const mockResponse = {
				status: 'SUCCESS',
				srcTxHash: '0xabc123...',
				dstTxHash: '0xdef456...',
				srcChainId: 1,
				dstChainId: 137,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCrossChainStatus')
				.mockReturnValueOnce('0xabc123...')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce('137');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('/cross-chain/status'),
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when getting cross-chain status fails', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getCrossChainStatus');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'Transaction not found' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('History Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-bearer-token',
				baseUrl: 'https://api.1inch.dev',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getTransactionHistory', () => {
		it('should get transaction history successfully', async () => {
			const mockResponse = {
				events: [
					{
						id: 'event123',
						type: 'swap',
						timestamp: 1640995200,
						txHash: '0x123...',
					},
				],
				total: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactionHistory')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D355A46B6b47A5AA')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('2023-01-01,2023-12-31');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeHistoryOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('/history/v2.0/history/0x742d35Cc6634C0532925a3b8D355A46B6b47A5AA/events'),
				headers: {
					'Authorization': 'Bearer test-bearer-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getTransactionHistory errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactionHistory')
				.mockReturnValueOnce('invalid-address')
				.mockReturnValueOnce('1');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address format'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeHistoryOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: { error: 'Invalid address format' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getInterventions', () => {
		it('should get interventions successfully', async () => {
			const mockResponse = {
				interventions: [
					{
						id: 'intervention123',
						type: 'protection',
						timestamp: 1640995200,
						details: 'Frontrun protection applied',
					},
				],
				total: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getInterventions')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D355A46B6b47A5AA')
				.mockReturnValueOnce('1')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeHistoryOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('/history/v2.0/history/0x742d35Cc6634C0532925a3b8D355A46B6b47A5AA/interventions'),
				headers: {
					'Authorization': 'Bearer test-bearer-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getInterventions errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getInterventions')
				.mockReturnValueOnce('0x742d35Cc6634C0532925a3b8D355A46B6b47A5AA')
				.mockReturnValueOnce('999');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Unsupported chain ID'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(false);

			const items = [{ json: {} }];

			await expect(
				executeHistoryOperations.call(mockExecuteFunctions, items)
			).rejects.toThrow('Unsupported chain ID');
		});
	});

	it('should handle unknown operations', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];

		await expect(
			executeHistoryOperations.call(mockExecuteFunctions, items)
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});
});
