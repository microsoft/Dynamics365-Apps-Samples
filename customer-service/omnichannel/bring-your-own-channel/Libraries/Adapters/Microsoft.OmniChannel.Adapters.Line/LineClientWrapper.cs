// Copyright (c) Microsoft Corporation. All rights reserved.

using Line.Messaging;
using Line.Messaging.Webhooks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.OmniChannel.Adapter.Builder;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapters.Line
{
    /// <summary>
    /// Wrapper class for the Line Messaging.
    /// </summary>
    public class LineClientWrapper : IDisposable
    {
        /// <summary>
        /// Line Adapter Configuration Setting Values
        /// </summary>
        private readonly IOptions<LineAdapterConfiguration> _lineAdapterConfiguration;

        /// <summary>
        /// Line Messaging Client
        /// </summary>
        private readonly LineMessagingClient _lineMessagingClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="LineClientWrapper"/> class.
        /// </summary>
        /// <param name="lineAdapterConfiguration">An object containing API credentials, a web-hook verification token and other options.</param>
        public LineClientWrapper(IOptions<LineAdapterConfiguration> lineAdapterConfiguration)
        {
            _lineAdapterConfiguration = lineAdapterConfiguration ?? throw new ArgumentNullException(nameof(lineAdapterConfiguration));

            if (string.IsNullOrWhiteSpace(_lineAdapterConfiguration.Value?.LineAccessToken))
            {
                throw new MissingFieldException(nameof(LineAdapterConfiguration.LineAccessToken));
            }

            if (string.IsNullOrWhiteSpace(_lineAdapterConfiguration.Value?.LineChannelSecret))
            {
                throw new MissingFieldException(nameof(LineAdapterConfiguration.LineChannelSecret));
            }

            _lineMessagingClient = new LineMessagingClient(_lineAdapterConfiguration.Value.LineAccessToken);
        }

        /// <summary>
        /// Send Messages to LIne Messaging API
        /// </summary>
        /// <param name="replyToId">Reply Id</param>
        /// <param name="lineMessages">Line Messages</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task SendMessageToLine(string replyToId, IList<ISendMessage> lineMessages)
        {
            if (string.IsNullOrWhiteSpace(replyToId))
            {
                throw new ArgumentNullException(nameof(replyToId));
            }

            if (lineMessages == null)
            {
                throw new ArgumentNullException(nameof(lineMessages));
            }

            await _lineMessagingClient.PushMessageAsync(replyToId, lineMessages).ConfigureAwait(false);
        }

        /// <summary>
        /// Verify if the request is valid, then returns LINE Web-hook events from the request
        /// </summary>
        /// <param name="httpRequest">Http Request</param>
        /// <param name="requestPayload">Request Payload</param>
        /// <returns>List of Web-hook Events</returns>
        public IEnumerable<WebhookEvent> GetWebhookEvents(HttpRequest httpRequest, JToken requestPayload)
        {
            if (httpRequest == null)
            {
                throw new ArgumentNullException(nameof(httpRequest));
            }

            if (requestPayload == null)
            {
                throw new ArgumentNullException(nameof(requestPayload));
            }

            var content = JsonConvert.SerializeObject(requestPayload);

            var xLineSignature = httpRequest.Headers["X-Line-Signature"];
            if (string.IsNullOrEmpty(xLineSignature) || !LineHelper.VerifySignature(_lineAdapterConfiguration.Value.LineChannelSecret, xLineSignature, content))
            {
                throw new InvalidSignatureException(Constant.InvalidSignatureExceptionMessage);
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            return WebhookEventParser.ParseEvents(json.events);
        }

        /// <summary>
        /// Get User Profile details from Line
        /// </summary>
        /// <param name="userId">User Id</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task<UserProfile> GetUserProfileAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            return await _lineMessagingClient.GetUserProfileAsync(userId).ConfigureAwait(false);
        }

        /// <summary>
        /// Performing object clean up.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Implementation of Dispose pattern.
        /// </summary>
        /// <param name="disposing">If true: Dispose</param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                // dispose managed resources
                _lineMessagingClient.Dispose();
            }
        }
    }
}
