using Microsoft.Xrm.Tooling.Connector;
using System;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        //private static Guid member1;
        private static Guid _lead1Id;
        private static Guid _lead2Id;
        private static Guid _accountId;
        private static Guid _leadAccountId;
        private static Guid _contactId;
        private static Guid _opportunityId;
        private static bool prompt = true;
        private static void NotifyEntityCreated(String entityName, Guid entityId)
        {
            Console.WriteLine("  {0} created with GUID {{{1}}}",
                entityName, entityId);
        }
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

            // Create an account to relate the opportunity to.
            var account = new Account
            {
                Name = "Litware, Inc.",
                Address1_StateOrProvince = "Colorado"
            };
            _accountId = (service.Create(account));

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
                
                    service.Delete(Account.EntityLogicalName, _accountId);
                    service.Delete(Account.EntityLogicalName, _leadAccountId);

                   service.Delete(Lead.EntityLogicalName, _lead1Id);
                   service.Delete(Lead.EntityLogicalName, _lead2Id);
                
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
