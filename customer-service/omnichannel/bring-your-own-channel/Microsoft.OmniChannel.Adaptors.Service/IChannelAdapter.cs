// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapters.Service
{
    /// <summary>
    /// Post API Controller to accept an incoming web-hook request from Channels
    /// </summary>
    public interface IChannelAdapter
    {
        /// <summary>
        /// Accept an incoming web-hook request from Channel/Aggregator.
        /// </summary>
        /// <param name="requestPayload">Inbound request Object</param>
        /// <returns>Executes the result operation of the action method asynchronously.</returns>
        Task<IActionResult> PostActivityAsync(JToken requestPayload);
    }
}
