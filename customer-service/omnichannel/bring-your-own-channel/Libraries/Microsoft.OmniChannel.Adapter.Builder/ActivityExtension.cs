// Copyright (c) Microsoft Corporation. All rights reserved.

using Newtonsoft.Json;
using System.Collections.Generic;

namespace Microsoft.OmniChannel.Adapter.Builder
{
    /// <summary>
    /// Activity extension to add Channel Type, Conversation Context and Customer Context
    /// as part of Channel Data
    /// </summary>
    public class ActivityExtension
    {
        /// <summary>
        /// Gets or sets a value of Channel Type.
        /// The Channel through which customer is sending messages. For e.g. MessageBird, SnapChat etc.
        /// </summary>
        /// <value>The Channel Type.</value>
        [JsonProperty("channeltype")]
        public string ChannelType { get; set; }

        /// <summary>
        /// Gets or sets a value of Conversation Context.
        /// Conversation context is a key value pair holds the context variables defined in the work stream.
        /// Refer the documentation for more information.
        /// </summary>
        /// <value>The Conversation Context</value>
        [JsonProperty("conversationcontext")]
        public Dictionary<string, string> ConversationContext { get; set; }

        /// <summary>
        /// Gets or sets a value of Customer Context.
        /// Customer context is a key value pair holds the customer identifier details such as phone number, email etc.
        /// Refer the documentation for more information.
        /// </summary>
        /// <value>The Customer Context</value>
        [JsonProperty("customercontext")]
        public Dictionary<string, string> CustomerContext { get; set; }
    }
}