using System;
using System.Collections.Generic;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class is for storing forcast definition
    /// </summary>
    public class ForecastConfiguration : ForecastConfigurationBase
    {
        
        /// <summary>
        /// Array of forecast columns from Forecast columns table.
        /// </summary>
        public List<ForecastConfigurationColumn> Columns { get; set; }

        /// <summary>
        /// org to which this fd belongs
        /// </summary>
        public Guid OrgId { get; set; }

        /// <summary>
        /// This will contain a list of all the entities involved in the FD (rollup, hierarchy etc.)
        /// </summary>
        public List<string> RelatedEntities { get; set; }

        /// <summary>
        /// For storing list of attributes which needs to be updated
        /// </summary>
        public List<string> UpdatedAttributeList { get; set; }        
    }
}
