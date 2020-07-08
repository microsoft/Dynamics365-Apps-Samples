using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Dynamics.Forecasting.Common.Models
{
	public class PageInfo
	{
		public int PageNo { get; set; }

		public int PageSize { get; set; }

		public string SortingAttribute { get; set; }

		public string SortingOrder { get; set; }
    }
}
