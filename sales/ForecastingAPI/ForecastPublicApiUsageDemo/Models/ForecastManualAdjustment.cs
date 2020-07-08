using System;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains information about manual adjustments done on forecast instance columns
    /// Each columns will have list of this objects.
    /// </summary>
    public class ForecastManualAdjustment
    {
        /// <summary>
        /// Unique Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets reset flag.
        /// True if reset is done, false otherwise.
        /// </summary>
        public bool IsReset { get; set; }

        /// <summary>
        /// Direct adjusted value.
        /// For Reset it will be null
        /// </summary>
        public Field<double> To { get; set; }

        /// <summary>
        /// Gets last value before current value.
        /// </summary>
        public Field<double> From { get; set; }

        /// <summary>
        /// notes given during adjustements
        /// </summary>
        public string Notes { get; set; }

        /// <summary>
        /// guid of user who made adjustements
        /// </summary>
        public Guid AdjustedBy { get; set; }

        /// <summary>
        /// Name of user who made adjustements
        /// </summary>
        public string AdjustedByName { get; set; }

        /// <summary>
        /// Adjustments made on 
        /// </summary>
        public DateTime AdjustedOn { get; set; }
    }
}
