// ==============================================================================
//  This file is part of the Microsoft Dynamics CRM SDK Code Samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
// ==============================================================================

//<snippetDiscoveryService>
using System;
using System.Collections.Generic;
using System.ServiceModel;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Discovery;
using System.ServiceModel.Description;

namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// Demonstrates useful messages of the Discovery service.
    /// </summary>
    public class DiscoveryService
    {

        #region Class Level Members

        private DiscoveryServiceProxy _serviceProxy;

        #endregion Class Level Members

        #region How-To Sample Code
        /// <summary>
        /// Demonstrates the RetrieveOrganization and RetrieveOrganizations messages
        /// of the Discovery service.
        /// </summary>
        /// <param name="serverConfig">Contains server connection information.</param>
        /// <param name="promptforDelete">When True, the user will be prompted to delete all
        /// created entities.</param>
        public void Run(ServerConnection.Configuration serverConfig, bool promptforDelete)
        {
            try
            {
                //<snippetDiscoveryService1>
                // Connect to the Discovery service. 
                // The using statement assures that the service proxy will be properly disposed.

                using (_serviceProxy = ServerConnection.GetProxy<IDiscoveryService, DiscoveryServiceProxy>(serverConfig))
                {
                    // You can choose to use the interface instead of the proxy.
                    IDiscoveryService service = _serviceProxy;

                    #region RetrieveOrganizations Message

                    //<snippetDiscoveryService2>
                    // Retrieve details about all organizations discoverable via the
                    // Discovery service.
                    RetrieveOrganizationsRequest orgsRequest =
                        new RetrieveOrganizationsRequest()
                        {
                            AccessType = EndpointAccessType.Default,
                            Release = OrganizationRelease.Current
                        };
                    RetrieveOrganizationsResponse organizations =
                        (RetrieveOrganizationsResponse)service.Execute(orgsRequest);
                    //</snippetDiscoveryService2>

                    // Print each organization's friendly name, unique name and URLs
                    // for each of its endpoints.
                    Console.WriteLine();
                    Console.WriteLine("Retrieving details of each organization:");
                    foreach (OrganizationDetail organization in organizations.Details)
                    {
                        Console.WriteLine("Organization Name: {0}", organization.FriendlyName);
                        Console.WriteLine("Unique Name: {0}", organization.UniqueName);
                        Console.WriteLine("Endpoints:");
                        foreach (var endpoint in organization.Endpoints)
                        {
                            Console.WriteLine("  Name: {0}", endpoint.Key);
                            Console.WriteLine("  URL: {0}", endpoint.Value);
                        }
                    }
                    Console.WriteLine("End of listing");
                    Console.WriteLine();

                    #endregion RetrieveOrganizations Message

                    #region RetrieveOrganization Message

                    //<snippetDiscoveryService3>
                    // Retrieve details about a single organization discoverable via the Discovery service.
                    //
                    RetrieveOrganizationRequest orgRequest =
                        new RetrieveOrganizationRequest()
                        {
                            UniqueName = organizations.Details[organizations.Details.Count -1].UniqueName,
                            AccessType = EndpointAccessType.Default,
                            Release = OrganizationRelease.Current
                        };
                    RetrieveOrganizationResponse org =
                        (RetrieveOrganizationResponse)service.Execute(orgRequest);
                    //</snippetDiscoveryService3>

                    // Print the organization's friendly name, unique name and URLs
                    // for each of its endpoints.
                    Console.WriteLine();
                    Console.WriteLine("Retrieving details of specific organization:");
                    Console.WriteLine("Organization Name: {0}", org.Detail.FriendlyName);
                    Console.WriteLine("Unique Name: {0}", org.Detail.UniqueName);
                    Console.WriteLine("Endpoints:");
                    foreach (KeyValuePair<EndpointType, string> endpoint in org.Detail.Endpoints)
                    {
                        Console.WriteLine("  Name: {0}", endpoint.Key);
                        Console.WriteLine("  URL: {0}", endpoint.Value);
                    }
                    Console.WriteLine("End of listing");
                    Console.WriteLine();

                    #endregion RetrieveOrganization Message

                }
                //</snippetDiscoveryService1>
            }

            // Catch any service fault exceptions that Microsoft Dynamics CRM throws.
            catch (FaultException<Microsoft.Xrm.Sdk.DiscoveryServiceFault>)
            {
                // You can handle an exception here or pass it back to the calling method.
                throw;
            }
        }

        #endregion How-To Sample Code

        #region Main method

        /// <summary>
        /// Standard Main() method used by most SDK samples.
        /// </summary>
        /// <param name="args"></param>
        static public void Main(string[] args)
        {
            try
            {
                // Obtain the target organization's Web address and client logon 
                // credentials from the user.
                ServerConnection serverConnect = new ServerConnection();
                ServerConnection.Configuration config = serverConnect.GetServerConfiguration();

                DiscoveryService app = new DiscoveryService();
                app.Run(config, true);
            }
            catch (FaultException<Microsoft.Xrm.Sdk.DiscoveryServiceFault> ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Timestamp: {0}", ex.Detail.Timestamp);
                Console.WriteLine("Code: {0}", ex.Detail.ErrorCode);
                Console.WriteLine("Message: {0}", ex.Detail.Message);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
            }
            catch (System.TimeoutException ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Message: {0}", ex.Message);
                Console.WriteLine("Stack Trace: {0}", ex.StackTrace);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.InnerException.Message ? "No Inner Fault" : ex.InnerException.Message);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine(ex.Message);

                // Display the details of the inner exception.
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);

                    FaultException<Microsoft.Xrm.Sdk.DiscoveryServiceFault> fe = ex.InnerException
                        as FaultException<Microsoft.Xrm.Sdk.DiscoveryServiceFault>;
                    if (fe != null)
                    {
                        Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                        Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                        Console.WriteLine("Message: {0}", fe.Detail.Message);
                        Console.WriteLine("Inner Fault: {0}",
                            null == fe.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
                    }
                }
            }
            // Additional exceptions to catch: SecurityTokenValidationException, ExpiredSecurityTokenException,
            // SecurityAccessDeniedException, MessageSecurityException, and SecurityNegotiationException.

            finally
            {
                Console.WriteLine("Press <Enter> to exit.");
                Console.ReadLine();
            }
        }
        #endregion Main method

        
    }
}
//</snippetDiscoveryService>