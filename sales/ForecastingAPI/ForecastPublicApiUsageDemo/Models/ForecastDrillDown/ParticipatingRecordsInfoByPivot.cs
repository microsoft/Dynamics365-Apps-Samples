using System;
using System.Collections.Generic;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// Maps ForecastPivot ID to that pivots aggregation query history (for a particular FC column and columnGroupType - rollup/aggregated)
    /// This information can help optimize drilldown aggregation calls, helpful specially when large
    /// scale data, typically >50k in magnitude, is involved.
    /// This object's values can be rolled up if present in a hierarchial structure
    /// </summary>
    public class ParticipatingRecordsInfoByPivot : Dictionary<Guid, DrillDownParticipatingRecordsInfo>
	{
	}
}