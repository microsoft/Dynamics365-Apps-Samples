namespace ForecastPublicApiUsageDemo.Utility
{
    public class Constants
    {
        // API related Constants
        public const string MSDYN_FORECASTAPI_PATH = "msdyn_ForecastApi";
        public const string GET_ForecastConfigurations = "GET_ForecastConfigurations";
        public const string GET_ForecastConfigurationsByName = "GET_ForecastConfigurationsByName";
        public const string GET_FORECASTPERIODS_BY_FORECASTCONFIGID = "GET_ForecastPeriodsByForecastConfigurationId";
        public const string GET_ForecastInstances = "GET_ForecastInstances";
        public const string Update_SimpleColumnByFIId = "Update_SimpleColumnByFIId";
        public const string Update_SimpleColumnByEntityId = "Update_SimpleColumnByEntityId";

        // Usecase related Constants
        public const string forecastConfigurationName = "Sample Forecast";
        public const string forecastperiodName = "FY{0} {1}"; //E.g. FY2024 May
    }
}
