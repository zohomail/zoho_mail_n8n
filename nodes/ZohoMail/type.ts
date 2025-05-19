
export type ZohoMailOAuth2ApiCredentials = {
	oauthTokenData: {
		api_domain: string;
	};
};
export type LoadedLayoutsAccount = {
	data: Array<{
		accountDisplayName: string;
		accountId: string;
	}>;
};
export type LoadedLayoutsFromAddress = {
	data: {
        sendMailDetails: Array<{
            displayName: string,
            fromAddress: string
        }>;
    }
};
export type LoadedLayoutsFolder = {
    data: Array<{
        folderName: string,
        path: string
    }>;
}
export type LoadedLayoutsLabel = {
    data: Array<{
        displayName: string,
        labelId: string
    }>;
}
