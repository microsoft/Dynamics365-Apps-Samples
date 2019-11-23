<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web" %>

<script language="C#" runat="server">
	void Page_Load(object sender, EventArgs e)
	{
		HttpRequest req = HttpContext.Current.Request;
		
		// NOTE: Make sure the folder you are saving the file to has write access
		using(StreamWriter logFile = new StreamWriter(@"c:\temp\SdkSample.log"))
		{
			logFile.WriteLine("Acct Name: " + req["Name"]);
			logFile.WriteLine("Acct Num : " + req["AccountNum"]);
		}
	}
</script>
