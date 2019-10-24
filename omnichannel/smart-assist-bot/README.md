# Smart assist bot 
This sample code for smart assist bot is built on top of the bot code that's [generated when you create an azure webapp bot](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#download-code)

# Getting Started
*	[Create a bot with Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0)
*	[Download its source code](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#download-code)
*	Apply the changes similart to [this commit](https://dynamicscrm.visualstudio.com/OneCRM/_git/CRM.Omnichannel.CodeSamples/commit/429b3fa26a874be8a094031b73f255b2726514fc?path=%2FSmartAssistBot%2FStartup.cs&gridItemType=2&mpath=%2FSmartAssistBot%2FStartup.cs&opath=%2FSmartAssistBot%2FStartup.cs&mversion=GC429b3fa26a874be8a094031b73f255b2726514fc&oversion=GC797d4986a2e8b303ed7b4f2186e3d2321ac32b7d&_a=compare). At a high level, this means - 
    * Copy the folder /SmartAssist into the SmartAssistBot folder
    * Add appsettings for Dynamics and Luis connections
    * Add a package reference to adaptive cards. 
    * Register Smart assist bot and other operations in ConfigureServices() in Startup
*	[Fill the values in appsettings.json](#appsettings.json)
*  Publish the code and test the bot!

# appsettings.json
There are 3 primary sections in appsettings.json that you will have to fill correctly for this sample code to work - 
* Bot settings
    * MicrosoftAppId and MicrosoftAppPassword should be already available to you from the downloaded source code of the bot 
* LUIS settings
    * Follow [these instructions](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=csharp) to add LUIS to your bot
    * Once you have created a LUIS app, jump to [this section](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=csharp#retrieve-application-information-from-the-luisai-portal) to get LuisAppId, LuisAPIKey and LuiAPIHostName
* CDS connection settings
    * You will first need to create an application user in CDS using which you can interact with it
    * [Follow the steps here](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/build-web-applications-server-server-s2s-authentication)
    * DynamicsAppId and DynamicsAppSecret will be the appId and clientsecret of the AD app you have created above


# References
- [Create a bot with Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0)
- [Build LUIS app to determine user intentions](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-quickstart-intents-only)
- [FullTextSearchKnowledgeArticle Action](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/fulltextsearchknowledgearticle?view=dynamics-ce-odata-9)