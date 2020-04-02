// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Http;
using Microsoft.Bot.Connector.DirectLine;
using Microsoft.Extensions.Options;
using Microsoft.OmniChannel.Adapter.Builder;
using Microsoft.OmniChannel.MessageRelayProcessor;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// Process inbound and outbound request of Message Bird Messaging service.
    /// </summary>
    public class MessageBirdAdapter : IAdapterBuilder
    {
        /// <summary>
        /// Relay Processor Client
        /// </summary>
        private readonly IRelayProcessor _relayProcessor;

        /// <summary>
        /// Message Bird Adapter Client
        /// </summary>
        private readonly MessageBirdClientWrapper _messageBirdClient;

        /// <summary>
        /// Callback event to receive activities from Message Relay Processor
        /// </summary>
        private event EventHandler<IList<Activity>> MessageBirdActivitiesReceived;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageBirdAdapter"/> class using configuration settings.
        /// </summary>
        /// <param name="relayProcessor">An <see cref="IRelayProcessor"/> instance.</param>
        /// <param name="messageBirdAdapterConfiguration">An <see cref="MessageBirdAdapterConfiguration"/> instance.</param>
        public MessageBirdAdapter(IRelayProcessor relayProcessor, IOptions<MessageBirdAdapterConfiguration> messageBirdAdapterConfiguration)
            : this(new MessageBirdClientWrapper(messageBirdAdapterConfiguration))
        {
            _relayProcessor = relayProcessor;
            MessageBirdActivitiesReceived += OnActivitiesReceived;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageBirdAdapter"/> class.
        /// </summary>
        /// <param name="messageBirdClient">The Message Bird client</param>
        public MessageBirdAdapter(MessageBirdClientWrapper messageBirdClient)
        {
            _messageBirdClient = messageBirdClient ?? throw new ArgumentNullException(nameof(messageBirdClient));
        }

        /// <summary>
        /// Process Inbound Request from the MessageBird
        /// </summary>
        /// <param name="content">Inbound message content</param>
        /// <param name="request">Represents the incoming side of an individual HTTP request</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task ProcessInboundActivitiesAsync(JToken content, HttpRequest request)
        {
            if (content == null || content.Type == JTokenType.Null)
            {
                throw new ArgumentNullException(nameof(content));
            }

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var jsonData = JsonConvert.SerializeObject(content);

            if (!_messageBirdClient.ValidateMessageBirdRequest(jsonData, request))
            {
                throw new InvalidOperationException(Constant.InvalidSignatureExceptionMessage);
            }

            var messagePayload = JsonConvert.DeserializeObject<MessageBirdRequestModel>(jsonData);
            var activity = MessageBirdHelper.PayloadToActivity(messagePayload);

            if (activity != null)
            {
                await _relayProcessor.PostActivityAsync(activity, MessageBirdActivitiesReceived).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Accept outbound Activities from Message Relay Processor, convert it into channel response model
        /// and send it to Message Bird Channel Messaging API
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
            var messageBirdResponses = MessageBirdHelper.ActivityToMessageBird(outboundActivities, replyToId);
            await _messageBirdClient.SendMessagesToMessageBird(messageBirdResponses).ConfigureAwait(false);
        }

        /// <summary>
        /// Activities Received from Message Relay Processor for MessageBird Channel
        /// </summary>
        /// <param name="sender">sender</param>
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
