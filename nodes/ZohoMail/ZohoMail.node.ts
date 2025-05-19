import {
	type IExecuteFunctions,
	type IDataObject,
	type ILoadOptionsFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import {
    taskOperations,
    folderOperations,
    messageOperations,
	labelOperations,
	messageActionFields,
} from './descriptions';

import {
	getPicklistAccountOptions,
    getPicklistFromAddressOptions,
    getPickListFolderoptions,
    zohomailApiRequest,
	formatDueDate
} from './GenericFunctions';


export class ZohoMail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Mail',
		name: 'zohoMail',
		icon: 'file:ZohoMail.png',
		group: ['transform'],
		subtitle: '={{$parameter["operation"]}}',
		version: 1,
		description: 'Consume Zoho Mail API',
		defaults: {
			name: 'Zoho Mail',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zohoMailOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
                required: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
                    {
                        name: 'Label',
                        value: 'label'
                    },
                    {
                        name: 'Folder',
                        value: 'folder',
                    },
                    {
                        name: 'Task',
                        value: 'task'
                    }
				],
				default: 'message',
			},
            ...messageOperations,
            ...messageActionFields,
            ...taskOperations,
            ...labelOperations,
            ...folderOperations
        ],
	};
    methods = {
		loadOptions: {
            async getListAccount(this: ILoadOptionsFunctions) {
				return await getPicklistAccountOptions.call(this);
			},
			async getListFromAddress(this: ILoadOptionsFunctions) {
				const account = this.getCurrentNodeParameter('account') as string;
				return await getPicklistFromAddressOptions.call(this, account.toString());
			},
            async getListFolder(this: ILoadOptionsFunctions) {
				const account = this.getCurrentNodeParameter('account') as string;
				return await getPickListFolderoptions.call(this, account.toString());
			}
        }
    };
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;

		for (let i = 0; i < items.length; i++) {

			try {
				if (resource === 'message') {
					// **********************************************************************
					//                                Message
					// **********************************************************************

					if (operation === 'sendemail') {
						// ----------------------------------------
						//             Message: sendmail
						// ----------------------------------------
						// Get the necessary parameters
                        const accountId = this.getNodeParameter('account',i);
						const body: IDataObject = {
							fromAddress: this.getNodeParameter('from', i),
							toAddress: this.getNodeParameter('to', i),
							subject: this.getNodeParameter('subject', i),
							content: this.getNodeParameter('body', i),
						};
						if (this.getNodeParameter('cc', i) !== undefined && this.getNodeParameter('cc',i) !== ''){
							body.ccAddress = this.getNodeParameter('cc', i)
						}
						if (this.getNodeParameter('bcc', i) !== undefined && this.getNodeParameter('bcc', i) !== ''){
							body.bccAddress = this.getNodeParameter('bcc', i);
						}
						if (this.getNodeParameter('bodytype', i) !== undefined && this.getNodeParameter('bodytype', i) !== ''){
							body.mailFormat = this.getNodeParameter('bodytype', i);
						}
						responseData = await zohomailApiRequest.call(this, 'POST', `api/accounts/${accountId}/messages`,body ,{});
						responseData = responseData.data;
					}
					else if(operation == 'createdraft'){
						// ----------------------------------------
						//             Message: Create Draft
						// ----------------------------------------
						// Get the necessary parameters
                        const accountId = this.getNodeParameter('account',i);
						const body: IDataObject = {
							fromAddress: this.getNodeParameter('from', i),
							toAddress: this.getNodeParameter('to', i),
							subject: this.getNodeParameter('subject', i),
							content: this.getNodeParameter('body', i),
							mode: "draft",
						};
						if (this.getNodeParameter('cc', i) !== undefined && this.getNodeParameter('cc',i) !== ''){
							body.ccAddress = this.getNodeParameter('cc', i)
						}
						if (this.getNodeParameter('bcc', i) !== undefined && this.getNodeParameter('bcc', i) !== ''){
							body.bccAddress = this.getNodeParameter('bcc', i);
						}
						if (this.getNodeParameter('bodytype', i) !== undefined && this.getNodeParameter('bodytype', i) !== ''){
							body.mailFormat = this.getNodeParameter('bodytype', i);
						}
						responseData = await zohomailApiRequest.call(this, 'POST', `api/accounts/${accountId}/messages`,body ,{});
						responseData = responseData.data;
					}
                }
				else if(resource == 'label'){
					// **********************************************************************
					//                                Label
					// **********************************************************************
					if(operation == 'createlabel'){
						// ----------------------------------------
						//             Message: Create Label
						// ----------------------------------------
						// Get the necessary parameters
						const accountId = this.getNodeParameter('account',i);
						const body: IDataObject = {
							displayName: this.getNodeParameter('labelname', i),
						};
						if (this.getNodeParameter('labelcolor', i) !== undefined && this.getNodeParameter('labelcolor', i) !== ''){
							body.color = this.getNodeParameter('labelcolor', i);
						}
						responseData = await zohomailApiRequest.call(this, 'POST', `api/accounts/${accountId}/labels`,body ,{});
						responseData = responseData.data;
					}
				}
				else if(resource == 'folder'){
					// **********************************************************************
					//                                Folder
					// **********************************************************************
					if(operation == 'createfolder'){
						// ----------------------------------------
						//             Message: Create Folder
						// ----------------------------------------
						// Get the necessary parameters
						const accountId = this.getNodeParameter('account',i);
						const body: IDataObject = {
							folderName: this.getNodeParameter('foldername', i),
						};
						if (this.getNodeParameter('parentfolder', i) !== undefined && this.getNodeParameter('parentfolder', i) !== ''){
							body.parentFolderPath = this.getNodeParameter('parentfolder', i);
						}
						responseData = await zohomailApiRequest.call(this, 'POST', `api/accounts/${accountId}/folders`,body ,{});
						responseData = responseData.data;
					}
				}
				else if(resource == 'task'){
					// **********************************************************************
					//                                Task
					// **********************************************************************
					if(operation == 'createnewtask' ){
						// ----------------------------------------
						//             Message: Create Task
						// ----------------------------------------
						// Get the necessary parameters
						const accountId = this.getNodeParameter('account',i);
						const dueDate =formatDueDate(this.getNodeParameter('dueDate',i));
						const body: IDataObject = {
							subject:  this.getNodeParameter('tasktitle',i)
						}
						if (this.getNodeParameter('taskdescription',i) !== undefined && this.getNodeParameter('taskdescription',i) !== ''){
							body.content = this.getNodeParameter('taskdescription',i);
						}
						responseData = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}`,{},{});
						var emailAddressList = responseData?.data?.sendMailDetails[0];
						if (emailAddressList.mode === 'alias' || emailAddressList.mode === 'mailbox'){
							const mailId = emailAddressList.fromAddress
                            body.fromAddress = 	mailId;
							var due = (dueDate !== 'NaNInvalid DateNaN' && dueDate !== undefined && dueDate !== '') ? '+' + dueDate : '';
                            body.toAddress = mailId.substring(0, mailId.indexOf("@")) + "+task"+ due + mailId.substring(mailId.indexOf("@"));
							body.mailFormat = "plaintext";
						}
						responseData = await zohomailApiRequest.call(this, 'POST', `api/accounts/${accountId}/messages`,body ,{});
						responseData = responseData.data;
					}	
				}
			}
            catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.data.errorCode, json: {} });
					continue;
				}
				throw error;
			}
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		}
		return [returnData];
    }
}   