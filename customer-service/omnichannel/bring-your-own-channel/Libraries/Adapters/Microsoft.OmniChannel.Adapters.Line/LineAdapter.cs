// Copyright (c) Microsoft Corporation. All rights reserved.

using Line.Messaging.Webhooks;
using Microsoft.AspNetCore.Http;
using Microsoft.Bot.Connector.DirectLine;
using Microsoft.Extensions.Options;
using Microsoft.OmniChannel.Adapter.Builder;
using Microsoft.OmniChannel.MessageRelayProcessor;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapters.Line
{
    /// <summary>
    /// Process inbound and outbound request of Line Messaging service.
    /// </summary>
    public class LineAdapter : IAdapterBuilder
    {
        /// <summary>
        /// Relay Processor Client
        /// </summary>
        private readonly IRelayProcessor _relayProcessor;

        /// <summary>
        /// Line Client to send outbound messages
        /// </summary>
        private readonly LineClientWrapper _lineClient;

        /// <summary>
        /// Callback event to receive activities from Message Relay Processor
        /// </summary>
        private event EventHandler<IList<Activity>> LineActivitiesReceived;

        /// <summary>
        /// Initializes a new instance of the <see cref="LineAdapter"/> class using configuration settings.
        /// </summary>
        /// <param name="relayProcessor">An <see cref="IRelayProcessor"/> instance.</param>
        /// <param name="lineAdapterConfiguration">An <see cref="LineAdapterConfiguration"/> instance.</param>
        public LineAdapter(IRelayProcessor relayProcessor, IOptions<LineAdapterConfiguration> lineAdapterConfiguration)
            : this(new LineClientWrapper(lineAdapterConfiguration))
        {
            _relayProcessor = relayProcessor;
            LineActivitiesReceived += OnActivitiesReceived;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="LineAdapter"/> class.
        /// </summary>
        /// <param name="lineClient">The Line client to connect to.</param>
        public LineAdapter(LineClientWrapper lineClient)
        {
            _lineClient = lineClient ?? throw new ArgumentNullException(nameof(lineClient));
        }

        /// <summary>
        /// Process Inbound Request from the Line Channel
        /// </summary>
        /// <param name="content">Inbound message content</param>
        /// <param name="request">Represents the incoming side of an individual HTTP request</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task ProcessInboundActivitiesAsync(JToken content, HttpRequest request)
        {
            if (content == null)
            {
                throw new ArgumentNullException(nameof(content));
            }

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var events = _lineClient.GetWebhookEvents(request, content);

            foreach (var eventData in events)
            {
                var eventInfo = (MessageEvent)eventData;
                if (eventInfo?.Type != WebhookEventType.Message)
                {
                    continue;
                }

                var userProfile = await _lineClient.GetUserProfileAsync(eventInfo.Source?.UserId).ConfigureAwait(false);
                var activity = LineHelper.PayloadToActivity(eventInfo, userProfile);
                await _relayProcessor.PostActivityAsync(activity, LineActivitiesReceived).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Accept outbound Activities from Message Relay Processor, convert it into channel response model
        /// and send it to Line Messaging API
        /// </summary>
        /// <param name="outboundActivities">The outbound activities</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task ProcessOutboundActivitiesAsync(IList<Activity> outboundActivities)
        {
            if (outboundActivities == null || outboundActivities.Count == 0)
            {
                throw new ArgumentNullException(nameof(outboundActivities));
            }

            var replyToId = outboundActivities[0]?.ReplyToId;
            var lineMessages = LineHelper.ActivityToLine(outboundActivities);

            await _lineClient.SendMessageToLine(replyToId, lineMessages).ConfigureAwait(false);
        }

        /// <summary>
        /// Activities Received from Message Relay Processor for Line Channel
        /// </summary>
        /// <param name="sender">Sender</param>
        /// <param name="outboundActivities">List of Outbound Activities</param>
        private async void OnActivitiesReceived(object sender, IList<Activity> outboundActivities)
        {
            if (outboundActivities == null)
            {
                throw new ArgumentNullException(nameof(outboundActivities));
            }

            await ProcessOutboundActivitiesAsync(outboundActivities).ConfigureAwait(false);
        }
    }
}
