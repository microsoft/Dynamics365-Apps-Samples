/// <summary>      
/// Aggregate Column : This column represent self contribution (in case of User hierarchy) or sum of values of contributors (in case of Territory hierarchy)
/// 1. SystemValue : System calculated value
/// 2. Value: Can have Direct adjusted value.
/// 3. UnadjustedValue : Same as System Value.
/// /// 
/// Rollup Column : This column represent value of sum of all the child nodes values.
/// 1. SystemValue : System calculated value, this will not have any adujstments even from the child nodes.
/// 2. Value: Can have Direct adjusted value. 
/// 3. UnadjustedValue: Sum of all values from child, this will never have any direct adjustments. might have Indirectly adjusted value
/// e.g. 
///------------------------------------------------------------------------------------------------------------
///         |                                            {World}                                           | 
///         |                                                                                              | 
///         |                  {US}                       |                   {EU}                         |            
///         |               [Ben, Ray]                    |               [Pawan, Lokesh]                  |                    
///         |    {NA}                 |               {SA}                                                 |            
///         |[Dinesh, Siva]           |           [Naren, Vishal]                                          |                    
///------------------------------------------------------------------------------------------------------------
/// Every User Node has 10000 worth opprtunity 
/// If MA is done Siva & NA Node to 20000 values will be like this
/// Siva:
/// SystemValue =30000, Value= 20000,  UnadjustedValue = 30000
/// NA:
/// SystemValue =40000, Value= 20000,  UnadjustedValue = 30000
/// ------------------------------------------------------------
/// If MA is done NA and US Node Aggregate to 20000 values will be like this
/// NA:
/// Aggregate: SystemValue = 40000, Value = 20000,  UnadjustedValue = 40000
/// US:
/// Aggregate: SystemValue = 40000, Value = 20000,  UnadjustedValue = 40000
/// Rollup: SystemValue = 100000, Value = 80000,  UnadjustedValue = 80000
/// ------------------------------------------------------------
/// If MA is done NA Aggregate and US Rollup Node to 20000 values will be like this
/// NA:
/// Aggregate: SystemValue = 40000, Value = 20000,  UnadjustedValue = 40000
/// US:
/// Aggregate: SystemValue = 40000, Value = 40000,  UnadjustedValue = 40000
/// Rollup: SystemValue = 100000, Value = 20000,  UnadjustedValue = 800000
using System;
using System.Collections.Generic;
namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains column values for forecast instance.
    /// </summary>
    public class ForecastInstanceColumn
    {
        /// <summary>
        /// Associated forecast config column id.
        /// </summary>
        public Guid ForecastConfigurationColumnId { get; set; }

        /// <summary>
        /// For hierarchy type columns, this will store entity ref of particular column record.
        /// Eg : 
        /// 1) For Orgchart : it will store Guid of system user id 
        /// 2) For territory : if its a HierarchyPrimary column , then it will store territoryid, if its a HierarchySecondary column type then
        /// it will store territory managerid . 
        /// it contain data for RecordAttribute of particular forecast configuration column .
        /// </summary>
        public Guid RecordId { get; set; }

        /// <summary>
        /// This will store actual value at present
        /// This could be 
        /// 1. System calculated.
        /// 2. Directly Adjusted.
        /// 3. Indirecly Adjusted (by any report in the hierarchy below or Aggregate node).
        /// </summary>
        public double Value { get; set; }

        /// <summary>
        /// This will store actual display value with currency labels
        /// for <see cref="Value"/>
        /// </summary>
        public string DisplayValue { get; set; }

        /// <summary>
        /// System calculated value.
        /// </summary>
        public Field<double> SystemCalculated { get; set; }

        /// <summary>
        /// Direct adjusted value if available else null
        /// </summary>
        public Field<double> DirectAdjusted { get; set; }

        /// <summary>
        /// Indirect adjusted value if available else null
        /// </summary>
        public Field<double> RollupAdjusted { get; set; }


        /// <summary>
        /// count of participating records for this instance
        /// </summary>
        public int ParticipatingRecordsCount { get; set; }

        /// <summary>
        /// count of direct adjusted child in hierarchy
        /// </summary>
        public int DirectAdjustedDescendantsCount { get; set; }

        /// <summary>
        /// It will store current manual adjustments
        /// This will be used to store last manual adjustment / reset
        /// This field will also be used for UI flag to show Manual adjustment icon or not.
        /// initially this will be null and onece MA is done then onwards it will have some value
        /// Be it MA or Reset.
        /// </summary>
        public ForecastManualAdjustment ManualAdjustment { get; set; }

        /// <summary>
        /// Contain list of all manual adjustments
        /// </summary>
        public List<ForecastManualAdjustment> AdjustmentHistory { get; set; } = new List<ForecastManualAdjustment>();

    }
}
