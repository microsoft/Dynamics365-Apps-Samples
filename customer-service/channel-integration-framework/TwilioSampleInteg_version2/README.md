# Steps For deploying the Sample softphone for Channel Integration Framework 2.0

Prerequisite
------------------------------------------------------------------------------
1. Valid Azure subscription 
2. Channel Integration Framework version is 10.1.0.51 or higher (unique name of the solution is ChannelIntegrationFrameworkV2)

## Publishing the sample app to Azure
-------------------------------------
1. Open the solution "TwilioSampleInteg.sln" using Visual Studio 2017
2. In Solution Explorer, right-click on the solution and build the complete solution
3. In Solution Explorer, right-click on the project "TwilioSampleInteg"  and select "Publish"
4. Click on "Start" to launch the "Publish" wizard
5. Choose "App Service" as the publish target
6. Select "Create New" and click on "Publish"
7. Provide a suitable appname. In this document we will assume "TwilioSampleInteg"
8. Provide valid subscription, resource group and hosting plan details
9. Click on "Create" to create the azure app service
10. Note the app service URL. In this sample, we will use "https://twiliosampleinteg.azurewebsites.net"

## Creating a Twilio function for use with the app service
-----------------------------------------------------------
1. Follow the Twilio documentation to create a sample quickstart application: "https://www.twilio.com/docs/voice/client/javascript/quickstart"
2. Use the code from section "Twilio - Client voice" below for the "client-voice" Twilio function
3. Use the code from section "Twilio - Capability token" below for the "capability-token" Twilio function
4. Note the URL for the Twilio "capability-token" function created above. In this sample, we will use "https://twilio-sample.twil.io/capability-token"

## Configuring Dynamics 365 for using the sample app
------------------------------------------------------
1. Note the base URL of the Dynamics 365 org from where all web resources are served. For example: "https://<orgname>.crmXX.dynamics.com". In this sample, we will use "https://twiliosampleorg.crm10.dynamics.com"
2. Open  https://make.powerapps.com and select your environment from top left of the screen.
3. Select the ellipsis next to the Omnichannel for customer service app or Customer service workspace app.
4. Select App profile manager from the menu. More: https://docs.microsoft.com/en-us/dynamics365/app-profile-manager/overview
5. Select App Profiles from sitemap app and then select your app profile.
6. Select the Channels and then select Add Channel providers. The new Channel Provider page opens in a new browser tab.
7. Provide a suitable name and label.
8. Update the Channel URL field with the following value: 
    <azure_app_service_url>?base=<crm_base_url>&twa=<twilio_capability_token_url> In this sample, the URL would be "https://twiliosampleinteg.azurewebsites.net?base=https://twiliosampleorg.crm10.dynamics.com&twa=https://twilio-sample.twil.io/capability-token"
9. Select Yes for the Enable outbound communication field.
10. Set channel order to 0.
11. Save the changes.
12. Once Channel record is saved, go to the browser tab where App profile manager is opened and now add this record under selected app profile > channels > Voice channel providers. 
13. Import TwilioSampleData.zip (included in this sample code) in your org to get Notification and Session templates used in this sample code.
14. The softphone is now ready for testing.

## Channel Integration Framework Events required for Hold/Unhold scenarios
--------------------------------------------------------------------------

In order to make use of the Channel Integration Framework Analytics apis for Hold/Unhold scenarios, this sample app expects below mentioned events to be present in Channel Integration Framework:
1. CallHold
Microsoft.CIFramework.createRecord('msdyn_kpieventdefinition', JSON.stringify({"msdyn_name" : "CallHold", "msdyn_eventdescription" : "A call is put on hold.", "msdyn_eventtype" : "100000000", "msdyn_eventdisplayname": "Call Hold"}));

2. CallUnhold
Microsoft.CIFramework.createRecord('msdyn_kpieventdefinition', JSON.stringify({"msdyn_name" : "CallUnhold", "msdyn_eventdescription" : "A call is put on unhold.", "msdyn_eventtype" : "100000000", "msdyn_eventdisplayname": "Call Unhold"}));

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