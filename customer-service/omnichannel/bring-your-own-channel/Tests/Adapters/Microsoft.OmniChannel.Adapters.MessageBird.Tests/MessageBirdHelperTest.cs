using Microsoft.AspNetCore.Http;
using Microsoft.Bot.Connector.DirectLine;
using Moq;
using System;
using System.Collections.Generic;
using Xunit;

namespace Microsoft.OmniChannel.Adapters.MessageBird.Tests
{
    public class MessageBirdHelperTest
    {
        [Fact]
        public void ActivityToMessageBirdShouldThrowArgumentNullExceptionWithNullActivities()
        {
            Assert.Throws<ArgumentNullException>(() =>
                {
                    MessageBirdHelper.ActivityToMessageBird(null, "sampleReplyId");
                });
        }

        [Fact]
        public void ActivityToMessageBirdShouldThrowArgumentNullExceptionWithEmptyReplyId()
        {
            Assert.Throws<ArgumentNullException>(() =>
            {
                MessageBirdHelper.ActivityToMessageBird(new List<Activity>(), "");
            });
        }

        [Fact]
        public void ActivityToMessageBirdShouldReturnMessageBirdResponseModel()
        {
            var activities = new List<Activity>
            {
                new Activity
                {
                    ChannelId = "Channel Id",
                    Text = "Sample Text"
                }
            };

            const string replyToId = "sampleReplyId";
            Assert.True(MessageBirdHelper.ActivityToMessageBird
                                (activities, replyToId)?.Count == activities.Count);
        }

        [Fact]
        public void PayloadToActivityShouldThrowArgumentNullExceptionWithNullPayload()
        {
            Assert.Throws<ArgumentNullException>(() =>
            {
                MessageBirdHelper.PayloadToActivity(null);
            });
        }

        [Fact]
        public void PayloadToActivityShouldReturnNullWithPayloadMessageDirectionNotReceived()
        {
            Assert.Null(MessageBirdHelper.PayloadToActivity(
                new MessageBirdRequestModel
                {
                    Message = new Message
                    {
                        Direction = ConversationMessageDirection.Sent
                    }
                }));
        }

        [Fact]
        public void PayloadToActivityShouldReturnActivityModel()
        {
            var requestModel = new MessageBirdRequestModel
            {
                Message = new Message
                {
                    Id = "12345",
                    Direction = ConversationMessageDirection.Received,
                    ChannelId = "MessageBird",
                    From = "123456789",
                    Content = new Content
                    {
                        Text = "SampleText"
                    }
                },
                Contact = new Contact
                {
                    DisplayName = "FirstName LastName"
                }

            };

            Assert.NotNull(MessageBirdHelper.PayloadToActivity(requestModel));
        }

        [Fact]
        public void ValidateMessageBirdRequestShouldThrowArgumentNullExceptionWithEmptySigningKey()
        {
            var httpRequest = new Mock<HttpRequest>();
            const string content = "Some content";
            Assert.Throws<ArgumentNullException>(() =>
            {
                MessageBirdHelper.ValidateMessageBirdRequest(content, httpRequest.Object, "");
            });
        }

        [Fact]
        public void ValidateMessageBirdRequestShouldThrowArgumentNullExceptionWithEmptyContent()
        {
            var httpRequest = new Mock<HttpRequest>();
            const string signingKey = "yruy374hgd87shad";
            Assert.Throws<ArgumentNullException>(() =>
            {
                MessageBirdHelper.ValidateMessageBirdRequest("", httpRequest.Object, signingKey);
            });
        }
    }
}
