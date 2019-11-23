// ======================================================================================
//  This file is part of the Microsoft Dynamics 365 (CRM) SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft Development Tools and/or 
//  on-line documentation.  See these other materials for detailed information regarding 
//  Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER 
//  EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY 
//  AND/OR FITNESS FOR A PARTICULAR PURPOSE.
// ======================================================================================

using Microsoft.Crm.Sdk.Samples.HelperCode;
using DataExportSales;
using DataExportSales.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;


namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// This program demonstrates programming against the Dynamics 365 Data Export Service, through
    ///  generated client code. The classes in the folder DataExportSalesClient were generated with 
    ///  Rest API Client wizard, added when the Azure SDK is installed.  This code wraps calls to the
    ///  Data Export API, documented at https://discovery.crmreplication.azure.net/swagger/ui/index.
    ///  The Data Export Service is an optional module available only with Dynamics 365 Online.
    /// </summary>
    /// <remarks>
    /// Before building this application, you must first modify the following configuration 
    /// information in the app.config file:
    ///   - CRM Online: Replace the app settings with the correct values for your Azure 
    ///                 application registration. 
    /// See the provided app.config file for more information. 
    /// </remarks>
    class SalesExport
    {
        // Common variables used in the sample
        private HttpClient httpClient;      // Client to CRM server communication

        /// <summary> 
        /// Primary method that demonstrates the Data Export Service API. 
        /// </summary>
        public async Task RunAsync()
        {
            //HttpRequestMessage request;
            //HttpResponseMessage response;

            string myOrgUrl = "https://crmue.crm.dynamics.com/";      //Dynamics 365 organization URL
            string myOrgId = "883278f5-07af-45eb-a0bc-3fea67caa544";  //Dynamics 365 organization ID

            //Call a method just to confirm connection
            var response = httpClient.GetAsync("WhoAmI",
                                       HttpCompletionOption.ResponseHeadersRead).Result;
            if (response.IsSuccessStatusCode)
            {
                //Get the response content and parse it.
                JObject body = JObject.Parse(response.Content.ReadAsStringAsync().Result);
                Guid userId = (Guid)body["UserId"];
                Console.WriteLine("Your system user ID is: {0}", userId);
            }
            else
            {
                Console.WriteLine("The WhoAmI request failed with a status of '{0}'",
                       response.ReasonPhrase);
            }


            //Use the metadata API to obtain a connector instance to your Dynamics 365 service.
            DataExportSalesClient discoveryClient = new DataExportSalesClient();
            ConnectorDetailResponse connResponse = (ConnectorDetailResponse) discoveryClient.
                Metadata.GetConnectorDetailsAsync(myOrgUrl, myOrgId).Result;

            if (connResponse == null)
            {
                Console.Write("Failed to obtain a connector instance from the discovery service!");
                throw new NullReferenceException("ConnectorDetailResponse is null!");
            }

            //Use the connector to perform profile operations via the profiles API.
            //First, create another client instance, but now using the discovered connector URL.
            DataExportSalesClient salesClient =
                    new DataExportSalesClient(new Uri(connResponse.ConnectorUrl));
            //Then obtain the collection of sales profiles.
            Profiles salesProfiles = new Profiles(salesClient);

            //With this client, can work with an existing Data Export profile.
            salesProfiles.Activate("SalesExport1");
            ProfileDetailsDTO salesProfile1 = (ProfileDetailsDTO)salesProfiles.GetProfileById("SalesExport1");


            //Or can create new Data Export profile.
            ProfileDetailsDTO salesProfile2 =
                (ProfileDetailsDTO)salesProfiles.CreateProfile(new DataExportSales.Models.ProfileDescriptionBase()
                {
                    DestinationKeyVaultUri = "https://mykv.vault.azure.net:443/secrets/SampleDataExportSecret/f593bcd8f3b8461584935e0a3e7325dd;",
                    Name = "SalesExport1"
                    //...

                });



            //Test the new profile.
            object testResult = salesProfiles.GetTestResultById(salesProfile1.Id);
            //Activate the new profile.
            salesProfiles.Activate(salesProfile1.Id);





        }

        /// <summary> Main method for the DataExportSales project. </summary>
        /// <param name="args">
        /// Command line arguments, first is the optional connection string name.
        /// </param>
        static void Main(string[] args)
        {
            SalesExport app = new SalesExport();
            Console.WriteLine("-- Sample started --");
            try
            {
                app.ConnectToCRM(args);       // Read configuration file and connect to the specified CRM instance.
                Task.WaitAll(Task.Run(async () => await app.RunAsync()));
            }
            catch (System.Exception ex)
            { DisplayException(ex); }
            finally
            {
                if (app.httpClient != null)
                {
                    app.httpClient.Dispose();
                }
                Console.WriteLine("\nPress <Enter> to exit the program.");
                Console.ReadLine();
            }
        }

        /// <summary>
        /// Obtains the connection information from the application's configuration file,
        /// and uses this info to connect to the specified CRM service.
        /// </summary>
        /// <param name="args">Command line arguments</param>
        private void ConnectToCRM(String[] cmdargs)
        {
            // Create a helper object to read app.config for service URL and application 
            // registration settings.
            Configuration config = null;
            if (cmdargs.Length > 0)
                config = new FileConfiguration(cmdargs[0]);
            else
                config = new FileConfiguration(null);

            // Create a helper object to authenticate the user with this connection info.
            Authentication auth = new Authentication(config);

            // Next use a HttpClient object to connect to specified CRM Web service.
            httpClient = new HttpClient(auth.ClientHandler, true);

            // Define the Web API base address, the max period of execute time, the 
            // default OData version, and the default response payload format.
            httpClient.BaseAddress = new Uri(config.ServiceUrl + "api/data/v8.1/");
            httpClient.Timeout = new TimeSpan(0, 2, 0);
            httpClient.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
            httpClient.DefaultRequestHeaders.Add("OData-Version", "4.0");
            httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        /// <summary> Displays exception information to the console. </summary>
        /// <param name="ex">The exception to output</param>
        private static void DisplayException(Exception ex)
        {
            Console.WriteLine("The application terminated with an error.");
            Console.WriteLine(ex.Message);
            while (ex.InnerException != null)
            {
                Console.WriteLine("\t* {0}", ex.InnerException.Message);
                ex = ex.InnerException;
            }
        }

    }
}
