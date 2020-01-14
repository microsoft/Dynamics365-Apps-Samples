# Build a custom smart assist bot

This sample code for building a custom smart assist bot is built on top of the bot code that is generated when you create an Azure webapp bot. More information: [Create a bot with Azure Bot Service > Download code](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#download-code).

For more information about the smart assist feature and how you can build your own custom smart assist bot, see [Build a custom smart assist bot](https://docs.microsoft.com/en-us/dynamics365/omnichannel/developer/how-to/smart-assist-bot).

## Getting Started

1.	[Create a bot with Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0).
2.	[Download the source code](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#download-code).
3. 	Once your bot source code is generated, make the changes given below. 
    * Copy the folder [SmartAssist](SmartAssistBot/SmartAssist) into the `<Bot name>` folder.
    * Add the required values for connecting to your Dynamics 365 organization and LUIS as shown in [appsettings.json](SmartAssistBot/appsettings.json) file.
    * Add a package reference to adaptive cards in the `.csproj` file similar to [CoreBot.csproj](SmartAssistBot/CoreBot.csproj) file.
    * Register Smart assist bot and other operations in `ConfigureServices()` in [Startup.cs](SmartAssistBot/Startup.cs) file. 
4.	Fill the values in [appsettings.json](SmartAssistBot/appsettings.json) file.

    There are 3 primary sections in `appsettings.json` file that you will have to fill correctly for this sample code to work - 
      - **Bot settings**<br />
        `MicrosoftAppId` and `MicrosoftAppPassword` are already available to you from the downloaded source code of the bot 
      - **LUIS settings**<br />
        Follow the instructions mentioned in topic [Add natural language understanding to your bot](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=csharp) to add LUIS to your bot.
      - Once you have created a LUIS app, see [this section](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=csharp#retrieve-application-information-from-the-luisai-portal) to get `LuisAppId`, `LuisAPIKey` and `LuiAPIHostName`.
      - **CDS connection settings**<br />
        You will first need to create an application user in CDS using which you can interact with it. Follow the steps mentioned in the PowerApps topic [Build web applications using Server-to-Server(S2S) authentication](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/build-web-applications-server-server-s2s-authentication).
      * `DynamicsAppId` and `DynamicsAppSecret` are the application Id and client secret of the Azure Active Directory app that you have created in the previous step.
Use `services.AddTransient<IBot, SmartAssistBot>();` to register the smart assist bot.

5.  Publish the code and test the bot. For more information on how to test the bot, see [Test the bot](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#test-the-bot).

## See also

- [Build a custom smart assist bot](https://docs.microsoft.com/en-us/dynamics365/omnichannel/developer/how-to/smart-assist-bot)
- [Create a bot with Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0)
- [Build LUIS app to determine user intentions](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-quickstart-intents-only)
- [FullTextSearchKnowledgeArticle Action](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/fulltextsearchknowledgearticle?view=dynamics-ce-odata-9)
