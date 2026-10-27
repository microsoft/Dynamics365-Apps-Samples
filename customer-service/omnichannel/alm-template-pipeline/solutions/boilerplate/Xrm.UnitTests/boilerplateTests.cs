//-----------------------------------------------------------------------
// <copyright file="boilerplateTests.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace boilerplate.Xrm.UnitTests
{
    using System.IO;
    using FluentAssertions;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// boilerplate test scenarios
    /// </summary>
    [TestClass]
    public class boilerplateTests
    {
        /// <summary>
        /// Unit test for boilerplate API
        /// </summary>
        [TestMethod]
        public void boilerplateAPITest()
        {
            // arrange
            var myExpectedValue = true;
            var myActualValue = false;

            // act
            myActualValue = 1 < 2;

            // assert
            myActualValue.Should().Be(myExpectedValue, "because 1 is less than 2");
        }

        /// <summary>
        /// boilerplate Test
        /// </summary>
        [TestMethod]
        public void boilerplateTest2()
        {
            var a = true;
            var b = true;

            // assert
            a.Should().Be(b, "because this is a test");
        }
    }
}
