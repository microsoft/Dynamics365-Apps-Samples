// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.Bot.Connector.DirectLine;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.OmniChannel.MessageRelayProcessor
{
    /// <summary>
    /// Connector Service that connects an Adapter to Direct Line Bot to send/receive activities
    /// </summary>
    public interface IRelayProcessor
    {
        /// <summary>
        /// Post Activity to DirectLine Bot and uses callback Handler to send activities to Adapter
        /// </summary>
        /// <param name="activity">Direct Line Activity</param>
        /// <param name="adapterCallBackHandler">Call back event handler to send outbound activities to Adapter</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        Task PostActivityAsync(Activity activity, EventHandler<IList<Activity>> adapterCallBackHandler);
    }
}