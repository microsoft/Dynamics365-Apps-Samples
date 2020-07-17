# Sample: Use msdyn_ForecastApi custom action

This sample shows how to use the `msdyn_ForecastApi` custom action.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

The sample lets you:

- Retrieve all forecast configurations configured.
- Retrieve all forecast configurations having the name provided as part of request payload.
- Retrieve all the forecast periods for the active forecast configuration Id, that is provided as part of the request payload.
- Retrieve the list of forecast instances that are a single row entity record.
- Update the specific column values using the values of the passed parameters.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will retrieve and update the forecasting data. You will need to create sample forecasting data to run this sample code. The sample adds a new column namely `Quota` to the forecasting data. The changes can be reverted manually through the UI.

### Demonstrate

This sample demonstrates how you can use the `msdyn_ForecastApi` custom action to perform various actions to retrieve and update forecasting data.    
