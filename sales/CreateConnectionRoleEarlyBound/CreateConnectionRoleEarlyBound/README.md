
# Sample: Create a connection role (early bound)

This sample shows how to create a connection role that can be used for accounts and contacts.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This sample creates a connection role that can be used for accounts and contacts.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

- Create a new connection role instance and set the object type.
- Create a Connection Role for account and contact.
    - Create a related Connection Role Object Type Code record for Account.
    - Create a related Connection Role Object Type Code record for Contact.
- Optionally delete any entity records that were created for this sample. The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.

### Demonstrate

This sample shows how to create a connection role that can be used for accounts and contacts.