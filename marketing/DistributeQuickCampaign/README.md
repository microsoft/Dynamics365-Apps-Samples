---
languages:
- csharp
products:
- dynamics
- dynamics-365
- dynamics-marketing
page_type: sample
level: 
- beginner
- intermediate
- advanced
role: developer
description: "Sample that shows how to create and distribute a quick campaign in Dynamics 365 Marketing."
---

# Distribute a quick campaign

This sample shows how to create and distribute a quick campaign.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This sample shows how to create and distribute a quick campaign.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

### Setup

1. Checks for the current version of the org. 
2. The `CreateRequiredRecords` method creates any entity records that this sample requires.
3. The `CreateAndRetrieveQuickCampaignForQueryExpression` method creates a quick campaign for a set of accounts selected by a query.
4. The `CreateAndRetrieveQuickCampaignForMarketingList` method creates quick campaign for a given marketing list and returns the Guid of the quick campaign.
        
### Demonstrate

1. The `List` method creates the marketing list that is required for the sample. 
2. The `QueryExpression` method constructs a query expression to specify which records quick campaign should include. 

### Clean up

Display an option to delete the records created in the [Setup](#setup). The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.