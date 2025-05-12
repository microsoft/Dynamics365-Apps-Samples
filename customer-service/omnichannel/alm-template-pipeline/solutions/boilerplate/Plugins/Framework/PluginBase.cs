//-----------------------------------------------------------------------
// <copyright file="PluginBase.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Dynamics.boilerplate.Plugins
{
    using Microsoft.Xrm.Sdk;
    using System;
    using System.Globalization;
    using System.ServiceModel;

    /// <summary>
    /// Base class for all plug-in classes.
    /// </summary>    
    public abstract class PluginBase : IPlugin
    {
        /// <summary>
        /// Gets the name of the child class.
        /// </summary>
        /// <value>The name of the child class.</value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "PluginBase")]
        protected string ChildClassName { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="PluginBase"/> class.
        /// </summary>
        /// <param name="childClassName">The <see cred="Type"/> of the derived class.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "PluginBase")]
        internal PluginBase(Type childClassName)
        {
            ChildClassName = childClassName.ToString();
        }

        /// <summary>
        /// Main entry point for he business logic that the plug-in is to execute.
        /// </summary>
        /// <param name="serviceProvider">The service provider.</param>
        /// <remarks>
        /// For improved performance, Microsoft Dynamics CRM caches plug-in instances. 
        /// The plug-in's Execute method should be written to be stateless as the constructor 
        /// is not called for every invocation of the plug-in. Also, multiple system threads 
        /// could execute the plug-in at the same time. All per invocation state information 
        /// is stored in the context. This means that you should not use global variables in plug-ins.
        /// </remarks>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:Do not pass literals as localized parameters", MessageId = "CrmVSSolution411.NewProj.PluginBase+LocalPluginContext.Trace(System.String)", Justification = "Execute")]
        public void Execute(IServiceProvider serviceProvider)
        {
            if (serviceProvider == null)
            {
                throw new InvalidPluginExecutionException("serviceProvider");
            }

            // Construct the local plug-in context.
            LocalPluginContext localcontext = new LocalPluginContext(serviceProvider);

            localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Entered {0}.Execute()", this.ChildClassName));
            var activityId = localcontext.PluginExecutionContext == null ? Guid.NewGuid() : localcontext.PluginExecutionContext.CorrelationId;
            var orgId = localcontext.PluginExecutionContext == null ? Guid.Empty : localcontext.PluginExecutionContext.OrganizationId;
            var userId = localcontext.PluginExecutionContext == null ? Guid.Empty : localcontext.PluginExecutionContext.InitiatingUserId;

            InitializeExecutionContext(localcontext);

            try
            {
                if (localcontext.IsSkipPluginSet())
                {
                    localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Skip plugin execution flag is set. Skipping {0}.Execute()", this.ChildClassName));
                    return;
                }

                // Invoke the custom implementation 
                ExecuteCrmPlugin(localcontext);
                // now exit - if the derived plug-in has incorrectly registered overlapping event registrations,
                // guard against multiple executions.
                return;
            }
            catch (FaultException<OrganizationServiceFault> e)
            {
                localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exception: {0}", e.ToString()));
                throw;
            }
            catch (Exception e)
            {
                localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exception: {0}", e.ToString()));
                throw;
            }
            finally
            {
                FinalizeExecutionContext();
                localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exiting {0}.Execute()", this.ChildClassName));
            }
        }

        /// <summary>
        /// Initializes the execution context for the plugin.
        /// </summary>
        /// <param name="localContext">Plugin context for the plug-in being executed.</param>
        protected virtual void InitializeExecutionContext(LocalPluginContext localContext)
        {
            //Guid requestId = (localContext.PluginExecutionContext.RequestId != null) ? (Guid)localContext.PluginExecutionContext.RequestId : Guid.Empty;
            //var executionContext = new ExecutionContext(
            //    localContext.OrganizationService,
            //    localContext.PluginExecutionContext.UserId,
            //    localContext.PluginExecutionContext.OrganizationId,
            //    localContext.PluginExecutionContext.CorrelationId,
            //    requestId);

            //ExecutionContextManager.InitiatingExecution(executionContext);
        }

        protected virtual void FinalizeExecutionContext()
        {
            //ExecutionContextManager.FinalizingExecution();
        }

        /// <summary>
        /// Placeholder for a custom plug-in implementation. 
        /// </summary>
        /// <param name="localcontext">Context for the current plug-in.</param>
        protected virtual void ExecuteCrmPlugin(LocalPluginContext localcontext)
        {
            // Do nothing. 
        }
    }
}