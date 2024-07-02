namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This object corresponds to a "node", identified by combination of forecast instance, forecast column and a forecast pivot.
    /// 1. Contains an estimated total participating record count for a "node"
    /// 2. Contains an estimated participating record count per drilldown instanace for a "node"
    /// </summary>
    public class DrillDownParticipatingRecordsInfo
    {
        /// <summary>
        /// Contains a total partipating record count for this node
        /// </summary>
        public int TotalParticipatingRecordsCount
        {
            get; set;
        }

        /// <summary>
        /// For optionset pivot, maps a particular option's value to its minimum aggregation count
        /// For entity pivot, it can remain empty. The key type is string which corresponds to
        /// UniqueValue attribute of drilldown instance.
        /// </summary>
        public ParticipatingRecordsCountByDrillDownInstance ParticipatingRecordsCountByDrillDownInstance
        {
            get; set;
        }
    }
}