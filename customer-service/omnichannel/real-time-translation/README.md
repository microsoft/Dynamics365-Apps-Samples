# Enable real time translation for conversations

## Pre-requisites

Since much of the real time translation behavior is defined by the web resource, verify the checklist given below:

1. All the agents and supervisors should have `Omnichannel Agent` or `Omnichannel Supervisor` role.


## What does this sample do?

This is a sample web resource that you can use to enable real time translation of the conversation messages exchanged between the customer and the agent. Please follow the below mentioned steps before using this sample:

1. Directly download and change the API key for the translation API engine, being used in your organisation, in `webResourceV2.js` at:

```
	bingTranslateApiClientSecret: '<please add your own azure translation api key>',
	googleTranslateApiClientSecret: '<please add your own google translation v2 api key>',
	useAzureTranslationApis: true,//please override it to false if planning to use google translation v2 api
```

2. Additional changes can be done in web resource logic as per your business needs.


Add this javascript file as web resource to your organisation. Follow the instructions in the topic [Add a web resource for real time translation](https://docs.microsoft.com/dynamics365/omnichannel/developer/how-to/add-web-resource-real-time-translation) to copy its URL in the Omnichannel Administration app to enable Realtime translation feature in Omnichannel for Customer Service.

## See also

[Enable language translation for conversations](https://docs.microsoft.com/dynamics365/omnichannel/administrator/enable-chat-translation)
