using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public const string forecastConfigurationName = "acc-5k-1";
        public const string forecastperiodName = "FY2020 Q2";


    }
}
