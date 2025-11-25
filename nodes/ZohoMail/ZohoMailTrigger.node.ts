import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeType,
	INodeTypeDescription,
    IWebhookFunctions,
    IHookFunctions,
    NodeConnectionType,
    IWebhookResponseData
} from 'n8n-workflow';

import {
	getPicklistAccountOptions,
    getPickListLabeloptions,
    zohomailApiRequest
} from './GenericFunctions';

import {
    triggerMessageNotificationOperations,
    triggerNewMailNotificationFields,
    triggerNewTaggedMailNotificationFields
} from './descriptions';

export class ZohoMailTrigger implements INodeType {
		description: INodeTypeDescription = {
		displayName: 'Zoho Mail Trigger',
		name: 'zohoMailTrigger',
		icon: 'file:ZohoMail.png',
		group: ['trigger'],
		version: 1,
		description: '',
		defaults: {
			name: 'Zoho Mail Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zohoMailOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
        properties: [
        {
            displayName: 'Trigger Resource',
            name: 'triggerresource',
            type: 'options',
            required: true,
            options: [
            {
                name: 'Message',
                value: 'message',
            },
            ],
        default: 'message'
        },
        ...triggerMessageNotificationOperations,
        ...triggerNewMailNotificationFields,
        ...triggerNewTaggedMailNotificationFields
        ]
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
            },
        }
    
    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const triggerOptions = this.getNodeParameter('optionstrigger') as string;
                const accountId = this.getNodeParameter('account') as string;
                const qs: IDataObject = {
                    action: 'MANAGE_OWH',
                    accId: accountId
                };
                const endpoint = 'integPlatform/api/outgoingWebhooks';
                const collection = await zohomailApiRequest.call(this, 'GET', endpoint, {}, qs);
                    
