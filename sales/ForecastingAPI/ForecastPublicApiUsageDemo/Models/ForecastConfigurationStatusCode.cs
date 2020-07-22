using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
	/// <summary>
	/// Enum for Status code for forecast configuration
	/// </summary>
	public enum ForecastConfigurationStatusCode
	{
		Draft = 1,
		InProgress,
		Active,
		Failed,
		Inactive
	}
}
