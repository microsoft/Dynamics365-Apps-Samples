using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnRequestByFIId : UpdateSimpleColumnRequestCommon
    {
        public Guid ForecastInstanceId { get; set; }

        public UpdateSimpleColumnRequestByFIId(Guid forecastInstanceId,
                Guid forecastConfigurationColumnId,
                Object forecastConfigurationColumnValue,
                Boolean isRolledUpColumnUpdate )
        {
            ForecastInstanceId = forecastInstanceId;
            ForecastConfigurationColumnId = forecastConfigurationColumnId;
            ForecastConfigurationColumnValue = forecastConfigurationColumnValue;
            IsRolledUpColumnUpdate = isRolledUpColumnUpdate;

        }
    }
}
