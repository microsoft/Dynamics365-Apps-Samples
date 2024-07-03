using System;

namespace ForecastPublicApiUsageDemo.Models
{
    class ForecastRecurrence
    {
        /// <summary>
        /// Primary key
        /// </summary>
        public Guid Id { get; set; }

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
        /// Current recompute status.
        /// </summary>
        public RecomputeStatus RecomputeStatus { get; set; }

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
    }
}
