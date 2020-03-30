using Microsoft.Bot.Connector.DirectLine;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Xunit;

namespace Microsoft.OmniChannel.MessageRelayProcessor.Tests
{
    public class RelayProcessorTests
    {
        private readonly Mock<EventHandler<IList<Activity>>> _mockEvent;

        private readonly RelayProcessor _relayProcessor;

        public RelayProcessorTests()
        {
            var relayProcessorConfiguration =
               new RelayProcessorConfiguration
               {
                   DirectLineSecret = "...",
                   BotHandle = "...",
                   PollingIntervalInMilliseconds = "2000"
               };
            var configuration = Options.Create(relayProcessorConfiguration);
            _mockEvent = new Mock<EventHandler<IList<Activity>>>();
            _relayProcessor = new Mock<RelayProcessor>(configuration).Object;
        }

        [Fact]
        public void PostActivityAsyncShouldThrowArgumentNullExceptionWithNullActivity()
        {
            Assert.ThrowsAsync<ArgumentNullException>(async () =>
             {
                 await _relayProcessor.PostActivityAsync(null, _mockEvent.Object).ConfigureAwait(false);
             });
        }

        [Fact]
        public void PostActivityAsyncShouldThrowValidationExceptionWithInvalidActivity()
        {
            var mockActivity = new Mock<Activity>();

            Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _relayProcessor.PostActivityAsync(mockActivity.Object, _mockEvent.Object).ConfigureAwait(false);
            });
        }
    }
}
