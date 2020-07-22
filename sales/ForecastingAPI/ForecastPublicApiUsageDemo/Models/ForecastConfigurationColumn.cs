using System;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class will contains information about column of forecast definition
    /// </summary>
    public class ForecastConfigurationColumn
    {
        /// <summary>
        /// PK
        /// </summary>
        public Guid ForecastConfigurationColumnId { get; set; }

        /// <summary>
        /// Name of column
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// Unique name
        /// </summary>
        public string UniqueName { get; set; }

        /// <summary>
        /// DataType of Column
        /// </summary>
        public ForecastColumnDataType DataType { get; set; }

        /// <summary>
        /// Actual revenue/amount attribute corresponding to aggregation attribute.
        /// </summary>
        public string ActualMoneyAttribute { get; set; }

        /// <summary>
        /// Aggregating attribute info of rollup entity. This is base revenue/amount attribute.
        /// </summary>
        public string AggregatingAttribute { get; set; }

        /// <summary>
        /// Date attribute info, it also supports nested relationships
        /// </summary>
        public AttributeInfo DateAttribute { get; set; }

        /// <summary>
        /// For Hierarchy type columns, this attributes will tell from where need to fetch entity reference of record column.
        /// </summary>
        public AttributeInfo RecordAttribute { get; set; }

        /// <summary>
        /// Fetch xml for source records selector
        /// </summary>
        public string Selector { get; set; }

        /// <summary>
        /// Forecast definition id which it belongs to
        /// </summary>
        public Guid ForecastConfigurationId { get; set; }

        /// <summary>
        /// The option of chosen option set
        /// </summary>
        public int OptionSetValue { get; set; }

        /// <summary>
        /// Ordering for columns
        /// </summary>
        public int ColumnOrder { get; set; }

        /// <summary>
        /// Rollup or calculated
        /// </summary>
        public ForecastColumnType ColumnType { get; set; }

        /// <summary>
        /// Contains the formula if this is a calculated column
        /// </summary>
        public string Formula { get; set; }

        /// <summary>
        /// If the column is editable, required by grid 
        /// </summary>
        public bool IsEditable { get; set; }

        /// <summary>
        /// If the column is visible or hidden, required by grid 
        /// </summary>
        public bool IsVisible { get; set; } 

        /// <summary>
        /// Show quota compared progress on this column
        /// </summary>
        public bool ShowQuotaComparedProgress { get; set; }

        /// <summary>
        /// Description of the column
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Boolean flag to specify if FC column has to be shown in trend chart
        /// </summary>
        public bool ShowInTrendChart { get; set; }

        /// <summary>
        /// ColorCode Hexadecimal to be used in charts for FC column
        /// </summary>
        public string ColorCode { get; set; }
    }
}
