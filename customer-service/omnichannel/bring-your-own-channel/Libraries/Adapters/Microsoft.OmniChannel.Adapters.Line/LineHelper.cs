// Copyright (c) Microsoft Corporation. All rights reserved.

using Line.Messaging;
using Line.Messaging.Webhooks;
using Microsoft.Bot.Connector.DirectLine;
using Microsoft.OmniChannel.Adapter.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Microsoft.OmniChannel.Adapters.Line
{
    /// <summary>
    /// A helper class to create Activities, Line messages and validate Line request.
    /// </summary>
    internal static class LineHelper
    {
        /// <summary>
        /// Creates Line message options object from a Bot Framework <see cref="Activity"/>.
        /// </summary>
        /// <param name="activities">The activities.</param>
        /// <returns>The Line message options object.</returns>
        public static List<ISendMessage> ActivityToLine(IList<Activity> activities)
        {
            if (activities == null)
            {
                throw new ArgumentNullException(nameof(activities));
            }

            return activities.Select(activity => new TextMessage(activity.Text)).Cast<ISendMessage>().ToList();
        }

        /// <summary>
        /// Creates Direct Line Bot Activity object from a Bot Framework <see cref="Activity"/>
        /// </summary>
        /// <param name="eventInfo">Line Message Event</param>
        /// <param name="userProfile">User Profile</param>
        /// <returns>Activity</returns>
        public static Activity PayloadToActivity(MessageEvent eventInfo, UserProfile userProfile)
        {
            if (eventInfo == null)
            {
                throw new ArgumentNullException(nameof(eventInfo));
            }

            if (userProfile == null)
            {
                throw new ArgumentNullException(nameof(userProfile));
            }

            var message = (TextEventMessage)eventInfo.Message;
            var channelData = new ActivityExtension
            {
                ChannelType = ChannelType.Line,

                // Add Conversation Context in below dictionary object. Please refer the design document for more information.
                ConversationContext = new Dictionary<string, string>(),

                // Add Customer Context in below dictionary object. Please refer the design document for more information.
                CustomerContext = new Dictionary<string, string>()
            };

            var activity = new Activity
            {
                From = new ChannelAccount(userProfile.UserId, userProfile.DisplayName),
                Text = message.Text,
                Type = ActivityTypes.Message,
                Id = message.Id,
                ServiceUrl = Constant.DirectLineBotServiceUrl,
                ChannelData = channelData
            };

            return activity;
        }

        /// <summary>
        /// The signature in the X-Line-Signature request header must be verified to confirm that the request was sent from the LINE Platform.
        /// Authentication is performed as follows.
        /// 1. With the channel secret as the secret key, your application retrieves the digest value in the request body created using the HMAC-SHA256 algorithm.
        /// 2. The server confirms that the signature in the request header matches the digest value which is Base64 encoded
        /// </summary>
        /// <param name="channelSecret">ChannelSecret</param>
        /// <param name="xLineSignature">X-Line-Signature header</param>
        /// <param name="requestBody">RequestBody</param>
        /// <returns>If true then it's valid signature; else invalid.</returns>
        internal static bool VerifySignature(string channelSecret, string xLineSignature, string requestBody)
        {
            try
            {
                var key = Encoding.UTF8.GetBytes(channelSecret);
                var body = Encoding.UTF8.GetBytes(requestBody);

                using (var hmac = new HMACSHA256(key))
                {
                    var hash = hmac.ComputeHash(body, 0, body.Length);
                    var xLineBytes = Convert.FromBase64String(xLineSignature);
                    return SlowEquals(xLineBytes, hash);
                }
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Compares two-byte arrays in length-constant time.
        /// This comparison method is used so that password hashes cannot be extracted from on-line systems
        /// </summary>
        private static bool SlowEquals(IReadOnlyList<byte> a, IReadOnlyList<byte> b)
        {
            var diff = (uint)a.Count ^ (uint)b.Count;
            for (var i = 0; i < a.Count && i < b.Count; i++)
            {
                diff |= (uint)(a[i] ^ b[i]);
            }

            return diff == 0;
        }
    }
}