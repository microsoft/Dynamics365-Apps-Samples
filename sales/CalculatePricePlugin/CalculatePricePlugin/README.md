# Sample: Calculate Price plug-in

write a plug-in that calculates the pricing of the opportunities, quotes, orders, and invoices based on your custom code. The discounts and taxes are calculated based on the total amount of all the product line items in an opportunity, quote, order, or invoice:

**Discount**: If the total amount is greater than 1000 and less than 5000, discount is 5%; if the total amount is 5000 or greater, discount is 10%.

**Tax**: Tax is applied on the amount that is effective after the discount is applied (total amount minus discount). If the effective amount is less than 5000, tax is 10%; otherwise, tax is 8%.

For more information, see [Use custom pricing for products](https://docs.microsoft.com/dynamics365/customerengagement/on-premises/developer/use-custom-pricing-products).

## How to run this sample

See [How to run samples](https://github.com/microsoft/PowerApps-Samples/blob/master/cds/README.md) for information about how to run this sample.

## What this sample does

1. Calculates price in an opportunity
2. Calculates price in a quote
3. Calculates extended amount in the product line items in a quote
4. Calculate price in an order
5. Calculates extended amount in the product line items in a order
6. Calculates price in an invoice
7. Calculates extended amount in the product line items in an invoice
8. Calculates discount

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

### Demonstrate

Demonstrates how to calculate the pricing of the opportunities, quotes, orders, and invoices based on your custom code.

### Clean up

1. Display an option to delete the records created in [Setup](#setup).

    The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.