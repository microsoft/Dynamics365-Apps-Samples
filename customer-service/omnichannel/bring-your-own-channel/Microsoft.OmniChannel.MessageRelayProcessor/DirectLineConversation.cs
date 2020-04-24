// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.Bot.Connector.DirectLine;

namespace Microsoft.OmniChannel.MessageRelayProcessor
{
    /// <summary>
    /// Direct Line Conversation to store as an Active Conversation
    /// </summary>
    public class DirectLineConversation
    {
        /// <summary>
        /// .NET SDK Client to connect to Direct Line Bot
        /// </summary>
        public DirectLineClient DirectLineClient { get; set; }

        /// <summary>
        /// Direct Line conversation response after start a new conversation
        /// </summary>
        public Conversation Conversation { get; set; }

        /// <summary>
        /// Watermark to guarantee that no messages are lost
        /// </summary>
        public string WaterMark { get; set; }
    }
}
