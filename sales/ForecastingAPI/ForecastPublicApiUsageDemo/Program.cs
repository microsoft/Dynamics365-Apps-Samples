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
    /// 3. Fecthing forecast Periods for the forecast configuration 
    /// 4. Fetching all the forecast Instances for the given forecast configuration and forecast period
    /// 5. Updating their column value using update simple column API by forecast Instance Id
    /// 6. Validating the updates are successful.
    /// </summary>
    /// <param name="da">Forecast Data Access Object</param>
       private void PerformUsecase(ForecastDataAccess da)
        {

            // Fetching full Forecast Configuration List 
            var fcs = da.GetFCList();

            LogWriter.GetLogWriter().LogWrite($"Num FCs:{fcs.Count}");
            LogWriter.GetLogWriter().LogWrite($"FCs Names: {string.Join(",", (fcs.Select(c => c.Name).ToList().ToArray()))}");

            // fetching forecast configuration by name
            var sampleFCName = Constants.forecastConfigurationName;
            var sampleFRName = string.Format(Constants.forecastperiodName, DateTime.Now.Year, DateTime.Now.ToString("MMM"));

            var fcsByName = da.GetFCListByName(sampleFCName);

            if (fcsByName.Count == 0)
            {
                LogWriter.GetLogWriter().LogWrite("Please provide a valid fc Name");
                return;
            }
            LogWriter.GetLogWriter().LogWrite($"FCs Found:{fcs.Count > 0}");
            LogWriter.GetLogWriter().LogWrite($"FCs Id: {string.Join(",", (fcs.Select(c => c.ForecastConfigurationId).ToList().ToArray()))}");
            
            // fetching forecast periods for the forecast configuration
            var forecastRecurrences = da.GetForecastPeriodsList(fcsByName[0].ForecastConfigurationId);
            LogWriter.GetLogWriter().LogWrite("FR Names: " + string.Join(",", forecastRecurrences.Select(c => c.Name).ToList().ToArray()));
            
            var frResults = forecastRecurrences.Where(o => o.Name == sampleFRName).ToList();

            if (frResults.Count == 0)
            {
                LogWriter.GetLogWriter().LogWrite("Please provide a valid forecast period Name");
                return;
            }

            var forecastInstances = da.FetchFullFIList(fcsByName[0].ForecastConfigurationId, frResults[0].Id);

            Dictionary<Guid, double> dataSet = UtilityImpl.PrepareDataSet(forecastInstances);

            LogWriter.GetLogWriter().LogWrite("FIs fetched: " + forecastInstances.Count);

            LogWriter.GetLogWriter().LogWrite("FIs Guids: " + string.Join(",", (forecastInstances.Select(c => c.ForecastInstanceId).ToList().ToArray())));

            LogWriter.GetLogWriter().LogWrite("DataSet Size: " + dataSet.Count);

            LogWriter.GetLogWriter().LogWrite("DataSet build: " + UtilityImpl.DictToDebugString(dataSet));

            var res = da.UpdateSimpleColumnByFIId(fcsByName[0].ForecastConfigurationId,
                 frResults[0].Id,
                 forecastInstances,
                 dataSet);

            forecastInstances = da.FetchFullFIList(fcsByName[0].ForecastConfigurationId, frResults[0].Id);

            UtilityImpl.VerifyDataSet(forecastInstances, dataSet);

            UsecaseHelper.CreateCSVOfForecastInstances(fcsByName[0], forecastInstances);

            Console.WriteLine("Completed");
            Console.ReadKey();
        }


        static void Main(string[] args)
        {
            new Program().Execute();
        }
      
    }
}
