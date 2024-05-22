using Microsoft.Dynamics.Forecasting.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ForecastPublicApiUsageDemo.Utility
{
    static class UsecaseHelper
    {
        public static void CreateCSVOfForecastInstances(ForecastConfiguration forecastConfiguration, List<ForecastInstance> forecastInstances)
        {
            LogWriter.GetLogWriter().LogWrite("Creating CSV for the FC and Aggregated Columns.");
            // Get all the columns from the forecast configuration
            List<ForecastConfigurationColumn> columns = forecastConfiguration.Columns;

            // Create the header row with the hierarchy record and names of the columns
            string headerRow = CreateHeaderRow(columns);

            // Create the data rows
            string dataRows = CreateDataRows(columns, forecastInstances);

            var csvContent = headerRow + dataRows;

            // Save the CSV file in local disk
            const string fileName = "Path.csv";
            File.WriteAllText(fileName, csvContent);

            LogWriter.GetLogWriter().LogWrite("Created CSV for the FC and Aggregated Columns.");
        }

        private static string CreateHeaderRow(List<ForecastConfigurationColumn> columns)
        {
            return "HierarchyRecordId," + string.Join(",", columns.Select(c => c.DisplayName).ToArray()) + "\n";
        }

        private static string CreateDataRows(List<ForecastConfigurationColumn> columns, List<ForecastInstance> forecastInstances)
        {
            string dataRows = "";
            foreach (ForecastInstance forecastInstance in forecastInstances)
            {
                var fiColumns = GetForecastInstanceColumns(forecastInstance);
                Guid recordId = forecastInstance.HierarchyEntityRecord.RecordId;
                string columnData = string.Join(",", columns.Select(c => GetColumnValue(c, fiColumns)).ToArray());
                dataRows += $"{recordId},{columnData}\n";
            }

            return dataRows;
        }

        private static string GetColumnValue(ForecastConfigurationColumn column, Dictionary<Guid, string> fiColumns)
        {
            return fiColumns.ContainsKey(column.ForecastConfigurationColumnId) ? fiColumns[column.ForecastConfigurationColumnId] : "";
        }

        private static Dictionary<Guid, string> GetForecastInstanceColumns(ForecastInstance forecastInstance)
        {
            return forecastInstance.AggregatedColumns.ToDictionary(c => c.ForecastConfigurationColumnId, c => string.IsNullOrEmpty(c.DisplayValue) ? c.Value.ToString() : c.DisplayValue);
        }
    }
}
