using System;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class is for storing forcast definition
    /// </summary>
    public class ForecastConfigurationBase
    {
        /// <summary>
        /// PK
        /// </summary>
        public Guid ForecastConfigurationId { get; set; }

        /// <summary>
        /// forecast Definition name
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
        /// Period type
        /// </summary>
        public ForecastPeriodType PeriodType { get; set; }

        /// <summary>
        /// start date for forecast
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// enddate  for forecast optionset value
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// starting fiscal month optionset value
        /// </summary>
        public int StartingFiscalMonth { get; set; }

        /// <summary>
        /// starting fiscal quarter optionset value
        /// </summary>
        public int StartingFiscalQuarter { get; set; }

        /// <summary>
        /// starting fiscal year optionset value
        /// </summary>
        public int StartingFiscalYear { get; set; }

        /// <summary>
        /// forecast definition statuscode mapping from CRM
        /// </summary>
        public ForecastConfigurationStatusCode StatusCode { get; set; }

        /// <summary>
        /// forecast definition statuscode mapping from CRM
        /// </summary>
        public ForecastConfigurationState State { get; set; }

        /// <summary>
        /// Any error during publish
        /// </summary>
        public string ErrorMessage { get; set; }    

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
        /// Permission roles will contain array of permission role objects for this FC
        /// </summary>
        public PermissionRole[] PermissionRoles { get; set; }

        /// <summary>
        /// Fetch xml for additional filters
        /// </summary>
        public string AdditionalFilters { get; set; }

        /// <summary>
        /// If the snapshot is scheduled or not
        /// If the snapshot is not scheduled then user will have to take snapshot manually
        /// </summary>
        public bool IsSnapshotScheduled { get; set; }

        /// <summary>
        /// CRON expression of the snapshot schedule
        /// </summary>
        public string SnapshotSchedule { get; set; }

        /// <summary>
        /// Time zone used for governing the forecast snapshot work
        /// </summary>
        public string SnapshotTimeZone { get; set; }

        /// <summary>
        /// Published dateTime
        /// </summary>
        public DateTime PublishedDateTime { get; set; }

        /// <summary>
        /// Default view id on which underlying records to be shown in editable grid. 
        /// </summary>
        public Guid DefaultViewIdForUnderlyingRecords { get; set; }
    }
}
