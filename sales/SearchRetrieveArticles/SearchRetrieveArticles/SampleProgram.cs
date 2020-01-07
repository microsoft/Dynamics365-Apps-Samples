using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Linq;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        [STAThread] // Required to support the interactive login experience
        static void Main(string[] args)
        {
            CrmServiceClient service = null;
            try
            {
                service = SampleHelpers.Connect("Connect");
                if (service.IsReady)
                {
                    // Create any entity records that the demonstration code requires
                    SetUpSample(service);

                    #region Demonstrate
                    // TODO Add demonstration code here
                    #region Search Knowledge base by Body

                    // Create the request
                    SearchByBodyKbArticleRequest searchByBodyRequest =
                        new SearchByBodyKbArticleRequest()
                        {
                            SubjectId = _subjectId,
                            UseInflection = true, // allows for a different tense or 
                                                  // inflection to be substituted for the search text
                            SearchText = "contained", // will also match on 'contains'
                            QueryExpression = new QueryExpression()
                            {
                                ColumnSet = new ColumnSet("articlexml"),
                                EntityName = KbArticle.EntityLogicalName
                            }
                        };

                    // Execute the request
                    Console.WriteLine("  Searching for published article with 'contained' in the body");

                    SearchByBodyKbArticleResponse seachByBodyResponse =
                        (SearchByBodyKbArticleResponse)_context.Execute(searchByBodyRequest);

                    // Check success
                    var retrievedArticleBodies = seachByBodyResponse.EntityCollection.Entities
                        .Select((entity) => ((KbArticle)entity).ArticleXml);

                    if (retrievedArticleBodies.Count() == 0)
                        throw new Exception("No articles found");

                    Console.WriteLine("  Results of search (article bodies found):");
                    foreach (var body in retrievedArticleBodies)
                        Console.WriteLine(body);

                    #endregion

                    #region Search knowledge base by Keyword

                    // Create the request
                    SearchByKeywordsKbArticleRequest searchByKeywordRequest =
                        new SearchByKeywordsKbArticleRequest()
                        {
                            SubjectId = _subjectId,
                            UseInflection = true,
                            SearchText = "Search",
                            QueryExpression = new QueryExpression()
                            {
                                ColumnSet = new ColumnSet("keywords"),
                                EntityName = KbArticle.EntityLogicalName
                            }
                        };

                    // Execute the request
                    Console.WriteLine();
                    Console.WriteLine("  Searching for published article with 'search' as a keyword");
                    var searchByKeywordResponse =
                        (SearchByKeywordsKbArticleResponse)_context.Execute(searchByKeywordRequest);

                    // Check success
                    var retrievedArticleKeywords = searchByKeywordResponse.EntityCollection.Entities
                        .Select((entity) => (KbArticle)entity);

                    if (retrievedArticleKeywords.Count() == 0)
                        throw new Exception("No articles found");

                    Console.WriteLine("  Results of search (keywords found):");
                    foreach (var article in retrievedArticleKeywords)
                        Console.WriteLine(article.KeyWords);

                    #endregion

                    #region Search knowledge base by Title

                    // create the request
                    SearchByTitleKbArticleRequest searchByTitleRequest =
                        new SearchByTitleKbArticleRequest()
                        {
                            SubjectId = _subjectId,
                            UseInflection = false,
                            SearchText = "code",
                            QueryExpression = new QueryExpression()
                            {
                                ColumnSet = new ColumnSet("title"),
                                EntityName = KbArticle.EntityLogicalName
                            }
                        };

                    // execute the request
                    Console.WriteLine();
                    Console.WriteLine("  Searching for published articles with 'code' in the title");
                    var searchByTitleResponse = (SearchByTitleKbArticleResponse)
                        _context.Execute(searchByTitleRequest);

                    // check success
                    var retrievedArticles = searchByTitleResponse.EntityCollection.Entities
                        .Select((entity) => (KbArticle)entity);
                    Console.WriteLine("  Results of search (titles found):");
                    foreach (var article in retrievedArticles)
                        Console.WriteLine(article.Title);

                    #endregion

                    #region Retrieve by top incident subject

                    // create the request
                    var retrieveByTopIncidentSubjectRequest =
                        new RetrieveByTopIncidentSubjectKbArticleRequest()
                        {
                            SubjectId = _subjectId
                        };

                    // execute request
                    Console.WriteLine();
                    Console.WriteLine("  Searching for the top articles in subject 'Default Subject'");
                    var retrieveByTopIncidentSubjectResponse = (RetrieveByTopIncidentSubjectKbArticleResponse)
                        _context.Execute(retrieveByTopIncidentSubjectRequest);

                    // check success
                    var articles = retrieveByTopIncidentSubjectResponse.EntityCollection.Entities.Select(
                        (entity) => (KbArticle)entity);
                    Console.WriteLine("  Top articles in subject 'Default Subject':");
                    foreach (var article in articles)
                        Console.WriteLine(article.Title);

                    #endregion

                    #region Retrieve by top incident product

                    // create the request
                    var retrieveByTopIncidentProductRequest =
                        new RetrieveByTopIncidentProductKbArticleRequest()
                        {
                            ProductId = _product.Id
                        };

                    // execute request
                    Console.WriteLine();
                    Console.WriteLine("  Searching for the top articles for product 'Sample Product'");
                    var retrieveByTopIncidentProductResponse = (RetrieveByTopIncidentProductKbArticleResponse)
                        _context.Execute(retrieveByTopIncidentProductRequest);

                    // check success
                    articles = retrieveByTopIncidentProductResponse.EntityCollection.Entities.Select(
                        (entity) => (KbArticle)entity);
                    Console.WriteLine("  Top articles for product 'Sample Product':");
                    foreach (var article in articles)
                        Console.WriteLine(article.Title);

                    #endregion
                    #endregion Demonstrate
                }
                else
                {
                    const string UNABLE_TO_LOGIN_ERROR = "Unable to Login to Common Data Service";
                    if (service.LastCrmError.Equals(UNABLE_TO_LOGIN_ERROR))
                    {
                        Console.WriteLine("Check the connection string values in cds/App.config.");
                        throw new Exception(service.LastCrmError);
                    }
                    else
                    {
                        throw service.LastCrmException;
                    }
                }
            }
            catch (Exception ex)
            {
                SampleHelpers.HandleException(ex);
            }

            finally
            {
                if (service != null)
                    service.Dispose();

                Console.WriteLine("Press <Enter> to exit.");
                Console.ReadLine();
            }

        }
    }
}
