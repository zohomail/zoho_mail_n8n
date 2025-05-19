import moment from 'moment-timezone';
import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IPollFunctions,
	NodeOperationError,
	NodeConnectionType
} from 'n8n-workflow';

import {
	getPicklistAccountOptions,
    getPickListLabeloptions,
    getPickListFolderoptions,
	zohomailApiRequest
} from './GenericFunctions';

import {
    triggerMessageOperations,
    newMatchingEmailTriggerFields,
    newTaggedEmailTriggerFields,
    newFolderEmailTriggerFields
} from './descriptions';


export class ZohoMailTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho Mail Trigger',
		name: 'zohoMailTrigger',
		icon: 'file:ZohoMail.png',
		group: ['trigger'],
		version: 1,
		description: 'Fetches mails from Zoho Mail and starts the workflow on specified polling intervals.',
		defaults: {
			name: 'Zoho Mail Trigger',
		},
		credentials: [
			{
				name: 'zohoMailOAuth2Api',
				required: true,
			},
		],
        polling: true,
		inputs: [],
		outputs: [NodeConnectionType.Main],
        properties: [
			{
				displayName: 'Trigger Resource',
				name: 'triggerresource',
				type: 'options',
				required: true,
                options: [
					{
						name: 'Message',
						value: 'triggermessage',
					},
                ],
                default: 'triggermessage'
			},
            ...triggerMessageOperations,
            ...newMatchingEmailTriggerFields,
            ...newTaggedEmailTriggerFields,
            ...newFolderEmailTriggerFields
		],
	};
    methods = {
		loadOptions: {
            async getListAccount(this: ILoadOptionsFunctions) {
				return await getPicklistAccountOptions.call(this);
			},
            async getListLabel(this: ILoadOptionsFunctions) {
				const account = this.getCurrentNodeParameter('account') as string;
				return await getPickListLabeloptions.call(this, account.toString());
			},
            async getListFolder(this: ILoadOptionsFunctions) {
				const account = this.getCurrentNodeParameter('account') as string;
				return await getPickListFolderoptions.call(this, account.toString());
			}
        }
    }
    async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const webhookData = this.getWorkflowStaticData('node');

		const qs: IDataObject = {};

		const triggerresource = this.getNodeParameter('triggerresource');
		const triggeroperation = this.getNodeParameter('operationtrigger');

		const accountId = this.getNodeParameter('account');
		
		let responseData;

		if (triggerresource === 'triggermessage'){

			if (triggeroperation === 'newtaggedmail'){

                qs.limit = 10;
				qs.labelid = this.getNodeParameter('tagname');
				responseData = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/messages/view`,{} ,qs);

                if (responseData.status.code === 200) {
	                const messages = responseData.data as Record<string, any>[];
	                const twoDaysBefore = Date.now() - 2 * 24 * 60 * 60 * 1000;
	                const msgList: Record<string, any>[] = [];

	                for (const msg of messages) {
		                if (msg.messageId !== undefined && msg.messageId !== null && msg.receivedTime >= twoDaysBefore) {
			                msg.id = msg.receivedTime;
			                if ('status2' in msg) {
				                delete msg.status2;
			                }
                            if ('status' in msg) {
				                msg.readStatus = msg.status === '0' ? 'Unread' : 'Read';
				                delete msg.status;
			                }
                            if ('priority' in msg) {
				                switch (msg.priority) {
					                case '1':
						                msg.priority = 'Highest';
						                break;
					                case '2':
						                msg.priority = 'High';
						                break;
					                case '4':
						                msg.priority = 'Low';
						                break;
					                case '5':
						                msg.priority = 'Lowest';
						                break;
					                default:
						                msg.priority = 'Normal';
				                }
			                }
                            if ('subject' in msg) {
				                msg.subject = msg.subject;
			                }
                            if ('summary' in msg) {
				                msg.summary = msg.summary;
			                }
			                if ('hasAttachment' in msg) {
				                msg.hasAttachment = msg.hasAttachment === '1' ? 'Yes' : 'No';
			                }
                            if ('sentDateInGMT' in msg) {
				                msg.sentAt = moment(Number(msg.sentDateInGMT)).tz('GMT').format();
						    }
							const mailContent = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/folders/${msg.folderId}/messages/${msg.messageId}/content`,{} ,{});
							if (mailContent.status.code === 200) {
								msg.body = mailContent.data.content;
							}
			                msgList.push(msg);
		                }
	                }
                    responseData = msgList;
                }
				else{
					throw new NodeOperationError(this.getNode(), new Error('The Zoho Mail New Tagged Mail API returned an error.'));
				}
			}
			else if(triggeroperation === 'newemails'){

				const twoDaysBefore = Date.now() - 2 * 24 * 60 * 60 * 1000;

				qs.searchKey = "newMails";
				qs.receivedTime = twoDaysBefore;

				if (this.getNodeParameter('groupresult') !== undefined && this.getNodeParameter('groupresult') !== '' && this.getNodeParameter('groupresult') !== 'false'){
					qs.groupResult = this.getNodeParameter('groupresult');
				}
				if (this.getNodeParameter('foldername') !== undefined && this.getNodeParameter('foldername') !== ''){
					const foldername = this.getNodeParameter('foldername');

					const folderResponseData = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/folders`,{} ,{});

					if(folderResponseData.status.code === 200) {
						const folderlist = folderResponseData.data as Record<string, any>[];
						for (const msg of folderlist) {
							if (foldername === msg.path){
                                qs.folderId = msg.folderId;
								break;
							}
					    }
						if (!( 'folderId' in qs)){
							throw new NodeOperationError(this.getNode(), new Error('Not a vaild folder'));
						}
					}
				}
				responseData = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/messages/search`,{} ,qs);

				if (responseData.status.code === 200) {
	                const messages = responseData.data as Record<string, any>[];	
	                const msgList: Record<string, any>[] = [];

	                for (const msg of messages) {
			            msg.id = msg.receivedTime;
			            if ('status2' in msg) {
				            delete msg.status2;
			            }
                        if ('status' in msg) {
				            msg.readStatus = msg.status === '0' ? 'Unread' : 'Read';
				            delete msg.status;
			            }
                        if ('priority' in msg) {
				            switch (msg.priority) {
					            case '1':
						            msg.priority = 'Highest';
						            break;
					            case '2':
						            msg.priority = 'High';
						            break;
					            case '4':
						            msg.priority = 'Low';
						            break;
					            case '5':
						            msg.priority = 'Lowest';
						            break;
					            default:
						            msg.priority = 'Normal';
				            }
			            }
                        if ('subject' in msg) {
				            msg.subject = msg.subject;
			            }
                        if ('summary' in msg) {
				            msg.summary = msg.summary;
			            }
			            if ('hasAttachment' in msg) {
				            msg.hasAttachment = msg.hasAttachment === '1' ? 'Yes' : 'No';
			            }
                        if ('sentDateInGMT' in msg) {
				            msg.sentAt = moment(Number(msg.sentDateInGMT)).tz('GMT').format();
						}
						const mailContent = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/folders/${msg.folderId}/messages/${msg.messageId}/content`,{} ,{});
						if (mailContent.status.code === 200) {
							msg.body = mailContent.data.content;
						}
			            msgList.push(msg);
		            }
					responseData = msgList;
				}
				else{
					throw new NodeOperationError(this.getNode(), new Error('The Zoho Mail New Mail API returned an error.'));
				}
			}
			else if(triggeroperation === 'newmatchingemail'){

				qs.searchKey = this.getNodeParameter('searchkey');
                qs.limit = "100";

				if (typeof qs.searchKey === 'string' && !qs.searchKey.includes(':')) {
					qs.searchKey = `entire:${qs.searchKey}`;
				}
				if (this.getNodeParameter('groupresult') !== undefined && this.getNodeParameter('groupresult') !== '' && this.getNodeParameter('groupresult') !== 'false'){
					qs.groupResult = this.getNodeParameter('groupresult');
				}
				responseData = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/messages/search`,{} ,qs);
				if (responseData.status.code === 200) {

					const twoDaysBefore = Date.now() - 2 * 24 * 60 * 60 * 1000;

	                const messages = responseData.data as Record<string, any>[];
	                const msgList: Record<string, any>[] = [];

	                for (const msg of messages) {
		                if (msg.messageId !== undefined && msg.messageId !== null && msg.receivedTime >= twoDaysBefore) {
			                msg.id = msg.receivedTime;
			                if ('status2' in msg) {
				                delete msg.status2;
			                }
                            if ('status' in msg) {
				                msg.readStatus = msg.status === '0' ? 'Unread' : 'Read';
				                delete msg.status;
			                }
                            if ('priority' in msg) {
				                switch (msg.priority) {
					                case '1':
						                msg.priority = 'Highest';
						                break;
					                case '2':
						                msg.priority = 'High';
						                break;
					                case '4':
						                msg.priority = 'Low';
						                break;
					                case '5':
						                msg.priority = 'Lowest';
						                break;
					                default:
						                msg.priority = 'Normal';
				                }
			                }
                            if ('subject' in msg) {
				                msg.subject = msg.subject;
			                }
                            if ('summary' in msg) {
				                msg.summary = msg.summary;
			                }
			                if ('hasAttachment' in msg) {
				                msg.hasAttachment = msg.hasAttachment === '1' ? 'Yes' : 'No';
			                }
                            if ('sentDateInGMT' in msg) {
				                msg.sentAt = moment(Number(msg.sentDateInGMT)).tz('GMT').format();
						    }
							const mailContent = await zohomailApiRequest.call(this, 'GET', `api/accounts/${accountId}/folders/${msg.folderId}/messages/${msg.messageId}/content`,{} ,{});
							if (mailContent.status.code === 200) {
								msg.body = mailContent.data.content;
							}
			                msgList.push(msg);
		                }
	                }
                    responseData = msgList;
                }
				else{
					throw new NodeOperationError(this.getNode(), new Error('The Zoho Mail New Matching Mail API returned an error.'));
				}
			}
		}
		if (Array.isArray(responseData) && responseData.length !== 0) {
			return [this.helpers.returnJsonArray(responseData)];
		}
		return null;
	}
};
