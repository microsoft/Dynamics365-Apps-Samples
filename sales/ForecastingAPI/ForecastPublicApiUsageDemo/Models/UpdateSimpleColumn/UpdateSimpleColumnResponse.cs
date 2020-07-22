using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnResponse : UpdateSimpleColumnResponseCommon
    {
        // This will be either HierarchyEntityRecordId or ForecastInstanceId
        public Guid UpdateKeyId { get; set; }
    }
}
