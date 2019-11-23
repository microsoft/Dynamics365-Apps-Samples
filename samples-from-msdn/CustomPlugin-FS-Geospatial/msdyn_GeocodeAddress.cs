// ===================================================================== 
//  This file is part of the Microsoft Dynamics 365 Customer Engagement 
//  SDK Code Samples. 
// 
//  Copyright (C) Microsoft Corporation.  All rights reserved. 
// 
//  This source code is intended only as a supplement to Microsoft 
//  Development Tools and/or on-line documentation.  See these other 
//  materials for detailed information regarding Microsoft code samples. 
// 
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A 
//  PARTICULAR PURPOSE. 
// =====================================================================

using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;
using Microsoft.Crm.Sdk.Samples.GoogleDataContracts;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace Microsoft.Crm.Sdk.Samples
{

    /// <summary>
    /// msdyn_GeocodeAddress Plugin.
    /// </summary>  
    public class msdyn_GeocodeAddress : IPlugin
    {
        const string PluginStatusCodeKey = "PluginStatus";
        const string Address1Key = "Line1";
        const string CityKey = "City";
        const string StateKey = "StateOrProvince";
        const string PostalCodeKey = "PostalCode";
        const string CountryKey = "Country";
        const string LatitudeKey = "Latitude";
        const string LongitudeKey = "Longitude";
        const string LcidKey = "Lcid";

        public void Execute(IServiceProvider serviceProvider)
        {
            if (serviceProvider == null)
            {
                throw new InvalidPluginExecutionException("serviceProvider");
            }

            // Obtain the execution context service from the service provider.
            IPluginExecutionContext PluginExecutionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the organization factory service from the service provider.
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            // Use the factory to generate the organization service.
            IOrganizationService OrganizationService = factory.CreateOrganizationService(PluginExecutionContext.UserId);

            // Obtain the tracing service from the service provider.
            ITracingService TracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            ExecuteGeocodeAddress(PluginExecutionContext, OrganizationService, TracingService);

        }


        /// <summary>
        /// Retrieve geocode address using Google Api
        /// </summary>
        /// <param name="pluginExecutionContext">Execution context</param>
        /// <param name="organizationService">Organization service</param>
        /// <param name="tracingService">Tracing service</param>
        /// <param name="notificationService">Notification service</param>
        public void ExecuteGeocodeAddress(IPluginExecutionContext pluginExecutionContext, IOrganizationService organizationService,  ITracingService tracingService)
        {
            //Contains 5 fields (string) for individual parts of an address
            ParameterCollection InputParameters = pluginExecutionContext.InputParameters;
            // Contains 2 fields (double) for resultant geolocation
            ParameterCollection OutputParameters = pluginExecutionContext.OutputParameters;
            //Contains 1 field (int) for status of previous and this plugin
            ParameterCollection SharedVariables = pluginExecutionContext.SharedVariables;

            tracingService.Trace("ExecuteGeocodeAddress started. InputParameters = {0}, OutputParameters = {1}", InputParameters.Count().ToString(), OutputParameters.Count().ToString());
            

            try
            {
                // If a plugin earlier in the pipeline has already geocoded successfully, quit 
                if ((double)OutputParameters[LatitudeKey] != 0d || (double)OutputParameters[LongitudeKey] != 0d) return;

                // Get user Lcid if request did not include it
                int Lcid = (int)InputParameters[LcidKey];
                string _address = string.Empty;
                if (Lcid == 0)
                {
                    var userSettingsQuery = new QueryExpression("usersettings");
                    userSettingsQuery.ColumnSet.AddColumns("uilanguageid", "systemuserid");
                    userSettingsQuery.Criteria.AddCondition("systemuserid", ConditionOperator.Equal, pluginExecutionContext.InitiatingUserId);
                    var userSettings = organizationService.RetrieveMultiple(userSettingsQuery);
                    if (userSettings.Entities.Count > 0)
                        Lcid = (int)userSettings.Entities[0]["uilanguageid"];
                }

                // Arrange the address components in a single comma-separated string, according to LCID
                _address = GisUtility.FormatInternationalAddress(Lcid,
                    (string)InputParameters[Address1Key], 
                    (string)InputParameters[PostalCodeKey], 
                    (string)InputParameters[CityKey], 
                    (string)InputParameters[StateKey], 
                    (string)InputParameters[CountryKey]);

                // Make Geocoding call to Google API
                WebClient client = new WebClient();
                var url = $"https://{GoogleConstants.GoogleApiServer}{GoogleConstants.GoogleGeocodePath}/json?address={_address}&key={GoogleConstants.GoogleApiKey}";
                tracingService.Trace($"Calling {url}\n");
                string response = client.DownloadString(url);   // Post ...

                tracingService.Trace("Parsing response ...\n");
                DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(GeocodeResponse));    // Deserialize response json
                object objResponse = jsonSerializer.ReadObject(new MemoryStream(Encoding.UTF8.GetBytes(response)));     // Get response as an object
                GeocodeResponse geocodeResponse = objResponse as GeocodeResponse;       // Unbox into our data contracted class for response

                tracingService.Trace("Response Status = " + geocodeResponse.Status + "\n");
                if (geocodeResponse.Status != "OK")
                    throw new ApplicationException($"Server {GoogleConstants.GoogleApiServer} application error (Status {geocodeResponse.Status}).");

                tracingService.Trace("Checking geocodeResponse.Result...\n");
                if (geocodeResponse.Results != null)
                {
                    if (geocodeResponse.Results.Count() == 1)
                    {
                        tracingService.Trace("Checking geocodeResponse.Result.Geometry.Location...\n");
                        if (geocodeResponse.Results.First()?.Geometry?.Location != null)
                        {
                            tracingService.Trace("Setting Latitude, Longitude in OutputParameters...\n");

                            // update output parameters
                            OutputParameters[LatitudeKey] = geocodeResponse.Results.First().Geometry.Location.Lat;
                            OutputParameters[LongitudeKey] = geocodeResponse.Results.First().Geometry.Location.Lng;

                        }
                        else throw new ApplicationException($"Server {GoogleConstants.GoogleApiServer} application error (missing Results[0].Geometry.Location)");
                    }
                    else throw new ApplicationException($"Server {GoogleConstants.GoogleApiServer} application error (more than 1 result returned)");
                }
                else throw new ApplicationException($"Server {GoogleConstants.GoogleApiServer} application error (missing Results)");
            }
            catch (Exception ex)
            {
                // Signal to subsequent plugins in this message pipeline that geocoding failed here.
                OutputParameters[LatitudeKey] = 0d;
                OutputParameters[LongitudeKey] = 0d;

                //TODO: You may need to decide which caught exceptions will rethrow and which ones will simply signal geocoding did not complete.
                throw new InvalidPluginExecutionException(string.Format("Geocoding failed at {0} with exception -- {1}: {2}"
                    , GoogleConstants.GoogleApiServer, ex.GetType().ToString(), ex.Message), ex);
            }

        }
    }
}
