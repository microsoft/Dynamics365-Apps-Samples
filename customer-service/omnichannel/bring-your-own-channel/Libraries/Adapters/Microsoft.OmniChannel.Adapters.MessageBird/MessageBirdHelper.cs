// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Http;
using Microsoft.Bot.Connector.DirectLine;
using Microsoft.OmniChannel.Adapter.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// A helper class to create Activities, MessageBird messages and validate MessageBird request.
    /// </summary>
    public static class MessageBirdHelper
    {
        /// <summary>
        /// Creates MessageBird response object from a Bot Framework <see cref="Activity"/>.
        /// </summary>
        /// <param name="activities">The outbound activities.</param>
        /// <param name="replyToId">Reply Id of Message Bird user.</param>
        /// <returns>List of MessageBird Responses.</returns>
        public static List<MessageBirdResponseModel> ActivityToMessageBird(IList<Activity> activities, string replyToId)
        {
            if (string.IsNullOrWhiteSpace(replyToId))
            {
                throw new ArgumentNullException(nameof(replyToId));
            }

            if (activities == null)
            {
                throw new ArgumentNullException(nameof(activities));
            }

            return activities.Select(activity => new MessageBirdResponseModel
            {
                To = replyToId,
                From = activity.ChannelId,
                Type = "text",
                Content = new Content
                {
                    Text = activity.Text
                }
            }).ToList();
        }

        /// <summary>
        /// Validate Message Bird Request
        /// </summary>
        /// <param name="content">Request Content</param>
        /// <param name="request">HTTP Request</param>
        /// <param name="messageBirdSigningKey">Message Bird Signing Key</param>
        /// <returns>True if there request is valid, false if there aren't.</returns>
        public static bool ValidateMessageBirdRequest(string content, HttpRequest request, string messageBirdSigningKey)
        {
            if (string.IsNullOrWhiteSpace(messageBirdSigningKey))
            {
                throw new ArgumentNullException(nameof(messageBirdSigningKey));
            }

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException(nameof(content));
            }

            var messageBirdRequest = new MessageBirdRequest(
                request.Headers?["Messagebird-Request-Timestamp"],
                request.QueryString.Value?.Equals("?",
                    StringComparison.CurrentCulture) != null
                    ? string.Empty
                    : request.QueryString.Value,
                GetBytes(content));

            var messageBirdRequestSigner = new MessageBirdRequestSigner(GetBytes(messageBirdSigningKey));
            string expectedSignature = request.Headers?["Messagebird-Signature"];
            return messageBirdRequestSigner.IsMatch(expectedSignature, messageBirdRequest);
        }

        /// <summary>
        /// Build Bot Activity type from the inbound MessageBird request payload<see cref="Activity"/>
        /// </summary>
        /// <param name = "messagePayload"> Message Bird Activity Payload</param>
        /// <returns>Direct Line Activity</returns>
        public static Activity PayloadToActivity(MessageBirdRequestModel messagePayload)
        {
            if (messagePayload == null)
            {
                throw new ArgumentNullException(nameof(messagePayload));
            }

            if (messagePayload.Message?.Direction == ConversationMessageDirection.Sent ||
                messagePayload.Type == ConversationWebhookMessageType.MessageUpdated)
            {
                return null;
            }

            var channelData = new ActivityExtension
            {
                ChannelType = ChannelType.MessageBird,

                // Add Conversation Context in below dictionary object. Please refer the document for more information.
                ConversationContext = new Dictionary<string, string>(),

                // Add Customer Context in below dictionary object. Please refer the document for more information.
                CustomerContext = new Dictionary<string, string>()
            };

            var activity = new Activity
            {
                From = new ChannelAccount(messagePayload.Message?.From, messagePayload.Contact?.DisplayName),
                ChannelId = Constant.ChannelId,
                ServiceUrl = Constant.DirectLineBotServiceUrl,
                Text = messagePayload.Message?.Content?.Text,
                Type = ActivityTypes.Message,
                Id = messagePayload.Message?.ChannelId,
                ChannelData = channelData
            };

            return activity;
        }

        /// <summary>
        /// Convert String to Byte Array
        /// </summary>
        /// <param name="input">Input String</param>
        /// <returns>Byte Array</returns>
        private static byte[] GetBytes(string input)
        {
            return Encoding.UTF8.GetBytes(input);
        }
    }
}
