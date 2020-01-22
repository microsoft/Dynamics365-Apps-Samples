# Distribute campaign activities to qualified marketing lists

This sample shows how to distribute campaign activities to the qualified members of a marketing list.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## How this sample works

In order to simulate the scenario described above, the sample will do the following:

### Setup

1. Checks for the current version of the org. 
2. The `CreateRequiredRecords` method creates any entity records that this sample requires.

### Demonstrate

1. The `DistributeCampaign` method creates and distributes campaign. 
2. The `CreateMarketingList` method creates static marketing lists. 
3. The `RemoveRelationships` method removes the marketing list from the campaign activity.

### Clean up

Display an option to delete the records created in the [Setup](#setup). The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.