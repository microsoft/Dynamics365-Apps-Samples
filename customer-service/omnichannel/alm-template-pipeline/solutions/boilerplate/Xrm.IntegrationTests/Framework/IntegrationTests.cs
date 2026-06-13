//-----------------------------------------------------------------------
// <copyright file="IntegrationTests.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace boilerplate.Xrm.IntegrationTests.Framework
{
    using Microsoft.Xrm.Sdk;
    using Microsoft.Xrm.Tools.Sdk.CDSConnection;

    /// <summary>
    /// Base IntegrationTest class
    /// </summary>
    public class IntegrationTests
    {
        /// <summary>
        /// Organization service
        /// </summary>
        private IOrganizationService organizationService;

        /// <summary>
        /// Get Organization service
        /// </summary>
        /// <returns>organization service object</returns>
        public IOrganizationService GetOrganizationService()
        {
            if (this.organizationService == null)
            {
                this.organizationService = OrganizationServiceFactory.GetOrganizationService();
            }

            return this.organizationService;
        }
    }
}