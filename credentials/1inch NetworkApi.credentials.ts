import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class OneinchNetworkApi implements ICredentialType {
	name = '1inchNetworkApi';
	displayName = '1inch Network API';
	documentationUrl = 'https://docs.1inch.io/docs/aggregation-protocol/api/swagger';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description: 'API key obtained from the 1inch Developer Portal',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://api.1inch.dev',
			description: '1inch API base URL',
		},
	];

	authenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	} as const;
}