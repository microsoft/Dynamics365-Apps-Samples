using ForecastPublicApiUsageDemo.Utility;
using System;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnResponseCommon
    {
        public Guid ForecastConfigurationColumnId { get; set; }

        public String Message;

        public UpdateSimpleColumnStatusCode StatusCode;
    }
}
