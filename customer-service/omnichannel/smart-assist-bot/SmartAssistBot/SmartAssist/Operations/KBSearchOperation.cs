using AdaptiveCards;
using CoreBot.Models;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.BotBuilderSamples;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CoreBot.SmartAssist.Operations
{
    /// <summary>
    /// Operation to suggest Knowledge articles from the CDS org
    /// </summary>
    public class KBSearchOperation
    {

        // Use your website url here 
        private const string WebsiteURL = "https://contosohelp.powerappsportals.com/knowledgebase/article/";

        // Data image URIs used for convenience. You can use full URLs for images
        private const string SendIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE8SURBVHgBnVLBUQJBEOxd1z8BALWgAWAEagSQAfLw5CdEIBkIP+UeEoIZyGUAAchtnVT55cXDu5txDrkqQKHUeexu7Uz3dO8OrBc18I/QWul6xYtC682bfwGq6nV0xazqSqkFg63sE9LxwD1U3MGOdJSOoVCY+cUWx6YFpqmm45fqTfRk26Hd2zFbqt48pI/4zI0qizyxUqJVU1NWxYPXYfl5q+MaPoYxtc3EzC+PwsfSZWrQY/7+Dipnl+M9xOc+aWAuZJYYmDCha7766nMibrhhMditt52woJemI6RNqekjSQaZJbNmqyFOppuA0/bbhTDf0lJyjD7F229gbPvdcpogv1wBGHdpKnxAz/nl4Cfl6kQmhxXqIDUROR35jjFBjZxfCnAgDMvkQPwRw2FHzkEgiAKK0+5vAXl8ArWLn19rFeLfAAAAAElFTkSuQmCC";
        private const string OpenIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABySURBVHgBnYyxDUBQFEXffURtAvk2YRIaNatoVWxgAyvYwI8JVArEEyqE+HHKm3MuyBCV9DERt2wqA0hpnjVMZZmWUJf+wCrrXBV3rom8b0yjFcCxm3v0JB+BLrxaRPJz9Cbv4P6IFZWwRE/yJfh6/s0G2y1KJHtA3a4AAAAASUVORK5CYII=";
        private const string KBIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACOSURBVHgB7ZLRDYIwFEXPsw7ACI7gIiYygi6gq7iAjRNowgA6kgMApQ0UCiWBhC8Szk/zbt/N+zmC55kZQoQfhXmg5IbhaJOk/buepF4JS02IfieU6oyIpuSOyl9c0n98xA/Dy1OZfXcsYCuvprzvTaEUTk836ewb6RmVvZqOTs8DBR+rZ9rqGSCjCs6kAicPMswh3Ik+AAAAAElFTkSuQmCC";

        protected readonly IDynamicsDataAccessLayer dynamicsDataAccessLayer;

        public KBSearchOperation(IDynamicsDataAccessLayer dynamicsDataAccessLayer)
        {
            this.dynamicsDataAccessLayer = dynamicsDataAccessLayer;
        }

        /// <summary>
        /// Searches for KB articles in CDS org and creates list of adaptive card message activites for all relevant results
        /// </summary>
        /// <param name="text"> Search text </param>
        /// <returns> List of adaptive card message activities </returns>
        public async Task<List<IMessageActivity>> SearchKBArticles(string text)
        {
            var kbCards = new List<IMessageActivity>();
            var kbArticles = await this.dynamicsDataAccessLayer.FullTextKBSearchAsync(text);
            if (kbArticles != null)
            {
                var kbResult = JsonConvert.DeserializeObject<KBSearchResult>(kbArticles);
                kbResult?.KBResults.ForEach((kb) =>
                {
                    var kbCard = MessageFactory.Attachment(CreateKBAdaptiveCardMessage(kb.Title, kb.Description, kb.ArticlePublicNumber));
                    kbCards.Add(kbCard);
                });
            }
            return kbCards;
        }

        private Attachment CreateKBAdaptiveCardMessage(string title, string description, string articleNumber)
        {
            var kbAdaptiveCard = ConstructKBAdaptiveCard(title, description, articleNumber);

            return new Attachment()
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = kbAdaptiveCard,
            };
        }

        private AdaptiveCard ConstructKBAdaptiveCard(string title, string description, string articleNumber)
        {
            // Constructs the adaptive card similar to /SmartAssist/Cards/KnowledgeArticle.json
            var kbAdaptiveCard = new AdaptiveCard("1.0")
            {
                Body = new List<AdaptiveElement>()
                {
                    new AdaptiveContainer() {
                        Items = new List<AdaptiveElement>() {
                            new AdaptiveColumnSet() {
                                Columns = new List<AdaptiveColumn>() {
                                    new AdaptiveColumn() {
                                        Width = "auto",
                                        Items = new List<AdaptiveElement>() {
                                            new AdaptiveImage() {
                                                PixelWidth = 16,
                                                PixelHeight = 16,
                                                Url = new Uri(KBIcon),
                                                AltText = "Knowledge article"
                                            }
                                        }
                                    },
                                    new AdaptiveColumn() {
                                        Width = "stretch",
                                        Items = new List<AdaptiveElement>() {
                                            new AdaptiveTextBlock() {
                                                Text = "knowledge article"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    new AdaptiveContainer() {
                        Items = new List<AdaptiveElement>() {
                            new AdaptiveTextBlock() {
                                Text = title,
                                Weight = AdaptiveTextWeight.Bolder
                            }
                        }
                    },
                    new AdaptiveTextBlock() {
                        Text = description,
                        Wrap = true
                    }
                },
                Actions = new List<AdaptiveAction>()
                {
                    new AdaptiveSubmitAction() {
                        IconUrl = SendIcon,
                        Title = "Send",
                        Data = new MacroData() {
                            // This macro should already be configured in the CDS org. Please note that the names are case sensitive
                            MacroName = "SendKBAsEmail",
                            MacroParameters = new Dictionary<string, string>() {
                                ["EmailTemplateName"] = "KBEmaiLTemplate"
                            }
                        }
                    },
                    new AdaptiveSubmitAction() {
                        IconUrl = OpenIcon,
                        Title = "Open",
                        Data = new MacroData() {
                            MacroName = "OpenKBLink",
                            MacroParameters = new Dictionary<string, string>() {
                                ["kblink"] = WebsiteURL + articleNumber
                            }
                        }
                    }
                }
            };
            return kbAdaptiveCard;
        }
    }
}
