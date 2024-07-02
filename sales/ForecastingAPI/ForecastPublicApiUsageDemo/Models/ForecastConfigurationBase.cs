using System;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class is for storing forcast configuration
    /// </summary>
    public class ForecastConfigurationBase
    {
        /// <summary>
        /// PK
        /// </summary>
        public Guid ForecastConfigurationId { get; set; }

        /// <summary>
        /// forecast configuration name
        /// </summary>
        public String Name { get; set; }

        /// <summary>
        /// Number of recurrences for this fd
        /// </summary>
        public int NumberOfRecurrences { get; set; }

        /// <summary>
        /// logical name of hierarchy entity
        /// </summary>
        public EntityInfo HierarchyEntity { get; set; }

        /// <summary>
        /// logical name of rollup entity
        /// </summary>
        public EntityInfo RollupEntity { get; set; }

        /// <summary>
        /// start date for forecast
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// enddate  for forecast optionset value
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// forecast configuration statuscode mapping from CRM
        /// </summary>
        public ForecastConfigurationStatusCode StatusCode { get; set; }

        /// <summary>
        /// forecast configuration statuscode mapping from CRM
        /// </summary>
        public ForecastConfigurationState State { get; set; }

        /// <summary>
        /// this guid will contain root record of hierarchy entity under which forecast will be performed
        /// </summary>
        public Guid RootEntityRecordId { get; set; }

        /// <summary>
        /// this will contain relation between rollup entity and hierarchy entity
        /// </summary>
        public RelationshipInfo HierarchyRelationship { get; set; }

        /// <summary>
        /// String for selecting option set
        /// </summary>
        public AttributeInfo ForecastCategoryAttribute { get; set; }

        ///   <summary>
        ///   Attribute info for storing permission attribute for forecast instances which is linked with Hierarchy Entity directly or indirectly
        ///   Eg :
        ///   OrgChart :
        ///    {
        ///       Relation : {
        ///       EntityInfo : {
        ///       EntityLogicalName = "systemuser",
        ///       PrimaryNameAttribute = "fullname",
        ///       PrimaryIdAttribute = "systemuserid",
        ///       EntitySetName = "systemusers",
        ///       HierarchyAttribute = "parentsystemuserid"
        ///  },
        ///  "RelatedFrom" : null,
        ///  "Relationship" : null
        /// },
        /// "TargetAttributeName" : "systemuserid"
        ///}
        ///</summary>
        public AttributeInfo PermissionAttribute { get; set; }

        /// <summary>
        /// Permission type will contain array of permission for this FC
        /// </summary>
        public PermissionType[] PermissionTypes { get; set; }

        /// <summary>
        /// Share Level for this FC
        /// </summary>
        public ShareLevel ShareLevel { get; set; }

        /// <summary>
        /// Permission roles will contain array of permission role objects for this FC
        /// </summary>
        public PermissionRole[] PermissionRoles { get; set; }

        /// <summary>
        /// Fetch xml for additional filters
        /// </summary>
        public string AdditionalFilters { get; set; }

        /// <summary>
        /// Fetch xml for hierarchy filters
        /// </summary>
        public string HierarchyFilters { get; set; }

        /// <summary>
        /// Published dateTime
        /// </summary>
        public DateTime PublishedDateTime { get; set; }

        /// <summary>
        /// Default view id on which underlying records to be shown in editable grid.
        /// </summary>
        public Guid DefaultViewIdForUnderlyingRecords { get; set; }

        /// <summary>
        /// if fc is default or not
        /// </summary>
        public bool IsDefault { get; set; }
    }
}
