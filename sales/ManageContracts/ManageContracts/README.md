
# Sample: Manage contracts

This sample shows how to create and manage contracts.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

This method first connects to the Organization service. Afterwards, a Contract Template and several Contracts are created, demonstrating how to create and work with the Contract entity.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

- Create Contract
    - Create a Contract from the Contract Template.
    - Create a contract line item.
- Clone contract twice
    - Create the first clone of the contract.
    - Create the second clone of the contract.
    - Retrieve all Contracts.
    - Display the retrieved Contract Ids.
- Invoice the contract to deactivate it (put on hold). 
- Put the contract on hold.
- Renew an invoiced contract.
    - Invoice the contract.
    - Cancel the contract.
    - Renew the canceled contract.
    - Retrieve Id of renewed contract.
    - Display the Id of the renewed contract.

- Two of the contracts, their associated account and the contract template records that were created and used in this sample will continue to exist on your system because contracts that have been invoiced cannot be deleted in your environment. They can only be put on hold or canceled.

### Demonstrate

This sample shows how to create and manage contracts.