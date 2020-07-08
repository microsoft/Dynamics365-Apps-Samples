using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForecastPublicApiUsageDemo.CRM
{
    class OrganizationService
    {
        private static string TIP_CONN_STR_TEMP = "AuthType=Office365;Username={0};Password={1};Url={2};AppId=57b7286c-58c7-49be-aaa7-157ea9dfb8b9;RedirectUri=api://57b7286c-58c7-49be-aaa7-157ea9dfb8b9;TokenCacheStorePath=c:\\MyTokenCache;LoginPrompt=Never";

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
            OrganizationServiceProxy crmService = crmConn.OrganizationServiceProxy;
            if (crmService != null)
                LogWriter.GetLogWriter().LogWrite("Connection successful");
            else
                LogWriter.GetLogWriter().LogWrite("Connection failed");
            return crmService;

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
