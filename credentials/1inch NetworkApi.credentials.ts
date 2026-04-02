import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OneinchNetworkApi implements ICredentialType {
	name = '1inchNetworkApi';
	displayName = '1inch Network API';
	documentationUrl = 'https://portal.1inch.dev/documentation';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API Key obtained from portal.1inch.dev',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.1inch.dev',
			description: 'The base URL for 1inch Network API',
		},
	];
}