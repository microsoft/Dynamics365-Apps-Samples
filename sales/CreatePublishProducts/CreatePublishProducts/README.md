
# Sample: Create and publish products

This sample shows how to create and publish products.

## How to run this sample

See [How to run samples](https://github.com/microsoft/PowerApps-Samples/blob/master/cds/README.md) for information about how to run this sample.

## What this sample does

This sample creates and publishes products.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

- Create and configure the organization service proxy.  
- Initiate creating all entity records that this sample requires.  
- Create a product family with a product property and two child product records.  
- Create a substitute relation between the two products.  
- Override the product property for one of the child products.  
- Publish the product family hierarchy, including the child records.  
- Revise a child product to overwrite the overridden property.  
- Publish the child product.  
- Optionally delete any entity records that were created for this sample. The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.

### Demonstrate

This sample demonstrates how to:

- Create a product family, product property, and child products.
- Override a product property at a child product level.
- Publish the product hierarchy.
- Revise a child product to overwrite the overridden property.

    