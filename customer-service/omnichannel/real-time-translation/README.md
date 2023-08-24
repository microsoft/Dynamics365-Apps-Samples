# Enable real-time translation for conversations

## Prerequisites

The real-time translation behavior is defined by the web resource, therefore, verify the following checklist:

1. As an administrator, deploy an Azure translation resource for the "Global" location.
2. Get your authentication key for the Azure translation resource.
For more information, see [Create a translator resource](https://learn.microsoft.com/azure/cognitive-services/Translator/create-translator-resource).

[!NOTE] All the agents and supervisors should have "Omnichannel agent" or "Omnichannel supervisor" role.

## What does this sample do?

The webResourceV2.js is a sample web resource that you can use to enable real-time translation of the conversation messages exchanged between the customer and the agent. Perform the following steps before using the sample:

1. Download the `webResourceV2.js` file and add the authentication key of the translation resource for the following end point:

```
	bingTranslateApiClientSecret: '<please add your own azure translation api key>',
```
	Additional changes can also be made in the web resource logic as per your business needs.


2. Add this javascript file as a web resource to your organisation. Follow the instructions in the topic [Add a web resource for real time translation](https://docs.microsoft.com/dynamics365/omnichannel/developer/how-to/add-web-resource-real-time-translation) to copy its URL in the Customer Service admin center app, and enable real-time translation feature in Omnichannel for Customer Service.

### See also

[Enable language translation for conversations](https://docs.microsoft.com/dynamics365/omnichannel/administrator/enable-chat-translation)
