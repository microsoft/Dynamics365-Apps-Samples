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
- Retrieve participating records for a forecast instance and export as a csv file named ParticipatingRecords_ForSingleForecastInstance.csv.
- Retrieve all forecast instances and their participating records and export as csv files named Forecast.csv and ParticipatingRecords_ForForecast.csv respectively.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will retrieve and update the forecasting data. You will need to create sample forecasting data to run this sample code. The sample adds a new column namely `Quota` to the forecasting data. The changes can be reverted manually through the UI.

Below are sample csv formats for forecasts and participating records created in the last two steps. The values are the forecast values for the configuration and the recurrence period mentioned in step 3 of [How to run this sample](#how-to-run-this-sample).

Forecasts.csv
HierarchyRecordId,IsGroupRow,$User,Quota,Won,Best case,Committed,Pipeline,Forecast,Prediction
34bfa932-425a-ef11-bfe2-6045bd0a9aca,false,Dustin Ochs,0,0,0,0,5000,0,0
c142f379-f856-ef11-bfe3-000d3a5b3e08,false,Kenny Smith,0,0,0,0,20000,0,0
c142f379-f856-ef11-bfe3-000d3a5b3e08,true,Kenny Smith,0,0,0,0,25000,0,0

ParticipatingRecords_ForForecast.csv
Status,Actual Close Date,Status Reason,Currency,Forecast category,Potential Customer,Owner,Est. close date,System User,Opportunity,Topic,Est. revenue
Open,2024-08-14,InProgress,US Dollar,Pipeline,"Fabrikam, Inc. (sample)",Dustin Ochs,2024-08-23,34bfa932-425a-ef11-bfe2-6045bd0a9aca,71c467a4-4a5a-ef11-bfe2-6045bd07d9e5,6 orders of Product SKU JJ202 (sample),5000.0000000000
Open,2024-08-14,InProgress,US Dollar,Pipeline,Blue Yonder Airlines (sample),Kenny Smith,2024-08-23,c142f379-f856-ef11-bfe3-000d3a5b3e08,73c467a4-4a5a-ef11-bfe2-6045bd07d9e5,Needs to restock their supply of Product SKU AX305; will purchase at least 25-50 (sample),5000.0000000000
Open,2024-08-14,InProgress,US Dollar,Pipeline,Contoso Pharmaceuticals (sample),Kenny Smith,2024-08-23,c142f379-f856-ef11-bfe3-000d3a5b3e08,77c467a4-4a5a-ef11-bfe2-6045bd07d9e5,They sell many of the same items that we do - need to follow up (sample),5000.0000000000
Open,2024-08-14,InProgress,US Dollar,Pipeline,Alpine Ski House (sample),Kenny Smith,2024-08-23,c142f379-f856-ef11-bfe3-000d3a5b3e08,79c467a4-4a5a-ef11-bfe2-6045bd07d9e5,Very likely will order 18 Product SKU JJ202 this year (sample),5000.0000000000
Open,2024-08-14,InProgress,US Dollar,Pipeline,Coho Winery (sample),Kenny Smith,2024-08-23,c142f379-f856-ef11-bfe3-000d3a5b3e08,7dc467a4-4a5a-ef11-bfe2-6045bd07d9e5,Will be ordering about 110 items of all types (sample),5000.0000000000



### Demonstrate

This sample demonstrates how you can use the `msdyn_ForecastApi` custom action to perform various actions to retrieve and update forecasting data. [Learn more](https://learn.microsoft.com/en-us/dynamics365/sales/developer/reference/custom-actions/msdyn_forecastapi). The [Schema](https://github.com/microsoft/Dynamics365-Apps-Samples/tree/master/sales/ForecastingAPI/ForecastPublicApiUsageDemo/Schema) folder contains the detailed schema of the forecast configuration, forecast recurrence and forecast instance entities, that are returned as part of the response payload from the various APIs. 
