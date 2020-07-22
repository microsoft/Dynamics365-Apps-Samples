using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnServiceRequest 
    {
        public Guid ForecastConfigurationId { get; set; }

        public Guid ForecastRecurranceId { get; set; }

        public List<UpdateSimpleColumnRequest> SimpleColumnUpdateRequests { get; set; }

    }
}
