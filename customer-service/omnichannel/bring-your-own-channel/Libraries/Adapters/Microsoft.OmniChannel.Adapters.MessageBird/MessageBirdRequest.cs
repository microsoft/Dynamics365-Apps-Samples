// Copyright (c) Microsoft Corporation. All rights reserved.

using System;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// Structure used for request signature verification via MessageBird.RequestSigner
    /// When user receive webhook, it should use this structure with
    /// MessageBird-Request-Timestamp header
    /// query string of request nd request body
    /// </summary>
    public class MessageBirdRequest
    {
        /// <summary>
        /// MessageBird-Request-Timestamp header
        /// </summary>
        public string Timestamp { get; }

        /// <summary>
        /// Query Parameter of request
        /// </summary>
        public string QueryParameters { get; }

        /// <summary>
        /// Request Body as byte array
        /// </summary>
        public byte[] Data { get; }

        /// <summary>
        /// Query Parameter Delimiter
        /// </summary>
        private const string QueryParametersDelimiter = "&";

        /// <summary>
        /// Constructs a new request instance.
        /// </summary>
        /// <param name="timestamp">Timestamp provided in the MessageBird-Request-Timestamp header</param>
        /// <param name="queryParameters">Query parameters in the request</param>
        /// <param name="data">data Raw body of this request</param>
        public MessageBirdRequest(string timestamp, string queryParameters, byte[] data)
        {
            if (string.IsNullOrEmpty(timestamp))
            {
                throw new ArgumentNullException(nameof(timestamp));
            }

            Timestamp = timestamp;
            QueryParameters = queryParameters;
            Data = data;
        }

        /// <summary>
        /// Query params (in lexicographical order) and body hash sum
        /// </summary>
        /// <returns>Concatenated string with the delimiter</returns>
        public string SortedQueryParameters()
        {
            var queryParams = QueryParameters.Split(QueryParametersDelimiter);
            Array.Sort(queryParams);
            return string.Join(QueryParametersDelimiter, queryParams);
        }
    }
}
