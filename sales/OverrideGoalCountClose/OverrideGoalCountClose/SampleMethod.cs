using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System.Collections.Generic;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _metricId;
        private static Guid _actualId;
        private static Guid _inprogressId;
        private static Guid _goalId;
        private static Guid _accountId;
        private static Guid _salesManagerId;
        private static Guid _phoneCallId;
        private static Guid _phoneCall2Id;
        private static List<Guid> _rollupQueryIds = new List<Guid>();
        private static  OrganizationServiceProxy _serviceProxy;
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

            // Retrieve a sales manager.
            _salesManagerId =
                SystemUserProvider.RetrieveMarketingManager(serviceProxy: _serviceProxy);

            #endregion

            #region Create PhoneCall record and supporting account

            Account newAccount = new Account
            {
                Name = "Margie's Travel",
                Address1_PostalCode = "99999"
            };
            _accountId = (_serviceProxy.Create(newAccount));
            newAccount.Id = _accountId;

            // Create Guids for PhoneCalls
            _phoneCallId = Guid.NewGuid();
            _phoneCall2Id = Guid.NewGuid();

            // Create ActivityPartys for the phone calls' "From" field.
            ActivityParty activityParty = new ActivityParty()
            {
                PartyId = newAccount.ToEntityReference(),
                ActivityId = new EntityReference
                {
                    Id = _phoneCallId,
                    LogicalName = PhoneCall.EntityLogicalName,
                },
                ParticipationTypeMask = new OptionSetValue(9)
            };

            ActivityParty activityPartyClosed = new ActivityParty()
            {
                PartyId = newAccount.ToEntityReference(),
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
                To = new ActivityParty[] { activityParty }
            };
            _serviceProxy.Create(phoneCall);

            // Create a second phone call to close
            phoneCall = new PhoneCall()
            {
                Id = _phoneCall2Id,
                Subject = "Sample Phone Call 2",
                DirectionCode = false,
                To = new ActivityParty[] { activityParty },
                ActualEnd = DateTime.Now
            };
            _serviceProxy.Create(phoneCall);

            // Close the second phone call.
            SetStateRequest closePhoneCall = new SetStateRequest()
            {
                EntityMoniker = phoneCall.ToEntityReference(),
                State = new OptionSetValue(1),
                Status = new OptionSetValue(4)
            };
            _serviceProxy.Execute(closePhoneCall);
            Console.WriteLine("Required records have been created.");
            #endregion
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
                _serviceProxy.Delete("phonecall", _phoneCallId);
                _serviceProxy.Delete("phonecall", _phoneCall2Id);
                _serviceProxy.Delete("goal", _goalId);
                _serviceProxy.Delete("goalrollupquery", _rollupQueryIds[1]);
                _serviceProxy.Delete("goalrollupquery", _rollupQueryIds[0]);
                _serviceProxy.Delete("account", _accountId);
                _serviceProxy.Delete("rollupfield", _actualId);
                _serviceProxy.Delete("rollupfield", _inprogressId);
                _serviceProxy.Delete("metric", _metricId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
