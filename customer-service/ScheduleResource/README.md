---
languages:
- csharp
products:
- dynamics-customer-service
page_type: sample
level: beginner
role: developer
description: "Sample that shows how to find opening to schedule a resource in Dynamics 365 Customer Service."
---

# Sample: Search for openings to schedule a resource

This sample shows how to find openings to schedule a resource by using the [SearchRequest](https://docs.microsoft.com/dotnet/api/microsoft.crm.sdk.messages.searchrequest?view=dynamics-general-ce-9) message.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This sample shows how to find openings to schedule a resource by using the [SearchRequest](https://docs.microsoft.com/dotnet/api/microsoft.crm.sdk.messages.searchrequest?view=dynamics-general-ce-9) message.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

### Setup

1. Gets the current user's information.
2. Creates the van resource.
3. Defines an anonymous type to define the possible constraint based group type code values.
4. Creates the plumber resource group.
5. Create the plumber required resource object.
6. Create the service for the equipment.
7. Deletes any entity records that were created for this sample.

### Clean up

1. Display an option to delete the records created in [Setup](#setup).

    The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.