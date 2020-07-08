using System;
using System.Collections.Generic;
using System.Text;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
    /// <summary>
    /// This class is base response class for all services
    /// </summary>
    public class ServiceResponse
    {
        /// <summary>
        /// Error or success code
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// Message
        /// </summary>
        public string Message { get; set; }
    }

    
}
