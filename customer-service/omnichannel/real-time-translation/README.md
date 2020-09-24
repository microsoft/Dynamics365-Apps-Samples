# Enable real-time translation for conversations

## Prerequisites

The real time translation behavior is defined by the web resource, therefore, verify the following checklist:

1. All the agents and supervisors should have "Omnichannel agent" or "Omnichannel supervisor" role.


## What does this sample do?

The webResourceV2.js is a sample web resource that you can use to enable real-time translation of the conversation messages exchanged between the customer and the agent. Perform the following steps before using the sample:

1. Directly download the file and change the API key for the translation API engine that is used in your organisation, in `webResourceV2.js` at:

```
	bingTranslateApiClientSecret: '<please add your own azure translation api key>',
	googleTranslateApiClientSecret: '<please add your own google translation v2 api key>',
	useAzureTranslationApis: true,//please override it to false if planning to use google translation v2 api
```

2. Make additional changes in the web resource logic as per your business needs.


Add this javascript file as web resource to your organisation. Follow the instructions in the topic [Add a web resource for real time translation](https://docs.microsoft.com/dynamics365/omnichannel/developer/how-to/add-web-resource-real-time-translation) to copy its URL in the Omnichannel Administration app to enable real-time translation feature in Omnichannel for Customer Service.

## See also

[Enable language translation for conversations](https://docs.microsoft.com/dynamics365/omnichannel/administrator/enable-chat-translation)
