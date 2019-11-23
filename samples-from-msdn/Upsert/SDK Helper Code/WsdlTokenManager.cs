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
using System.IdentityModel.Tokens;
using System.IO;
using System.Net;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.ServiceModel.Security;
using System.Text;
using System.Xml;

using Microsoft.IdentityModel.Protocols.WSTrust;

using Microsoft.Crm.Services.Utility;

namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// Utility to authenticate Microsoft account and Microsoft Office 365 (i.e. OSDP / OrgId) users 
    /// without using the classes exposed in Microsoft.Xrm.Sdk.dll
    /// </summary>
    public static class WsdlTokenManager
    {
        private static string FederationMetadataUrlFormat = "https://nexus.passport{0}.com/federationmetadata/2007-06/FederationMetaData.xml";

        private const string DeviceTokenResponseXPath =
            @"S:Envelope/S:Body/wst:RequestSecurityTokenResponse/wst:RequestedSecurityToken";
        private const string UserTokenResponseXPath =
            @"S:Envelope/S:Body/wst:RequestSecurityTokenResponse/wst:RequestedSecurityToken";

        #region Templates
        private const string DeviceTokenTemplate = @"<?xml version=""1.0"" encoding=""UTF-8""?>
        <s:Envelope 
          xmlns:s=""http://www.w3.org/2003/05/soap-envelope"" 
          xmlns:wsse=""http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"" 
          xmlns:wsp=""http://schemas.xmlsoap.org/ws/2004/09/policy"" 
          xmlns:wsu=""http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"" 
          xmlns:wsa=""http://www.w3.org/2005/08/addressing"" 
          xmlns:wst=""http://schemas.xmlsoap.org/ws/2005/02/trust"">
           <s:Header>
            <wsa:Action s:mustUnderstand=""1"">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</wsa:Action>
            <wsa:To s:mustUnderstand=""1"">http://Passport.NET/tb</wsa:To>    
            <wsse:Security>
              <wsse:UsernameToken wsu:Id=""devicesoftware"">
                <wsse:Username>{0:deviceName}</wsse:Username>
                <wsse:Password>{1:password}</wsse:Password>
              </wsse:UsernameToken>
            </wsse:Security>
          </s:Header>
          <s:Body>
            <wst:RequestSecurityToken Id=""RST0"">
                 <wst:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</wst:RequestType>
                 <wsp:AppliesTo>
                    <wsa:EndpointReference>
                       <wsa:Address>http://Passport.NET/tb</wsa:Address>
                    </wsa:EndpointReference>
                 </wsp:AppliesTo>
              </wst:RequestSecurityToken>
          </s:Body>
        </s:Envelope>
        ";

        private const string UserTokenTemplate = @"<?xml version=""1.0"" encoding=""UTF-8""?>
        <s:Envelope 
          xmlns:s=""http://www.w3.org/2003/05/soap-envelope"" 
          xmlns:wsse=""http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"" 
          xmlns:wsp=""http://schemas.xmlsoap.org/ws/2004/09/policy"" 
          xmlns:wsu=""http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"" 
          xmlns:wsa=""http://www.w3.org/2005/08/addressing"" 
          xmlns:wst=""http://schemas.xmlsoap.org/ws/2005/02/trust"">
           <s:Header>
            <wsa:Action s:mustUnderstand=""1"">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</wsa:Action>
            <wsa:To s:mustUnderstand=""1"">http://Passport.NET/tb</wsa:To>    
           <ps:AuthInfo Id=""PPAuthInfo"" xmlns:ps=""http://schemas.microsoft.com/LiveID/SoapServices/v1"">
                 <ps:HostingApp>{0:clientId}</ps:HostingApp>
              </ps:AuthInfo>
              <wsse:Security>
                 <wsse:UsernameToken wsu:Id=""user"">
                    <wsse:Username>{1:userName}</wsse:Username>
                    <wsse:Password>{2:password}</wsse:Password>
                 </wsse:UsernameToken>
                 {3:binarySecurityToken}
              </wsse:Security>
          </s:Header>
          <s:Body>
            <wst:RequestSecurityToken Id=""RST0"">
                 <wst:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</wst:RequestType>
                 <wsp:AppliesTo>
                    <wsa:EndpointReference>
                       <wsa:Address>{4:partnerUrl}</wsa:Address>
                    </wsa:EndpointReference>
                 </wsp:AppliesTo>
                 <wsp:PolicyReference URI=""{5:policy}""/>
              </wst:RequestSecurityToken>
          </s:Body>
        </s:Envelope>";

        private const string BinarySecurityToken = @"<wsse:BinarySecurityToken ValueType=""urn:liveid:device"">
                   {0:deviceTokenValue}
                 </wsse:BinarySecurityToken>";
        #endregion

        /// <summary>
        /// This shows the method to retrieve the security ticket for the Microsoft account user or OrgId user
        /// without using any certificate for authentication.     
        /// </summary>
        /// <param name="credentials">User credentials that should be used to connect to the server</param>
        /// <param name="appliesTo">Indicates the AppliesTo that is required for the token</param>
        /// <param name="policy">Policy that should be used when communicating with the server</param>
        public static SecurityToken Authenticate(ClientCredentials credentials, string appliesTo, string policy)
        {
            return Authenticate(credentials, appliesTo, policy, null);
        }

        /// <summary>
        /// This shows the method to retrieve the security ticket for the Microsoft account user or OrgId user
        /// without using any certificate for authentication.     
        /// </summary>
        /// <param name="credentials">User credentials that should be used to connect to the server</param>
        /// <param name="appliesTo">Indicates the AppliesTo that is required for the token</param>
        /// <param name="policy">Policy that should be used when communicating with the server</param>
        /// <param name="issuerUri">URL for the current token issuer</param> 
        public static SecurityToken Authenticate(ClientCredentials credentials, string appliesTo, string policy, Uri issuerUri)
        {
            string serviceUrl = issuerUri.ToString();
            // if serviceUrl starts with "https://login.live.com", it means Microsoft account authentication is needed otherwise OSDP authentication.
            if (!String.IsNullOrEmpty(serviceUrl) && serviceUrl.StartsWith("https://login.live.com"))
            {
                serviceUrl = GetServiceEndpoint(issuerUri);
            
                //Authenticate the device
                ClientCredentials deviceCredentials = DeviceIdManager.LoadOrRegisterDevice(issuerUri);
                string deviceToken = IssueDeviceToken(serviceUrl, deviceCredentials);
                //Use the device token to authenticate the user
                return Issue(serviceUrl, credentials, appliesTo, policy, Guid.NewGuid(), deviceToken);
            }            
            // Default to OSDP authentication.
            return Issue(serviceUrl, credentials, appliesTo, policy, Guid.NewGuid(), null);
                  
        }

        #region Private Methods
        private static SecurityToken Issue(string serviceUrl, ClientCredentials credentials, string partner,
            string policy, Guid clientId, string deviceToken)
        {            
            string soapEnvelope;

            if (null != deviceToken)
            {
                soapEnvelope = string.Format(CultureInfo.InvariantCulture,
                UserTokenTemplate, clientId.ToString(),
                credentials.UserName.UserName, credentials.UserName.Password, 
                String.Format(CultureInfo.InvariantCulture, BinarySecurityToken, deviceToken), 
                partner, policy);
            }
            else
            {
                soapEnvelope = string.Format(CultureInfo.InvariantCulture,
                UserTokenTemplate, clientId.ToString(),
                credentials.UserName.UserName, credentials.UserName.Password, String.Empty, 
                partner, policy);
            }
            XmlDocument doc = CallOnlineSoapServices(serviceUrl, "POST", soapEnvelope);

            XmlNamespaceManager namespaceManager = CreateNamespaceManager(doc.NameTable);

            XmlNode serializedTokenNode = SelectNode(doc, namespaceManager, UserTokenResponseXPath);
            if (null == serializedTokenNode)
            {
                throw new InvalidOperationException("Unable to Issue User Token due to error" + Environment.NewLine + FormatXml(doc));
            }
            return ConvertToToken(serializedTokenNode.InnerXml);
        }

        private static string IssueDeviceToken(string serviceUrl, ClientCredentials deviceCredentials)
        {
            string soapEnvelope = string.Format(CultureInfo.InvariantCulture,
                DeviceTokenTemplate, deviceCredentials.UserName.UserName, deviceCredentials.UserName.Password);
            XmlDocument doc = CallOnlineSoapServices(serviceUrl, "POST", soapEnvelope);

            XmlNamespaceManager namespaceManager = CreateNamespaceManager(doc.NameTable);
            XmlNode tokenNode = SelectNode(doc, namespaceManager, DeviceTokenResponseXPath);
            if (null == tokenNode)
            {
                throw new InvalidOperationException("Unable to Issue Device Token due to error" + Environment.NewLine + FormatXml(doc));
            }

            return tokenNode.InnerXml;
        }

        private static string FormatXml(XmlDocument doc)
        {
            //Create the writer settings
            XmlWriterSettings settings = new XmlWriterSettings();
            settings.Indent = true;
            settings.OmitXmlDeclaration = true;

            //Write the data
            using (StringWriter stringWriter = new StringWriter(CultureInfo.InvariantCulture))
            {
                using (XmlWriter writer = XmlWriter.Create(stringWriter, settings))
                {
                    doc.Save(writer);
                }

                //Return the writer's contents
                return stringWriter.ToString();
            }
        }

        private static string GetServiceEndpoint(Uri issuerUri)
        {
            string passportEnvironment = DeviceIdManager.DiscoverEnvironment(issuerUri);
            string federationMetadataUrl = string.Format(CultureInfo.InvariantCulture, FederationMetadataUrlFormat,
                string.IsNullOrEmpty(passportEnvironment) ? null : "-" + passportEnvironment);

            XmlDocument doc = CallOnlineSoapServices(federationMetadataUrl, "GET", null);

            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(doc.NameTable);
            namespaceManager.AddNamespace("fed", "http://docs.oasis-open.org/wsfed/federation/200706");
            namespaceManager.AddNamespace("wsa", "http://www.w3.org/2005/08/addressing");
            namespaceManager.AddNamespace("xsi", "http://www.w3.org/2001/XMLSchema-instance");
            namespaceManager.AddNamespace("core", "urn:oasis:names:tc:SAML:2.0:metadata");

            return SelectNode(doc, namespaceManager,
                @"//core:EntityDescriptor/core:RoleDescriptor[@xsi:type='fed:ApplicationServiceType']/fed:ApplicationServiceEndpoint/wsa:EndpointReference/wsa:Address").InnerText.Trim();
        }

        private static XmlDocument CallOnlineSoapServices(string serviceUrl,
            string method, string soapMessageEnvelope)
        {
            // Buid the web request
            string url = serviceUrl;
            WebRequest request = WebRequest.Create(url);
            request.Method = method;
            request.Timeout = 180000;
            if (method == "POST")
            {
                // If we are "posting" then this is always a SOAP message
                request.ContentType = "application/soap+xml; charset=UTF-8";
            }

            // If a SOAP envelope is supplied, then we need to write to the request stream
            // If there isn't a SOAP message supplied then continue onto just process the raw XML
            if (!string.IsNullOrEmpty(soapMessageEnvelope))
            {
                byte[] bytes = Encoding.UTF8.GetBytes(soapMessageEnvelope);
                using (Stream str = request.GetRequestStream())
                {
                    str.Write(bytes, 0, bytes.Length);
                    str.Close();
                }
            }

            // Read the response into an XmlDocument and return that doc
            string xml;
            using (WebResponse response = request.GetResponse())
            {
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    xml = reader.ReadToEnd();
                }
            }

            XmlDocument document = new XmlDocument();
            document.LoadXml(xml);
            return document;
        }

        private static SecurityToken ConvertToToken(string xml)
        {
            WS2007FederationHttpBinding binding = new WS2007FederationHttpBinding(WSFederationHttpSecurityMode.TransportWithMessageCredential,
                false);
            Microsoft.IdentityModel.Protocols.WSTrust.WSTrustChannelFactory factory = new Microsoft.IdentityModel.Protocols.WSTrust.WSTrustChannelFactory(binding, new EndpointAddress("https://null-EndPoint"));
            factory.TrustVersion = TrustVersion.WSTrustFeb2005;

            Microsoft.IdentityModel.Protocols.WSTrust.WSTrustChannel trustChannel = (Microsoft.IdentityModel.Protocols.WSTrust.WSTrustChannel)factory.CreateChannel();

            RequestSecurityTokenResponse response = trustChannel.WSTrustResponseSerializer.CreateInstance();
            response.RequestedSecurityToken = new RequestedSecurityToken(LoadXml(xml).DocumentElement);
            response.IsFinal = true;

            RequestSecurityToken requestToken = new RequestSecurityToken(WSTrustFeb2005Constants.RequestTypes.Issue);
            requestToken.KeyType = WSTrustFeb2005Constants.KeyTypes.Symmetric;

            return trustChannel.GetTokenFromResponse(requestToken, response);
        }

        private static XmlDocument LoadXml(string xml)
        {
            XmlReaderSettings settings = new XmlReaderSettings();
            settings.IgnoreWhitespace = true;
            settings.ConformanceLevel = ConformanceLevel.Fragment;

            using (StringReader memoryReader = new StringReader(xml))
            {
                using (XmlReader reader = XmlReader.Create(memoryReader, settings))
                {
                    //Create the xml document
                    XmlDocument doc = new XmlDocument();
                    doc.XmlResolver = null;

                    //Load the data from the reader
                    doc.Load(reader);

                    return doc;
                }
            }
        }

        private static XmlNode SelectNode(XmlDocument document,
            XmlNamespaceManager namespaceManager, string xPathToNode)
        {
            XmlNodeList nodes = document.SelectNodes(xPathToNode, namespaceManager);
            if (nodes != null && nodes.Count > 0 && nodes[0] != null)
            {
                return nodes[0];
            }
            return null;
        }

        private static XmlNamespaceManager CreateNamespaceManager(XmlNameTable nameTable)
        {
            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(nameTable);
            namespaceManager.AddNamespace("wst", "http://schemas.xmlsoap.org/ws/2005/02/trust");
            namespaceManager.AddNamespace("S", "http://www.w3.org/2003/05/soap-envelope");
            namespaceManager.AddNamespace("wsu", "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd");
            return namespaceManager;
        }
        #endregion
    }
}