                for (const webhook of collection.data.data.WEBHOOK_DATA) {
                if (
                    webhook.webhookURL === webhookUrl) {
                        webhookData.webhookURI = webhook.webhookURL;
                        return true;
                    }
                }
                return false;
            },	

            async create(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
                const triggerOptions = this.getNodeParameter('optionstrigger') as string;
                const accountId = this.getNodeParameter('account') as string;

                const qs: IDataObject = {
                    action: 'CREATE_OWH',
                    accId: accountId,
                    webhookURL: webhookUrl,
                    metaOnly: false,
                    category: 0,
                    webhookName: 'Outgoing Webhook Bot'
                }

                var criteria = []; 
                if (triggerOptions == 'newmailnotification') {
                
                    if (this.getNodeParameter('matchingcondition') != undefined && this.getNodeParameter('matchingcondition') !== null && this.getNodeParameter('matchingcondition') !== '' ) {
                        if (this.getNodeParameter('from') != undefined && this.getNodeParameter('from') !== null && this.getNodeParameter('from') !== '') {
                            criteria.push({'lhs': 'sender', 'rhs': this.getNodeParameter('from'), 'operator': 'contains'})
                        }
                        if (this.getNodeParameter('to') != undefined && this.getNodeParameter('to') !== null && this.getNodeParameter('to') !== '') {
                            criteria.push({ 'lhs': 'to', 'rhs': this.getNodeParameter('to'), 'operator': 'contains' });
                        }
                        if (this.getNodeParameter('subject') != undefined && this.getNodeParameter('subject') !== null && this.getNodeParameter('subject') !== '') {
                            criteria.push( {'lhs': 'subject', 'rhs': this.getNodeParameter('subject'), 'operator': 'contains'});
                        }
                        if (this.getNodeParameter('cc') != undefined && this.getNodeParameter('cc') !== null && this.getNodeParameter('cc') !== '') {
                            criteria.push( {'lhs': 'cc', 'rhs': this.getNodeParameter('cc'), 'operator': 'contains'});
                        }
                        if (this.getNodeParameter('bcc') != undefined && this.getNodeParameter('bcc') !== null && this.getNodeParameter('bcc') !== '') {
                            criteria.push( {'lhs': 'bcc', 'rhs': this.getNodeParameter('bcc'), 'operator': 'contains'});
                        }
                        if (this.getNodeParameter('content') != undefined && this.getNodeParameter('content') !== null && this.getNodeParameter('content') !== '') {
                            criteria.push( {'lhs': 'content', 'rhs': this.getNodeParameter('content'), 'operator': 'contains'});
                        }
                        if (this.getNodeParameter('priority') != undefined && this.getNodeParameter('priority') !== null && this.getNodeParameter('priority') !== '') {
                            criteria.push( {'lhs': 'priority', 'rhs': this.getNodeParameter('priority'), 'operator': 'is'});
                        }
                        if (this.getNodeParameter('attachment_type') != undefined && this.getNodeParameter('attachment_type') !== null && this.getNodeParameter('attachment_type') !== '') {
                            criteria.push( {'lhs': 'attachtype', 'rhs': this.getNodeParameter('attachment_type'), 'operator': 'contains'});
                        }
                        if (this.getNodeParameter('attachment_name') != undefined && this.getNodeParameter('attachment_name') !== null && this.getNodeParameter('attachment_name') !== '') {
                            criteria.push( {'lhs': 'attachnames', 'rhs': this.getNodeParameter('attachment_name'), 'operator': 'contains'});
                        }
                        if (this.getNodeParameter('has_attachment') != undefined && this.getNodeParameter('has_attachment') !== null && this.getNodeParameter('has_attachment') !== '') {
                            criteria.push( {'lhs': 'hasattachment', 'rhs': this.getNodeParameter('attachment_name')});
                        }
                        qs.criterias = JSON.stringify(criteria);
                        qs.matchingCondition = this.getNodeParameter('matchingcondition');
                    }
                    else {
                        qs.criterias = JSON.stringify([]);
                        qs.matchingCondition = 'ALL';
                    }
                }
                if (triggerOptions == 'newTaggedmailnotification') {
                    if (this.getNodeParameter('labelname') != undefined && this.getNodeParameter('labelname') !== null && this.getNodeParameter('labelname')) {
                        const labelStr = String( this.getNodeParameter('labelname') || '').trim();

                        if (labelStr.length > 0) {
                            const onTag = labelStr.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0); 
                            if (onTag.length > 0) {
                                criteria.push({ onTag });
                            } 
                        }
                        qs.criterias = JSON.stringify(criteria);
                    }
                }
                const endpoint = 'integPlatform/api/outgoingWebhooks';
                const responseData = await zohomailApiRequest.call(this, 'POST', endpoint, {}, qs);
    
                if (responseData === undefined) {
                    return false;
                }
                if (triggerOptions === 'newmailnotification'){
                    if (responseData?.data?.data?.FILTER_DATA !== undefined) {
                        webhookData.filterId = responseData.data.data.FILTER_DATA.filterId;
                    }
                }
                webhookData.integId = responseData.data.data.integId
                return true;
            },
    
            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');
                const accountId = this.getNodeParameter('account') as string;
                const triggerOptions = this.getNodeParameter('optionstrigger') as string;
    
                const qs: IDataObject = {
                    action: "DELETE_OWH",
                    accId: accountId,
                    integId: webhookData.integId,
                }

                if (triggerOptions === 'newmailnotification') {
                    qs.filterId =  webhookData.filterId
                }

                if (webhookData.integId !== undefined ) {
                    try {
                        const endpoint = 'integPlatform/api/outgoingWebhooks'
                        await zohomailApiRequest.call(this, 'DELETE', endpoint, {}, qs);
                    } catch (error) {
                        return false;
                    }
                    delete webhookData.integId;
                    if (triggerOptions === 'newmailnotification') {
                        delete webhookData.filterId;
                    }
                }
                return true;
            },
        },
    };
    
    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }    
};