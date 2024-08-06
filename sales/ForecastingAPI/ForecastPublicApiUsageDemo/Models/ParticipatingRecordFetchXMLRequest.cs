using System;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    class ParticipatingRecordFetchXMLRequest
    {
        public Guid ForecastConfigurationId { get; set; }

        public Guid ForecastPeriodId { get; set; }

        public Guid HierarchyRecordId { get; set; }

        public Guid ForecastInstanceId { get; set; }

        public Guid ForecastConfigurationColumnId { get; set; }

        public Guid RecordViewId { get; set; }

        public bool IsRolledUpNodeRequested { get; set; }
    }
}
