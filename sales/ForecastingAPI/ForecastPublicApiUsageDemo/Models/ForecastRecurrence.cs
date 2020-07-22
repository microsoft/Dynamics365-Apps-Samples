using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForecastPublicApiUsageDemo.Models
{
    [BsonIgnoreExtraElements]
    class ForecastRecurrence
    {
        [BsonElement("_id")]
        public Guid Id { get; set; }

        /// <summary>
        /// Organization id which it belongs
        /// </summary>
        public Guid OrganizationId { get; set; }

        /// <summary>
        /// Forecast configuration id to which it is related
        /// </summary>
        public Guid ForecastConfigurationId { get; set; }

        /// <summary>
        /// its recurrence index
        /// </summary>
        public int RecurrenceIndex { get; set; }

        /// <summary>
        /// valid from date of this recurrence
        /// </summary>
        public DateTime ValidFrom { get; set; }

        /// <summary>
        /// valid to date of this recurrence
        /// </summary>
        public DateTime ValidTo { get; set; }

        /// <summary>
        /// Recurrence Name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Last successful recompute completed on. 
        /// </summary>
        public DateTime LastRecomputedOn { get; set; }

        /// <summary>
        /// Last recompute started on.
        /// </summary>
        public DateTime RecomputationStartTime { get; set; }

        /// <summary>
        /// Last status changed on
        /// </summary>
        public DateTime RecomputeStatusChangedOn { get; set; }

        /// <summary>
        /// Failure information if any
        /// </summary>
        public string FailureInfo { get; set; }

        /// <summary>
        /// Recompute executor id
        /// </summary>
        public string RecomputeExecutorId { get; set; }

        /// <summary>
		/// Forecast recurrence state
		/// </summary>
        public ForecastRecurrenceState RecurrenceState { get; set; }

        /// <summary>
        /// For storing list of attributes which needs to be updated
        /// </summary>
        [BsonIgnore]
        public List<string> UpdatedAttribteList { get; set; }
    }
}
