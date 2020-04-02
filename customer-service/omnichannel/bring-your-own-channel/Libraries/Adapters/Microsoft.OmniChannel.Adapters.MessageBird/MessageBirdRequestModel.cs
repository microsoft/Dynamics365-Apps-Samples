// Copyright (c) Microsoft Corporation. All rights reserved.

using Newtonsoft.Json;
using System;
using System.Runtime.Serialization;
using Newtonsoft.Json.Converters;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// The request model generated from the webhook event on Message Bird Platform
    /// </summary>
    public class MessageBirdRequestModel
    {
        /// <summary>
        /// Properties of the Contact Context.
        /// </summary>
        [JsonProperty(PropertyName = "contact")]
        public Contact Contact { get; set; }

        /// <summary>
        /// Properties of the Conversation Context.
        /// </summary>
        [JsonProperty(PropertyName = "conversation")]
        public Conversation Conversation { get; set; }

        /// <summary>
        /// Properties of the Message Context.
        /// </summary>
        [JsonProperty(PropertyName = "message")]
        public Message Message { get; set; }

        /// <summary>
        /// Webhook message Type Information
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty(PropertyName = "type")]
        public ConversationWebhookMessageType Type { get; set; }
    }

    /// <summary>
    /// Properties defined for Message Context.
    /// </summary>
    public class Message
    {
        /// <summary>
        /// Channel Id
        /// </summary>
        [JsonProperty(PropertyName = "channelId")]
        public string ChannelId { get; set; }

        /// <summary>
        /// Properties of the Request Content.
        /// </summary>
        [JsonProperty(PropertyName = "content")]
        public Content Content { get; set; }

        /// <summary>
        /// Conversation Id
        /// </summary>
        [JsonProperty(PropertyName = "conversationId")]
        public string ConversationId { get; set; }

        /// <summary>
        /// Created Date Time
        /// </summary>
        [JsonProperty(PropertyName = "createdDatetime")]
        public DateTime CreatedDatetime { get; set; }

        /// <summary>
        /// Direction: sent or received
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty(PropertyName = "direction")]
        public ConversationMessageDirection Direction { get; set; }

        /// <summary>
        /// From Identifier.
        /// </summary>
        [JsonProperty(PropertyName = "from")]
        public string From { get; set; }

        /// <summary>
        /// Request Id.
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Channel Platform Identifier. e.g. SMS
        /// </summary>
        [JsonProperty(PropertyName = "platform")]
        public string Platform { get; set; }

        /// <summary>
        /// Status Identifier
        /// </summary>
        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }

        /// <summary>
        /// To Identifier.
        /// </summary>
        [JsonProperty(PropertyName = "to")]
        public string To { get; set; }

        /// <summary>
        /// Message Type Identifier.
        /// </summary>
        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }

        /// <summary>
        /// Updated Date Time
        /// </summary>
        [JsonProperty(PropertyName = "updatedDatetime")]
        public DateTime UpdatedDatetime { get; set; }
    }

    /// <summary>
    /// Properties defined for Conversation Context.
    /// </summary>
    public class Conversation
    {
        /// <summary>
        /// Contact Identifier
        /// </summary>
        [JsonProperty(PropertyName = "contactId")]
        public string ContactId { get; set; }

        /// <summary>
        /// Created Date Time.
        /// </summary>
        [JsonProperty(PropertyName = "createdDatetime")]
        public DateTime CreatedDatetime { get; set; }

        /// <summary>
        /// Conversation Identifier.
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Last Received Date time.
        /// </summary>
        [JsonProperty(PropertyName = "lastReceivedDatetime")]
        public DateTime LastReceivedDatetime { get; set; }

        /// <summary>
        /// Conversation State.
        /// </summary>
        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }

        /// <summary>
        /// Updated Date time.
        /// </summary>
        [JsonProperty(PropertyName = "updatedDatetime")]
        public DateTime UpdatedDatetime { get; set; }
    }

    /// <summary>
    /// Properties defined for Contact Context.
    /// </summary>
    public class Contact
    {
        /// <summary>
        /// Created Date time.
        /// </summary>
        [JsonProperty(PropertyName = "createdDatetime")]
        public DateTime CreatedDatetime { get; set; }

        /// <summary>
        /// Display name of Contact.
        /// </summary>
        [JsonProperty(PropertyName = "displayName")]
        public string DisplayName { get; set; }

        /// <summary>
        /// First Name.
        /// </summary>
        [JsonProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }

        /// <summary>
        /// href of Contact.
        /// </summary>
        [JsonProperty(PropertyName = "href")]
        public string Href { get; set; }

        /// <summary>
        /// Contact Id.
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Last Name.
        /// </summary>
        [JsonProperty(PropertyName = "lastName")]
        public string LastName { get; set; }

        /// <summary>
        /// MSISDN of the contact.
        /// </summary>
        [JsonProperty(PropertyName = "msisdn")]
        public long? Msisdn { get; set; }

        /// <summary>
        /// Updated Date time
        /// </summary>
        [JsonProperty(PropertyName = "updatedDatetime")]
        public DateTime UpdatedDatetime { get; set; }
    }

    /// <summary>
    /// Message Bird Request Type
    /// </summary>
    public enum ConversationWebhookMessageType
    {
        /// <summary>
        /// Create Message Type.
        /// </summary>
        [EnumMember(Value = "message.created")]
        MessageCreated,

        /// <summary>
        /// Update Message Type.
        /// </summary>
        [EnumMember(Value = "message.updated")]
        MessageUpdated
    }

    /// <summary>
    /// Conversation Message Direction
    /// </summary>
    public enum ConversationMessageDirection
    {
        /// <summary>
        /// Received Message Direction
        /// </summary>
        [EnumMember(Value = "received")]
        Received,

        /// <summary>
        /// Sent Message Direction
        /// </summary>
        [EnumMember(Value = "sent")]
        Sent
    }
}
