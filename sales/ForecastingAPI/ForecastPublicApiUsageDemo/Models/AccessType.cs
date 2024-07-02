namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// Type of Access user has on a FI in increasing order of priority
    /// least priority -  SharedAsReadOnly
    /// most priority - DirectOrIndirectOwner
    /// SharedAsReadOnly = can only read the fi & sub hierarchy because someone shared
    /// ForecastReadPermission = can only read the entire forecast because of forecast permission
    /// SharedAsReadWrite = can read +  edit the fi & sub hierarchy because someone shared the fi
    /// ForecastWritePermission = can read+ edit the entire forecast because of forecast permissions
    /// DirectOrIndirectOwner = can read +  edit + share the forecast because they own the fi
    /// </summary>
    public enum AccessType
    {
        None = 0,
        SharedAsReadOnly = 1,
        ForecastReadPermission = 2,
        SharedAsReadWrite = 3,
        ForecastWritePermission = 4,
        DirectOrIndirectOwner = 5
    }
}
