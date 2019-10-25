using Newtonsoft.Json;
using System.Collections.Generic;

namespace CoreBot.Models
{

    /// <summary>
    /// Request body to FullTextSearchKnowledgeArticle action
    /// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/fulltextsearchknowledgearticle?view=dynamics-ce-odata-9
    /// </summary>
    public class FullTextKBSearchRequest
    {
        /// <summary>
        /// The text to search for in knowledge articles
        /// </summary>
        public string SearchText { get; set; }

        /// <summary>
        /// Indicates whether to use inflectional stem matching when searching for knowledge articles
        /// </summary>
        public string UseInflection { get; set; }

        /// <summary>
        /// Indicates whether to remove multiple versions of the same knowledge article in search resultss
        /// </summary>
        public string RemoveDuplicates { get; set; }

        /// <summary>
        /// The state of the knowledge articles to filter the search results
        /// </summary>
        public int StateCode { get; set; }

        /// <summary>
        /// The query criteria to find knowledge articles with specified text
        /// </summary>
        public QueryExpression QueryExpression { get; set; }
    }

    /// <summary>
    /// QueryExpression ComplexType as defined in CDS
    /// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/queryexpression?view=dynamics-ce-odata-9
    /// </summary>
    public class QueryExpression {
        [JsonProperty("@odata.type")]
        public string Type { get; set; }

        /// <summary>
        /// The logical name of the entity
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// The columns to include
        /// </summary>
        public ColumnSet ColumnSet { get; set; }

        /// <summary>
        /// The number of pages and the number of entity instances per page returned from the query
        /// </summary>
        public PageInfo PageInfo { get; set; }

        /// <summary>
        /// The order in which the entity instances are returned from the query.
        /// </summary>
        public List<Order> Orders { get; set; }
    }

    /// <summary>
    /// ColumnSet ComplexType
    /// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/columnset?view=dynamics-ce-odata-9
    /// </summary>
    public class ColumnSet {
        [JsonProperty("@odata.type")]
        public string Type { get; set; }

        /// <summary>
        /// The collection of Strings containing the names of the attributes to be retrieved from a query
        /// </summary>
        public List<string> Columns { get; set; }
    }

    /// <summary>
    /// PagingInfo ComplexType
    /// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/paginginfo?view=dynamics-ce-odata-9
    /// </summary>
    public class PageInfo {
        /// <summary>
        /// The number of entity instances returned per page
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// The total number of records should be returned from the query
        /// </summary>
        public bool ReturnTotalRecordCount { get; set; }
    }

    /// <summary>
    /// OrderExpression ComplexType
    /// https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/orderexpression?view=dynamics-ce-odata-9
    /// </summary>
    public class Order {
        /// <summary>
        /// The name of the attribute in the order expression
        /// </summary>
        public string AttributeName { get; set; }

        /// <summary>
        /// The order, ascending or descending
        /// </summary>
        public string OrderType { get; set; }
    }
}
