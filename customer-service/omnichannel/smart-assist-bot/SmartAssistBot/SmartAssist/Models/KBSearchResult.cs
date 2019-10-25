using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace CoreBot.Models
{
    /// <summary>
    /// The FullTextSearchKnowledgeArticle action returns the following value
    /// </summary>
    public class KBSearchResult {
        /// <summary>
        /// collection of knowledgearticle entities
        /// </summary>
        [JsonProperty("value")]
        public List<KBResult> KBResults;
    }

    /// <summary>
    /// Knowledge article entity type
    /// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/knowledgearticle?view=dynamics-ce-odata-9
    /// </summary>
    public class KBResult
    {
        /// <summary>
        /// A short overview of the article, primarily used in search results and for search engine optimization
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }

        /// <summary>
        /// Title for the article
        /// </summary>
        [JsonProperty("title")]
        public string Title { get; set; }

        /// <summary>
        /// Shows the automatically generated ID exposed to customers, partners, and other external users to reference and look up articles
        /// </summary>
        [JsonProperty("articlepublicnumber")]
        public string ArticlePublicNumber { get; set; }

        /// <summary>
        /// Unique identifier for entity instances
        /// </summary>
        [JsonProperty("knowledgearticleid")]
        public Guid KnowledgeArticleId { get; set; }

        /// <summary>
        /// keywords used for searches in knowledge base articles
        /// </summary>
        [JsonProperty("keywords")]
        public string Keywords { get; set; }
    }
}
