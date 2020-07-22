using ForecastPublicApiUsageDemo.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnByEntityResponse : UpdateSimpleColumnResponseCommon
    {
        public Guid HierarchyEntityRecordId { get; set; }

        public UpdateSimpleColumnByEntityResponse(Guid hierarchyEntityRecordId,
            Guid forecastConfigurationColumnId,
            String message,
            UpdateSimpleColumnStatusCode statusCode)
        {
            HierarchyEntityRecordId = hierarchyEntityRecordId;
            ForecastConfigurationColumnId = forecastConfigurationColumnId;
            Message = message;
            StatusCode = statusCode;
        }
    }
}
