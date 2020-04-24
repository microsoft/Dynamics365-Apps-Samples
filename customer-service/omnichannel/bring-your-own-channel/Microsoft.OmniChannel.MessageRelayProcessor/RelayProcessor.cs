// Copyright (c) Microsoft Corporation. All rights reserved.

using Microsoft.Bot.Connector.DirectLine;
using Microsoft.Extensions.Options;
using Microsoft.OmniChannel.MessageRelayProcessor.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Microsoft.OmniChannel.MessageRelayProcessor
{
    /// <summary>
    /// Connector Service that connects an Adapter to Direct Line Bot to send/receive activities
    /// </summary>
    public class RelayProcessor : IRelayProcessor
    {
        private readonly IOptions<RelayProcessorConfiguration> _relayProcessorConfiguration;

        /// <summary>
        /// Inject Message Relay Processor Configuration Settings
        /// </summary>
        /// <param name="relayProcessorConfiguration">Message Relay Processor Instance</param>
        public RelayProcessor(IOptions<RelayProcessorConfiguration> relayProcessorConfiguration)
        {
            _relayProcessorConfiguration = relayProcessorConfiguration ?? throw new ArgumentNullException(nameof(relayProcessorConfiguration));

            if (string.IsNullOrWhiteSpace(_relayProcessorConfiguration.Value?.DirectLineSecret))
            {
                throw new MissingFieldException(nameof(RelayProcessorConfiguration.DirectLineSecret));
            }

            if (string.IsNullOrWhiteSpace(_relayProcessorConfiguration.Value?.BotHandle))
            {
                throw new MissingFieldException(nameof(RelayProcessorConfiguration.BotHandle));
            }

            if (string.IsNullOrWhiteSpace(_relayProcessorConfiguration?.Value?.PollingIntervalInMilliseconds))
            {
                throw new MissingFieldException(nameof(RelayProcessorConfiguration.PollingIntervalInMilliseconds));
            }
        }

        /// <summary>
        /// Post Activity to DirectLine Bot and uses callback Handler to send activities to Adapter
        /// </summary>
        /// <param name="inboundActivity">Inbound activity from the channel</param>
        /// <param name="adapterCallBackHandler">Call back event handler to send outbound activities to Adapter</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        public async Task PostActivityAsync(Activity inboundActivity, EventHandler<IList<Activity>> adapterCallBackHandler)
        {
            if (inboundActivity == null)
            {
                throw new ArgumentNullException(nameof(inboundActivity));
            }

            var validationResult = RelayProcessorHelper.Validate(inboundActivity);

            if (!validationResult.IsValid)
            {
                throw new ValidationException(string.Join(" ; ", validationResult.BrokenRules));
            }

            if (!ActiveConversationCache.ActiveConversations.ContainsKey(inboundActivity.From.Id))
            {
                await InitiateConversation(inboundActivity, adapterCallBackHandler).ConfigureAwait(false);
            }

            await SendActivityToBotAsync(inboundActivity).ConfigureAwait(false);
        }

        /// <summary>
        /// Send the activity to the bot using Direct Line client
        /// </summary>
        /// <param name="inboundActivity">Inbound message from Aggregator/Channel</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        private static async Task SendActivityToBotAsync(Activity inboundActivity)
        {
            if (!ActiveConversationCache.ActiveConversations.TryGetValue(inboundActivity.From.Id,
                out var conversationContext))
            {
                throw new KeyNotFoundException($"No active conversation found for {inboundActivity.From.Id}");
            }

            await conversationContext.DirectLineClient.Conversations.PostActivityAsync(
                conversationContext.Conversation.ConversationId, inboundActivity).ConfigureAwait(false);
        }

        /// <summary>
        /// Initiate Conversation with Direct Line Bot
        /// </summary>
        /// <param name="inboundActivity">Inbound message from Aggregator/Channel</param>
        /// <param name="adapterCallBackHandler">Call Back to send activities to Messaging API</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        private async Task InitiateConversation(Activity inboundActivity, EventHandler<IList<Activity>> adapterCallBackHandler)
        {
            var directLineConversation = new DirectLineConversation
            {
                DirectLineClient = new DirectLineClient(_relayProcessorConfiguration.Value.DirectLineSecret)
            };

            // Start a conversation with Direct Line Bot
            directLineConversation.Conversation = await directLineConversation.DirectLineClient.Conversations.
                StartConversationAsync().ConfigureAwait(false);

            if (directLineConversation.Conversation == null)
            {
                throw new Exception(
                    "An error occured while starting the Conversation with direct line. Please validate the direct line secret in the configuration file.");
            }

            // Adding the Direct Line Conversation object to the lookup dictionary and starting a thread to poll the activities from the direct line bot.
            if (ActiveConversationCache.ActiveConversations.TryAdd(inboundActivity.From.Id, directLineConversation))
            {
                // Starts a new thread to poll the activities from Direct Line Bot
                new Thread(async () => await PollActivitiesFromBotAsync(
                    directLineConversation.Conversation.ConversationId, inboundActivity, adapterCallBackHandler).ConfigureAwait(false))
                .Start();
            }
        }

        /// <summary>
        /// Polling the activities from BOT for the active conversation
        /// </summary>
        /// <param name="conversationId">Direct Line Conversation Id</param>
        /// <param name="inboundActivity">Inbound Activity from Channel/Aggregator</param>
        /// <param name="lineActivitiesReceived">Call Back to send activities to Messaging API</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        private async Task PollActivitiesFromBotAsync(string conversationId, Activity inboundActivity, EventHandler<IList<Activity>> lineActivitiesReceived)
        {
            if (!int.TryParse(_relayProcessorConfiguration.Value.PollingIntervalInMilliseconds, out var pollingInterval))
            {
                throw new FormatException($"Invalid Configuration value of PollingIntervalInMilliseconds: {_relayProcessorConfiguration.Value.PollingIntervalInMilliseconds}");
            }

            if (!ActiveConversationCache.ActiveConversations.TryGetValue(inboundActivity.From.Id,
                out var conversationContext))
            {
                throw new KeyNotFoundException($"No active conversation found for {inboundActivity.From.Id}");
            }

            while (true)
            {
                var watermark = conversationContext.WaterMark;

                // Retrieve the activity set from the bot.
                var activitySet = await conversationContext.DirectLineClient.Conversations.
                    GetActivitiesAsync(conversationId, watermark).ConfigureAwait(false);

                // Set the watermark to the message received
                watermark = activitySet?.Watermark;

                // Extract the activities sent from our bot.
                if (activitySet != null)
                {
                    var activities = (from activity in activitySet.Activities
                                      where activity.From.Id == _relayProcessorConfiguration.Value.BotHandle
                                      select activity).ToList();

                    if (activities.Count > 0)
                    {
                        SendReplyActivity(activities, inboundActivity, lineActivitiesReceived);
                    }

                    // Update Watermark
                    ActiveConversationCache.ActiveConversations[inboundActivity.From.Id].WaterMark = watermark;

                    if (activities.Exists(a => a.Type == ActivityTypes.EndOfConversation))
                    {
                        if (ActiveConversationCache.ActiveConversations.TryRemove(inboundActivity.From.Id, out _))
                        {
                            Thread.CurrentThread.Abort();
                        }
                    }
                }

                await Task.Delay(TimeSpan.FromMilliseconds(pollingInterval)).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Send the reply to Adapter
        /// </summary>
        /// <param name="directLineActivities">Activity Received from the DL Bot</param>
        /// <param name="inboundActivity">Inbound Activity</param>
        /// <param name="adapterCallBackHandler">Call Back to send activities to Messaging API</param>
        private void SendReplyActivity(List<Activity> directLineActivities, Activity inboundActivity, EventHandler<IList<Activity>> adapterCallBackHandler)
        {
            if (directLineActivities == null)
            {
                throw new ArgumentNullException(nameof(directLineActivities));
            }

            if (inboundActivity == null)
            {
                throw new ArgumentNullException(nameof(inboundActivity));
            }

            // Update Reply Id and Channel Id of each outbound activities based on Inbound activity
            directLineActivities.ForEach(a =>
            {
                a.ReplyToId = inboundActivity.From.Id;
                a.ChannelId = inboundActivity.Id;
            });

            // Invoke Call Back event to send outbound activities to Adapter
            adapterCallBackHandler?.Invoke(this, directLineActivities);
        }
    }
}