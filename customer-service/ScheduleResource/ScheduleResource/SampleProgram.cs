using Microsoft.Crm.Sdk.Messages;
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
                    RequiredResource vanReq = new RequiredResource
                    {
                        ResourceId = _vanId,
                        ResourceSpecId = _specId
                    };

                    // Create the appointment request.
                    AppointmentRequest appointmentReq = new AppointmentRequest
                    {
                        RequiredResources = new RequiredResource[] { vanReq },
                        Direction = SearchDirection.Backward,
                        Duration = 60,
                        NumberOfResults = 10,
                        ServiceId = _plumberServiceId,
                        // The search window describes the time when the resouce can be scheduled.
                        // It must be set.
                        SearchWindowStart = DateTime.Now.ToUniversalTime(),
                        SearchWindowEnd = DateTime.Now.AddDays(7).ToUniversalTime(),
                        UserTimeZoneCode = 1
                    };

                    // Verify whether there are openings available to schedule the appointment using this resource              
                    SearchRequest search = new SearchRequest
                    {
                        AppointmentRequest = appointmentReq
                    };
                    SearchResponse searched = (SearchResponse)service.Execute(search);

                    if (searched.SearchResults.Proposals.Length > 0)
                    {
                        Console.WriteLine("Openings are available to schedule the resource.");
                    }

                    DeleteRequiredRecords(service, prompt);
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
