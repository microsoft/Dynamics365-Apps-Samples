using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _accountId;
        private static Guid _contractId;
        private static Guid _contractTemplateId;
        private static Guid _firstCloneId;
        private static Guid _secondCloneId;
        private static Guid _renewedId;
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
            Account setupAccount = new Account()
            {
                Name = "Litware, Inc."
            };
            _accountId = _serviceProxy.Create(setupAccount);
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
                _serviceProxy.Delete(Contract.EntityLogicalName, _secondCloneId);
                _serviceProxy.Delete(Contract.EntityLogicalName, _renewedId);
                _serviceProxy.Delete(Contract.EntityLogicalName, _contractId);
                SetStateRequest setStateRequest = new SetStateRequest()
                {
                    EntityMoniker = new EntityReference
                    {
                        Id = _firstCloneId,
                        LogicalName = Contract.EntityLogicalName
                    },
                    State = new OptionSetValue((int)ContractState.Invoiced),
                    Status = new OptionSetValue(3)
                };
                _serviceProxy.Execute(setStateRequest);
                setStateRequest = new SetStateRequest()
                {
                    EntityMoniker = new EntityReference
                    {
                        Id = _firstCloneId,
                        LogicalName = Contract.EntityLogicalName
                    },
                    State = new OptionSetValue((int)ContractState.Canceled),
                    Status = new OptionSetValue(5)
                };
                _serviceProxy.Execute(setStateRequest);
                _serviceProxy.Delete(Contract.EntityLogicalName, _firstCloneId);
                _serviceProxy.Delete(Account.EntityLogicalName, _accountId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
