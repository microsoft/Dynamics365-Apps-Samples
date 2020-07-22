using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnServiceBody<T>
    {
        public List<T> SimpleColumnUpdateResponses { get; set; }
    }
}
