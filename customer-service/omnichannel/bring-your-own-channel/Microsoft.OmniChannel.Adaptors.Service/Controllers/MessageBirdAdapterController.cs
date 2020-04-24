// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.OmniChannel.Adapter.Builder;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapters.Service.Controllers
{
    /// <summary>
    /// Message Bird Post API Controller to accept an incoming web-hook request from MessageBird Aggregator
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MessageBirdAdapterController : Controller, IChannelAdapter
    {
        /// <summary>
        /// Logger Instance
        /// </summary>
        private readonly ILogger<MessageBirdAdapterController> _logger;

        /// <summary>
        /// Message Bird Adapter Client
        /// </summary>
        private readonly IAdapterBuilder _messageBirdAdapter;

        /// <summary>
        /// Inject Logger and MessageBird Adapter Instance
        /// </summary>
        /// <param name="logger">Logger Instance</param>
        /// <param name="adapterAccessor">Adapter Service Resolver</param>
        public MessageBirdAdapterController(ILogger<MessageBirdAdapterController> logger, AdapterServiceResolver adapterAccessor)
        {
            if (adapterAccessor == null)
            {
                throw new ArgumentNullException(nameof(adapterAccessor));
            }

            _logger = logger;
            _messageBirdAdapter = adapterAccessor(ChannelType.MessageBird);
        }

        /// <summary>
        /// Accept an incoming web-hook request from MessageBird Channel
        /// </summary>
        /// <param name="requestPayload">Inbound request Object</param>
        /// <returns>Executes the result operation of the action method asynchronously.</returns>
        [HttpPost("postactivityasync")]
        public async Task<IActionResult> PostActivityAsync(JToken requestPayload)
        {
            if (requestPayload == null)
            {
                return BadRequest("Request payload is invalid.");
            }

            try
            {
                await _messageBirdAdapter.ProcessInboundActivitiesAsync(requestPayload, Request).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError($"postactivityasync: {ex}");
                return StatusCode(500, "An error occured while handling your request.");
            }

            return StatusCode(200);
        }
    }
}