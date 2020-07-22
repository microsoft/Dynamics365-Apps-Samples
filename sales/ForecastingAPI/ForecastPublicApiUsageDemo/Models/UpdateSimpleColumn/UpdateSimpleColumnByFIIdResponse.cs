using ForecastPublicApiUsageDemo.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnByFIIdResponse : UpdateSimpleColumnResponseCommon
    {
        public Guid ForecastInstanceId { get; set; }

        public UpdateSimpleColumnByFIIdResponse(Guid forecastInstanceId,
            Guid forecastConfigurationColumnId,
            String message,
            UpdateSimpleColumnStatusCode statusCode)
        {
            ForecastInstanceId = forecastInstanceId;
            ForecastConfigurationColumnId = forecastConfigurationColumnId;
            Message = message;
            StatusCode = statusCode;
        }
    }
}
