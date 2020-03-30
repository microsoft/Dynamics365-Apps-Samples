# OmniChannel Connector Sample

This document describe how to run the sample connector which is integarted to OmniChannel through Direct Line Bot. This source code is intended for the developers reference to create their own connector. In this sample, we are using Direct Line API 3.0 via .NET SDK to create a direct line client and we have created following channel adapeter to build this sample connector:
  - MessageBird

## Prerequisites!

-   [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/) and above.
-   [ngrok](https://ngrok.com/download) which allows you to expose a web server running on your local machine to the internet.

## How To

- Download the source code.
- Open `Microsoft.OmniChannel.Connector.Sample.sln` in visual studio.
- Fill following values in the appsettings.json file under `RelayProcessorSettings`.
 
    | Key | Value |
    | ------ | ------ |
    | DirectLineSecret | Direct Line Channel Secret |
    | BotHandle | Bot Handle |
    | PollingIntervalInMilliseconds | Polling frequency to receive activities from OmniChannel throgh Direct Line Bot |

- Fill following values in the appsettings.json file under `MessageBirdAdapterSettings`.
 
    | Key | Value |
    | ------ | ------ |
    | MessageBirdAccessKey | Access key of the MessageBird |
    | MessageBirdSigningKey | Signing key of the MessageBird |
- Add Conversation Context and Customer context as a keyvalue pair under the channel data in `PayloadToActivity` method in respective Adapter helper class.

        var channelData = new ActivityExtension
        {
            ChannelType = ChannelType.MessageBird,

            // Add Conversation Context in below dictionary object. Please refer the design document for more information.
            ConversationContext = new Dictionary<string, string>(),

            // Add Customer Context in below dictionary object. Please refer the design document for more information.
            CustomerContext = new Dictionary<string, string>()
        };

- Set `Microsoft.OmniChannel.Adapters.Service` as startup project and press F5 to run the solution.
- Open ngrok command prompt and run `ngrok http 65481 -host-header="localhost:65481"`
- Above step generates https ngrok forwarding URI. Replace `<ngrokURI>` in following URL and configure this URL in MessageBird for the incoming webhook request.
    `https://<ngrokURI>/api/MessageBirdAdapter/postactivityasync`.

_Note: Application logs will be stored in `Microsoft.OmniChannel.Adapters.Service/Logs` folder as a text file._


## See also

|Resource link|Description|
|------|------|
|[Direct Line API 3.0](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts?view=azure-bot-service-4.0) | Introduces key concepts of Direct Line API 3.0 and provides information about relevant developer resources.|
|[MessageBird API Docs](https://developers.messagebird.com/api/) | Communication APIs and technical resources to help you build your MessageBird communication solution.|
