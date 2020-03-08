# Sample: Process quotes, sales orders and invoices

This sample shows how to convert an opportunity that is won to a quote, then convert a quote to a sales order, and then convert a sales order to an invoice. It also shows how to lock and unlock the sales order and the invoice prices.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This sample converts a "won" opportunity to a quote and then converts a quote to a sales order, and a sales order to an invoice. Also demonstrates locking/unlocking prices on both sales orders and invoices.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

- Create and publish a product
- Create Opportunities.
- Win Opportunity.
- Lose Opportunity.
- Convert Opportunity to a Quote.
- Close Quote.
- Create Quote's Product
- Convert Quote to SalesOrder.
- Cancel Sales Order.
- Lock pricing on SalesOrder.
- Convert SalesOrder to Invoice.
- Lock pricing on Invoice.
- The three system users that were created by this sample will continue to exist on your system because system users cannot be deleted in the environment.  They can only be enabled or disabled. The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.

### Demonstrate

This sample shows how to convert an opportunity that is won to a quote, then convert a quote to a sales order, and then convert a sales order to an invoice. It also shows how to lock and unlock the sales order and the invoice prices.