//-----------------------------------------------------------------------
// <copyright file="LocalPluginContext.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Dynamics.boilerplate.Plugins
{
    using Microsoft.Xrm.Sdk;
    using System;

    /// <summary>
    /// Plug-in Context object.
    /// </summary>
    public class LocalPluginContext
    {
        public IServiceProvider ServiceProvider { get; private set; }

        /// <summary>
        /// Microsoft Dynamics CRM organization service
        /// </summary>
        public IOrganizationService OrganizationService { get; private set; }

        private IOrganizationService systemService = null;
        public IOrganizationService SystemService
        {
            get
            {
                if (systemService == null)
                {
                    systemService = Factory.CreateOrganizationService(null);
                }

                return systemService;
            }
        }

        /// <summary>
        /// IPluginExecutionContext contains information that describes the run-time environment that the plug-in executes, information related to the execution pipeline, and entity business information.
        /// </summary>
        public IPluginExecutionContext PluginExecutionContext { get; private set; }

        /// <summary>
        /// Synchronous registered plug-ins can post the execution context to the Microsoft Azure Service Bus. <br/>
        /// It is through this notification service that synchronous plug-ins can send brokered messages to the Microsoft Azure Service Bus.
        /// </summary>
        public IServiceEndpointNotificationService NotificationService { get; private set; }

        /// <summary>
        /// Provides logging run-time trace information for plug-ins.
        /// </summary>
        public ITracingService TracingService { get; private set; }

        private IOrganizationServiceFactory Factory { get; set; }

        private LocalPluginContext()
        {
        }

        /// <summary>
        /// Helper object that stored the services available in this plug-in.
        /// </summary>
        /// <param name="serviceProvider">CDS platform services provider object</param>
        public LocalPluginContext(IServiceProvider serviceProvider)
        {
            // Obtain the execution context service from the service provider.
            PluginExecutionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            // Obtain the tracing service from the service provider.
            TracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Get Notification service from the service provider.
            NotificationService = (IServiceEndpointNotificationService)serviceProvider.GetService(typeof(IServiceEndpointNotificationService));

            // Obtain the Organization Service factory service from the service provider.
            // Using LogOrganizationService to intercept the CRUD events which will emit telemetry data about CRUD events
            Factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

            // Use the factory to generate the Organization Service.
            OrganizationService = Factory.CreateOrganizationService(PluginExecutionContext.UserId);

            this.ServiceProvider = serviceProvider;
        }

        /// <summary>
        /// Writes a Trace Messaged to the CRM Trace Log.
        /// </summary>
        /// <param name="message">Message name to trace.</param>
        internal void Trace(string message)
        {
            if (string.IsNullOrWhiteSpace(message) || TracingService == null)
            {
                return;
            }

            if (PluginExecutionContext == null)
            {
                TracingService.Trace(message);
            }
            else
            {
                TracingService.Trace(
                    "{0}, Correlation Id: {1}, Initiating User: {2}",
                    message,
                    PluginExecutionContext.CorrelationId,
                    PluginExecutionContext.InitiatingUserId);
            }
        }

        /// <summary>
        /// Creates the organization service as the initiaiting user
        /// </summary>
        /// <remarks>
        /// On the Delete action of a connection record, the plugin gets called in the context of the SYSTEM user.
        /// The only workaround that you have, is that from your plugin, when you create the CRM service you impersonate back the initiating user.
        /// </remarks>
        internal void CreateOrganizationServiceAsInitiatingUser()
        {
            OrganizationService = Factory.CreateOrganizationService(PluginExecutionContext.InitiatingUserId);
        }
            
        /// <summary>
        /// Adds the key value pair to the SharedVariables collection
        /// </summary>
        /// <param name="key">The key of the shared variable</param>
        /// <param name="value">The value of the shared variable</param>
        internal void AddSharedVariable(string key, object value)
        {
            this.PluginExecutionContext.SharedVariables.Add(key, value);
        }

        /// <summary>
        /// Gets the specified SharedVariable object.
        /// </summary>
        /// <typeparam name="T">Expected type of the shared variable.</typeparam>
        /// <param name="variableName">Shared variable name.</param>
        /// <param name="retrieveInParentContextChain">Determines if the process should also check ParentContext chain.</param>
        /// <returns>Shared variable object in the expected type.</returns>
        /// <remarks>
        /// When retrieveInParentContextChain flag is set to true, the process will try to find
        /// and return the first SharedVariable found starting from current context
        /// and walks up the parent context chain when SharedVariable is not found.
        /// The process will return null when SharedVariable is not found anywhere in the chain.
        /// </remarks>
        public T GetSharedVariable<T>(string variableName, bool retrieveInParentContextChain = false)
        {
            T sharedVariable = default(T);

            if (PluginExecutionContext == null)
            {
                return sharedVariable;
            }

            if (!retrieveInParentContextChain)
            {
                // find only in the current context
                if (PluginExecutionContext.SharedVariables.Contains(variableName))
                {
                    sharedVariable = (T)PluginExecutionContext.SharedVariables[variableName];
                }
            }
            else
            {
                IPluginExecutionContext context = PluginExecutionContext;
                while (context != null)
                {
                    if (context.SharedVariables.Contains(variableName))
                    {
                        sharedVariable = (T)context.SharedVariables[variableName];
                        break;
                    }

                    context = context.ParentContext;
                }
            }

            return sharedVariable;
        }

        /// <summary>
        /// Gets the input parameter object.
        /// </summary>
        /// <typeparam name="T">Expected type of the input parameter object.</typeparam>
        /// <param name="inputParameterName">Input parameter name.</param>
        /// <returns>Input parameter object in the expected type.</returns>
        public virtual T GetInputParameter<T>(string inputParameterName)
        {
            T parameter = default(T);

            if (this.PluginExecutionContext.InputParameters.Contains(inputParameterName))
            {
                parameter = (T)this.PluginExecutionContext.InputParameters[inputParameterName];
            }

            return parameter;
        }

        /// <summary>
        /// Sets the output parameter object.
        /// </summary>
        /// <typeparam name="T">Expected type of the output parameter object.</typeparam>
        /// <param name="outputParameterName">Output parameter name.</param>
        /// <param name="parameter">Parameter object to store.</param>
        /// <param name="createParameter">Creates the parameter key if not found in the parameters collection.</param>
        /// <remarks>
        /// This will raise an exception when createParameter flag is set to false 
        /// and the parameter name is not found in the OutputParameters collection.
        /// </remarks>
        public void SetOutputParameter<T>(string outputParameterName, T parameter, bool createParameter = true)
        {
            if (this.PluginExecutionContext.OutputParameters.Contains(outputParameterName))
            {
                this.PluginExecutionContext.OutputParameters[outputParameterName] = parameter;
            }
            else if (createParameter)
            {
                this.PluginExecutionContext.OutputParameters.Add(outputParameterName, parameter);
            }
            else
            {
                // throw new CrmInvalidOperationException(Labels.CannotSetInexistentParameter);
            }
        }

        /// <summary>
        /// Checks if there are variables indicating that this plugin should be skipped
        /// </summary>
        /// <returns>True if plugin execution should be skipped</returns>
        internal bool IsSkipPluginSet()
        {
            return false;
        }
    }
}