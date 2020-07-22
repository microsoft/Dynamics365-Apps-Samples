using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnByFIIdServiceRequest 
    {
        public Guid ForecastConfigurationId { get; set; }

        public Guid ForecastRecurranceId { get; set; }

        public List<UpdateSimpleColumnRequestByFIId> SimpleColumnUpdateRequests { get; set; }

    }
}
