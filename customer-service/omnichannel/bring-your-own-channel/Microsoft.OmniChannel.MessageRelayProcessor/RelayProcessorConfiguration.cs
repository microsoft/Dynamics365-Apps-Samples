// Copyright (c) Microsoft Corporation. All rights reserved.

namespace Microsoft.OmniChannel.MessageRelayProcessor
{
    /// <summary>
    /// Defines values that a <see cref="RelayProcessor"/> can use to connect to Direct Line Bot.
    /// </summary>
    public class RelayProcessorConfiguration
    {
        /// <summary>
        /// Direct Line Secret
        /// </summary>
        public string DirectLineSecret { get; set; }

        /// <summary>
        /// Bot Handle
        /// </summary>
        public string BotHandle { get; set; }

        /// <summary>
        /// HTTP GET Polling Interval in milliseconds
        /// </summary>
        public string PollingIntervalInMilliseconds { get; set; }
    }
}
