using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Linq;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static OrganizationServiceProxy _serviceProxy;
        private static ServiceContext _context;
        private static KbArticle[] _articles = new KbArticle[3];
        private static Guid _subjectId;
        private static Incident _incident;
        private static Account _account;
        private static Product _product;
        private static UoM _uom;
        private static UoMSchedule _uomSchedule;
        //private static Guid member1;

        private static bool prompt = true;
        /// <summary>
        /// Function to set up the sample.
        /// </summary>
        /// <param name="service">Specifies the service to connect to.</param>
        /// 
        private static void SetUpSample(CrmServiceClient service)
        {
            // Check that the current version is greater than the minimum version
            if (!SampleHelpers.CheckVersion(service, new Version("9.0.0.0")))
            {
                //The environment version is lower than version 7.1.0.0
                return;
            }

            CreateRequiredRecords(service);
        }

        private static void CleanUpSample(CrmServiceClient service)
        {
            DeleteRequiredRecords(service, prompt);
        }

        /// <summary>
        /// This method creates any entity records that this sample requires.
        /// Creates the email activity.
        /// </summary>
        public static void CreateRequiredRecords(CrmServiceClient service)
        {
            // TODO Create entity records
            #region create kb articles

            Console.WriteLine("  Creating KB Articles");

            _subjectId = (
                          from subject in _context.SubjectSet
                          where subject.Title == "Default Subject"
                          select subject.Id
                         ).First();

            var kbArticleTemplateId = (
                                       from articleTemplate in _context.KbArticleTemplateSet
                                       where articleTemplate.Title == "Standard KB Article"
                                       select articleTemplate.Id
                                      ).FirstOrDefault();

            if (kbArticleTemplateId != Guid.Empty)
            {
                // create a KB article
                _articles[0] = new KbArticle()
                {
                    // set the article properties
                    Title = "Searching the knowledge base",
                    ArticleXml = @"
                <articledata>
                    <section id='0'>
                        <content><![CDATA[This is a sample article about searching the knowledge base.]]></content>
                    </section>
                    <section id='1'>
                        <content><![CDATA[Knowledge bases contain information useful for various people.]]></content>
                    </section>
                </articledata>",
                    // use the built-in "Standard KB Article" template
                    KbArticleTemplateId = new EntityReference(KbArticleTemplate.EntityLogicalName,
                        kbArticleTemplateId),
                    // use the default subject
                    SubjectId = new EntityReference(Subject.EntityLogicalName, _subjectId),
                    KeyWords = "Searching Knowledge base"
                };
                _context.AddObject(_articles[0]);

                _articles[1] = new KbArticle()
                {
                    Title = "What's in a knowledge base",
                    ArticleXml = @"
                            <articledata>
                                <section id='0'>
                                    <content><![CDATA[This is a sample article about what would be in a knowledge base.]]></content>
                                </section>
                                <section id='1'>
                                    <content><![CDATA[This section contains more information.]]></content>
                                </section>
                            </articledata>",
                    KbArticleTemplateId = new EntityReference(KbArticleTemplate.EntityLogicalName,
                       kbArticleTemplateId),
                    SubjectId = new EntityReference(Subject.EntityLogicalName, _subjectId),
                    KeyWords = "Knowledge base"
                };
                _context.AddObject(_articles[1]);

                _articles[2] = new KbArticle()
                {
                    Title = "Searching the knowledge base from code",
                    ArticleXml = @"
                            <articledata>
                                <section id='0'>
                                    <content><![CDATA[This article covers searching the knowledge base from code.]]></content>
                                </section>
                                <section id='1'>
                                    <content><![CDATA[This section contains more information.]]></content>
                                </section>
                            </articledata>",
                    KbArticleTemplateId = new EntityReference(KbArticleTemplate.EntityLogicalName,
                       kbArticleTemplateId),
                    SubjectId = new EntityReference(Subject.EntityLogicalName, _subjectId),
                    KeyWords = "Knowledge base code"
                };
                _context.AddObject(_articles[2]);
                _context.SaveChanges();
            }
            else
            {
                throw new ArgumentException("Standard Article Templates are missing");
            }
            #endregion

            #region Submit the articles

            Console.WriteLine("  Submitting the articles");

            foreach (var article in _articles)
            {
                _context.Execute(new SetStateRequest
                {
                    EntityMoniker = article.ToEntityReference(),
                    State = new OptionSetValue((int)KbArticleState.Unapproved),
                    Status = new OptionSetValue((int)kbarticle_statuscode.Unapproved)
                });
            }

            #endregion

            #region Approve and Publish the article

            Console.WriteLine("  Publishing articles");

            foreach (var article in _articles)
            {
                _context.Execute(new SetStateRequest
                {
                    EntityMoniker = article.ToEntityReference(),
                    State = new OptionSetValue((int)KbArticleState.Published),
                    Status = new OptionSetValue((int)kbarticle_statuscode.Published)
                });
            }

            #endregion

            #region Waiting for publishing to finish

            // Wait 20 seconds to ensure that data will be available
            // Full-text indexing
            Console.WriteLine("  Waiting 20 seconds to ensure indexing has completed on the new records.");
            System.Threading.Thread.Sleep(20000);
            Console.WriteLine();

            #endregion

            #region Add cases to KbArticles

            // Create UoM
            _uomSchedule = new UoMSchedule()
            {
                Name = "Sample unit group",
                BaseUoMName = "Sample base unit"
            };
            _context.AddObject(_uomSchedule);
            _context.SaveChanges();

            _uom = (from uom in _context.UoMSet
                    where uom.Name == _uomSchedule.BaseUoMName
                    select uom).First();

            Console.WriteLine("  Creating an account and incidents for the KB articles");
            var whoami = (WhoAmIResponse)_context.Execute(new WhoAmIRequest());

            _account = new Account()
            {
                Name = "Coho Winery",
            };
            _context.AddObject(_account);
            _context.SaveChanges();

            _product = new Product()
            {
                Name = "Sample Product",
                ProductNumber = "0",
                ProductStructure = new OptionSetValue(1),
                DefaultUoMScheduleId = _uomSchedule.ToEntityReference(),
                DefaultUoMId = _uom.ToEntityReference()
            };

            _context.AddObject(_product);
            _context.SaveChanges();

            // Publish Product
            SetStateRequest publishRequest = new SetStateRequest
            {
                EntityMoniker = new EntityReference(Product.EntityLogicalName, _product.Id),
                State = new OptionSetValue((int)ProductState.Active),
                Status = new OptionSetValue(1)
            };
            _context.Execute(publishRequest);

            _incident = new Incident()
            {
                Title = "A sample incident",
                OwnerId = new EntityReference(SystemUser.EntityLogicalName, whoami.UserId),
                KbArticleId = _articles[0].ToEntityReference(),
                CustomerId = _account.ToEntityReference(),
                SubjectId = new EntityReference(Subject.EntityLogicalName, _subjectId),
                ProductId = _product.ToEntityReference()
            };
            _context.AddObject(_incident);
            _context.SaveChanges();

            #endregion
            Console.WriteLine("Required records have been created.");
        }


        /// <summary>
        /// Deletes the custom entity record that was created for this sample.
        /// <param name="prompt">Indicates whether to prompt the user 
        /// to delete the entity created in this sample.</param>
        /// </summary>
        public static void DeleteRequiredRecords(CrmServiceClient service, bool prompt)
        {
            bool deleteRecords = true;

            if (prompt)
            {
                Console.WriteLine("\nDo you want these entity records deleted? (y/n)");
                String answer = Console.ReadLine();

                deleteRecords = (answer.StartsWith("y") || answer.StartsWith("Y"));
            }

            if (deleteRecords)
            {
                // TODO Delete entity records
                #region Delete incidents, accounts and units of measure

                _serviceProxy.Delete(Incident.EntityLogicalName, _incident.Id);

                _serviceProxy.Delete(Product.EntityLogicalName, _product.Id);

                _serviceProxy.Delete(Account.EntityLogicalName, _account.Id);

                _serviceProxy.Delete(UoMSchedule.EntityLogicalName, _uomSchedule.Id);

                #endregion

                #region Unpublish articles

                foreach (var article in _articles)
                {
                    _serviceProxy.Execute(new SetStateRequest
                    {
                        EntityMoniker = article.ToEntityReference(),
                        Status = new OptionSetValue((int)kbarticle_statuscode.Unapproved),
                        State = new OptionSetValue((int)KbArticleState.Unapproved)
                    });
                }

                #endregion

                #region Delete articles

                foreach (var article in _articles)
                    _serviceProxy.Delete(KbArticle.EntityLogicalName, article.Id);

                #endregion
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
