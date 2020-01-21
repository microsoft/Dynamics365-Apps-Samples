using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _connectionRoleId;
        private static Guid _connectionId;
        private static Guid _accountId;
        private static Guid _contactId;
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
                //The environment version is lower than version 9.0.0.0
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
            Connection newConnection = new Connection
            {
                Record1Id = new EntityReference(Account.EntityLogicalName,
                                        _accountId),
                Record1RoleId = new EntityReference(ConnectionRole.EntityLogicalName,
                                        _connectionRoleId),
                Record2RoleId = new EntityReference(ConnectionRole.EntityLogicalName,
                                        _connectionRoleId),
                Record2Id = new EntityReference(Contact.EntityLogicalName,
                                        _contactId)
            };

            _connectionId = _serviceProxy.Create(newConnection);

            Console.WriteLine(
                "Created a connection between the account and the contact.");
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
                _serviceProxy.Delete(Connection.EntityLogicalName, _connectionId);
                _serviceProxy.Delete(Account.EntityLogicalName, _accountId);
                _serviceProxy.Delete(Contact.EntityLogicalName, _contactId);
                _serviceProxy.Delete(ConnectionRole.EntityLogicalName, _connectionRoleId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
