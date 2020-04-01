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
using static Microsoft.Crm.Sdk.Samples.GoogleDataContracts.DistanceMatrixResponse.CResult.CElement;

namespace Microsoft.Crm.Sdk.Samples
{

    /// <summary>
    /// msdyn_RetrieveDistanceMatrix Plugin.
    /// </summary>
    public class msdyn_RetrieveDistance : IPlugin
    {
        const string PluginStatusCodeKey = "PluginStatus";
        const string SourcesKey = "Sources";
        const string TargetsKey = "Targets";
        const string MatrixKey = "Result";

        /// <summary>
        /// Initializes a new instance of the msdyn_RetrieveDistance class
        /// </summary>
        /// <param name="unsecure"></param>
        /// <param name="secure"></param>
        public msdyn_RetrieveDistance(string unsecure, string secure)
        {
            // TODO: Implement your custom configuration handling.
        }

        /// <summary>
        /// Execute the plugin
        /// </summary>
        /// <param name="serviceProvider"></param>
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

            ExecuteDistanceMatrix(PluginExecutionContext, OrganizationService, TracingService);

        }

        public void ExecuteDistanceMatrix(IPluginExecutionContext pluginExecutionContext, IOrganizationService organizationService, ITracingService tracingService)
        {
            //Contains 2 fields (EntityCollection) for sources and targets
            ParameterCollection InputParameters = pluginExecutionContext.InputParameters;
            // Contains 1 field (EntityCollection) for results
            ParameterCollection OutputParameters = pluginExecutionContext.OutputParameters;
            //Contains 1 field (int) for status of previous and this plugin
            ParameterCollection SharedVariables = pluginExecutionContext.SharedVariables;

            tracingService.Trace("ExecuteDistanceMatrix started.  InputParameters = {0},OutputParameters = {1}", InputParameters.Count().ToString(), OutputParameters.Count().ToString());

            try
            {
                // If a plugin earlier in the pipeline has already retrieved a distance matrix successfully, quit 
                if (OutputParameters[MatrixKey] != null)
                    if (((EntityCollection)OutputParameters[MatrixKey]).Entities != null)
                        if (((EntityCollection)OutputParameters[MatrixKey]).Entities.Count > 0) return;

                // Make Distance Matrix call to Google API
                WebClient client = new WebClient();
                var url = String.Format($"https://{GoogleConstants.GoogleApiServer}{GoogleConstants.GoogleDistanceMatrixPath}/json"
                    + "?units=imperial"
                    + $"&origins={string.Join("|", ((EntityCollection)InputParameters[SourcesKey]).Entities.Select(e => e.GetAttributeValue<double?>("latitude") + "," + e.GetAttributeValue<double?>("longitude")))}"
                    + $"&destinations={string.Join("|", ((EntityCollection)InputParameters[TargetsKey]).Entities.Select(e => e.GetAttributeValue<double?>("latitude") + "," + e.GetAttributeValue<double?>("longitude")))}"
                    + $"&key={GoogleConstants.GoogleApiKey}");
                tracingService.Trace($"Calling {url}\n");
                string response = client.DownloadString(url);   // Post ...

                tracingService.Trace("Parsing response ...\n");
                DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(DistanceMatrixResponse));    // Deserialize response json
                object objResponse = jsonSerializer.ReadObject(new MemoryStream(Encoding.UTF8.GetBytes(response)));     // Get response as an object
                DistanceMatrixResponse distancematrixResponse = objResponse as DistanceMatrixResponse;       // Unbox as our data contracted class for response

                tracingService.Trace("Response Status = " + distancematrixResponse.Status + "\n");
                if (distancematrixResponse.Status != "OK")
                    throw new ApplicationException($"Server {GoogleConstants.GoogleApiServer} application error (Status={distancematrixResponse.Status}). {distancematrixResponse.ErrorMessage}");

                tracingService.Trace("Checking distancematrixResponse.Results...\n");
                if (distancematrixResponse.Rows != null)
                {
                    tracingService.Trace("Parsing distancematrixResponse.Results.Elements...\n");

                    // build and update output parameter
                    var result = new EntityCollection();
                    result.Entities.AddRange(distancematrixResponse.Rows.Select(r => ToEntity(r.Columns.Select(c => ToEntity(c.Status, c.Duration, c.Distance)).ToArray())));
                    OutputParameters[MatrixKey] = result;

                }
                else throw new ApplicationException($"Server {GoogleConstants.GoogleApiServer} application error (missing Rows)");
            }
            catch (Exception ex)
            {
                // Signal to subsequent plugins in this message pipeline that retrieval of distance matrix failed here.
                OutputParameters[MatrixKey] = null;

                //TODO: You may need to decide which caught exceptions will rethrow and which ones will simply signal geocoding did not complete.
                throw new InvalidPluginExecutionException(string.Format("Geocoding failed at {0} with exception -- {1}: {2}"
                    , GoogleConstants.GoogleApiServer, ex.GetType().ToString(), ex.Message), ex);
            }

            // For debugging purposes, throw an exception to see the details of the parameters
            CreateExceptionWithDetails("Debugging...", InputParameters, OutputParameters, SharedVariables);
        }

        private Entity ToEntity(string status, CProperty duration, CProperty meters)
        {
            var e = new Entity("organization");
            e["status"] = status;
            if (status.ToUpper() == "OK")
            {
                e["miles"] = meters.Value * 0.000621371d;      // Convert to miles
                e["duration"] = duration.Value;
            }
            else
            {                                        // either NOT_FOUND or ZERO_RESULTS
                e["miles"] = 0d;
                e["duration"] = 0d;
            }
            return e;
        }

        private Entity ToEntity(params Entity[] entities)
        {
            var c = new EntityCollection();
            c.Entities.AddRange(entities);
            var e = new Entity("organization");
            e[MatrixKey] = c;
            return e;
        }

        private void CreateExceptionWithDetails(string message, ParameterCollection inputs, ParameterCollection outputs, ParameterCollection shareds)
        {
            StringBuilder sb = new StringBuilder(message + "\n");
            sb.AppendLine("InputParameters -- ");
            foreach (var item in inputs)
            {
                sb.AppendLine("\t" + item.Key + " : '" + item.Value + "' ");
                if (((EntityCollection)item.Value).Entities != null)
                    ((EntityCollection)item.Value).Entities.ToList().ForEach(e => sb.AppendLine("\t\t" + e.GetAttributeValue<double>("latitude").ToString() + "," + e.GetAttributeValue<double>("longitude").ToString()));
            }
            if (outputs != null)
            {
                sb.AppendLine("OutputParameters -- ");
                foreach (var item in outputs)
                {
                    sb.AppendLine("\t" + item.Key + " : '" + item.Value + "' ");
                    if (item.Value != null)
                        if (((EntityCollection)item.Value).Entities != null)
                            ((EntityCollection)item.Value).Entities.ToList().ForEach(r => {
                                sb.AppendLine("\t\t" + r.GetAttributeValue<EntityCollection>(MatrixKey).ToString());
                                if (r.GetAttributeValue<EntityCollection>(MatrixKey).Entities != null)
                                    r.GetAttributeValue<EntityCollection>(MatrixKey).Entities.ToList().ForEach(e => sb.AppendLine("\t\t" + e.GetAttributeValue<double>("distance").ToString() + "," + e.GetAttributeValue<double>("duration").ToString()));

                            });
                }
            }
            sb.AppendLine("SharedVariables -- ");
            foreach (var item in shareds) sb.AppendLine("\t" + item.Key + " : '" + item.Value + "' ");
            throw new InvalidPluginExecutionException(sb.ToString());
        }
    }
}
