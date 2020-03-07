using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;

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
                    /// <summary>
                    /// Function to set up the sample.
                    /// </summary>
                    /// <param name="service">Specifies the service to connect to.</param>
                    /// 
                    Console.WriteLine("=== Creating and Qualifying Leads ===");

                    // Create two leads.
                    var lead1 = new Lead
                    {
                        CompanyName = "A. Datum Corporation",
                        FirstName = "Henriette",
                        LastName = "Andersen",
                        Subject = "Sample Lead 1"
                    };

                    _lead1Id = service.Create(lead1);
                    NotifyEntityCreated(Lead.EntityLogicalName, _lead1Id);

                    var lead2 = new Lead
                    {
                        CompanyName = "Adventure Works",
                        FirstName = "Michael",
                        LastName = "Sullivan",
                        Subject = "Sample Lead 2"
                    };

                    _lead2Id = service.Create(lead2);
                    NotifyEntityCreated(Lead.EntityLogicalName, _lead2Id);

                    // Qualify the first lead, creating an account and a contact from it, but
                    // not creating an opportunity.
                    var qualifyIntoAccountContactReq = new QualifyLeadRequest
                    {
                        CreateAccount = true,
                        CreateContact = true,
                        LeadId = new EntityReference(Lead.EntityLogicalName, _lead1Id),
                        Status = new OptionSetValue((int)lead_statuscode.Qualified)
                    };

                    var qualifyIntoAccountContactRes =
                        (QualifyLeadResponse)service.Execute(qualifyIntoAccountContactReq);
                    Console.WriteLine("  The first lead was qualified.");
                    foreach (var entity in qualifyIntoAccountContactRes.CreatedEntities)
                    {
                        NotifyEntityCreated(entity.LogicalName, entity.Id);
                        if (entity.LogicalName == Account.EntityLogicalName)
                        {
                            _leadAccountId = entity.Id;
                        }
                        else if (entity.LogicalName == Contact.EntityLogicalName)
                        {
                            _contactId = entity.Id;
                        }
                    }

                    // Retrieve the organization's base currency ID for setting the
                    // transaction currency of the opportunity.
                    var query = new QueryExpression("organization");
                    query.ColumnSet = new ColumnSet("basecurrencyid");
                    var result = service.RetrieveMultiple(query);
                    var currencyId = (EntityReference)result.Entities[0]["basecurrencyid"];

                    // Qualify the second lead, creating an opportunity from it, and not
                    // creating an account or a contact.  We use an existing account for the
                    // opportunity customer instead.
                    var qualifyIntoOpportunityReq = new QualifyLeadRequest
                    {
                        CreateOpportunity = true,
                        OpportunityCurrencyId = currencyId,
                        OpportunityCustomerId = new EntityReference(
                            Account.EntityLogicalName,
                            _accountId),
                        Status = new OptionSetValue((int)lead_statuscode.Qualified),
                        LeadId = new EntityReference(Lead.EntityLogicalName, _lead2Id)
                    };

                    var qualifyIntoOpportunityRes =
                        (QualifyLeadResponse)service.Execute(qualifyIntoOpportunityReq);
                    Console.WriteLine("  The second lead was qualified.");

                    foreach (var entity in qualifyIntoOpportunityRes.CreatedEntities)
                    {
                        NotifyEntityCreated(entity.LogicalName, entity.Id);
                        if (entity.LogicalName == Opportunity.EntityLogicalName)
                        {
                            _opportunityId = entity.Id;
                        }
                    }

                    DeleteRequiredRecords(service, prompt);
                }
                #endregion
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
