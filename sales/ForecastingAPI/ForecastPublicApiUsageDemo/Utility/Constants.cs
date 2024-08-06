using System.Collections.Generic;

namespace ForecastPublicApiUsageDemo.Utility
{
    public class Constants
    {
        // API related Constants
        public const string MSDYN_FORECASTAPI_PATH = "msdyn_ForecastApi";
        public const string GET_ForecastConfigurations = "GET_ForecastConfigurations";
        public const string GET_ForecastConfigurationsByName = "GET_ForecastConfigurationsByName";
        public const string GET_FORECASTPERIODS_BY_FORECASTCONFIGID = "GET_ForecastPeriodsByForecastConfigurationId";
        public const string GET_ParticipatingRecordsFetchXML = "GET_ParticipatingRecordsFetchxml";
        public const string GET_ForecastInstances = "GET_ForecastInstances";
        public const string Update_SimpleColumnByFIId = "Update_SimpleColumnByFIId";
        public const string Update_SimpleColumnByEntityId = "Update_SimpleColumnByEntityId";

        // Opportunity constants
        public static Dictionary<string, string> OpportunityCategories = new Dictionary<string, string>()
        {
            { "100000001", "Pipeline" },
            { "100000002", "Bestcase" },
            { "100000003", "Committed" },
            { "100000004", "Omitted" },
            { "100000005", "Won" },
            { "100000006", "Lost"  }
        };
        public static Dictionary<string, string> OpportunityState = new Dictionary<string, string>()
        {
            { "0", "Open" },
            { "1", "Won" },
            { "2", "Lost" }
        };
        public static Dictionary<string, string> OpportunityStatusReason = new Dictionary<string, string>()
        {
            { "1", "InProgress" },
            { "2", "On Hold" },
            { "3", "Won" },
            { "4", "Canceled" },
            { "5", "Out-Sold" }
        };

        // Usecase related Constants
        public const string forecastConfigurationName = "Sample Forecast";
        public const string forecastperiodName = "FY{0} {1}"; //E.g. FY2024 May
        public const string recordViewId = "bf649add-6c30-ea11-a813-000d3a5475f7"; //Record view id for Opportunities Forecast View
        public const string recordViewName = "Opportunities Forecast View";//This should change according to the view you are expecting
        public const string columnUniqueName = "pipeline";//Simple column unique name
    }
}
