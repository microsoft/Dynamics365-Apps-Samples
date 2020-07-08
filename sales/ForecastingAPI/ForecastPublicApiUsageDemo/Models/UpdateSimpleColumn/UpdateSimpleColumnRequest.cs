using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnRequest : UpdateSimpleColumnRequestCommon
    {
        // This will be either HierarchyEntityRecordId or ForecastInstanceId
        public Guid UpdateKeyId { get; set; }

        public UpdateSimpleColumnRequest(Guid updateKeyId,
            Guid forecastConfigurationColumnId,
            Object forecastConfigurationColumnValue,
            Boolean isRolledUpColumnUpdate)
        {
            UpdateKeyId = updateKeyId;
            ForecastConfigurationColumnId = forecastConfigurationColumnId;
            ForecastConfigurationColumnValue = forecastConfigurationColumnValue;
            IsRolledUpColumnUpdate = isRolledUpColumnUpdate;
        }
    }

}
