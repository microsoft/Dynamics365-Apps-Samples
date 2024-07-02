namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// Enum for Status code for forecast configuration
    /// </summary>
    public enum ForecastConfigurationStatusCode
	{
		/// <summary>
		/// Default status reason 
		/// </summary>
		Draft = 1,
		/// <summary>
		/// Status reason when FC activation is in progress
		/// </summary>
		InProgress,
		/// <summary>
		/// Status reason when FC is activated
		/// </summary>
		Active,
		/// <summary>
		/// Status reason when FC activation fails
		/// </summary>
		Failed,
		/// <summary>
		/// Status reason when FC is deactivated from UI
		/// </summary>
		Inactive,
		/// <summary>
		/// Status reason when FC is auto archived
		/// </summary>
		Archived,
		/// <summary>
		/// Status reason when active FC is deactivated due to invalid/missing metadata
		/// </summary>
		Invalidated,
		/// <summary>
		/// Status reason when FC is reactivation is in progress
		/// </summary>
		Reactivate_InProgress
	}
}
