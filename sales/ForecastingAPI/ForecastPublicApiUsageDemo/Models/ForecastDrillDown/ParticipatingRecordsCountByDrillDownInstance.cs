using System.Collections.Generic;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// Maps a drilldown instance uniqueID to its aggregation participating records count for a node
    /// Typically useful for optionset pivots where uniqueIDs correspond to optionset values
    /// </summary>
    public class ParticipatingRecordsCountByDrillDownInstance : Dictionary<string, int>
	{
	}

}