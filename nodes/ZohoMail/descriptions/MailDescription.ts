import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Send Email',
				value: 'sendemail',
				description: 'Create and send a new email message..',
				action: 'Send Email',
			},
			{
				name: 'Create Draft',
				value: 'createdraft',
				description: 'Create (but do not send) a new email message.',
				action: 'Create Draft',
			},
		],
		default: 'sendemail',
	},
];

export const taskOperations: INodeProperties[] = [

	// ----------------------------------------
    //     Message: Create Task
    // ----------------------------------------

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Create New Task',
				value: 'createnewtask',
				description: 'Creates a new task.',
				action: 'Create New Task',
			} 
		],
		default: 'createnewtask'
	},
	{
		displayName: 'Account',
		name: 'account',
		type: 'options',
		default: '',
		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createnewtask'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAccount',
        },
		required: true,
	},
	{
		displayName: 'Task Title',
		name: 'tasktitle',
		type: 'string',
		default: '',
		description: 'Enter the Task Title',
		hint: 'Enter the Task Title',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createnewtask'],
			},
		},
		required: true,
	},
	{
		displayName: 'Task Description',
		name: 'taskdescription',
		type: 'string',
		default: '',
		description: 'Enter the Task Description',
		hint: 'Enter the Task Description',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createnewtask'],
			},
		},
	},	
	{
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'dateTime',
		default: '',
		description: 'Enter the Due Date',
		hint: 'Enter the Due Date',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['createnewtask'],
			},
		},
	},
];
export const labelOperations: INodeProperties[] = [

	// ----------------------------------------
    //     Message: Create Label
    // ----------------------------------------

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['label'],
			},
		},
		options: [
			{
				name: 'Create Label',
				value: 'createlabel',
				description: 'Creates a new tag.',
				action: 'Create Label',
			}, 
		],
		default: 'createlabel'
	},
	{
		displayName: 'Account',
		name: 'account',
		type: 'options',
		default: '',
		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['createlabel'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAccount',
        },
		required: true,
	},
	{
		displayName: 'Label Name',
		name: 'labelname',
		type: 'string',
		default: '',
		description: 'Enter the Tag name',
		hint: 'Enter the Tag name',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['createlabel'],
			},
		},
		required: true,
	},
	{
		displayName: 'Label Color',
		name: 'labelcolor',
		type: 'string',
		default: '',
		description: 'You can also give hex value of a color. Label created will be displayed in this color. For Example blue, green, #0000CD,#228B22.',
		hint: 'You can also give hex value of a color. Label created will be displayed in this color. For Example blue, green, #0000CD,#228B22.',
		displayOptions: {
			show: {
				resource: ['label'],
				operation: ['createlabel'],
			},
		},
	},
];
export const folderOperations: INodeProperties[] = [

	 // ----------------------------------------
     //     Message: Create Folder
     // ----------------------------------------

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['folder'],
			},
		},
		options: [
			{
				name: 'Create Folder',
				value: 'createfolder',
				description: 'Creates a new folder.',
				action: 'Create Folder',
			}, 
		],
		default: 'createfolder'
	},
	{
		displayName: 'Account',
		name: 'account',
		type: 'options',
		default: '',
		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['createfolder'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAccount',
        },
		required: true,
	},
	{
		displayName: 'Folder Name',
		name: 'foldername',
		type: 'string',
		default: '',
		description: 'Enter the Folder name',
		hint: 'Enter the Folder Name',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['createfolder'],
			},
		},
		required: true,
	},
	{
		displayName: 'Parent Folder',
		name: 'parentfolder',
		type: 'options',
		default: '',
		description: 'Select Parent Folder',
		hint: 'Select Parent Folder',
		displayOptions: {
			show: {
				resource: ['folder'],
				operation: ['createfolder'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListFolder',
			loadOptionsDependsOn: ['account']
        },
	},
];

export const messageActionFields: INodeProperties[] = [

    // ----------------------------------------
    //     Message: Send Mail, Create Draft
    // ----------------------------------------

	{ 
		displayName: 'Account',
		name: 'account',
		type: 'options',
		default: '',
		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		displayOptions: {
			show: {
				resource: ['message',],
				operation: ['sendemail','createdraft'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAccount',
        },
		required: true,
	},
    {
		displayName: 'From',
		name: 'from',
		type: 'options',
		default: '',
		description: 'Select From Address',
		hint: 'Select From Address',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListFromAddress',
			loadOptionsDependsOn: ['account']
        },
		required: true,
	},	
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		default: ''	,
		description: 'Enter To email address and separate by comma if more than one',
		hint: 'Enter To email address and separate by comma if more than one',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
		required: true,
	},	
	{
		displayName: 'CC',
		name: 'cc',
		type: 'string',
		default: ''	,
		description: "Enter CC email address and separate by comma if more than one",
		hint: "Enter CC email address and separate by comma if more than one",
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
	},	
	{
		displayName: 'BCC',
		name: 'bcc',
		type: 'string',
		default: ''	,
		description: "Enter BCC email address and separate by comma if more than one",
		hint: "Enter BCC email address and separate by comma if more than one",
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
	},	
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: ''	,
		description: "Enter subject of the email",
		hint: "Enter subject of the email",
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
		required: true,
	},	
	{
		displayName: 'Body Type',
		name: 'bodytype',
		type: 'options',
		default: ''	,
		description: "Select a Body Type",
		hint: "Select a Body Type",
		displayOptions: {
			show: {	
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
		options: [
			{
				name: 'plain',
				value: 'plaintext',
			},
			{
				name: 'HTML',
				value: 'html'
			}
		]
	},	
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		default: ''	,
		description: "Enter the content of the email",
		hint: "Enter the content of the email",
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail','createdraft'],
			},
		},
		required: true,
	},			
]
export const triggerMessageNotificationOperations: INodeProperties[] = [
	{
	    displayName: 'Trigger On',
	    name: 'optionstrigger',
		type: 'options',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				triggerresource: ['message'],
			},
		},
		options: [
			{
				name: 'New Mail Notification',
				value: 'newmailnotification',
				description: 'Triggers when you receive a new email.'
			},
			{
				name: 'New Tagged Mail Notification',
				value: 'newTaggedmailnotification',
				description: 'Triggers when a new tagged email is received.'
			}
		],
		default: 'newmailnotification'
	},
];

