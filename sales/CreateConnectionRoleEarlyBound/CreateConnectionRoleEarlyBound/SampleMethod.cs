using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;


namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static OrganizationServiceProxy _serviceProxy;

        // Define the IDs needed for this sample.
        public  static Guid _connectionRoleId;
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
            // Create a Connection Role for account and contact
            var Categories = new
            {
                Business = 1,
                Family = 2,
                Social = 3,
                Sales = 4,
                Other = 5
            };

            ConnectionRole newConnectionRole = new ConnectionRole
            {
                Name = "Example Connection Role",
                Category = new OptionSetValue(Categories.Business)
            };

            _connectionRoleId = _serviceProxy.Create(newConnectionRole);
            Console.WriteLine("Created {0}.", newConnectionRole.Name);

            // Create a related Connection Role Object Type Code record for Account
            ConnectionRoleObjectTypeCode newAccountConnectionRoleTypeCode
                = new ConnectionRoleObjectTypeCode
                {
                    ConnectionRoleId = new EntityReference(
                        ConnectionRole.EntityLogicalName, _connectionRoleId),
                    AssociatedObjectTypeCode = Account.EntityLogicalName
                };

            _serviceProxy.Create(newAccountConnectionRoleTypeCode);
            Console.WriteLine(
                "Created a related Connection Role Object Type Code record for Account.");

            // Create a related Connection Role Object Type Code record for Contact
            ConnectionRoleObjectTypeCode newContactConnectionRoleTypeCode
                = new ConnectionRoleObjectTypeCode
                {
                    ConnectionRoleId = new EntityReference(
                        ConnectionRole.EntityLogicalName, _connectionRoleId),
                    AssociatedObjectTypeCode = Contact.EntityLogicalName
                };

            _serviceProxy.Create(newContactConnectionRoleTypeCode);
            Console.WriteLine("Created a related Connection Role Object Type Code record for Contact.");

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
                _serviceProxy.Delete(ConnectionRole.EntityLogicalName, _connectionRoleId);

                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
