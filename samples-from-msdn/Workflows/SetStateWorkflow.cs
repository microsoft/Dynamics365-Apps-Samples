// =====================================================================
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
// =====================================================================

//<snippetSetStateWorkflow>
using System;
using System.ServiceModel;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// located in the SDK\bin folder of the SDK download.
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;

// These namespaces are found in the Microsoft.Crm.Sdk.Proxy.dll assembly
// located in the SDK\bin folder of the SDK download.
using Microsoft.Crm.Sdk.Messages;

namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// This sample shows how to change the state of a workflow.
    /// </summary>
    /// <remarks>
    /// At run-time, you will be given the option to delete all the
    /// database records created by this program.
    /// </remarks>
    public class SetStateWorkflow
    {
        #region Class Level Members

        private Guid _workflowId;
        private OrganizationServiceProxy _serviceProxy;
        
        #endregion Class Level Members

        #region How To Sample Code
        /// <summary>
        /// This method first creates XAML to define the custom workflow. Afterwards, 
        /// it creates the workflow record with this XAML and then activates it. Finally 
        /// it checks if it is activated and, if so, deactivates it.
        /// </summary>
        /// <param name="serverConfig">Contains server connection information.</param>
        /// <param name="promptforDelete">When True, the user will be prompted to delete all
        /// created entities.</param>

        public void Run(ServerConnection.Configuration serverConfig, bool promptforDelete)
        {
            try
            {
                // Connect to the Organization service. 
                // The using statement assures that the service proxy will be properly disposed.
                using (_serviceProxy = ServerConnection.GetOrganizationProxy(serverConfig))
                {
                    // This statement is required to enable early-bound type support.
                    _serviceProxy.EnableProxyTypes();

                    CreateRequiredRecords();

                    // Activate the workflow.
                    Console.WriteLine("\nActivating the workflow...");
                    //<snippetSetStateWorkflow1>
                    var activateRequest = new SetStateRequest
                    {
                        EntityMoniker = new EntityReference
                            (Workflow.EntityLogicalName, _workflowId),
                        State = new OptionSetValue((int)WorkflowState.Activated),
                        Status = new OptionSetValue((int)workflow_statuscode.Activated)
                    };
                    _serviceProxy.Execute(activateRequest);
                    //</snippetSetStateWorkflow1>
                    
                    // Verify that the workflow is activated.
                    Workflow retrievedWorkflow = 
                        (Workflow)_serviceProxy.Retrieve("workflow", _workflowId, new ColumnSet("statecode", "name"));

                    Console.WriteLine("The state of workflow {0} is: {1}.", retrievedWorkflow.Name, retrievedWorkflow.StateCode);

                    // Deactivate the workflow.
                    if (retrievedWorkflow.StateCode == WorkflowState.Activated)
                    {
                        Console.WriteLine("\nDeactivating the workflow...");
                        //<snippetSetStateWorkflow2>
                        SetStateRequest deactivateRequest = new SetStateRequest
                        {
                            EntityMoniker = 
                                new EntityReference(Workflow.EntityLogicalName, _workflowId),
                            State = new OptionSetValue((int)WorkflowState.Draft),
                            Status = new OptionSetValue((int)workflow_statuscode.Draft)
                        };
                        _serviceProxy.Execute(deactivateRequest);
                        //</snippetSetStateWorkflow2>
                    }

                    // Verify that the workflow is deactivated (in a draft state).
                    retrievedWorkflow =
                        (Workflow)_serviceProxy.Retrieve("workflow", _workflowId, new ColumnSet("statecode", "name"));

                    Console.WriteLine("The state of workflow {0} is: {1}.", retrievedWorkflow.Name, retrievedWorkflow.StateCode);

                    DeleteRequiredRecords(promptforDelete);
                }
            }

            // Catch any service fault exceptions that Microsoft Dynamics CRM throws.
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>)
            {
                // You can handle an exception here or pass it back to the calling method.
                throw;
            }
        }

        #region Public methods

        /// <summary>
        /// Creates any entity records that this sample requires.
        /// </summary>
        public void CreateRequiredRecords()
        {
            #region Create XAML

            // Define the workflow XAML.
            string xamlWF;

            // This xml defines a workflow that creates a new task when executed

            xamlWF = @"<?xml version=""1.0"" encoding=""utf-16""?>
<Activity x:Class=""CreateTask""
          xmlns=""http://schemas.microsoft.com/netfx/2009/xaml/activities""
          xmlns:mva=""clr-namespace:Microsoft.VisualBasic.Activities;assembly=System.Activities, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35""
          xmlns:mxs=""clr-namespace:Microsoft.Xrm.Sdk;assembly=Microsoft.Xrm.Sdk, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35""
          xmlns:mxswa=""clr-namespace:Microsoft.Xrm.Sdk.Workflow.Activities;assembly=Microsoft.Xrm.Sdk.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35""
          xmlns:s=""clr-namespace:System;assembly=mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089""
          xmlns:scg=""clr-namespace:System.Collections.Generic;assembly=mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089""
          xmlns:srs=""clr-namespace:System.Runtime.Serialization;assembly=System.Runtime.Serialization, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089""
          xmlns:this=""clr-namespace:""
          xmlns:x=""http://schemas.microsoft.com/winfx/2006/xaml"">
  <x:Members>
    <x:Property Name=""InputEntities""
                Type=""InArgument(scg:IDictionary(x:String, mxs:Entity))"" />
    <x:Property Name=""CreatedEntities""
                Type=""InArgument(scg:IDictionary(x:String, mxs:Entity))"" />
  </x:Members>
  <this:CreateTask.InputEntities>
    <InArgument x:TypeArguments=""scg:IDictionary(x:String, mxs:Entity)"" />
  </this:CreateTask.InputEntities>
  <this:CreateTask.CreatedEntities>
    <InArgument x:TypeArguments=""scg:IDictionary(x:String, mxs:Entity)"" />
  </this:CreateTask.CreatedEntities>
  <mva:VisualBasic.Settings>Assembly references and imported namespaces for internal implementation</mva:VisualBasic.Settings>
  <mxswa:Workflow>
    <Sequence DisplayName=""CreateStep1: Create a task"">
      <Sequence.Variables>
        <Variable x:TypeArguments=""x:Object""
                  Name=""CreateStep1_1"" />
        <Variable x:TypeArguments=""x:Object""
                  Name=""CreateStep1_2"" />
        <Variable x:TypeArguments=""x:Object""
                  Name=""CreateStep1_3"" />
        <Variable x:TypeArguments=""x:Object""
                  Name=""CreateStep1_4"" />
      </Sequence.Variables>
      <Assign x:TypeArguments=""mxs:Entity""
              To=""[CreatedEntities(&quot;CreateStep1_localParameter#Temp&quot;)]""
              Value=""[New Entity(&quot;task&quot;)]"" />
      <mxswa:ActivityReference AssemblyQualifiedName=""Microsoft.Crm.Workflow.Activities.EvaluateExpression, Microsoft.Crm.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35""
                               DisplayName=""EvaluateExpression"">
        <mxswa:ActivityReference.Arguments>
          <InArgument x:TypeArguments=""x:String""
                      x:Key=""ExpressionOperator"">CreateCrmType</InArgument>
          <InArgument x:TypeArguments=""s:Object[]""
                      x:Key=""Parameters"">[New Object() { Microsoft.Xrm.Sdk.Workflow.WorkflowPropertyType.String, ""New Task"", ""String"" }]</InArgument>
          <InArgument x:TypeArguments=""s:Type""
                      x:Key=""TargetType"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""x:String"" />
          </InArgument>
          <OutArgument x:TypeArguments=""x:Object""
                       x:Key=""Result"">[CreateStep1_1]</OutArgument>
        </mxswa:ActivityReference.Arguments>
      </mxswa:ActivityReference>
      <mxswa:SetEntityProperty Attribute=""subject""
                               Entity=""[CreatedEntities(&quot;CreateStep1_localParameter#Temp&quot;)]""
                               EntityName=""task""
                               Value=""[CreateStep1_1]"">
        <mxswa:SetEntityProperty.TargetType>
          <InArgument x:TypeArguments=""s:Type"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""x:String"" />
          </InArgument>
        </mxswa:SetEntityProperty.TargetType>
      </mxswa:SetEntityProperty>
      <mxswa:GetEntityProperty Attribute=""leadid""
                               Entity=""[InputEntities(&quot;primaryEntity&quot;)]""
                               EntityName=""lead""
                               Value=""[CreateStep1_3]"">
        <mxswa:GetEntityProperty.TargetType>
          <InArgument x:TypeArguments=""s:Type"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""mxs:EntityReference"" />
          </InArgument>
        </mxswa:GetEntityProperty.TargetType>
      </mxswa:GetEntityProperty>
      <mxswa:ActivityReference AssemblyQualifiedName=""Microsoft.Crm.Workflow.Activities.EvaluateExpression, Microsoft.Crm.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35""
                               DisplayName=""EvaluateExpression"">
        <mxswa:ActivityReference.Arguments>
          <InArgument x:TypeArguments=""x:String""
                      x:Key=""ExpressionOperator"">SelectFirstNonNull</InArgument>
          <InArgument x:TypeArguments=""s:Object[]""
                      x:Key=""Parameters"">[New Object() { CreateStep1_3 }]</InArgument>
          <InArgument x:TypeArguments=""s:Type""
                      x:Key=""TargetType"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""mxs:EntityReference"" />
          </InArgument>
          <OutArgument x:TypeArguments=""x:Object""
                       x:Key=""Result"">[CreateStep1_2]</OutArgument>
        </mxswa:ActivityReference.Arguments>
      </mxswa:ActivityReference>
      <mxswa:SetEntityProperty Attribute=""regardingobjectid""
                               Entity=""[CreatedEntities(&quot;CreateStep1_localParameter#Temp&quot;)]""
                               EntityName=""task""
                               Value=""[CreateStep1_2]"">
        <mxswa:SetEntityProperty.TargetType>
          <InArgument x:TypeArguments=""s:Type"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""mxs:EntityReference"" />
          </InArgument>
        </mxswa:SetEntityProperty.TargetType>
      </mxswa:SetEntityProperty>
      <mxswa:ActivityReference AssemblyQualifiedName=""Microsoft.Crm.Workflow.Activities.EvaluateExpression, Microsoft.Crm.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35""
                               DisplayName=""EvaluateExpression"">
        <mxswa:ActivityReference.Arguments>
          <InArgument x:TypeArguments=""x:String""
                      x:Key=""ExpressionOperator"">CreateCrmType</InArgument>
          <InArgument x:TypeArguments=""s:Object[]""
                      x:Key=""Parameters"">[New Object() { Microsoft.Xrm.Sdk.Workflow.WorkflowPropertyType.OptionSetValue, ""1"", ""Picklist"" }]</InArgument>
          <InArgument x:TypeArguments=""s:Type""
                      x:Key=""TargetType"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""mxs:OptionSetValue"" />
          </InArgument>
          <OutArgument x:TypeArguments=""x:Object""
                       x:Key=""Result"">[CreateStep1_4]</OutArgument>
        </mxswa:ActivityReference.Arguments>
      </mxswa:ActivityReference>
      <mxswa:SetEntityProperty Attribute=""prioritycode""
                               Entity=""[CreatedEntities(&quot;CreateStep1_localParameter#Temp&quot;)]""
                               EntityName=""task""
                               Value=""[CreateStep1_4]"">
        <mxswa:SetEntityProperty.TargetType>
          <InArgument x:TypeArguments=""s:Type"">
            <mxswa:ReferenceLiteral x:TypeArguments=""s:Type""
                                    Value=""mxs:OptionSetValue"" />
          </InArgument>
        </mxswa:SetEntityProperty.TargetType>
      </mxswa:SetEntityProperty>
      <mxswa:CreateEntity EntityId=""{x:Null}""
                          DisplayName=""CreateStep1: Create a task""
                          Entity=""[CreatedEntities(&quot;CreateStep1_localParameter#Temp&quot;)]""
                          EntityName=""task"" />
      <Assign x:TypeArguments=""mxs:Entity""
              To=""[CreatedEntities(&quot;CreateStep1_localParameter&quot;)]""
              Value=""[CreatedEntities(&quot;CreateStep1_localParameter#Temp&quot;)]"" />
      <Persist />
    </Sequence>
  </mxswa:Workflow>
</Activity>";

            #endregion Create XAML

            #region Create Workflow

            // Create the workflow
            //<snippetSetStateWorkflow3>
            Workflow workflow = new Workflow()
            {
                Name = "CreateTaskXAML",
                Type = new OptionSetValue((int)WorkflowType.Definition),
                Category = new OptionSetValue((int)WorkflowCategory.Workflow),
                Scope = new OptionSetValue((int)WorkflowScope.User),
                LanguageCode = 1033,                // U.S. English
                TriggerOnCreate = true,
                OnDemand = true,
                PrimaryEntity = Lead.EntityLogicalName,
                Description =
                    "Test workflow for the SetStateWorkflow SDK sample",
                Xaml = xamlWF
            };
            _workflowId = _serviceProxy.Create(workflow);
            //</snippetSetStateWorkflow3>

            Console.WriteLine("Created workflow {0}.", workflow.Name);

            #endregion Create Workflow
        }

        /// <summary>
        /// Deletes any entity records that were created for this sample.
        /// <param name="prompt">Indicates whether to prompt the user 
        /// to delete the records created in this sample.</param>
        /// </summary>
        public void DeleteRequiredRecords(bool prompt)
        {
            bool toBeDeleted = true;

            if (prompt)
            {
                // Ask the user if the created entities should be deleted.
                Console.Write("\nDo you want these entity records deleted? (y/n) [y]: ");
                String answer = Console.ReadLine();
                if (answer.StartsWith("y") ||
                    answer.StartsWith("Y") ||
                    answer == String.Empty)
                {
                    toBeDeleted = true;
                }
                else
                {
                    toBeDeleted = false;
                }
            }

            if (toBeDeleted)
            {
                // Delete the workflow.
                _serviceProxy.Delete(Workflow.EntityLogicalName, _workflowId);
                Console.WriteLine("The workflow has been deleted.");
            }
        }
        #endregion Public Methods

        #endregion How To Sample Code

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

                SetStateWorkflow app = new SetStateWorkflow();
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

                    FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> fe = ex.InnerException
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

        #endregion Main method
    }
}
//</snippetSetStateWorkflow>
