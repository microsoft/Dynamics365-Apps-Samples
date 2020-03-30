// Copyright (c) Microsoft Corporation. All rights reserved.

using Newtonsoft.Json;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// The model class to send response to Message Bird Platform
    /// </summary>
    public class MessageBirdResponseModel
    {
        /// <summary>
        /// To Identifier.
        /// </summary>
        [JsonProperty(PropertyName = "to")]
        public string To { get; set; }

        /// <summary>
        /// From Identifier.
        /// </summary>
        [JsonProperty(PropertyName = "from")]
        public string From { get; set; }

        /// <summary>
        /// Response Type.
        /// </summary>
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }

        /// <summary>
        /// Response Content Context.
        /// </summary>
        [JsonProperty(PropertyName = "content")]
        public Content Content { get; set; }
    }

    /// <summary>
    /// Response Content Context.
    /// </summary>
    public class Content
    {
        /// <summary>
        /// Response Text message.
        /// </summary>
        [JsonProperty(PropertyName = "text")]
        public string Text { get; set; }
    }
}
