using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.OmniChannel.MessageRelayProcessor;
using Moq;
using Newtonsoft.Json.Linq;
using System;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Microsoft.OmniChannel.Adapters.MessageBird.Tests
{
    public class MessageBirdAdapterTests
    {
        private readonly MessageBirdAdapter _messageBirdAdapter;

        private readonly MessageBirdClientWrapper _messageBirdClientWrapper;

        public MessageBirdAdapterTests()
        {

            var messageBirdAdapterConfiguration =
                new MessageBirdAdapterConfiguration
                {
                    MessageBirdSigningKey = "...",
                    MessageBirdAccessKey = "..."
                };

            var configuration = Options.Create(messageBirdAdapterConfiguration);
            var relayProcessor = new Mock<IRelayProcessor>();
            _messageBirdAdapter = new MessageBirdAdapter(relayProcessor.Object, configuration);
            _messageBirdClientWrapper = new MessageBirdClientWrapper(configuration);
        }

        [Fact]
        public async void ProcessInboundActivitiesShouldFailWithNullContent()
        {
            var httpRequest = new Mock<HttpRequest>();
            var jTokenContent = JToken.Parse("null");

            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await _messageBirdAdapter.ProcessInboundActivitiesAsync(jTokenContent, httpRequest.Object);
            });
        }

        [Fact]
        public async Task ProcessInboundActivitiesShouldFailWithInvalidContent()
        {
            var httpRequest = new Mock<HttpRequest>();
            var jTokenContent = JToken.Parse("{}");

            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await _messageBirdAdapter.ProcessInboundActivitiesAsync(jTokenContent, httpRequest.Object);
            });
        }

        [Fact]
        public async Task ProcessOutboundActivitiesAsyncShouldFailWithNullOutboundActivities()
        {
            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await _messageBirdAdapter.ProcessOutboundActivitiesAsync(null);
            });
        }

        [Fact]
        public async Task SendMessagesToMessageBirdShouldThrowArgumentNullExceptionWithNullResponse()
        {
            await Assert.ThrowsAsync<ArgumentNullException>(async () =>
            {
                await _messageBirdClientWrapper.SendMessagesToMessageBird(null);
            });
        }

        [Fact]
        public void MessageBirdRequestSignerIsMatchEmptyDataAndWrongExpectedSignature()
        {
            var requestSigner = new MessageBirdRequestSigner(GetBytes("secret"));
            const string expectedSignature = "SignatureIsNotValid";
            var request = new MessageBirdRequest("1544544948", "", GetBytes(""));

            Assert.False(requestSigner.IsMatch(expectedSignature, request));
        }

        [Fact]
        public void MessageBirdRequestSignerIsMatchWithDataAndWrongExpectedSignature()
        {
            var requestSigner = new MessageBirdRequestSigner(GetBytes("secret"));
            const string expectedSignature = "SignatureIsNotValid";
            var request = new MessageBirdRequest("1544544948", "", GetBytes("{\"a key\":\"some value\"}"));

            Assert.False(requestSigner.IsMatch(expectedSignature, request));
        }

        [Fact]
        public void MessageBirdRequestSignerIsNotMatchWithEmptyExpectedSignature()
        {
            var requestSigner = new MessageBirdRequestSigner(GetBytes("secret"));
            const string expectedSignature = "";
            var request = new MessageBirdRequest("1544544948", "", GetBytes("{\"a key\":\"some value\"}"));

            Assert.False(requestSigner.IsMatch(expectedSignature, request));
        }

        /// <summary>
        /// Helper to get the bytes the provided UTF-8 encoded string represents.
        /// </summary>
        /// <param name="s">Input string</param>
        /// <returns>Byte Array</returns>
        private static byte[] GetBytes(string s)
        {
            return Encoding.UTF8.GetBytes(s);
        }
    }
}
