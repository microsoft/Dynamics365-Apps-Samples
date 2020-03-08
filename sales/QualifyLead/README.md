# Sample: Qualify a lead

This sample shows how to qualify a lead and create an account, contact, or opportunity based on the lead.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This sample shows how to qualify a lead and create an account, contact, or opportunity based on the lead.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

### Setup

1. Create two leads.
2. Create an account to relate the opportunity to.

### Demonstrates

1. Qualify the first lead, creating an account and a contact from it, but not creating an opportunity.
2. Retrieve the organization's base currency ID for setting the transaction currency of the opportunity.
3. Qualify the second lead, creating an opportunity from it, and not creating an account or a contact. We use an existing account for the opportunity customer instead.

### Clean up

1. Display an option to delete the records created in [Setup](#setup).

    The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.