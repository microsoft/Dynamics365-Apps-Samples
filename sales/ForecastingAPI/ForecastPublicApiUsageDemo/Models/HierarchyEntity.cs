using System;
using System.Runtime.Serialization;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// Hierarchy entity record class
    /// </summary>
    public class HierarchyEntity
    {
        /// <summary>
        /// Hierarchy entity logical name
        /// </summary>
        public string EntityLogicalName { get; set; }

		/// <summary>
		/// Name of the entity record. This is the display name of the record
		/// </summary>
		public string RecordName { get; set; }

		/// <summary>
		/// Entity record id
		/// </summary>
		public Guid RecordId { get; set; }

		/// <summary>
		/// Parent entity record id
		/// </summary>
		public Guid ParentRecordId { get; set; }

		/// <summary>
		/// Immediate child count under this node
		/// </summary>
		public int ImmediateChildCount { get; set; }
	}

}
