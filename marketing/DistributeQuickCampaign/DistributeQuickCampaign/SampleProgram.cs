using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                    var newList = new List()
                    {
                        ListName = "TestList",
                        CreatedFromCode = new OptionSetValue((int)ListCreatedFromCode.Account)
                    };

                    _newListId = service.Create(newList);

                    for (int j = 0; j < 5; j++)
                    {
                        var addMemberListRequest = new AddMemberListRequest();
                        addMemberListRequest.EntityId = _accountIdArray[j];
                        addMemberListRequest.ListId = _newListId;
                        var addMemberListResponse =
                            service.Execute(addMemberListRequest) as AddMemberListResponse;
                    }

                    Guid BOId = CreateAndRetrieveQuickCampaignForMarketingList(service, 
                        _templateLetterActivity,
                        _newListId,
                        PropagationOwnershipOptions.ListMemberOwner,
                        true);


                    #endregion

                    #region Run a QC with a list of accounts as input

                    // Construct a Query Expression(QE) which specifies which records QC should include                
                    QueryExpression query = new QueryExpression("account");
                    query.ColumnSet = new ColumnSet("accountid");
                    query.Criteria = new FilterExpression();
                    FilterExpression filter = query.Criteria.AddFilter(LogicalOperator.Or);
                    for (int j = 0; j < 5; j++)
                    {
                        filter.AddCondition("accountid", ConditionOperator.Equal, _accountIdArray[j]);
                    }
                    _qcBOId = CreateAndRetrieveQuickCampaignForQueryExpression(service, 
                        _templateEmailActivity,
                        query,
                        PropagationOwnershipOptions.ListMemberOwner,
                        true);
                    #endregion Demonstrate

                    #region Clean up
                    CleanUpSample(service);
                    #endregion Clean up
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
