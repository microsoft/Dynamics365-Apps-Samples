# Fulfill a sales order

This sample shows how to create a sales order and then close it by fulfilling it.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This sample shows how to create a sales order and then close it by fulfilling it.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

### Setup

1. Creates a customer for the sales order.
2. Create an account to be used with the sales account.
3. Creates the email activity.
4. Creates a customer for the sales order.
5. Creates the sales order to close.

### Demonstrate

1. Calls the `FulfillSalesOrderRequest` method and closes it as completed.

### Clean up

Display an option to delete the records created in the [Setup](#setup). The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.