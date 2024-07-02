namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    using ForecastPublicApiUsageDemo.Models;
    using System.Collections.Generic;

    /// <summary>
    /// </summary>
    public class ForecastConfiguration : ForecastConfigurationBase
    {

        /// <summary>
        /// Array of forecast columns from Forecast columns table.
        /// </summary>
        public List<ForecastConfigurationColumn> Columns { get; set; }

        /// <summary>
        /// This will contain a list of all the entities involved in the FD (rollup, hierarchy etc.)
        /// </summary>
        public List<string> RelatedEntities { get; set; }

        /// <summary>
        /// Contains configuration info for all pivots - used for generating forecast drill down response
        /// </summary>
        public List<ForecastPivot> Pivots { get; set; }

        /// <summary>
        /// Contains entity info metadata
        /// </summary>
        public Dictionary<string, EntityInfo> EntityMetadata { get; set; }

        /// <summary>
        /// Contains mapping from entity to dictionary containing: key = acual money attribute, value = base money attribute
        /// </summary>
        public Dictionary<string, Dictionary<string, string>> MoneyAttrCache { get; set; }
    }
}
