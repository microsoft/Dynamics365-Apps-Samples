// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// Wrapper class for the MessageBird Messaging.
    /// </summary>
    public class MessageBirdClientWrapper : IDisposable
    {
        /// <summary>
        /// MessageBird API to send Outbound messages
        /// </summary>
        private const string MessageBirdDefaultApi = "https://conversations.messagebird.com/v1";

        /// <summary>
        /// MessageBird Adapter Configuration Setting Values
        /// </summary>
        private readonly IOptions<MessageBirdAdapterConfiguration> _messageBirdAdapterConfiguration;

        /// <summary>
        /// HTTP Client
        /// </summary>
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessageBirdClientWrapper"/> class.
        /// </summary>
        /// <param name="messageBirdAdapterConfiguration">An object containing API credentials, a web-hook verification token and other options.</param>
        public MessageBirdClientWrapper(IOptions<MessageBirdAdapterConfiguration> messageBirdAdapterConfiguration)
        {
            _messageBirdAdapterConfiguration = messageBirdAdapterConfiguration ?? throw new ArgumentNullException(nameof(messageBirdAdapterConfiguration));
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("AccessKey",
                messageBirdAdapterConfiguration.Value.MessageBirdAccessKey);

            if (string.IsNullOrWhiteSpace(_messageBirdAdapterConfiguration.Value?.MessageBirdAccessKey))
            {
                throw new MissingFieldException(nameof(MessageBirdAdapterConfiguration.MessageBirdAccessKey));
            }

            if (string.IsNullOrWhiteSpace(_messageBirdAdapterConfiguration.Value?.MessageBirdSigningKey))
            {
                throw new MissingFieldException(nameof(MessageBirdAdapterConfiguration.MessageBirdSigningKey));
            }
        }

        /// <summary>
        /// Check if request is sent from MessageBird
        /// </summary>
        /// <param name="content">Request Content</param>
        /// <param name="request">HTTP Request</param>
        /// <returns>status of the Request Validation</returns>
        public bool ValidateMessageBirdRequest(string content, HttpRequest request)
        {
            return MessageBirdHelper.ValidateMessageBirdRequest(
                content, request,
                _messageBirdAdapterConfiguration.Value.MessageBirdSigningKey);
        }

        /// <summary>
        /// Send Outbound Messages to Message Bird
        /// </summary>
        /// <param name="messageBirdResponses">Message Bird Response object</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task SendMessagesToMessageBird(IList<MessageBirdResponseModel> messageBirdResponses)
        {
            if (messageBirdResponses == null)
            {
                throw new ArgumentNullException(nameof(messageBirdResponses));
            }

            foreach (var messageBirdResponse in messageBirdResponses)
            {
                using (var request = new HttpRequestMessage(HttpMethod.Post, $"{MessageBirdDefaultApi}/send"))
                {
                    var content = JsonConvert.SerializeObject(messageBirdResponse);
                    request.Content = new StringContent(content, Encoding.UTF8, "application/json");
                    await _httpClient.SendAsync(request).ConfigureAwait(false);
                }
            }
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
                _httpClient.Dispose();
            }
        }
    }
}
