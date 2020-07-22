using System;
using System.Collections;
using System.Collections.Generic;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnByEntityIdServiceRequest 
    {
        public Guid ForecastConfigurationId { get; set; }

        public Guid ForecastRecurranceId { get; set; }

        public List<UpdateSimpleColumnRequestByEntityId> SimpleColumnUpdateRequests { get; set; }

    }
}
