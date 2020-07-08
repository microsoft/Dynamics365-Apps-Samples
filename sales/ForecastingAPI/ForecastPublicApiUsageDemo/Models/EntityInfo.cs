using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains entity information
    /// </summary>
    public class EntityInfo
    {
        /// <summary>
        /// logical name of  entity
        /// </summary>
        public string EntityLogicalName { get; set; }

        /// <summary>
        /// logical name of primary key
        /// </summary>
        public string PrimaryIdAttribute { get; set; }

        /// <summary>
        /// logical name of name attribute
        /// </summary>
        public string PrimaryNameAttribute { get; set; }

        /// <summary>
        /// logical name of entityset
        /// </summary>
        public string EntitySetName { get; set; }

        /// <summary>
        /// logical name of entityset
        /// </summary>
        public string HierarchyAttribute { get; set; }

    }
}