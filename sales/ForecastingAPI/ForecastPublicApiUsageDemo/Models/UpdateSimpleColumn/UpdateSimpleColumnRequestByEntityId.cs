using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models.ClientServices.UpdateSimpleColumnModels
{
    public class UpdateSimpleColumnRequestByEntityId : UpdateSimpleColumnRequestCommon
    {
        public Guid HierarchyEntityRecordId { get; set; }
    }
}
