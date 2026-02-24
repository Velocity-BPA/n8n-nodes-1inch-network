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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
        baseUrl: 'https://api.1inch.dev',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getQuote operation', () => {
    it('should successfully get a swap quote', async () => {
      const mockQuoteResponse = {
        toAmount: '1000000000000000000',
        protocols: [['UNISWAP_V3']],
        gas: 150000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getQuote';
          case 'chainId': return '1';
          case 'src': return '0xA0b86a33E6441E55DEB25fE58b6B4E79aFDDA2fc';
          case 'dst': return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
          case 'amount': return '1000000000000000000';
          case 'protocols': return 'UNISWAP_V3';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const items = [{ json: {} }];
      const result = await executeSwapOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuoteResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/swap/v6.0/1/quote'),
        headers: {
          'Authorization': 'Bearer test-api-key',
          'accept': 'application/json',
        },
        json: true,
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getQuote';
          case 'chainId': return '1';
          case 'src': return '0xA0b86a33E6441E55DEB25fE58b6B4E79aFDDA2fc';
          case 'dst': return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
          case 'amount': return '1000000000000000000';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(
        executeSwapOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow();
    });
  });

  describe('getSwap operation', () => {
    it('should successfully get swap transaction data', async () => {
      const mockSwapResponse = {
        tx: {
          to: '0x111111125421cA6dc452d289314280a0f8842A65',
          data: '0x...',
          value: '0',
          gas: 150000,
          gasPrice: '20000000000',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getSwap';
          case 'chainId': return '1';
          case 'src': return '0xA0b86a33E6441E55DEB25fE58b6B4E79aFDDA2fc';
          case 'dst': return '0xdAC17F958D2ee523a2206206994597C13D831ec7';
          case 'amount': return '1000000000000000000';
          case 'from': return '0x742d35Cc6634C0532925a3b8D1ad1e2d6FA3e3Aa';
          case 'slippage': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSwapResponse);

      const items = [{ json: {} }];
      const result = await executeSwapOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockSwapResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/swap/v6.0/1/swap'),
        headers: {
          'Authorization': 'Bearer test-api-key',
          'accept': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getTokens operation', () => {
    it('should successfully get supported tokens', async () => {
      const mockTokensResponse = {
        tokens: {
          '0xA0b86a33E6441E55DEB25fE58b6B4E79aFDDA2fc': {
            symbol: 'CRV',
            name: 'Curve DAO Token',
            decimals: 18,
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getTokens';
          case 'chainId': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTokensResponse);

      const items = [{ json: {} }];
      const result = await executeSwapOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockTokensResponse);
    });
  });

  describe('getProtocols operation', () => {
    it('should successfully get available protocols', async () => {
      const mockProtocolsResponse = {
        protocols: [
          {
            name: 'UNISWAP_V3',
            part: 1,
            img: 'uniswap.png',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getProtocols';
          case 'chainId': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProtocolsResponse);

      const items = [{ json: {} }];
      const result = await executeSwapOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockProtocolsResponse);
    });
  });

  describe('getPresets operation', () => {
    it('should successfully get routing presets', async () => {
      const mockPresetsResponse = {
        presets: {
          fast: { gas: 'high', complexity: 'low' },
          balanced: { gas: 'medium', complexity: 'medium' },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getPresets';
          case 'chainId': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPresetsResponse);

      const items = [{ json: {} }];
      const result = await executeSwapOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockPresetsResponse);
    });
  });
});

describe('LimitOrder Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createOrder operation', () => {
    it('should create a new limit order successfully', async () => {
      const mockResponse = {
        orderHash: '0x123456789abcdef',
        status: 'created',
        order: {
          makerAsset: '0xA0b86a33E6422C057fE34b79b70F89fa8a2B6b2b',
          takerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          maker: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          receiver: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          makingAmount: '1000000000000000000',
          takingAmount: '3000000000',
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'createOrder',
          chainId: '1',
          makerAsset: '0xA0b86a33E6422C057fE34b79b70F89fa8a2B6b2b',
          takerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          maker: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          receiver: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          makingAmount: '1000000000000000000',
          takingAmount: '3000000000',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.1inch.dev/orderbook/v4.0/1/order',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          makerAsset: '0xA0b86a33E6422C057fE34b79b70F89fa8a2B6b2b',
          takerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          maker: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          receiver: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          makingAmount: '1000000000000000000',
          takingAmount: '3000000000',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrder operation', () => {
    it('should get order details successfully', async () => {
      const mockResponse = {
        orderHash: '0x123456789abcdef',
        status: 'fillable',
        order: {
          makerAsset: '0xA0b86a33E6422C057fE34b79b70F89fa8a2B6b2b',
          takerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          makingAmount: '1000000000000000000',
          takingAmount: '3000000000',
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getOrder',
          chainId: '1',
          orderHash: '0x123456789abcdef',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/orderbook/v4.0/1/order/0x123456789abcdef',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrders operation', () => {
    it('should get orders by maker address successfully', async () => {
      const mockResponse = {
        orders: [
          {
            orderHash: '0x123456789abcdef',
            status: 'fillable',
            order: {
              maker: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
              makerAsset: '0xA0b86a33E6422C057fE34b79b70F89fa8a2B6b2b',
              takerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            }
          }
        ],
        meta: {
          totalCount: 1
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getOrders',
          chainId: '1',
          maker: '0x742d35Cc6aF8B5Dbb4C2C4b4f8b2a9e8a1F1F1F1',
          limit: 100,
          offset: 0,
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/orderbook/v4.0/1/orders?'),
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('cancelOrder operation', () => {
    it('should cancel order successfully', async () => {
      const mockResponse = {
        success: true,
        orderHash: '0x123456789abcdef',
        status: 'cancelled'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'cancelOrder',
          chainId: '1',
          orderHash: '0x123456789abcdef',
          signature: '0xabcdef123456789',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: expect.stringContaining('/orderbook/v4.0/1/order/0x123456789abcdef?signature=0xabcdef123456789'),
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrderBook operation', () => {
    it('should get order book successfully', async () => {
      const mockResponse = {
        asks: [
          {
            orderHash: '0x123456789abcdef',
            makingAmount: '1000000000000000000',
            takingAmount: '3000000000',
            price: '0.0003'
          }
        ],
        bids: [
          {
            orderHash: '0xfedcba987654321',
            makingAmount: '2000000000',
            takingAmount: '666666666666666666',
            price: '0.0003'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getOrderBook',
          chainId: '1',
          makerAsset: '0xA0b86a33E6422C057fE34b79b70F89fa8a2B6b2b',
          takerAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/orderbook/v4.0/1/orders/book?'),
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getOrder',
          chainId: '1',
          orderHash: '0x123456789abcdef',
        };
        return params[paramName];
      });

      const apiError = new Error('Order not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(
        executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Order not found');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getOrder',
          chainId: '1',
          orderHash: '0x123456789abcdef',
        };
        return params[paramName];
      });

      const apiError = new Error('Order not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const result = await executeLimitOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Order not found' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('FusionOrder Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should create fusion order successfully', async () => {
    const mockResponse = {
      orderHash: '0x123abc',
      status: 'pending',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createFusionOrder',
        chainId: '1',
        fromTokenAddress: '0xA0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        toTokenAddress: '0xB0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        amount: '1000000000000000000',
        walletAddress: '0xC0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeFusionOrderOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.1inch.dev/swap/v6.0/1/fusion/orders',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        fromTokenAddress: '0xA0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        toTokenAddress: '0xB0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        amount: '1000000000000000000',
        walletAddress: '0xC0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
      },
      json: true,
    });
  });

  test('should get fusion order successfully', async () => {
    const mockResponse = {
      orderHash: '0x123abc',
      status: 'completed',
      fromToken: '0xA0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
      toToken: '0xB0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getFusionOrder',
        chainId: '1',
        orderHash: '0x123abc',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeFusionOrderOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.1inch.dev/swap/v6.0/1/fusion/orders/0x123abc',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get fusion orders by wallet successfully', async () => {
    const mockResponse = {
      orders: [
        { orderHash: '0x123abc', status: 'pending' },
        { orderHash: '0x456def', status: 'completed' },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getFusionOrders',
        chainId: '1',
        address: '0xC0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        limit: 50,
        offset: 0,
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeFusionOrderOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.1inch.dev/swap/v6.0/1/fusion/orders?address=0xC0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8&limit=50&offset=0',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should cancel fusion order successfully', async () => {
    const mockResponse = {
      success: true,
      orderHash: '0x123abc',
      status: 'cancelled',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'cancelFusionOrder',
        chainId: '1',
        orderHash: '0x123abc',
        signature: '0xsignature123',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeFusionOrderOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.1inch.dev/swap/v6.0/1/fusion/orders/0x123abc',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        signature: '0xsignature123',
      },
      json: true,
    });
  });

  test('should get fusion quote successfully', async () => {
    const mockResponse = {
      fromToken: '0xA0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
      toToken: '0xB0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
      fromTokenAmount: '1000000000000000000',
      toTokenAmount: '2000000000000000000',
      estimatedGas: '150000',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getFusionQuote',
        chainId: '1',
        fromTokenAddress: '0xA0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        toTokenAddress: '0xB0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8',
        amount: '1000000000000000000',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeFusionOrderOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.1inch.dev/swap/v6.0/1/fusion/quoter/v1.0/quote?fromTokenAddress=0xA0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8&toTokenAddress=0xB0b86a33E6441dF66c6A2E4a9b8F3e66e1A3c3a8&amount=1000000000000000000',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getFusionOrder',
        chainId: '1',
        orderHash: '0xinvalid',
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Order not found')
    );
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeFusionOrderOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Order not found');
  });
});

describe('Portfolio Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getPortfolioOverview', () => {
    it('should get portfolio overview successfully', async () => {
      const mockResponse = {
        result: [
          {
            protocolId: 'wallet',
            balances: [
              {
                tokenAddress: '0xa0b86a33e6c23031c32b5c3f8f73fdd7c8f3dbb9',
                balance: '1000000000000000000',
                balanceUSD: 1500.5,
              },
            ],
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getPortfolioOverview';
        if (param === 'addresses') return '0x1234567890123456789012345678901234567890';
        if (param === 'chainId') return 1;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePortfolioOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          addresses: '0x1234567890123456789012345678901234567890',
          chainId: 1,
        },
        json: true,
      });
    });

    it('should handle errors for getPortfolioOverview', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getPortfolioOverview';
        if (param === 'addresses') return '0x1234567890123456789012345678901234567890';
        if (param === 'chainId') return 1;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executePortfolioOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getProtocolBalances', () => {
    it('should get protocol balances successfully', async () => {
      const mockResponse = {
        result: [
          {
            protocolId: 'uniswap_v3',
            balances: [
              {
                positionId: '123456',
                balanceUSD: 2500.75,
              },
            ],
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getProtocolBalances';
        if (param === 'addresses') return '0x1234567890123456789012345678901234567890';
        if (param === 'chainId') return 1;
        if (param === 'protocolNames') return 'uniswap_v3,aave_v2';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePortfolioOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/portfolio/portfolio/v4/overview/protocols/uniswap_v3,aave_v2',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          addresses: '0x1234567890123456789012345678901234567890',
          chainId: 1,
        },
        json: true,
      });
    });
  });

  describe('getValueChart', () => {
    it('should get value chart successfully', async () => {
      const mockResponse = {
        result: [
          {
            timestamp: 1640995200,
            value: 5000.25,
          },
          {
            timestamp: 1641081600,
            value: 5250.75,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getValueChart';
        if (param === 'addresses') return '0x1234567890123456789012345678901234567890';
        if (param === 'chainId') return 1;
        if (param === 'timerange') return '1week';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePortfolioOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/portfolio/portfolio/v4/general/value_chart',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          addresses: '0x1234567890123456789012345678901234567890',
          chainId: 1,
          timerange: '1week',
        },
        json: true,
      });
    });
  });

  describe('getCurrentValue', () => {
    it('should get current value successfully', async () => {
      const mockResponse = {
        result: [
          {
            address: '0x1234567890123456789012345678901234567890',
            currentValue: 7500.5,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getCurrentValue';
        if (param === 'addresses') return '0x1234567890123456789012345678901234567890';
        if (param === 'chainId') return 1;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePortfolioOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getTransactions', () => {
    it('should get transactions successfully', async () => {
      const mockResponse = {
        result: [
          {
            hash: '0xabcdef1234567890',
            timestamp: 1640995200,
            from: '0x1234567890123456789012345678901234567890',
            to: '0x0987654321098765432109876543210987654321',
            value: '1000000000000000000',
          },
        ],
        meta: {
          total: 1,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getTransactions';
        if (param === 'addresses') return '0x1234567890123456789012345678901234567890';
        if (param === 'chainId') return 1;
        if (param === 'limit') return 100;
        if (param === 'offset') return 0;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePortfolioOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/portfolio/portfolio/v4/transactions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          addresses: '0x1234567890123456789012345678901234567890',
          chainId: 1,
          limit: 100,
          offset: 0,
        },
        json: true,
      });
    });
  });
});

describe('CrossChain Resource', () => {
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
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getCrossChainQuote', () => {
    it('should get cross-chain quote successfully', async () => {
      const mockQuoteResponse = {
        fromToken: { address: '0xA0b86a33E6441d86', decimals: 18 },
        toToken: { address: '0x55d3', decimals: 18 },
        estimatedGas: '200000',
        protocols: [['UNISWAP_V3']],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCrossChainQuote';
          case 'fromChainId': return 1;
          case 'toChainId': return 56;
          case 'fromTokenAddress': return '0xA0b86a33E6441d86';
          case 'toTokenAddress': return '0x55d3';
          case 'amount': return '1000000000000000000';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockQuoteResponse);

      const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockQuoteResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/cross-chain/v1.0/quote',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          fromChainId: 1,
          toChainId: 56,
          fromTokenAddress: '0xA0b86a33E6441d86',
          toTokenAddress: '0x55d3',
          amount: '1000000000000000000',
        },
        json: true,
      });
    });

    it('should handle quote request errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCrossChainQuote';
          default: return 1;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('createCrossChainSwap', () => {
    it('should create cross-chain swap successfully', async () => {
      const mockSwapResponse = {
        tx: { to: '0x123', data: '0xabc', value: '0', gasLimit: '200000' },
        id: 'swap-123',
        status: 'pending',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createCrossChainSwap';
          case 'fromChainId': return 1;
          case 'toChainId': return 56;
          case 'fromTokenAddress': return '0xA0b86a33E6441d86';
          case 'toTokenAddress': return '0x55d3';
          case 'amount': return '1000000000000000000';
          case 'receiver': return '0x742d35Cc6639E93a78Adf3b9F9cf91';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSwapResponse);

      const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockSwapResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.1inch.dev/cross-chain/v1.0/swap',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          fromChainId: 1,
          toChainId: 56,
          fromTokenAddress: '0xA0b86a33E6441d86',
          toTokenAddress: '0x55d3',
          amount: '1000000000000000000',
          receiver: '0x742d35Cc6639E93a78Adf3b9F9cf91',
        },
        json: true,
      });
    });
  });

  describe('getCrossChainStatus', () => {
    it('should get cross-chain status successfully', async () => {
      const mockStatusResponse = {
        status: 'completed',
        txHash: '0x123abc',
        confirmations: 12,
        bridgeStatus: 'success',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCrossChainStatus';
          case 'txHash': return '0x123abc';
          case 'fromChainId': return 1;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockStatusResponse);

      const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockStatusResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/cross-chain/v1.0/status/0x123abc',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          fromChainId: 1,
        },
        json: true,
      });
    });
  });

  describe('getSupportedChains', () => {
    it('should get supported chains successfully', async () => {
      const mockChainsResponse = {
        chains: [
          { chainId: 1, name: 'Ethereum', nativeCurrency: 'ETH' },
          { chainId: 56, name: 'BNB Smart Chain', nativeCurrency: 'BNB' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getSupportedChains';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockChainsResponse);

      const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockChainsResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/cross-chain/v1.0/chains',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getCrossChainTokens', () => {
    it('should get cross-chain tokens successfully', async () => {
      const mockTokensResponse = {
        tokens: [
          { address: '0xA0b86a33', symbol: 'USDT', decimals: 6 },
          { address: '0x55d3', symbol: 'USDC', decimals: 6 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCrossChainTokens';
          case 'chainId': return 1;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTokensResponse);

      const result = await executeCrossChainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockTokensResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.1inch.dev/cross-chain/v1.0/tokens',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          chainId: 1,
        },
        json: true,
      });
    });
  });
});
});
