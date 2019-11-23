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
using System.Globalization;
using System.Net;
using System.Xml;

namespace Microsoft.Crm.Services.Utility
{
    /// <summary>
    /// Microsoft Online (Microsoft account as well as Microsoft Office 365 a.k.a. OSDP / OrgId)) Authentication Policy 
    /// for CRM Web Services.
    /// </summary>
    public sealed class OnlineAuthenticationPolicy
    {
        /// <summary>
        /// Construct an Instance of the OnlineAuthenticationPolicy class
        /// </summary>
        /// <param name="flatWsdlUrl">URL to the Flattened WSDL</param>
        public OnlineAuthenticationPolicy(string flatWsdlUrl)
        {
            this.Initialize(flatWsdlUrl);
        }

        /// <summary>
        /// Construct an Instance of the OnlineAuthenticationPolicy class
        /// </summary>
        /// <param name="appliesTo">AppliesTo for the web service</param>
        /// <param name="policy">Microsoft account Policy that should be used</param>
        /// <param name="issuerUri">Issuer URI that should be used for authenticating tokens</param>
        public OnlineAuthenticationPolicy(string appliesTo, string policy, Uri issuerUri)
        {
            this.AppliesTo = appliesTo;
            this.Policy = policy;
            this.IssuerUri = issuerUri;
        }

        #region Properties
        /// <summary>
        /// AppliesTo value that should be set on the service
        /// </summary>
        public string AppliesTo { get; private set; }

        /// <summary>
        /// Microsoft account / Org Id Policy
        /// </summary>
        public string Policy { get; private set; }

        /// <summary>
        /// Microsoft account / Org Id Issuer that issues the tokens
        /// </summary>
        public Uri IssuerUri { get; private set; }
        #endregion

        #region Methods
        private void Initialize(string flatWsdlUrl)
        {
            if (string.IsNullOrWhiteSpace(flatWsdlUrl))
            {
                throw new ArgumentNullException("flatWsdlUrl");
            }

            // Parse the WSDL
            XmlDocument wsdl = DownloadWsdl(flatWsdlUrl);

            // Setup the namespace manager required for executing queries
            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(wsdl.NameTable);
            namespaceManager.AddNamespace("wsdl", "http://schemas.xmlsoap.org/wsdl/");
            
            // Fetching target wsdl uri from "wsdl:import" node.
            XmlNode importNode = SelectFirstNodeOrDefault(wsdl.DocumentElement, "wsdl:import", namespaceManager);
            String targetWsdlUri = ReadAttributeValue(importNode, "location");
            XmlDocument targetWsdl = DownloadWsdl(targetWsdlUri);

            // Initialize with the downloaded WSDL
            this.Initialize(flatWsdlUrl, targetWsdl);
        }

