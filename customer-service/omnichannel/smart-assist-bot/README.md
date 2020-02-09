# Build a custom smart assist bot

### Getting Started
Sample code provided in github contains smart bot implementation for KB article suggetion and natural language understanding(LUIS)

1) Deploying a new Smart Assist Bot
2) Integrating to an exisiting Azure Bot

### 1. Deploying a new Smart Assist Bot

To develop a new WebApp based Smart Bot, Please follow the steps mentioned below
Download the github sample and Open the code in visual studio 2017 or above and update the appsettings. This setup broadly contains the following steps.

1) Update the values in appsettings.json (SmartAssistBot/appsettings.json) file<br />
2) Publish the webapp to Azure<br />
3) Update the Messaging endpoint in Bot channels registration<br />
4) Enable Teams channel<br />
5) Test your Bot online<br />

##### Update appsettings.json <br />
Appsettings.json contains LUIS, Bot and CDS settings.
1) Follow the instructions mentioned in topic [Add natural language understanding to your bot](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=csharp) to add LUIS to your bot. Once you have created a LUIS app, see [this section](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-luis?view=azure-bot-service-4.0&tabs=csharp#retrieve-application-information-from-the-luisai-portal) to get `LuisAppId`, `LuisAPIKey` and `LuiAPIHostName`

    **LUIS** app settings can be left blank if you are interested only in KB search
    
        // LUIS connection settings
        "LuisAPIHostName": "westus.api.cognitive.microsoft.com",
        "LuisAPIKey": "",
        "LuisAppId": "",

2) Register a bot with Azure Bot Service and obtain the Microsoft App ID and a Client secret
    (a) App ID:
        - Create registration resource following [this documentation](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0#create-a-registration-resource)
        - Go to the Azure App Service resource which is just created.
        - In the right pane, in the resource blade, click on Settings. The resource Settings page opens up.
        - From the Settings page, copy the generated Microsoft App ID

    (b) Client Secret:
        * Generate Client secret or registration password like mentioned [here](https://docs.microsoft.com/en-us/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019)

3) Update the Microsoft App ID and secret in appsettings.json
    ```
    // Bot settings
    "MicrosoftAppId": "<Microsoft App Id as generated in step 1a>",
    "MicrosoftAppPassword": "<Microsoft App password as generated in step 1b>",
    "REMOTEDEBUGGINGVERSION": "15.0.28307.222",
    "ScmType": "None"```

4) Create an azure application to access dynamics CDS following [this link](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/walkthrough-register-app-azure-active-directory#create-an-application-registration) and copy the Application (client) ID and client secret

5) Update the CDS settings

     ```//Dynamics connection settings
    "DynamicsAppId": "<Azure Application Id created in step 3, This enables Bot to talk to CDS>",
    "DynamicsAppSecret": "<App secret for CDS App Id creates in step 3>",
    "DynamicsOrgUrl": "<CDS Org Url>",
    "TenantId": "<CDS Tenant Id>"```

**Publish your WebApp to azure**<br />

- Build your code and publish from visual studio like mentioned in this [link](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/walkthrough-register-app-azure-active-directory#create-an-application-registration)
- Copy the WebApp's endpoint which opens up in a browser after publishing. For Instance, lets say webapp endpoint is https://smartassistbot2020.azurewebsites.net/

**Update Messaging endpoint of Bot channels registration**<br />

- Now update the Messaging endpoint of Bot channels registration, created in 4(a) with the WebApps messaging endpoint created in previous step
**Messaging endpoint will be ```WebApp Endpoint + /api/messages```**  (i.e)  
_In our Example, it will be : https://smartassistbot2020.azurewebsites.net/api/messages_

**Enable Teams channel**
Please make sure to enable Teams channel like mentioned in this [link](https://docs.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0).

**Test your Smart bot**

- Test your bot online using ```Test in Web Chat``` option. See [here](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#test-the-bot) for more details. 
- If you are using trail org use keywords `travel`’  or ‘book’ or ‘audio equipment’ to see the smart suggestions

### 2 . Integrating Smart Assist to an exisiting Azure Bot

This sample code for building a custom smart assist bot is built on top of the bot code that is generated when you create an Azure webapp bot. More information: [Create a bot with Azure Bot Service > Download code](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#download-code).

For more information about the smart assist feature and how you can build your own custom smart assist bot, see [Build a custom smart assist bot](https://docs.microsoft.com/en-us/dynamics365/omnichannel/developer/how-to/smart-assist-bot).

1. [Create a bot with Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0).
2. [Download the source code](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0#download-code).
3. Once your bot source code is generated, make the changes given below.
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

5.  Publish the code and test the bot.

## See also

- [Build a custom smart assist bot](https://docs.microsoft.com/en-us/dynamics365/omnichannel/developer/how-to/smart-assist-bot)
- [Create a bot with Azure Bot Service](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0)
- [Build LUIS app to determine user intentions](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-quickstart-intents-only)
- [FullTextSearchKnowledgeArticle Action](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/fulltextsearchknowledgearticle?view=dynamics-ce-odata-9)
