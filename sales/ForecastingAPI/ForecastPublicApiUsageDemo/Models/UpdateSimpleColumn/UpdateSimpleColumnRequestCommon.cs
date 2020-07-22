using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnRequestCommon
    {
        public Guid ForecastConfigurationColumnId { get; set; }

        public Object ForecastConfigurationColumnValue { get; set; }

        public Boolean IsRolledUpColumnUpdate { get; set; }
    }
}
