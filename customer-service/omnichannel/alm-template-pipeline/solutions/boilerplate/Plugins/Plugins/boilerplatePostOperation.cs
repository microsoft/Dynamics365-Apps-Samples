//-----------------------------------------------------------------------
// <copyright file="boilerplatePostOperation.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.Dynamics.boilerplate.Plugins
{
    using System;

    /// <summary>
    /// boilerplatePostOperation Plugin.
    /// </summary>    
    public class boilerplatePostOperation : PluginBase
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="boilerplatePostOperation"/> class.
        /// </summary>
        /// <param name="unsecure">Contains public (unsecured) configuration information.</param>
        /// <param name="secure">Contains non-public (secured) configuration information. 
        /// When using Microsoft Dynamics CRM for Outlook with Offline Access, 
        /// the secure string is not passed to a plug-in that executes while the client is offline.</param>
        public boilerplatePostOperation(string unsecure, string secure)
            : base(typeof(boilerplatePostOperation))
        {
        }

        /// <summary>
        /// Main entry point for the business logic that the plug-in is to execute.
        /// </summary>
        /// <param name="localContext">The <see cref="LocalPluginContext"/> which contains the
        /// <see cref="IPluginExecutionContext"/>,
        /// <see cref="IOrganizationService"/>
        /// and <see cref="ITracingService"/>
        /// </param>
        protected override void ExecuteCrmPlugin(LocalPluginContext localContext)
        {
            throw new ApplicationException("this is your message");
        }
    }
}