        private void Initialize(string url, XmlDocument wsdl)
        {
            const string wsp = "wsp";
            const string MsXrm = "ms-xrm";
            const string MsXrm2012 = "ms-xrm2012";
            const string sp = "sp";
            const string ad = "ad";
            const string ExactlyOne = ":ExactlyOne/";
            const string All = ":All/";
            const string AuthenticationPolicy = ":AuthenticationPolicy/";
            const string SecureTokenService = ":SecureTokenService/";
            const string ReferenceParameters = ":ReferenceParameters/";
            const string PolicyNodePath = wsp +":Policy";
            const string AllPathFormat = "{0}{1}{0}{2}{3}";
            const string TrustPathFormat = AllPathFormat + "{4}{3}{5}{3}";
            const string LiveTrustPathFormat = TrustPathFormat + ":LiveTrust" ;
            const string OrgTrustPathFormat = TrustPathFormat + ":OrgTrust";
            const string IssuerContainerPathFormat = AllPathFormat + ":SignedSupportingTokens/{0}:Policy/{3}:IssuedToken/{3}:Issuer";
            
            const string LiveAppliesToNodeName = MsXrm + ":AppliesTo";
            const string OrgAppliesToNodeName = MsXrm2012 + ":AppliesTo";
            const string LivePolicyNodeName = MsXrm + ":LivePolicy";
            const string OrgPolicyNodeName = MsXrm2012 + ":LivePolicy";

            const string LiveIdReferenceIssuerUriNodeName = ad + ReferenceParameters + MsXrm2012 + ":LiveIssuer";
            const string OrgIdReferenceIssuerUriNodeName = ad + ReferenceParameters + MsXrm2012 + ":OrgIdIssuer";
            const string AddressIssuerUriNodeName = ad + ":Address";

            // Setup the namespace manager required for executing queries
            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(wsdl.NameTable);
            namespaceManager.AddNamespace(wsp, "http://schemas.xmlsoap.org/ws/2004/09/policy");
            namespaceManager.AddNamespace(MsXrm, "http://schemas.microsoft.com/xrm/2011/Contracts/Services");
            namespaceManager.AddNamespace(MsXrm2012, "http://schemas.microsoft.com/xrm/2012/Contracts/Services");
            namespaceManager.AddNamespace(sp, "http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702");
            namespaceManager.AddNamespace(ad, "http://www.w3.org/2005/08/addressing");

            // Retrieve the root policy node to fetch properties AppliesTo, Policy and IssuerUri required for authentication. 
            XmlNode policyNode = SelectFirstNodeOrDefault(wsdl.DocumentElement, PolicyNodePath, namespaceManager);
            if (null != policyNode)
            {
                // Set authentication type to OnlineFederation.
                Boolean authWithOrgId = true;               
                
                // Construct the org trust path.
                String orgIdentityProviderTrustPath = string.Format(CultureInfo.InvariantCulture,
                    OrgTrustPathFormat, wsp, ExactlyOne, All, MsXrm2012, AuthenticationPolicy, SecureTokenService);

                // Retrieve the OrgId authentication policy (that contains the AppliesTo and LivePolicy values).
                XmlNode IdentityProviderTrustConfiguration = SelectFirstNodeOrDefault(policyNode, 
                    orgIdentityProviderTrustPath, 
                    namespaceManager);
                                
                // If OrgId authentication policy node note found then try Microsoft account policy node.
                if (null == IdentityProviderTrustConfiguration)
                {
                    // Construct the Microsoft account trust path.
                    String liveIdentityProviderTrustPath = string.Format(CultureInfo.InvariantCulture,
                    LiveTrustPathFormat, wsp, ExactlyOne, All, MsXrm, AuthenticationPolicy, SecureTokenService);

                    IdentityProviderTrustConfiguration = SelectFirstNodeOrDefault(policyNode, liveIdentityProviderTrustPath, namespaceManager);
                    // Set OnlineFederation authentication flag to false.
                    authWithOrgId = false;
                }

                if (null != IdentityProviderTrustConfiguration)
                {
                    // Retrieve AppliesTo value based on IdentityProvider type.
                    string appliesTo = ReadNodeValue(IdentityProviderTrustConfiguration, 
                        authWithOrgId? OrgAppliesToNodeName : LiveAppliesToNodeName, 
                        namespaceManager);
                    // Retrieve LivePolicy value based on IdentityProvider type.
                    string livePolicy = ReadNodeValue(IdentityProviderTrustConfiguration, 
                        authWithOrgId? OrgPolicyNodeName : LivePolicyNodeName, 
                        namespaceManager);

                    string issuerContainerPath = string.Format( CultureInfo.InvariantCulture, IssuerContainerPathFormat, wsp, ExactlyOne, All, sp);

                    // The issuer container node contains the Issuer URI. Since the Discovery Service exposes both Office 365 
                    // and Microsoft account authentication mechanisms, it lists multiple issuers. In that case, the issuer is 
                    // listed under the reference parameters. In other scenarios, it is listed in the Address node instead.
                    XmlNode issuerContainerNode = SelectFirstNodeOrDefault(policyNode, issuerContainerPath, namespaceManager);
                    if (null != issuerContainerNode)
                    {
                        // Read the value from the reference parameters. If it is not set, check the Address node.
                        string issuerUri = ReadNodeValue(issuerContainerNode,
                            authWithOrgId? OrgIdReferenceIssuerUriNodeName : LiveIdReferenceIssuerUriNodeName,
                            namespaceManager);
                       
                        // Try Address node to find issuer Uri.
                        if (string.IsNullOrWhiteSpace(issuerUri))
                        {
                            issuerUri = ReadNodeValue(issuerContainerNode, AddressIssuerUriNodeName, namespaceManager);
                        }
                        // If the issuer was discovered, it means that all of the required information has been found.
                        if (!string.IsNullOrWhiteSpace(issuerUri))
                        {
                            this.Initialize(appliesTo, livePolicy, new Uri(issuerUri));
                            return;
                        }
                    }
                }
            }

            // Some piece of information could not be found.
            throw new InvalidOperationException(string.Format(CultureInfo.InvariantCulture,
                "Unable to parse the authentication policy from the WSDL \"{0}\".", url));
        }

        private void Initialize(string appliesTo, string policy, Uri issuerUri)
        {
            if (string.IsNullOrWhiteSpace(appliesTo))
            {
                throw new ArgumentNullException("appliesTo");
            }
            else if (string.IsNullOrWhiteSpace(policy))
            {
                throw new ArgumentNullException("policy");
            }
            else if (null == issuerUri)
            {
                throw new ArgumentNullException("issuerUri");
            }

            this.AppliesTo = appliesTo;
            this.Policy = policy;
            this.IssuerUri = issuerUri;
        }

        private XmlDocument DownloadWsdl(string flatWsdlUrl)
        {
            // Download the Flat WSDL to determine the authentication policy information
            WebClient client = new WebClient();
            string wsdl;
            try
            {
                wsdl = client.DownloadString(flatWsdlUrl);
            }
            catch (WebException ex)
            {
                throw new InvalidOperationException(string.Format(CultureInfo.InvariantCulture,
                    "Unable to download the authentication policy from WSDL \"{0}\".", flatWsdlUrl), ex);
            }

            // Parse the XML into a document
            XmlDocument wsdlDoc = new XmlDocument();
            try
            {
                wsdlDoc.LoadXml(wsdl);
            }
            catch (XmlException ex)
            {
                throw new InvalidOperationException(string.Format(CultureInfo.InvariantCulture,
                    "Unable to parse the WSDL \"{0}\".", flatWsdlUrl), ex);
            }

            return wsdlDoc;
        }

        private XmlNode SelectFirstNodeOrDefault(XmlNode root, string path, XmlNamespaceManager namespaceManager)
        {
            XmlNodeList nodes = root.SelectNodes(path, namespaceManager);
            if (0 == nodes.Count)
            {
                return null;
            }

            return nodes[0];
        }

        private string ReadNodeValue(XmlNode parent, string nodeName, XmlNamespaceManager namespaceManager)
        {
            XmlNode node = SelectFirstNodeOrDefault(parent, nodeName, namespaceManager);
            if (null != node)
            {
                return node.InnerText;
            }

            return null;
        }

        private string ReadAttributeValue(XmlNode parent, string attributeName)
        {
            XmlAttribute attribute = parent.Attributes[attributeName];
            if (null != attribute)
            {
                return attribute.InnerText;
            }
            return null;
        }
        #endregion
    }
}