//-----------------------------------------------------------------------
// <copyright file="boilerplateIntegrationTests.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace boilerplate.Xrm.IntegrationTests
{
    using FluentAssertions;
    using Microsoft.Crm.Sdk.Messages;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using boilerplate.Xrm.IntegrationTests.Framework;
    
    /// <summary>
    /// boilerplate test scenarios
    /// </summary>
    [TestClass]
    public class boilerplateIntegrationTests : IntegrationTests
    {
        /// <summary>
        /// Checks if the organizationService is not NULL.
        /// </summary>
        [TestMethod]
        public void CheckOrgServiceIsNotNullTest()
        {
            var orgService = GetOrganizationService();

            // Assert
            orgService.Should().NotBeNull();
        }
    }
}