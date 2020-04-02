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
    /// Line Post API Controller to accept an incoming web-hook request from Line Channel
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class LineAdapterController : Controller, IChannelAdapter
    {
        /// <summary>
        /// Logger Instance
        /// </summary>
        private readonly ILogger<LineAdapterController> _logger;

        /// <summary>
        /// Line Adapter Client
        /// </summary>
        private readonly IAdapterBuilder _lineAdapter;

        /// <summary>
        /// Inject Logger and Line Channel Manager
        /// </summary>
        /// <param name="logger">Logger Instance</param>
        /// <param name="adapterAccessor">Adapter Service Resolver</param>
        public LineAdapterController(ILogger<LineAdapterController> logger, AdapterServiceResolver adapterAccessor)
        {
            if (adapterAccessor == null)
            {
                throw new ArgumentNullException(nameof(adapterAccessor));
            }

            _logger = logger;
            _lineAdapter = adapterAccessor(ChannelType.Line);
        }

        /// <summary>
        /// Accept an incoming web-hook request from Line Channel
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
                await _lineAdapter.ProcessInboundActivitiesAsync(requestPayload, Request).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError($"postactivityasync:, {ex}");
                return StatusCode(500, "An error occured while handling your request.");
            }

            return StatusCode(200);
        }
    }
}