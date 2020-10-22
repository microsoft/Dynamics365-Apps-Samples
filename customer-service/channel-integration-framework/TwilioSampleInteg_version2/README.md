# Steps For deploying the Sample softphone for Channel Integration Framework 2.0

This document assumes a valid Azure subscription is available

## Publishing the sample app to Azure
-------------------------------------
1. Unzip the folder "ChannelApiFrameworkv2_SampleApp.zip"
2. Open the solution "TwilioSampleInteg.sln" using Visual Studio 2017
3. In Solution Explorer, right-click on the solution and build the complete solution
4. In Solution Explorer, right-click on the project "TwilioSampleInteg"  and select "Publish"
5. Click on "Start" to launch the "Publish" wizard
6. Choose "App Service" as the publish target
7. Select "Create New" and click on "Publish"
8. Provide a suitable appname. In this document we will assume "TwilioSampleInteg"
9. Provide valid subscription, resource group and hosting plan details
10. Click on "Create" to create the azure app service
11. Note the app service URL. In this sample, we will use "https://twiliosampleinteg.azurewebsites.net"

## Creating a Twilio function for use with the app service
-----------------------------------------------------------
1. Follow the Twilio documentation to create a sample quickstart application: "https://www.twilio.com/docs/voice/client/javascript/quickstart"
2. Use the code from section "Twilio - Client voice" below for the "client-voice" Twilio function
3. Use the code from section "Twilio - Capability token" below for the "capability-token" Twilio function
4. Note the URL for the Twilio "capability-token" function created above. In this sample, we will use "https://twilio-sample.twil.io/capability-token"

## Configuring Dynamics 365 for using the sample app
------------------------------------------------------
1. Note the base URL of the CRM org from where all webresources are served. For an online org, this should be of the form "https://<orgname>.crmXX.dynamics.com". In this sample, we will use "https://twiliosampleorg.crm10.dynamics.com"
1. Install the solution "Dynamics 365 Channel Integration Framework"
2. Open the UCI app "Channel Integration Framework"
3. Click on "New" to create a new "Channel Provider"
4. Provide a suitable name and label
5. For Channel URL, provide the URL as <azure_app_service_url>?base=<crm_base_url>&twa=<twilio_capability_token_url>. In this sample, the URL would be "https://twiliosampleinteg.azurewebsites.net?base=https://twiliosampleorg.crm10.dynamics.com&twa=https://twilio-sample.twil.io/capability-token"
6. For "Enable outbound communication", select "yes".
7. Set channel order to "0"
8. Select the UCI apps and user roles for which this sample softphone should be enabled
9. Save all changes
10. The softphone is now ready for testing

## Important considerations
----------------------------
1. All URLs must be https.
2. If a self-signed certificate is used for the azure app or the CRM org, some browsers may silently reject the connection and fail to load the sample phone. As a workaround, open the azure app in a separate tab and accept the certificate once.
3. Ensure microphone and speaker access is not blocked by browser policy


## Twilio - Client voice
--------------------------

```javascript
exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();

    if(event.To) {
      // Wrap the phone number or client name in the appropriate TwiML verb
      // if is a valid phone number
      const attr = isAValidPhoneNumber(event.To) ? 'number' : 'client';
      if(event.To == '<TwilioPhoneNumber>')	//Put the Twilio phone number to be used for this sample here
      {
        const dial = twiml.dial({
            callerId: event.From,
        });
        dial['client']({}, 'TwilioSampleIntegDemo');    //Choose a suitable client name here
      }
      else {
        const dial = twiml.dial({
            callerId: context.CALLER_ID,
        });
        dial[attr]({}, event.To);
      }
    } else {
      twiml.say('No dialing To no. found!');
    }

     callback(null, twiml);
};

/**
* Checks if the given value is valid as phone number
* @param {Number|String} number
* @return {Boolean}
*/
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
```

VI) Twilio - Capability token
------------------------------

```javascript
exports.handler = function(context, event, callback) {
  
  let response = new Twilio.Response();

  // Add CORS Headers
  let headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Content-Type": "application/json"
  };
    
  // Set headers in response
  response.setHeaders(headers);
  
  response.setStatusCode(200);
  
  let ClientCapability = require('twilio').jwt.ClientCapability;

  const identity = 'TwilioSampleIntegDemo'
  const capability = new ClientCapability({
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
  });

  capability.addScope(new ClientCapability.IncomingClientScope(identity));
  capability.addScope(new ClientCapability.OutgoingClientScope({
    applicationSid: context.TWIML_APP_SID,
    clientName: identity,
  }));

  // Include identity and token in a JSON response
  response.setBody({
    'identity': identity,
    'token': capability.toJwt()
  });
  
  callback(null, response);
};
```

VII) Import configuration data
------------------------------

1. Download the Configuration Migration Tool. The Configuration Migration tool is available as a NuGet package.
2. Start the Configuration Migration tool. Double-click DataMigrationUtility.exe in the folder: [your folder]\Tools\ConfigurationMigration\
3. On the main screen, click Import data, and click Continue.
4. On the Login screen, provide authentication details to connect to your Dynamics 365 instance from where you want to import data. If you have multiple organizations on the Dynamics 365 for Customer Engagement server, and want to select the organization where to import the configuration data, select the Always display list of available orgs check box. Click Login.
5. If you have multiple organizations, and you selected the Always display list of available orgs check box, the next screen lets you choose the organization that you want to connect to. Select a Dynamics 365 apps organization to connect to.
6. Provide the data file. (data.zip) to be imported. Browse to the data file, and select it. Click Import Data.
7. This step is applicable only if the data that you are importing contains the user information of the source system. Enter mapping user information on the target system. You can either map all of them to the user who is running the import process or map to individual users by using a user map file (.xml). If you choose the latter, you will have to either specify an existing user map file or the tool can generate it for you. If you generate a new file, fill in the mapping user name in the New parameter for every user on the source server. Select the user map file in the tool when you are done, and click OK.
8. The next screen displays the import status of your records. The data import is done in multiple passes to first import the foundation data while queuing up the dependent data, and then import the dependent data in the subsequent passes to handle any data dependencies or linkages. This ensures clean and consistent data import.
9. Click Finish to close the tool.