export const triggerNewMailNotificationFields: INodeProperties[] = [
      { 
		displayName: 'Account',
		name: 'account',
		type: 'options',
		default: '',
		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAccount',
        },
		required: true,
	},
	{
		displayName: 'Matching Condition',
		name: 'matchingcondition',
		type: 'options',
		default: '',
		description: '',
		hint: '',
	    displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
		options: [
			{
				name: 'OR',
				value: 'or',
			},
            {
				name: 'AND',
				value: 'and',
			},
		],
	    required: false
	},
	{
		displayName : 'From',
		name: 'from',
		type: 'string',
		default: '',
		hint: 'Enter email address.',
	    displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName : 'To',
		name: 'to',
		type: 'string',
		default: '',
		hint: 'Enter email address.',
	    displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName : 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		hint: "Specify a keyword from the email's subject line.",
	    displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName : 'CC',
		name: 'cc',
		type: 'string',
		default: '',
		hint: 'Enter email address.',
	    displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName : 'BCC',
		name: 'bcc',
		type: 'string',
		default: '',
		hint: 'Enter email address.',
	    displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		hint: 'Specify a keyword from the email content.',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'options',
		default: '',
		hint: 'Specify a keyword from the email content.',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
		options: [
			{
				name: 'High',
				value: 'high',
			},
			{
               name: 'Medium',
			   value: 'medium'
			},
			{
				name: 'Low',
				value: 'low'
			}
		],
	    required: false
	},
	{
		displayName: 'Attachment Type',
		name: 'attachment_type',
		type: 'string',
		default: '',
		hint: 'Enter attachment type (Example: .pdf, .doc. .xlx, etc.)',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName: 'Attachment Name',
		name: 'attachment_name',
		type: 'string',
		default: '',
		hint: 'Enter attachment name',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
	    required: false
	},
	{
		displayName: 'Has Attachment',
		name: 'has_attachment',
		type: 'options',
		default: '',
		hint: 'Specify a keyword from the email content.',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newmailnotification']
			},
		},
		options: [
			{
				name: 'True',
				value: 'true',
			},
			{
               name: 'False',
			   value: 'false'
			}
		],
	    required: false
	},
];

export const triggerNewTaggedMailNotificationFields: INodeProperties[] = [
	{ 
		displayName: 'Account',
		name: 'account',
		type: 'options',
		default: '',
		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newTaggedmailnotification']
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAccount',
        },
		required: true,
	},
	{
		displayName: 'Tag Name',
		name: 'labelname',
		type: 'options',
		default: '',
		description: '',
		hint: '',
		displayOptions: {
			show: {
				triggerresource: ['message'],
				optionstrigger: ['newTaggedmailnotification']
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListLabel',
			loadOptionsDependsOn: ['account']
        },
		required: true,
	}
];

// export const triggerMessageOperations: INodeProperties[] = [
// 	{
// 		displayName: 'Trigger On',
// 		name: 'operationtrigger',
// 		type: 'options',
// 		required: true,
// 		noDataExpression: true,
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 			},
// 		},
// 		options: [
// 			{
// 				name: 'New Email Matching Search Trigger',
// 				value: 'newmatchingemail',
// 				description: 'Triggers when you receive a new email that matches given conditions.',
// 			},	
// 			{
// 				name: 'New Tagged Email',
// 				value: 'newtaggedmail',
// 				description: 'Triggers when a new email is received and you tag it within two days.',
// 			},
// 			{
// 				name: 'New Email',
// 				value: 'newemails',
// 				description: 'Triggers when you receive a new email.',
// 			}
// 		],
// 		default: 'newmatchingemail',
// 	},
// ];

