# Sample: Use msdyn_ForecastApi custom action

This sample shows how to use the `msdyn_ForecastApi` custom action.

## How to run this sample

Follow these steps to run this sample.

1. Open the `ForecastPublicApiUsageDemo.sln` file in Visual Studio.
2. Add your organization URL and login credentials in the `App.config` file.
3. Update the Constants.cs file with the required values, namely forecastConfigurationName and forecastperiodName. The sample assumes the org has "Sample Forecast" forecast configuration and current month's forecast recurrence.
4. Select **Tools**>**NuGet Package Manager**>**Package Manager Console** and install the NuGet package `Microsoft.CrmSdk.CoreAssemblies v9.0.2.26`.
5. Build and then run the solution by selecting the **Start** button or by pressing **F5** on your keyboard.

For more information, see [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md).

## What this sample does

The sample lets you:

- Retrieve all forecast configurations configured.
- Retrieve all forecast configurations having the name provided as part of request payload.
- Retrieve all the forecast periods for the active forecast configuration Id, that is provided as part of the request payload.
- Retrieve the list of forecast instances that are a single row entity record.
- Update the specific column values using the values of the passed parameters.
- Creates a csv file showing the forecast values

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will retrieve and update the forecasting data. You will need to create sample forecasting data to run this sample code. The sample adds a new column namely `Quota` to the forecasting data. The changes can be reverted manually through the UI.

The sample also creates a csv file that shows record id, record name and the values of the columns that are configured. The values are the forecast values for the configuration and the recurrence period mentioned in step 3 of [How to run this sample](#how-to-run-this-sample).

Below is a sample csv file that was created.

HierarchyRecordId,User,Quota,Won,Best case,Committed,Pipeline,Forecast,Prediction
482da819-4336-ef11-a317-000d3a5a9882,Kenny Smith,0,0,2550,6107,16586,6107,0
5a74b9d7-fc37-ef11-a316-000d3a34d462,Dustin Ochs,0,0,0,11949,3583,11949,0
6974b9d7-fc37-ef11-a316-000d3a34d462,Millard Lamontagne,0,0,9575,12180,9869,12180,0

### Demonstrate

This sample demonstrates how you can use the `msdyn_ForecastApi` custom action to perform various actions to retrieve and update forecasting data. [Learn more](https://learn.microsoft.com/en-us/dynamics365/sales/developer/reference/custom-actions/msdyn_forecastapi). The [Schema](https://github.com/microsoft/Dynamics365-Apps-Samples/tree/master/sales/ForecastingAPI/ForecastPublicApiUsageDemo/Schema) folder contains the detailed schema of the forecast configuration, forecast recurrence and forecast instance entities, that are returned as part of the response payload from the various APIs. 
