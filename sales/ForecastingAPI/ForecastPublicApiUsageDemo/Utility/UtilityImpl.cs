using Microsoft.Dynamics.Forecasting.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ForecastPublicApiUsageDemo.Utility
{
    class UtilityImpl
    {
        public static void VerifyDataSet(List<ForecastInstance> fis, Dictionary<Guid, double> dataSet)
        {
            LogWriter.GetLogWriter().LogWrite("Verifying data set: ");

            foreach (ForecastInstance forecastInstance in fis)
            {
                double value = 0;
                dataSet.TryGetValue(forecastInstance.HierarchyEntityRecord.RecordId, out value);
                if (value != forecastInstance.AggregatedColumns[1].Value)
                {
                    LogWriter.GetLogWriter().LogWrite($"FI Value does not match {forecastInstance.ForecastInstanceId} {value} {forecastInstance.AggregatedColumns[1].Value}");
                }
            }

            LogWriter.GetLogWriter().LogWrite("Verified data set.");
        }

        public static string DictToDebugString<TKey, TValue>(Dictionary<TKey, TValue> dictionary)
        {
            return "{" + string.Join(",", dictionary.Select(kv => kv.Key + "=" + kv.Value).ToArray()) + "}";
        }


        private static double GetRandomNumber(double minimum, double maximum)
        {
            Random random = new Random();
            return random.NextDouble() * (maximum - minimum) + minimum;
        }

        public static Dictionary<Guid, Double> PrepareDataSet(List<ForecastInstance> forecastInstances)
        {
            Dictionary<Guid, Double> dataSet = new Dictionary<Guid, double>();
            double minimum = 1000;
            double maximum = 100000000;

            foreach (ForecastInstance forecastInstance in forecastInstances)
            {
                if (!dataSet.ContainsKey(forecastInstance.ForecastInstanceId))
                {
                    dataSet.Add(forecastInstance.ForecastInstanceId, GetRandomNumber(minimum, maximum));
                }
            }
            return dataSet;
        }
    }
}