// export const newMatchingEmailTriggerFields: INodeProperties[] = [

//     // ----------------------------------------
//     //     Message: New Matching Email
//     // ----------------------------------------
// 	{ 
// 		displayName: 'Account',
// 		name: 'account',
// 		type: 'options',
// 		default: '',
// 		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newmatchingemail']
// 			},
// 		},
// 		typeOptions: {
//             loadOptionsMethod: 'getListAccount',
//         },
// 		required: true,
// 	},
// 	{ 
// 		displayName: 'Search Value',
// 		name: 'searchkey',
// 		type: 'string',
// 		default: '',
// 		description: 'Enter the search value',
// 		hint: 'This works the same as the advanced search in Zoho Mail. Example search string : entire:bill::sender:payments@example.com The above search string list all emails from the sender payments@example.com, with the word bill anywhere in the email content. [Learn more] (https://www.zoho.com/mail/help/search-syntax.html).',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newmatchingemail'],
// 			},
// 		},
// 		required: true,
// 	},
// 	{
// 		displayName: 'Group Result',
// 		name: 'groupresult',
// 		type: 'options',
// 		default: 'false',
// 		description: "Include this parameter if you want the search results that are part of the same conversation to be grouped together. This value will be set to false by default. Set the value of the parameter to true if you want to group the emails.",
// 		hint: "Include this parameter if you want the search results that are part of the same conversation to be grouped together. This value will be set to false by default. Set the value of the parameter to true if you want to group the emails.",
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newmatchingemail']
// 			},
// 		},
// 		options: [
// 			{
// 				name: 'Yes',
// 				value: 'true',
// 			},
// 			{
// 				name: 'No',
// 				value: 'false'
// 			}
// 		]
// 	}
// ]
// export const newTaggedEmailTriggerFields: INodeProperties[] = [

//     // ----------------------------------------
//     //     Message: New Matching Email
//     // ----------------------------------------
// 	{ 
// 		displayName: 'Account',
// 		name: 'account',
// 		type: 'options',
// 		default: '',
// 		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newtaggedmail']
// 			},
// 		},
// 		typeOptions: {
//             loadOptionsMethod: 'getListAccount',
//         },
// 		required: true,
// 	},
// 	{ 
// 		displayName: 'Label Name',
// 		name: 'tagname',
// 		type: 'options',
// 		default: '',
// 		description: 'Triggers when a new email is received and you tag it within two days.',
// 		hint: 'Triggers when a new email is received and you tag it within two days.',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newtaggedmail'],
// 			},
// 		},
// 		typeOptions: {
//             loadOptionsMethod: 'getListLabel',
// 			loadOptionsDependsOn: ['account']
//         },
// 		required: true,
// 	},
// ]
// export const newFolderEmailTriggerFields: INodeProperties[] = [

//     // ----------------------------------------
//     //     Message: New Matching Email
//     // ----------------------------------------
// 	{ 
// 		displayName: 'Account',
// 		name: 'account',
// 		type: 'options',
// 		default: '',
// 		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newemails']
// 			},
// 		},
// 		typeOptions: {
//             loadOptionsMethod: 'getListAccount',
//         },
// 		required: true,
// 	},
// 	{ 
// 		displayName: 'Folder Name',
// 		name: 'foldername',
// 		type: 'options',
// 		default: '',
// 		description: 'Choose a folder, if you want to get new emails only from a particular folder.',
// 		hint: 'Choose a folder, if you want to get new emails only from a particular folder.',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newemails'],
// 			},
// 		},
// 		typeOptions: {
//             loadOptionsMethod: 'getListFolder',
// 			loadOptionsDependsOn: ['account']
//         },
// 	},
// 	{
// 		displayName: 'Group Result',
// 		name: 'groupresult',
// 		type: 'options',
// 		default: 'false',
// 		description: "Include this parameter if you want the search results that are part of the same conversation to be grouped together. This value will be set to false by default. Set the value of the parameter to true if you want to group the emails.",
// 		hint: "Include this parameter if you want the search results that are part of the same conversation to be grouped together. This value will be set to false by default. Set the value of the parameter to true if you want to group the emails.",
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newemails']
// 			},
// 		},
// 		options: [
// 			{
// 				name: 'Yes',
// 				value: 'true',
// 			},
// 			{
// 				name: 'No',
// 				value: 'false'
// 			}
// 		]
// 	}
// ]

// export const NewMailNotification : INodeProperties[] = [
// 	{ 
// 		displayName: 'Account',
// 		name: 'account',
// 		type: 'options',
// 		default: '',
// 		description: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		hint: 'Select the account (Zoho account/ POP account) from the list of accounts available in Zoho Mail.',
// 		displayOptions: {
// 			show: {
// 				triggerresource: ['triggermessage'],
// 				operationtrigger: ['newmailnotification']
// 			},
// 		},
// 		typeOptions: {
//             loadOptionsMethod: 'getListAccount',
//         },
// 		required: true,
// 	}
     
// ]
