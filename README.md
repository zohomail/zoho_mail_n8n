![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)
# Zoho Mail integration with n8n
## About Zoho Mail and Zoho Mail node in n8n:
Zoho Mail is a business email platform that helps you communicate with your colleagues, clients, and others via a secure email platform. The Zoho Mail node in n8n will help you trigger an action in another email or perform actions in Zoho Mail based on a trigger from another application. The supported triggers include a new email notification and a new tag added to an email. The supported actions include sending a new email, saving an email content as draft, creating a new tag/ label, folder, and a new task.
To learn more about n8n: [n8n homepage](https://n8n.io/).
To learn more about Zoho Mail: [Zoho Mail homepage]( https://www.zoho.com/mail/ )
In case of any technical queries: [Contact our sales team]( https://www.zoho.com/mail/contact.html )
## Pre-requisites:
- An n8n Admin account (https://app.n8n.cloud/login)
- Zoho Mail account
- A Verified domain added to the Zoho Mail account
## Installation
- To install the Zoho Mail node in n8n:
  - Login to your n8n account.
  - Navigate to the project you want to add Zoho Mail and click the Nodes panel on the right.
  - Search for Zoho Mail in the nodes listing.
  - Click <b> Install node. </b> The Zoho Mail node for n8n will be successfully installed.
  - You can find the installed node in the Community nodes section under Settings.

## Zoho Mail node configuration in n8n: 
Once you install the package, you should integrate with n8n to start sending emails:
- Login to your n8n account.
- Click the down-arrow next to the <b>Create workflow</b> button and click <b>Create credentials</b>.
- In the <b>Add credentials</b> dialogue box, choose the <b>Zoho Mail OAuth 2.0</b> authorization and copy the Authorized Redirection URL.
- Go to the [Zoho Developer Console](https://api-console.zoho.com/) console to generate a new Client ID and Client Secret. These parameters will connect Zoho Mail and n8n.
- Click <b>Get started</b> if you do not have any new client. If you have an existing client, click Add client.
- Select <b>Server-based applications</b> in the client type window.
- Provide an appropriate client name, your domain value in the homepage URL field, and the Authorized Redirection URL copied from the <b>Add credentials</b> dialog box.
- Click <b>Create</b> to generate the Client ID and Client Secret.
- Copy the generated values and paste them in the <b>Add credentials</b> dialog box.
- The connection is established. You can now create workflows to trigger or perform the actions supported by the Zoho Mail node in n8n.

## Create workflows using Zoho Mail node in n8n:
- Click <b>Create Workflow</b> on the top right corner of the home page.
- Click <b>Add first step</b> and search and select appropriate trigger app to perform actions in Zoho Mail or search and select Zoho Mail triggers to perform an action in another application.
- If the Zoho Mail node is chosen, the triggers and actions are listed for you to choose based on which you want to create the workflow:
- <b>The available triggers are:</b> New email notification and New tagged email.
- <b>The available actions are:</b> Send new email, Save draft, Create new label, Create new folder, and Create new task.

## Troubleshooting 
Write to us in case of any queries at support@zohomail.com.

### Description
This page explains the integration of Zoho Mail with n8n to create workflows that can trigger an action in another application based on the supported triggers or perform a supported action in Zoho Mail based on the triggers from another application.

- To learn more about Zoho Mail: [Zoho Mail homepage](https://www.zoho.com/mail/)
- In case of any technical queries: [Contact our sales team](https://www.zoho.com/mail/contact.html)