using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Configuration;

namespace ForecastPublicApiUsageDemo.CRM
{
    class OrganizationService
    {
        private const string TIP_CONN_STR_TEMP = @"
                AuthType = OAuth;
                UserName = {0};
                Password = {1};
                Url = {2};
                AppId = 51f81489-12ee-4a9e-aaae-a2591f45987d;
                RedirectUri = app://58145B91-0C36-4500-8554-080854F2AC97;
                LoginPrompt=Auto;
                RequireNewInstance = True";

        /// <summary>
        /// Create the organization service for using Public APIs endpoints
        /// </summary>
        /// <returns></returns>
        public static IOrganizationService CreateOrgService()
        {
            var crmUrl = ConfigurationManager.AppSettings["CrmUrl"];
            var crmUsername = ConfigurationManager.AppSettings["CrmUsername"];
            var crmPass = ConfigurationManager.AppSettings["CrmPass"];

            string connString = string.Format(TIP_CONN_STR_TEMP, crmUsername, crmPass, crmUrl);

            var orgService = getOrgService(connString);
            return orgService;
        }

        /// <summary>
        /// Create CRM service client to be used
        /// </summary>
        /// <param name="connstr"></param>
        /// <returns></returns>
        private static IOrganizationService getOrgService(string connstr)
        {
            LogWriter.GetLogWriter().LogWrite("Connecting to CRM org");
            CrmServiceClient crmConn = new CrmServiceClient(connstr);
            if (crmConn.IsReady)
                LogWriter.GetLogWriter().LogWrite("Connection successful");
            else
                LogWriter.GetLogWriter().LogWrite("Connection failed");
            return crmConn;

        }

        /// <summary>
        /// A helper method to test the connection to CRM service
        /// </summary>
        private static void TestConnection()
        {
            IOrganizationService orgService = CreateOrgService();

            var query = new QueryExpression("organization");
            query.ColumnSet = new ColumnSet(true);
            query.TopCount = 1;

            var results = orgService.RetrieveMultiple(query);

            LogWriter.GetLogWriter().LogWrite(results.Entities[0]["name"].ToString());

            Console.ReadKey();
        }
    }
}
