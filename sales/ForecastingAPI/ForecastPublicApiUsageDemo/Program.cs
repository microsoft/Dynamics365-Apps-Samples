using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xrm.Sdk;
using ForecastPublicApiUsageDemo.Forecasting;
using ForecastPublicApiUsageDemo.CRM;
using ForecastPublicApiUsageDemo.Utility;

namespace ForecastPublicApiUsageDemo
{
    /// <summary>
    /// Main Application
    /// </summary>
    class Program
    {
        private void Execute()
        {
            IOrganizationService orgService = OrganizationService.CreateOrgService();

            if (orgService == null)
            {
                LogWriter.GetLogWriter().LogWrite("Something went wrong during connection to CRM Org!");
                return;
            }

            var da = new ForecastDataAccess(orgService);
            PerformUsecase(da);
        }

        /// <summary>
        /// This will demonstrate Use case of:
        /// 1. Fetching forecast configuration list
        /// 2. Fetching forecast configuration using the name
        /// 3. Fetching forecast Periods for the forecast configuration
        /// 4. Fetching all the forecast Instances for the given forecast configuration and forecast period
        /// 5. Updating their column value using update simple column API by forecast Instance Id
        /// 6. Validating the updates are successful.
        /// 7. Fetching participating records for a given forecast instance and exporting to CSV
        /// 8. Fetching all forecasts, participating records and exporting to csv. This data can be stored as snapshot data for later data analysis.
        /// </summary>
        /// <param name="da">Forecast Data Access Object</param>
        private void PerformUsecase(ForecastDataAccess da)
        {
            //1. Fetching full Forecast Configuration List 
            LogWriter.GetLogWriter().LogWrite("1. Fetching full Forecast Configuration List...");
            var fcs = da.GetFCList();
            LogWriter.GetLogWriter().LogWrite($"Total FCs:{fcs.Count}");
            LogWriter.GetLogWriter().LogWrite($"FCs Names: {string.Join(", ", fcs.ConvertAll(c => c.Name).ToArray())}");
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            //2. Fetching forecast configuration by name            
            const string sampleFCName = Constants.forecastConfigurationName;
            LogWriter.GetLogWriter().LogWrite($"2. Fetching forecast configuration by name \"{sampleFCName}\" ...");
            var fcsByName = da.GetFCListByName(sampleFCName);

            if (fcsByName.Count == 0)
            {
                LogWriter.GetLogWriter().LogWrite("No FC found. Please provide a valid FC Name.");
                return;
            }
            else if (fcsByName.Count > 1)
            {
                LogWriter.GetLogWriter().LogWrite($"Multiple FCs found with name \"{sampleFCName}\". Count:{fcsByName.Count > 0}");
                LogWriter.GetLogWriter().LogWrite($"FCs Id: {string.Join(", ", fcsByName.ConvertAll(c => c.ForecastConfigurationId).ToArray())}");
            }
            else if (fcsByName.Count == 1)
            {
                LogWriter.GetLogWriter().LogWrite($"FC found with id : {fcsByName[0].ForecastConfigurationId}");
            }
            var sampleFC = fcsByName[0];
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            //3. Fetching forecast periods for the forecast configuration
            var sampleFRName = string.Format(Constants.forecastperiodName, DateTime.Now.Year, DateTime.Now.ToString("MMMM"));
            LogWriter.GetLogWriter().LogWrite($"3. Fetching forecast periods for the forecast configuration...");
            var forecastRecurrences = da.GetForecastPeriodsList(sampleFC.ForecastConfigurationId);
            LogWriter.GetLogWriter().LogWrite($"Periods fetched : {string.Join(",", forecastRecurrences.ConvertAll(c => c.Name).ToArray())}");

            var frResults = forecastRecurrences.Where(o => o.Name == sampleFRName).ToList();
            if (frResults.Count == 0)
            {
                LogWriter.GetLogWriter().LogWrite($"No forecast period found with the given name \"{sampleFRName}\".Please provide a valid forecast period Name");
                return;
            }
            var sampleFR = frResults[0];
            LogWriter.GetLogWriter().LogWrite($"Forecast period with given name \"{sampleFRName}\" found.");
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            // 4. Fetching all the forecast Instances for the given forecast configuration and forecast period
            LogWriter.GetLogWriter().LogWrite($"4. Fetching forecasts for above forecast configuration and period...");
            var forecastInstances = da.FetchFullFIList(sampleFC.ForecastConfigurationId, sampleFR.Id);
            LogWriter.GetLogWriter().LogWrite("Forecasts fetched count: " + forecastInstances.Count);
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            // 5. Updating their column value using update simple column API by forecast Instance Id
            LogWriter.GetLogWriter().LogWrite($"5. Building random dataset and updating forecast simple column data...");
            Dictionary<Guid, double> dataSet = UtilityImpl.PrepareDataSet(forecastInstances);
            LogWriter.GetLogWriter().LogWrite("DataSet Size: " + dataSet.Count);
            LogWriter.GetLogWriter().LogWrite("DataSet build: " + UtilityImpl.DictToDebugString(dataSet), false);
            var res = da.UpdateSimpleColumnByFIId(sampleFC.ForecastConfigurationId,
                 sampleFR.Id,
                 forecastInstances,
                 dataSet);
            LogWriter.GetLogWriter().LogWrite($"Simple column updates completed. Count updated:{res.Count}");
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            // 6. Validating the updates are successful.
            LogWriter.GetLogWriter().LogWrite("6. Fetching forecasts and verifying whether updates are successful...");
            forecastInstances = da.FetchFullFIList(sampleFC.ForecastConfigurationId, sampleFR.Id);
            UtilityImpl.VerifyDataSet(forecastInstances, dataSet);
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            // 7. Fetching participating records for a hierarchy record (i.e., user in a user hierarchy), a column and exporting to CSV
            LogWriter.GetLogWriter().LogWrite("7. Fetching participating records for a forecast instance and exporting to CSV");
            var sampleHierarchyRecordId = forecastInstances[0].HierarchyEntityRecord.RecordId;
            var sampleForecastInstanceId = forecastInstances[0].ForecastInstanceId;
            var sampleColumnId = sampleFC.Columns.First(col => col.UniqueName == Constants.columnUniqueName).ForecastConfigurationColumnId;
            var participatingRecordsFetchXML = da.GetParticipatingRecordsFetchXML(sampleFC.ForecastConfigurationId, sampleFR.Id, sampleHierarchyRecordId, sampleForecastInstanceId, sampleColumnId);
            var entities = da.GetParticipatingRecords(participatingRecordsFetchXML);
            LogWriter.GetLogWriter().LogWrite("Participating record fetch XML for a forecast column: " + participatingRecordsFetchXML);
            var participatingRecordsForSingleFIFileName = "ParticipatingRecords_ForSingleForecastInstance.csv";
            UsecaseHelper.CreateCSVOfParticipatingRecords(entities, participatingRecordsForSingleFIFileName);
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            // 8. Fetching all forecasts, participating records and exporting to csv. This data can be stored as snapshot data for later data analysis.
            LogWriter.GetLogWriter().LogWrite("8. Fetching all forecasts, participating records and exporting to csv.");
            var forecastInstancesAndParticipatingRecordsFetchXml = da.FetchFullFIListAndParticipatingFetchXml(fcsByName[0].ForecastConfigurationId, frResults[0].Id);
            forecastInstances = forecastInstancesAndParticipatingRecordsFetchXml.Item1;
            var participatingFetchXmlForForecast = forecastInstancesAndParticipatingRecordsFetchXml.Item2;
            UsecaseHelper.CreateCSVOfForecastInstances(fcsByName[0], forecastInstances);
            entities = da.GetParticipatingRecords(participatingFetchXmlForForecast);
            var participatingRecordsFileName = "ParticipatingRecords_ForForecast.csv";
            UsecaseHelper.CreateCSVOfParticipatingRecords(entities, participatingRecordsFileName);
            LogWriter.GetLogWriter().LogWrite(Environment.NewLine);

            Console.WriteLine("Completed.");
            Console.ReadKey();
        }

        static void Main(string[] args)
        {
            new Program().Execute();
        }
    }
}
