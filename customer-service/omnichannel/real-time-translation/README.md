# Enable real time translation for conversations

## Pre-requisites

Since much of the real time translation behavior is defined by the web resource, follow the steps given below to create a new role `RTT privilege` and assign it to all the agents and supervisors.

1. Login to your organisation as an admin.
2. Go to **Advanced Settings**, then select **Security**.
3. Select **Roles** and create a new role with the name `RTT privilege`.
4. Select custom entities and select all privileges for **Custom item value**.
5. Save and close.
6. Now go to the Omnichannel administration app and enable Real Time Translation.

## What does this sample do?

This is a sample web resource that you can use to implement the logic for enabling real time translation of the conversation messages exchanged between the customer and the agent.

For more information about web resources, see [Web resources in model-driven apps](https://docs.microsoft.com/powerapps/developer/model-driven-apps/web-resources).

Once you have uploaded this file as a web resource, follow the instructions in the topic [Add a web resource for real time translation](https://docs.microsoft.com/dynamics365/omnichannel/developer/how-to/add-web-resource-real-time-translation) to copy its URL in the Omnichannel Administration app.

## See also

[Enable language translation for conversations](https://docs.microsoft.com/dynamics365/omnichannel/administrator/enable-chat-translation)
