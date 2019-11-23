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
//<snippetDumpPicklistInfo>
using System;
using System.Linq;
using System.Xml.Linq;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Collections.Generic;
using System.Xml.Serialization;
using System.Xml;
using System.IO;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;

// This namespace is found in Microsoft.Crm.Sdk.Proxy.dll assembly
// found in the SDK\bin folder.
using Microsoft.Crm.Sdk.Messages;

namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// This sample shows how to retrieve and write out all the option set values:
    /// picklist, state and status attribute types.
    /// </summary>
    public class DumpPicklistInfo
    {
        #region Class Level Members

        /// <summary>
        /// Stores the organization service proxy.
        /// </summary>
        OrganizationServiceProxy _serviceProxy;

        // Create storage for new attributes being created
        public List<AttributeMetadata> addedAttributes;

        // Specify which language code to use in the sample. If you are using a language
        // other than US English, you will need to modify this value accordingly.
        // See http://msdn.microsoft.com/en-us/library/0h88fahh.aspx
        public const int _languageCode = 1033;

        // Define the IDs/variables needed for this sample.
        public int _insertedStatusValue;

        #endregion Class Level Members

        #region How To Sample Code
        /// <summary>
        /// </summary>
        /// <param name="serverConfig">Contains server connection information.</param>
        /// <param name="promptForDelete">When True, the user will be prompted to delete all
        /// created entities.</param>
        public void Run(ServerConnection.Configuration serverConfig, bool promptForDelete)
        {
            try
            {

                // Connect to the Organization service. 
                // The using statement assures that the service proxy will be properly disposed.
                using (_serviceProxy = ServerConnection.GetOrganizationProxy(serverConfig))
                {
                    // This statement is required to enable early-bound type support.
                    _serviceProxy.EnableProxyTypes();

                    //<snippetDumpPicklistInfo1>
                    #region How to dump attribute info
                    //<snippetDumpPicklistInfo2>
                    RetrieveAllEntitiesRequest request = new RetrieveAllEntitiesRequest()
                    {
                        EntityFilters = EntityFilters.Attributes,
                        // When RetrieveAsIfPublished property is set to false, retrieves only the currently published changes. Default setting of the property is false.
                        // When RetrieveAsIfPublished property is set to true, retrieves the changes that are published and those changes that have not been published.
                        RetrieveAsIfPublished = false

                    };

                    // Retrieve the MetaData.
                    RetrieveAllEntitiesResponse response = (RetrieveAllEntitiesResponse)_serviceProxy.Execute(request);
                    
                    // Create an instance of StreamWriter to write text to a file.
                    // The using statement also closes the StreamWriter.
		    // To view this file, right click the file and choose open with Excel. 
		    // Excel will figure out the schema and display the information in columns.

                    String filename = String.Concat("AttributePicklistValues.xml");
                    using (StreamWriter sw = new StreamWriter(filename))
                    {
                        // Create Xml Writer.
                        XmlTextWriter metadataWriter = new XmlTextWriter(sw);

                        // Start Xml File.
                        metadataWriter.WriteStartDocument();

                        // Metadata Xml Node.
                        metadataWriter.WriteStartElement("Metadata");

                        foreach (EntityMetadata currentEntity in response.EntityMetadata)
                        {
                            
                            if (currentEntity.IsIntersect.Value == false)
                            {
                                // Start Entity Node
                                metadataWriter.WriteStartElement("Entity");

                                // Write the Entity's Information.
                                metadataWriter.WriteElementString("EntitySchemaName", currentEntity.SchemaName);
                                if (currentEntity.IsCustomizable.Value == true)
                                    metadataWriter.WriteElementString("IsCustomizable", "yes");
                                else
                                    metadataWriter.WriteElementString("IsCustomizable", "no");

                                #region Attributes

                                // Write Entity's Attributes.
                                metadataWriter.WriteStartElement("Attributes");

                                foreach (AttributeMetadata currentAttribute in currentEntity.Attributes)
                                {
                                    // Only write out main attributes.
                                    if (currentAttribute.AttributeOf == null)
                                    {

                                        // Start Attribute Node
                                        metadataWriter.WriteStartElement("Attribute");

                                        // Write Attribute's information.
                                        metadataWriter.WriteElementString("SchemaName", currentAttribute.SchemaName);
                                        metadataWriter.WriteElementString("Type", currentAttribute.AttributeType.Value.ToString());

                                        if (currentAttribute.GetType() == typeof(PicklistAttributeMetadata))
                                        {
                                            PicklistAttributeMetadata optionMetadata = (PicklistAttributeMetadata)currentAttribute;
                                            // Writes the picklist's options
                                            metadataWriter.WriteStartElement("Options");

                                            // Writes the attributes of each picklist option
                                            for (int c = 0; c < optionMetadata.OptionSet.Options.Count; c++)
                                            {
                                                metadataWriter.WriteStartElement("Option");
                                                metadataWriter.WriteElementString("OptionValue", optionMetadata.OptionSet.Options[c].Value.Value.ToString());
                                                metadataWriter.WriteElementString("OptionDescription", optionMetadata.OptionSet.Options[c].Label.UserLocalizedLabel.Label.ToString());
                                                metadataWriter.WriteEndElement();
                                            }

                                            metadataWriter.WriteEndElement();

                                        }
                                        else if (currentAttribute.GetType() == typeof(StateAttributeMetadata))
                                        {
                                            StateAttributeMetadata optionMetadata = (StateAttributeMetadata)currentAttribute;
                                            // Writes the picklist's options
                                            metadataWriter.WriteStartElement("Options");

                                            // Writes the attributes of each picklist option
                                            for (int c = 0; c < optionMetadata.OptionSet.Options.Count; c++)
                                            {
                                                metadataWriter.WriteStartElement("Option");
                                                metadataWriter.WriteElementString("OptionValue", optionMetadata.OptionSet.Options[c].Value.Value.ToString());
                                                metadataWriter.WriteElementString("OptionDescription", optionMetadata.OptionSet.Options[c].Label.UserLocalizedLabel.Label.ToString());
                                                metadataWriter.WriteEndElement();
                                            }

                                            metadataWriter.WriteEndElement();
                                        }
                                        else if (currentAttribute.GetType() == typeof(StatusAttributeMetadata))
                                        {
                                            StatusAttributeMetadata optionMetadata = (StatusAttributeMetadata)currentAttribute;
                                            // Writes the picklist's options
                                            metadataWriter.WriteStartElement("Options");

                                            // Writes the attributes of each picklist option
                                            for (int c = 0; c < optionMetadata.OptionSet.Options.Count; c++)
                                            {
                                                metadataWriter.WriteStartElement("Option");
                                                metadataWriter.WriteElementString("OptionValue", optionMetadata.OptionSet.Options[c].Value.Value.ToString());
                                                metadataWriter.WriteElementString("OptionDescription", optionMetadata.OptionSet.Options[c].Label.UserLocalizedLabel.Label.ToString());
                                                if (optionMetadata.OptionSet.Options[c] is StatusOptionMetadata)
                                                    metadataWriter.WriteElementString("RelatedToState", ((StatusOptionMetadata)optionMetadata.OptionSet.Options[c]).State.ToString());
                                                metadataWriter.WriteEndElement();
                                            }

                                            metadataWriter.WriteEndElement();
                                        }

                                        // End Attribute Node
                                        metadataWriter.WriteEndElement();
                                    }
                                }
                                // End Attributes Node
                                metadataWriter.WriteEndElement();

                                #endregion

                                // End Entity Node
                                metadataWriter.WriteEndElement();
                            }
                        }

                        // End Metadata Xml Node
                        metadataWriter.WriteEndElement();
                        metadataWriter.WriteEndDocument();

                        // Close xml writer.
                        metadataWriter.Close();
                    }

                    //</snippetDumpPicklistInfo2>
                    #endregion How to dump attribute info



                   Console.WriteLine("Done.");
                    //</snippetDumpPicklistInfo1>

                    //DeleteRequiredRecords(promptForDelete);
                }
            }

            // Catch any service fault exceptions that Microsoft Dynamics CRM throws.
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>)
            {
                // You can handle an exception here or pass it back to the calling method.
                throw;
            }
        }

        /// <summary>
        /// Deletes/Reverts the record that was created/changed for this sample.
        /// <param name="prompt">Indicates whether to prompt the user to delete 
        /// the records created in this sample.</param>
        /// </summary>
        public void DeleteRequiredRecords(bool prompt)
        {
            bool deleteRecords = true;

            if (prompt)
            {
                Console.WriteLine(
                    "\nDo you want these entity records to be deleted? (y/n)");
                String answer = Console.ReadLine();

                deleteRecords = (answer.StartsWith("y") || answer.StartsWith("Y"));
            }

            if (deleteRecords)
            {
 
            }
        }
        #endregion How To Sample Code

        #region Main
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

                DumpPicklistInfo app = new DumpPicklistInfo();
                app.Run(config, false);
            }
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Timestamp: {0}", ex.Detail.Timestamp);
                Console.WriteLine("Code: {0}", ex.Detail.ErrorCode);
                Console.WriteLine("Message: {0}", ex.Detail.Message);
                Console.WriteLine("Plugin Trace: {0}", ex.Detail.TraceText);
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

                    FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> fe
                        = ex.InnerException
                        as FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>;
                    if (fe != null)
                    {
                        Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                        Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                        Console.WriteLine("Message: {0}", fe.Detail.Message);
                        Console.WriteLine("Plugin Trace: {0}", fe.Detail.TraceText);
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
        #endregion Main

    }
}
//</snippetDumpPicklistInfo>