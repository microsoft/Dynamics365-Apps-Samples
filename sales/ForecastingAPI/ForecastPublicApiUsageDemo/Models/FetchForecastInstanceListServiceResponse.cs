using System.Collections.Generic;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
	/// <summary>
	/// custom response class extending base service response
	/// </summary>
	public class FetchForecastInstanceListServiceResponse : ServiceResponse
	{
		public List<ForecastInstance> ForecastInstances { get; set; }
		public bool HasMorePages { get; set; }

	}   
}
