# Sample: Use msdyn_ForecastApi custom action

This sample shows how to use the `msdyn_ForecastApi` custom action.

## How to run this sample

Follow these steps to run this sample.

1. Open the `ForecastPublicApiUsageDemo.sln` file in Visual Studio.
2. Add your organization URL and login credentials in the `App.config` file.
3. Select **Tools**>**NuGet Package Manager**>**Package Manager Console** and install the NuGet package `Microsoft.CrmSdk.CoreAssemblies v9.0.2.26`.
4. Build and then run the solution by selecting the **Start** button or by pressing **CTRL**+**F5** on your keyboard.

For more information, see [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md).

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
