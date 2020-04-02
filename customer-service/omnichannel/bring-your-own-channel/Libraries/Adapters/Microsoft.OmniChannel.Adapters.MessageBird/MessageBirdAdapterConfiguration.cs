// Copyright (c) Microsoft Corporation. All rights reserved.

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// Defines values that a <see cref="MessageBirdClientWrapper"/> can use to connect to Message Bird messaging service.
    /// </summary>
    public class MessageBirdAdapterConfiguration
    {
        /// <summary>
        /// Message Bird Access Key
        /// </summary>
        public string MessageBirdAccessKey { get; set; }

        /// <summary>
        /// Message Bird Signing Key
        /// </summary>
        public string MessageBirdSigningKey { get; set; }
    }
}
