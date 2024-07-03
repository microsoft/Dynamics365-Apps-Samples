namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// type of forecastcolumn
    /// </summary>
    public enum ForecastColumnType
    {
        Rollup = 0,
        Calculated = 1,
        Simple = 2,
        Predictive = 3,
        HierarchyPrimary = 4,
        HierarchySecondary = 5
    }
}
