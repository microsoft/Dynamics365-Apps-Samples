using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// Siguature of request arguments for "GetFiList" API method
    /// </summary>
	public class PublicForecastInstanceListRequest
    {
        public Guid ForecastPeriodId { get; set; }

        public Guid ForecastConfigurationId { get; set; }

        public PageInfo PageInfo { get; set; }

        public bool GetParticipatingRecordsFetchXml { get; set; }

        public Guid? ParticipatingRecordsViewId { get; set; }

    }
}
