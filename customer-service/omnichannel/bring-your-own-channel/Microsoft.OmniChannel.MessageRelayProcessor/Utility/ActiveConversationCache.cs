// Copyright (c) Microsoft Corporation. All rights reserved.

using System.Collections.Concurrent;

namespace Microsoft.OmniChannel.MessageRelayProcessor.Utility
{
    /// <summary>
    /// Save Active Conversations in dictionary data structure to keep track of active conversations
    /// where key is user Id and value is Direct Line Conversation Object along with watermark
    /// </summary>
    public static class ActiveConversationCache
    {
        /// <summary>
        /// Gets or sets Active Conversations.
        /// </summary>
        /// <value>Key: User ID; Value: <see cref="DirectLineConversation"/></value>
        public static ConcurrentDictionary<string, DirectLineConversation> ActiveConversations { get; set; }

        static ActiveConversationCache()
        {
            ActiveConversations = new ConcurrentDictionary<string, DirectLineConversation>();
        }
    }
}
