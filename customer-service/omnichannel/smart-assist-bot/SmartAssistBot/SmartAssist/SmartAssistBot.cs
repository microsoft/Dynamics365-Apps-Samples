// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using CoreBot.SmartAssist.Operations;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Microsoft.BotBuilderSamples.Bots
{
    public class ConversationData
    {
        public bool IsEscalated { get; set; }

    }

    /// <summary>
    /// Smartassist bot to demonstrate knowledge article suggestions and appointment intent detection
    /// </summary>
    public class SmartAssistBot : ActivityHandler
    {
        protected readonly BotState ConversationState;
        protected readonly BotState UserState;
        protected readonly ILogger Logger;
        protected readonly KBSearchOperation kBSearchOperation;
        protected readonly AppointmentDetectionOperation appointmentDetectionOperation;
        public const string OmnichannelFooBar = "omnichannelfoobar";

        public SmartAssistBot(ConversationState conversationState, UserState userState, IDynamicsDataAccessLayer dynamicsDataAccessLayer, KBSearchOperation kBSearchOperation, AppointmentDetectionOperation appointmentDetectionOperation)
        {
            ConversationState = conversationState;
            UserState = userState;
            this.kBSearchOperation = kBSearchOperation;
            this.appointmentDetectionOperation = appointmentDetectionOperation;
        }

        private async Task setConversationData(ITurnContext turnContext)
        {
            var conversationStateAccessors = ConversationState.CreateProperty<ConversationData>(nameof(ConversationData));
            var conversationData = await conversationStateAccessors.GetAsync(turnContext, () => new ConversationData());

            conversationData.IsEscalated = true;
            await ConversationState.SaveChangesAsync(turnContext);
            await UserState.SaveChangesAsync(turnContext);
        }

        public override async Task OnTurnAsync(ITurnContext turnContext, CancellationToken cancellationToken = default(CancellationToken))
        {
            var conversationStateAccessors = ConversationState.CreateProperty<ConversationData>(nameof(ConversationData));
            var conversationData = await conversationStateAccessors.GetAsync(turnContext, () => new ConversationData());

            var activity = turnContext.Activity;
            var actList = new List<IActivity>();

            if (activity.Type == ActivityTypes.Message &&
                activity.Text ==  OmnichannelFooBar &&
                conversationData.IsEscalated == false)
            {
                await setConversationData(turnContext);
                return;
            }

            if (activity.Type == ActivityTypes.ConversationUpdate && conversationData.IsEscalated == false)
            {
                var result = activity.MembersAdded;
                foreach (ChannelAccount account in result)
                {
                    if (account.AadObjectId != null)
                    {
                        await setConversationData(turnContext);
                        return;
                    }
                }
            }
            if (activity.Type == ActivityTypes.Message && (conversationData.IsEscalated == true))
            {
                await base.OnTurnAsync(turnContext, cancellationToken);
            }

            // Save any state changes that might have occured during the turn.
            await ConversationState.SaveChangesAsync(turnContext, false, cancellationToken);
            await UserState.SaveChangesAsync(turnContext, false, cancellationToken);
        }

        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            var cards = new List<IMessageActivity>();

            // Search for knowledge articles in CDS org
            var kbCards = await kBSearchOperation.SearchKBArticles(turnContext.Activity.Text);
            if (kbCards != null && kbCards.Count > 0) {
                cards.AddRange(kbCards);
            }

            // Check if the message has appointment intent
            var appointmentCard = await appointmentDetectionOperation.GetAppointmentDetectionCard(turnContext, cancellationToken);
            if (appointmentCard != null) {
                cards.Add(appointmentCard);
            }

            if (cards.Count > 0)
            {
                // IMPORTANT!
                // This tag MUST be present in all responses going from the bot
                // Any response without this tag will cause unintended UX errors
                cards.ForEach((card) =>
                {
                    Dictionary<string, object> channelinfo = new Dictionary<string, object>
                            {
                                { "tags", "smartbot" }
                            };
                    card.ChannelData = channelinfo;
                });

                // Send the card(s) as response
                await turnContext.SendActivitiesAsync(cards.ToArray(), cancellationToken);
            }
        }
    }
}
