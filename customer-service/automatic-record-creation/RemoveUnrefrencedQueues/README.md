---
languages:
- csharp
products:
- dynamics-customer-service
page_type: sample
level: beginner
role: developer
description: "Sample that shows how Automatic Record Creation for Dynamics 365 Customer Service can be customized to remove unrefrenced queues from recieved emails"
---

# Sample: ARC Multi-Related - Remove Unrefrenced Queues

This sample shows how to write a simple plug-in that updates the activity parties on an email removing any related item's created by ARC that are no longer party to the email.  This assumes that the org has enabled ARC's Multi-Related for Email feature.

## Usecases Covered

1. An external user sends an email to a queue monitored by Automatic Record Creation (ARC).  ARC creates a case for that email and adds the created case to the email's related activity party list. Because of this relationship the email is shown on the case's timeline view.  The user then forwards an email from that chain to another mailbox (example. The Agent's Manager).  This custimization allows for organizations that  do not want that forwarded email on the timeline like it would be by default.
2. Similarlly, If a user replies to an email that was sent to multiple ARC Rules (example. email sent to support and engineering queues) and the user removes one of those mailboxes from a reply, this customization would remove the cases not assosciated with a recipient. (ex. if sent to only support queue any cases created from the engineering queue would be removed).


## How to run this sample

1. Download or clone the [Dynamics 365 Samples](https://github.com/microsoft/Dynamics365-Apps-Samples) repo so that you have a local copy. This sample is located under customer-service\automatic-record-creation\RemoveUnrefrencedQueues.
2. Open the sample solution in Visual Studio, navigate to the project's properties, and verify the assembly will be signed during the build. Press F6 to build the sample's assembly (RemoveUnrefrencedQueues.dll).
3. Run the Plug-in Registration tool and register the sample's assembly in the D365 server's sandbox and database. When registering a step, specify the Create message, email table, and syncronous mode on Post Create stage.
4. Create two or more Automatic Record Creation rules with unique queue mailboxes
5. Trigger case creation of the ARC rule by sending an email to the configured queue for one of the ARC rules
6. Test the plugin by replying or forwarding that email to different ARC enabled queues
6. When you are done testing, unregister the assembly and step.

Note that the plugin is run syncronously so that at no point does the email show on the timelines for related items that would be removed.

## What this sample does

When executed upon creation of an email, the plugin removes any ARC created activity parties that are no longer party to the email.  It does this by comparing the originating queue of the regarding objects with the recipient queues. 

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

- Look at an email
- Find the related activity parties on the email
- Find the originating queue for any related entities
- Remove any related activity parties where the originating queue is no longer party to this email. Ex. remove the case created by the supprot queue if this email no longer has the Support queue in the to/cc/bcc fields

### Demonstrates

1. How to get the relatied parties
2. How to find the originating queue for the related parties created by ARC
3. How to update the related parties on the email

### See also

[Write a plug-in](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/write-plug-in)  
[Register a plug-in](https://docs.microsoft.com/en-us/powerapps/developer/common-data-service/register-plug-in)