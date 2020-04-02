using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.OmniChannel.Adapter.Builder;
using Microsoft.OmniChannel.Adapters.Service.Controllers;
using Moq;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace Microsoft.OmniChannel.Adapters.Service.Tests
{
    public class MessageBirdAdapterControllerTests
    {
        private readonly MessageBirdAdapterController _adapterController;
        private readonly Mock<IAdapterBuilder> _mockAdapterBuilder;
        public MessageBirdAdapterControllerTests()
        {
            var logger = new Mock<ILogger<MessageBirdAdapterController>>();
            var adapterAccessor = new Mock<AdapterServiceResolver>();
            _mockAdapterBuilder = new Mock<IAdapterBuilder>();
            adapterAccessor.Setup(a => a.Invoke(ChannelType.MessageBird))
                .Returns(_mockAdapterBuilder.Object);

            _adapterController = new MessageBirdAdapterController(logger.Object, 
                adapterAccessor.Object);
        }

        [Fact]
        public async Task PostActivityAsyncShouldSendOkStatusWithNonEmptyPayload()
        {
            _mockAdapterBuilder.Setup(a => a.ProcessInboundActivitiesAsync(
                It.IsAny<JToken>(), 
                It.IsAny<HttpRequest>()));

            var result = await _adapterController.PostActivityAsync(JToken.Parse("{}"));
            var statusCodeResult = (StatusCodeResult) result;

            Assert.Equal((int) HttpStatusCode.OK, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task PostActivityAsyncShouldSendBadRequestWithNullPayload()
        {
            _mockAdapterBuilder.Setup(a => a.ProcessInboundActivitiesAsync(
                It.IsAny<JToken>(),
                It.IsAny<HttpRequest>()));

            var result = await _adapterController.PostActivityAsync(null);
            var statusCodeResult = (ObjectResult)result;

            Assert.Equal((int)HttpStatusCode.BadRequest, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task PostActivityAsyncShouldSendInternalServerErrorOnException()
        {
            _mockAdapterBuilder.Setup(a => a.ProcessInboundActivitiesAsync(
                It.IsAny<JToken>(),
                It.IsAny<HttpRequest>())).Returns(Task.FromException(new Exception()));

            var result = await _adapterController.PostActivityAsync(JToken.Parse("{}"));
            var statusCodeResult = (ObjectResult)result;

            Assert.Equal((int)HttpStatusCode.InternalServerError, statusCodeResult.StatusCode);
        }
    }
}
