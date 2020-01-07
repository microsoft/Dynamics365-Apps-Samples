using Microsoft.Xrm.Tooling.Connector;
using System;
using System.ServiceModel;
using System.Collections.Generic;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Crm.Sdk.Messages;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _salesManagerId;
        private static Guid _accountId;
        private static Guid _phoneCallId;
        private static Guid _phoneCall2Id;
        private static Guid _metricId;
        private static Guid _actualId;
        private static Guid _parentGoalId;
        private static Guid _firstChildGoalId;
        private static Guid _secondChildGoalId;
        private static List<Guid> _rollupQueryIds = new List<Guid>();
        private static List<Guid> _salesRepresentativeIds = new List<Guid>();

        private static OrganizationServiceProxy _serviceProxy;
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
            #region Create or Retrieve the necessary system users

            // Retrieve the ldapPath
            String ldapPath = String.Empty;
            // Retrieve the sales team - 1 sales manager and 2 sales representatives.
            _salesManagerId =
                SystemUserProvider.RetrieveSalesManager(_serviceProxy, ref ldapPath);
            _salesRepresentativeIds =
                SystemUserProvider.RetrieveSalespersons(_serviceProxy, ref ldapPath);

            #endregion

            #region Create PhoneCall record and supporting account

            Account account = new Account
            {
                Name = "Margie's Travel",
                Address1_PostalCode = "99999"
            };
            _accountId = (_serviceProxy.Create(account));
            account.Id = _accountId;

            // Create Guids for PhoneCalls
            _phoneCallId = Guid.NewGuid();
            _phoneCall2Id = Guid.NewGuid();

            // Create ActivityPartys for the phone calls' "From" field.
            ActivityParty activityParty = new ActivityParty()
            {
                PartyId = account.ToEntityReference(),
                ActivityId = new EntityReference
                {
                    Id = _phoneCallId,
                    LogicalName = PhoneCall.EntityLogicalName,
                },
                ParticipationTypeMask = new OptionSetValue(9),
            };

            ActivityParty activityPartyClosed = new ActivityParty()
            {
                PartyId = account.ToEntityReference(),
                ActivityId = new EntityReference
                {
                    Id = _phoneCall2Id,
                    LogicalName = PhoneCall.EntityLogicalName,
                },
                ParticipationTypeMask = new OptionSetValue(9)
            };

            // Create an open phone call.
            PhoneCall phoneCall = new PhoneCall()
            {
                Id = _phoneCallId,
                Subject = "Sample Phone Call",
                DirectionCode = false,
                To = new ActivityParty[] { activityParty },
                OwnerId = new EntityReference("systemuser", _salesRepresentativeIds[0]),
                ActualEnd = DateTime.Now
            };
            _serviceProxy.Create(phoneCall);

            // Close the first phone call.
            SetStateRequest closePhoneCall = new SetStateRequest()
            {
                EntityMoniker = phoneCall.ToEntityReference(),
                State = new OptionSetValue(1),
                Status = new OptionSetValue(4)
            };
            _serviceProxy.Execute(closePhoneCall);

            // Create a second phone call. 
            phoneCall = new PhoneCall()
            {
                Id = _phoneCall2Id,
                Subject = "Sample Phone Call 2",
                DirectionCode = true,
                To = new ActivityParty[] { activityParty },
                OwnerId = new EntityReference("systemuser", _salesRepresentativeIds[1]),
                ActualEnd = DateTime.Now
            };
            _serviceProxy.Create(phoneCall);

            // Close the second phone call.
            closePhoneCall = new SetStateRequest()
            {
                EntityMoniker = phoneCall.ToEntityReference(),
                State = new OptionSetValue(1),
                Status = new OptionSetValue(4)
            };
            _serviceProxy.Execute(closePhoneCall);

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
                // Delete all records created in this sample.
                _serviceProxy.Delete("goal", _firstChildGoalId);
                _serviceProxy.Delete("goal", _secondChildGoalId);
                _serviceProxy.Delete("goal", _parentGoalId);
                _serviceProxy.Delete("goalrollupquery", _rollupQueryIds[0]);
                _serviceProxy.Delete("goalrollupquery", _rollupQueryIds[1]);
                _serviceProxy.Delete("account", _accountId);
                _serviceProxy.Delete("phonecall", _phoneCallId);
                _serviceProxy.Delete("phonecall", _phoneCall2Id);
                _serviceProxy.Delete("rollupfield", _actualId);
                _serviceProxy.Delete("metric", _metricId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
