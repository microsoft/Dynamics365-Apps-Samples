// Copyright (c) Microsoft Corporation. All rights reserved.

namespace Microsoft.OmniChannel.Adapters.Line
{
    /// <summary>
    /// Defines values that a <see cref="LineClientWrapper"/> can use to connect to Line messaging service.
    /// </summary>
    public class LineAdapterConfiguration
    {
        /// <summary>
        /// Line Access Token
        /// </summary>
        public string LineAccessToken { get; set; }

        /// <summary>
        /// Line Channel Secret
        /// </summary>
        public string LineChannelSecret { get; set; }
    }
}
