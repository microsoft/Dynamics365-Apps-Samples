﻿namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains entity information
    /// </summary>
    public class AttributeInfo
    {
        /// <summary>
        /// Contains relationship info if attribute present in related object
        /// </summary>
        public RelationshipInfo Relation { get; set; }

        /// <summary>
        /// Attribute logical name
        /// </summary>
        public string TargetAttributeName { get; set; }

        /// <summary>
        /// Contains the type of the target lookup attribute
        /// </summary>
        public string LookupAttributeTarget { get; set; }
    }
}