// =====================================================================
//
//  This file is part of the Microsoft Dynamics 365 SDK code samples.
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
using System.ServiceModel;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;

// This namespace is found in Microsoft.Crm.Sdk.Proxy.dll assembly
// found in the SDK\bin folder.
using Microsoft.Crm.Sdk.Messages;

namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// This sample shows how to work with Busines Process Flows (BPFs). 
    /// 1. Creates a Lead record and then qualifies it to an Opportunity record.
    /// 2. Shows how to retrieve process instances for an entity record.    /// 
    /// 3. Retrieves the active path, process stages, and active stage information for 
    ///    for a process instance record.
    /// 4. Prompts the user whether to move to the next stage in the process.
    /// 5. Finally, prompts you to delete the BPF and Opportunity
    ///    records created during the sample run.
    /// </summary>
    public class WorkWithBPF
    {
        #region Class Level Members

        /// <summary>
        /// Stores the organization service proxy.
        /// </summary>
        OrganizationServiceProxy _serviceProxy;

        // Define the IDs/variables needed for this sample.
        public Guid _leadId;
        public Guid _opportunityId;
        public Guid _processOpp1Id;
        public Guid _activeStageId;
        public string _activeStageName;
        public string _procInstanceLogicalName;
        public int _activeStagePosition;

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
                using (_serviceProxy = new OrganizationServiceProxy(serverConfig.OrganizationUri, serverConfig.HomeRealmUri, serverConfig.Credentials, serverConfig.DeviceCredentials))
                {
                    // This statement is required to enable early-bound type support.
                    _serviceProxy.EnableProxyTypes();

                    // Creates required records for this sample.
                    CreateRequiredRecords();

                    // Qualify a lead to create an opportunity                    
                    QualifyLeadRequest qualifyRequest = new QualifyLeadRequest
                    {
                        LeadId = new EntityReference(Lead.EntityLogicalName, _leadId),
                        Status = new OptionSetValue((int)lead_statuscode.Qualified),
                        CreateOpportunity = true
                    };
                    QualifyLeadResponse qualifyResponse = (QualifyLeadResponse)_serviceProxy.Execute(qualifyRequest);
                    _opportunityId = qualifyResponse.CreatedEntities[0].Id;
                    if (_opportunityId != Guid.Empty)
                        Console.WriteLine("\nQualified Lead to create an Opportunity record.");

                    // Verify the curently active BPF instance for the qualified Opportunity record
                    RetrieveProcessInstancesRequest procOpp1Req = new RetrieveProcessInstancesRequest
                    {
                        EntityId = _opportunityId,
                        EntityLogicalName = Opportunity.EntityLogicalName
                    };
                    RetrieveProcessInstancesResponse procOpp1Resp = (RetrieveProcessInstancesResponse)_serviceProxy.Execute(procOpp1Req);

                    // Declare variables to store values returned in response
                    Entity activeProcessInstance = null;                                        

                    if (procOpp1Resp.Processes.Entities.Count > 0)
                    {
                        activeProcessInstance = procOpp1Resp.Processes.Entities[0]; // First record is the active process instance
                        _processOpp1Id = activeProcessInstance.Id; // Id of the active process instance, which will be used
                                                                   // later to retrieve the active path of the process instance
                                                
                        Console.WriteLine("Current active process instance for the Opportunity record: '{0}'", activeProcessInstance["name"].ToString());
                        _procInstanceLogicalName = activeProcessInstance["name"].ToString().Replace(" ", string.Empty).ToLower();
                    }
                    else
                    {
                        Console.WriteLine("No process instances found for the opportunity record; aborting the sample.");
                        Environment.Exit(1);
                    }                    

                    // Retrieve the active stage ID of the active process instance
                    _activeStageId = new Guid(activeProcessInstance.Attributes["processstageid"].ToString());

                    // Retrieve the process stages in the active path of the current process instance
                    RetrieveActivePathRequest pathReq = new RetrieveActivePathRequest
                    {
                        ProcessInstanceId = _processOpp1Id
                    };
                    RetrieveActivePathResponse pathResp = (RetrieveActivePathResponse)_serviceProxy.Execute(pathReq);
                    Console.WriteLine("\nRetrieved stages in the active path of the process instance:");
                    for (int i = 0; i < pathResp.ProcessStages.Entities.Count; i++)
                    {
                        Console.WriteLine("\tStage {0}: {1} (StageId: {2})", i + 1,
                            pathResp.ProcessStages.Entities[i].Attributes["stagename"], pathResp.ProcessStages.Entities[i].Attributes["processstageid"]);


                        // Retrieve the active stage name and active stage position based on the activeStageId for the process instance
                        if (pathResp.ProcessStages.Entities[i].Attributes["processstageid"].ToString() == _activeStageId.ToString())
                        {
                            _activeStageName = pathResp.ProcessStages.Entities[i].Attributes["stagename"].ToString();
                            _activeStagePosition = i;
                        }
                    }

                    // Display the active stage name and Id
                    Console.WriteLine("\nActive stage for the process instance: '{0}' (StageID: {1})", _activeStageName, _activeStageId);

                    // Prompt the user to move to the next stage. If user choses to do so: 
                    // Set the next stage (_activeStagePosition + 1) as the active stage for the process instance
                    bool moveToNextStage = true;
                    Console.WriteLine("\nDo you want to move to the next stage (y/n):");
                    String answer = Console.ReadLine();
                    moveToNextStage = (answer.StartsWith("y") || answer.StartsWith("Y"));
                    if (moveToNextStage)
                    {
                        // Retrieve the stage ID of the next stage that you want to set as active
                        _activeStageId = (Guid)pathResp.ProcessStages.Entities[_activeStagePosition + 1].Attributes["processstageid"];

                        // Retrieve the process instance record to update its active stage
                        ColumnSet cols1 = new ColumnSet();
                        cols1.AddColumn("activestageid");
                        Entity retrievedProcessInstance = _serviceProxy.Retrieve(_procInstanceLogicalName, _processOpp1Id, cols1);

                        // Update the active stage to the next stage
                        retrievedProcessInstance["activestageid"] = new EntityReference(ProcessStage.EntityLogicalName, _activeStageId);
                        _serviceProxy.Update(retrievedProcessInstance);


                        // Retrieve the process instance record again to verify its active stage information
                        ColumnSet cols2 = new ColumnSet();
                        cols2.AddColumn("activestageid");
                        Entity retrievedProcessInstance1 = _serviceProxy.Retrieve(_procInstanceLogicalName, _processOpp1Id, cols2);

                        EntityReference activeStageInfo = retrievedProcessInstance1["activestageid"] as EntityReference;
                        if (activeStageInfo.Id == _activeStageId)
                        {
                            Console.WriteLine("\nChanged active stage for the process instance to: '{0}' (StageID: {1})",
                                          activeStageInfo.Name, activeStageInfo.Id);
                        }
                    }

                    // Prompts to delete the required records
                    DeleteRequiredRecords(promptForDelete);
                }
            }

            // Catch any service fault exceptions that Microsoft Dynamics 365 throws.
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>)
            {
                // You can handle an exception here or pass it back to the calling method.
                throw;
            }
        }

        /// <summary>
        /// Creates any entity records that this sample requires.
        /// </summary>
        public void CreateRequiredRecords()
        {
            // Create a sample Lead record.
            // This will also create an instance of "Lead To Opportunity Sales Process"
            // BPF for the new lead record.
            Lead myLead = new Lead
            {
                Subject = "SDK Sample Record",
                FirstName = "Randy",
                LastName = "Blythe"
            };
            _leadId = _serviceProxy.Create(myLead);
            Console.WriteLine("\nCreated a Lead: '{0}'.", myLead.Subject);


            // Verify that an instance of "Lead To Opportunity Sales Process" is created for the new Lead record.
            RetrieveProcessInstancesRequest procLeadReq = new RetrieveProcessInstancesRequest
            {
                EntityId = _leadId,
                EntityLogicalName = Lead.EntityLogicalName
            };
            RetrieveProcessInstancesResponse procLeadResp = (RetrieveProcessInstancesResponse)_serviceProxy.Execute(procLeadReq);

            if (procLeadResp.Processes.Entities.Count > 0)
            {
                var processLeadInstance = procLeadResp.Processes.Entities[0];
                Console.WriteLine("Process instance automatically created for the new Lead record: '{0}'", processLeadInstance["name"]);
            }
            else
            {
                Console.WriteLine("No processes found for the Lead record; aborting the sample.");
                Environment.Exit(1);
            }

        }

        /// <summary>
        /// Deletes any entity records that were created for this sample.
        /// <param name="prompt">Indicates whether to prompt the user to delete the records created in this sample.</param>
        /// </summary>
        public void DeleteRequiredRecords(bool prompt)
        {
            bool deleteRecords = true;

            if (prompt)
            {
                Console.WriteLine("\nDo you want these entity records deleted? (y/n)");
                String deleteAnswer = Console.ReadLine();
                deleteRecords = (deleteAnswer.StartsWith("y") || deleteAnswer.StartsWith("Y"));
            }

            if (deleteRecords)
            {
                _serviceProxy.Delete(_procInstanceLogicalName, _processOpp1Id);
                _serviceProxy.Delete(Opportunity.EntityLogicalName, _opportunityId);
                Console.WriteLine("Entity records have been deleted.");
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
                WorkWithBPF app = new WorkWithBPF();
                app.Run(config, true);
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