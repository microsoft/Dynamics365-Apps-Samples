// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Http;
using Microsoft.Bot.Connector.DirectLine;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapter.Builder
{
    /// <summary>
    /// Process inbound and outbound request of Messaging service.
    /// </summary>
    public interface IAdapterBuilder
    {
        /// <summary>
        /// Accept an incoming web-hook request, convert it into a Direct Line Activity
        /// and send it to Message Relay Processor
        /// </summary>
        /// <param name="content">An Inbound request content.</param>
        /// <param name="request">The incoming HTTP request.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        Task ProcessInboundActivitiesAsync(JToken content, HttpRequest request);

        /// <summary>
        /// Accept outbound Activities from Message Relay Processor, convert it into channel response model
        /// and send it to Channel Messaging API
        /// </summary>
        /// <param name="outboundActivities">The outbound activities</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        Task ProcessOutboundActivitiesAsync(IList<Activity> outboundActivities);
    }
}
