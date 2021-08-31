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
description: "Sample that shows how to create a dynamic marketing list, copy it to the static marketing list and distribute campaign activities to the members in Dynamics 365 Marketing."
---

# Distribute campaign activities to dynamic and static lists

This sample shows how to create a dynamic marketing list, copy it to the static marketing list, and distribute campaign activities to the members of the marketing lists.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## How this sample works

In order to simulate the scenario described above, the sample will do the following:

### Setup

1. Checks for the current version of the org. 
2. The `CreateRequiredRecords` method creates any entity records that this sample requires.

### Demonstrate

1. The `List` method creates a dynamic list. The list is considered to be a dynamic list only when the `Type` parameter is set to true. 
2. The `Campaign` method creates a campaign. 
3. The `AddItemCampaignRequest` method adds the dynamic list to the campaign.
4. The `CampaignActivity` method creates a campaign activity to distribute fax to the list members.
5. The `AddItemCampaignActivityRequest` method adds the dynamic list to the campaign activity.
6. The `CopyDynamicListToStaticRequest` method copies the dynamic list to a static list.
7. The `DistributeCampaignActivityRequest` method distributes the campaign activity to the marketing lists.

### Clean up

Display an option to delete the records created in the [Setup](#setup). The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.