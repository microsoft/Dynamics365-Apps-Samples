// =====================================================================
//
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
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
//
// =====================================================================
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens;
using System.ServiceModel;
using System.ServiceModel.Description;

using Microsoft.Crm.Services.Utility;

namespace Microsoft.Crm.Sdk.Samples
{
    using CrmSdk;
    using CrmSdk.Discovery;

    internal static class Program
    {
        #region Constants
        /// <summary>
        /// Microsoft account (e.g. youremail@live.com) or Microsoft Office 365 (Org ID e.g. youremail@yourorg.onmicrosoft.com) User Name.
        /// </summary>
        private const string UserName = "youremail@yourorg.onmicrosoft.com";

        /// <summary>
        /// Microsoft account or Microsoft Office 365 (Org ID) Password.
        /// </summary>
        private const string UserPassword = "password";

        /// <summary>
        /// Unique Name of the organization
        /// </summary>
        private const string OrganizationUniqueName = "orgname";

        /// <summary>
        /// URL for the Discovery Service
        /// For North America
        ///     Microsoft account, discovery service url could be https://dev.crm.dynamics.com/XRMServices/2011/Discovery.svc
        ///     Microsoft Office 365, discovery service url could be https://disco.crm.dynamics.com/XRMServices/2011/Discovery.svc
        /// To use appropriate discovery service url for other environments refer http://technet.microsoft.com/en-us/library/gg309401.aspx
        /// 
        /// </summary>
        private const string DiscoveryServiceUrl = "https://disco.crm.dynamics.com/XRMServices/2011/Discovery.svc";

        /// <summary>
        /// Suffix for the Flat WSDL
        /// </summary>
        private const string WsdlSuffix = "?wsdl";
        #endregion

        static void Main(string[] args)
        {
            // Retrieve the authentication policy for the Discovery service.
            OnlineAuthenticationPolicy discoveryPolicy =
                 new OnlineAuthenticationPolicy(DiscoveryServiceUrl + WsdlSuffix);
            // Authenticate the user using the authentication policy.
            SecurityToken discoveryToken = Authenticate(discoveryPolicy, UserName, UserPassword);

            // Retrieve the organization service URL for the given organization
            string organizationServiceUrl = DiscoverOrganizationUrl(discoveryToken, OrganizationUniqueName, DiscoveryServiceUrl,
                discoveryPolicy.IssuerUri);

            // The Discovery Service token cannot be reused against the Organization Service as the Issuer and AppliesTo may differ between
            // the discovery and organization services.
            OnlineAuthenticationPolicy organizationPolicy =
                new OnlineAuthenticationPolicy(organizationServiceUrl + WsdlSuffix);
            SecurityToken organizationToken = Authenticate(organizationPolicy, UserName, UserPassword);

            // Execute the sample
            ExecuteWhoAmI(organizationToken, organizationServiceUrl, organizationPolicy.IssuerUri);

            Console.Write("Press [Enter] to exit.... ");
            Console.ReadLine();
        }

        private static SecurityToken Authenticate(OnlineAuthenticationPolicy policy, string userName, string password)
        {
            ClientCredentials credentials = new ClientCredentials();
            credentials.UserName.UserName = userName;
            credentials.UserName.Password = password;

            return WsdlTokenManager.Authenticate(credentials, policy.AppliesTo, policy.Policy, policy.IssuerUri);
        }

        private static string DiscoverOrganizationUrl(SecurityToken token, string organizationName, string discoveryServiceUrl, Uri issuerUri)
        {
            using (DiscoveryServiceClient client = new DiscoveryServiceClient("CustomBinding_IDiscoveryService", discoveryServiceUrl))
            {
                client.ConfigureCrmOnlineBinding(issuerUri);
                client.Token = token;

                RetrieveOrganizationRequest request = new RetrieveOrganizationRequest()
                {
                    UniqueName = organizationName
                };
                RetrieveOrganizationResponse response;
                try
                {
                    response = (RetrieveOrganizationResponse)client.Execute(request);
                }
                catch (CommunicationException)
                {
                    throw;
                }

                foreach (KeyValuePair<EndpointType, string> endpoint in response.Detail.Endpoints)
                {
                    if (EndpointType.OrganizationService == endpoint.Key)
                    {
                        Console.WriteLine("Organization Service URL: {0}", endpoint.Value);
                        return endpoint.Value;
                    }
                }

                throw new InvalidOperationException(string.Format(CultureInfo.InvariantCulture,
                    "Organization {0} does not have an OrganizationService endpoint defined.", organizationName));
            }
        }

        private static void ExecuteWhoAmI(SecurityToken token, string serviceUrl, Uri issuerUri)
        {
            using (OrganizationServiceClient client = new OrganizationServiceClient("CustomBinding_IOrganizationService",
                new EndpointAddress(serviceUrl)))
            {
                client.ConfigureCrmOnlineBinding(issuerUri);
                client.Token = token;

                OrganizationRequest request = new OrganizationRequest();
                request.RequestName = "WhoAmI";

                OrganizationResponse response = (OrganizationResponse)client.Execute(request);

                foreach (KeyValuePair<string, object> result in response.Results)
                {
                    if ("UserId" == result.Key)
                    {
                        Console.WriteLine("User ID: {0}", result.Value);
                        break;
                    }
                }
            }
        }
    }
}