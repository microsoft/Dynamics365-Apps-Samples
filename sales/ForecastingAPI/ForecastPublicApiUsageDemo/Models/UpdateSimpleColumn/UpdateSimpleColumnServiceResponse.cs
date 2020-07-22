using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnServiceResponse<T> : ServiceResponse
    {
        public UpdateSimpleColumnServiceBody<T> Body { get; set; }
    }
}
