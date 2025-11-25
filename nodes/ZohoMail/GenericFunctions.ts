import {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	JsonObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	NodeOperationError,
	NodeApiError,
	IPollFunctions
} from 'n8n-workflow';
import {
	ZohoMailOAuth2ApiCredentials,
	LoadedLayoutsAccount,
    LoadedLayoutsFromAddress,
    LoadedLayoutsFolder,
	LoadedLayoutsLabel
} from './type'

export function throwOnErrorStatus(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
	responseData: {
		data?: { errorCode?: string };
		status?: { code?: number; description?: string };
	}
): void {
	const errorCode = responseData.data?.errorCode;
	const errorDescription = responseData.status?.description;
	const statuscode = responseData.status?.code;

	if ((statuscode !== 200 && statuscode !== 201) && (errorCode || errorDescription)) {

		const fullMessage = errorCode ? `${errorCode}: ${errorDescription ?? 'Internal error'}` : errorDescription ?? 'Internal error';
		throw new NodeOperationError(this.getNode(), fullMessage);
	}
}

export async function zohomailApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
) {
	const { oauthTokenData } = await this.getCredentials<ZohoMailOAuth2ApiCredentials>('zohoMailOAuth2Api');
	const options: IHttpRequestOptions = {
		headers: {"user-agent": "N8n Zoho Mail"},
		body: body,
		method,
		qs,
		url: `https://mail.${getDomain(oauthTokenData.api_domain)}/${endpoint}`,
		json: true,
	};
	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	try {
		const responseData = await this.helpers.requestOAuth2?.call(this, 'zohoMailOAuth2Api', options);
		if (responseData === undefined) return [];
	    throwOnErrorStatus.call(this, responseData as IDataObject);
		return responseData;
	} catch (error) {
		const args = error ? {
			message: error.error?.data?.errorCode ?? 'The Zoho Mail API returned an error.',
			description: error.error?.status?.description ?? 'No additional information provided.',
		} : undefined;
		throw new NodeApiError(this.getNode(), error as JsonObject, args);
	}
}

export async function getPicklistAccountOptions(
	this: ILoadOptionsFunctions,
) {
	const responseData = (await zohomailApiRequest.call(
		this,
		'GET',
		'api/accounts',
		{}
	)) as LoadedLayoutsAccount;

	const pickListOptions = responseData.data

	if (!pickListOptions) return [];

	return pickListOptions.map((option) => ({
		name: option.accountDisplayName,
		value: option.accountId,
	}));
}

export async function getPicklistFromAddressOptions(
	this: ILoadOptionsFunctions,
	targetField: string
) {
	const responseData = (await zohomailApiRequest.call(
		this,
		'GET',
		`api/accounts/${targetField}`,
		{}
	)) as LoadedLayoutsFromAddress;

    const pickListOptions = responseData.data.sendMailDetails

	if (!pickListOptions) return [];
	
    return pickListOptions.map((option) => ({
		name: option.displayName,
		value: option.fromAddress,
	}));   
}

export async function getPickListFolderoptions(
    this: ILoadOptionsFunctions,
    targetField: string
) {
    const responseData = (await zohomailApiRequest.call(
		this,
		'GET',
		`api/accounts/${targetField}/folders`,
		{}
	)) as LoadedLayoutsFolder;

    const pickListOptions = responseData.data

	if (!pickListOptions) return [];

    return pickListOptions.map((option) => ({
		name: option.folderName,
		value: option.path,
	}));   

}

export async function getPickListLabeloptions(
    this: ILoadOptionsFunctions,
    targetField: string
) {
    const responseData = (await zohomailApiRequest.call(
		this,
		'GET',
		`api/accounts/${targetField}/labels`,
		{}
	)) as LoadedLayoutsLabel;

    const pickListOptions = responseData.data

	if (!pickListOptions) return [];

    return pickListOptions.map((option) => ({
		name: option.displayName,
		value: option.labelId,
	}));   

}

export function getDomain(domain: string): string | undefined {
    const value: { [key: string]: string } = {
        ".com": "zoho.com",
        ".eu": "zoho.eu",
        ".com.cn": "zoho.com.cn",
        ".com.au": "zoho.com.au",
        ".in": "zoho.in",
        ".ca": "zohocloud.ca",
        ".sa": "zoho.sa",
        ".jp": "zoho.jp"
    };
    const suffixes = new Set(Object.keys(value));
    for (const key of suffixes) {
        if (domain.endsWith(key)) {
            return value[key];
        }
    }
    return undefined;
}

export function formatDueDate(input: any) {
	const date = new Date(input);
  
	const day = String(date.getDate()).padStart(2, '0');
	const month = date.toLocaleString('en-US', { month: 'short' });
	const year = date.getFullYear();
  
	return `${day}${month}${year}`;
  }
  
