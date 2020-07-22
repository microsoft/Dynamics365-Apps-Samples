using System;
using System.Collections.Generic;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains single forecast instance information
    /// </summary>    
    public class ForecastInstance
    {

        /// <summary>
        /// PK
        /// </summary>
        public Guid ForecastInstanceId { get; set; }

        /// <summary>
        /// Organization id which it belongs
        /// </summary>
        public Guid OrganizationId { get; set; }

        /// <summary>
        /// Forecast definition id which it belongs
        /// </summary>
        public Guid ForecastConfigurationId { get; set; }

        /// <summary>
        /// Parent instance id
        /// </summary>
        public Guid ParentInstanceId { get; set; }

        /// <summary>
        /// its a type of system user which owns this instance 
        /// </summary>
        public Guid OwnerId { get; set; }

        /// <summary>
        /// recurrence index of forecast definition
        /// </summary>
        public Guid ForecastRecurrenceId { get; set; }

        /// <summary>
        /// Record of hierarchy entity
        /// </summary>
        public HierarchyEntity HierarchyEntityRecord { get; set; }

        /// <summary>
        /// List of Aggregated columns
        /// </summary>
        public List<ForecastInstanceColumn> AggregatedColumns { get; set; }

        /// <summary>
        /// List of rollup columns
        /// </summary>
        public List<ForecastInstanceColumn> RolledUpColumns { get; set; }
    }
}
