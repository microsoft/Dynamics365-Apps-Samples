using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Tooling.Connector;
using System;
using System.Linq;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        #region Class Level Members
        private static Guid? _salesOrderId;
        private static Guid? _accountId;
        #endregion

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
        /// Creates a customer for the sales order
        /// </summary>
        private static void CreateCustomer(CrmServiceClient service)
        {
            // Create an account to be used with the sales account.
            _accountId = service.Create(new Account
            {
                Name = "Microsoft"
            });

            Console.WriteLine(String.Concat("Created account for sales order: ",
                _accountId.Value));
        }
        /// <summary>
        /// This method creates any entity records that this sample requires.
        /// Creates the email activity.
        /// </summary>
        public static void CreateRequiredRecords(CrmServiceClient service)
        {
            /// <summary>
            /// Creates a customer for the sales order
            /// </summary>
            /// Create an account to be used with the sales account.
            _accountId = service.Create(new Account
            {
                Name = "Microsoft"
            });

            Console.WriteLine(String.Concat("Created account for sales order: ",
                _accountId.Value));
        }

        /// <summary>
        /// Creates the sales order to close 
        /// </summary>
        private static void CreateSalesOrder(CrmServiceClient service)
        {
            // Create a sales order with an account
            _salesOrderId = service.Create(new SalesOrder
            {
                CustomerId = new EntityReference
                {
                    LogicalName = Account.EntityLogicalName,
                    Id = _accountId.Value
                },
                Description = "Sales Order Description",
            });

            Console.WriteLine(String.Concat("Created sales order: ",
                _salesOrderId.Value));
        }
        /// <summary>
        /// Calls the FulfillSalesOrderRequest and closes it as completed
        /// </summary>
        private static void CloseSalesOrder(CrmServiceClient service)
        {
            if (!_salesOrderId.HasValue)
                return;

            // Close the sales order with a status of Complete
            int newStatus = (int)salesorder_statuscode.Complete;
            var request = new FulfillSalesOrderRequest
            {
                OrderClose = new OrderClose
                {
                    SalesOrderId = new EntityReference
                    { LogicalName = SalesOrder.EntityLogicalName, Id = _salesOrderId.Value }

                },
                Status = new OptionSetValue(newStatus)
            };

            Console.WriteLine(String.Concat("Executing FullfillSalesOrderRequest on sales order: ",
                _salesOrderId.Value, ",\n\t new status: ",
                GetLabelForStatus(SalesOrder.EntityLogicalName, "statuscode", newStatus, service)));

            service.Execute(request);

            // Validate that the sales order is complete
            var salesOrder = service.Retrieve(SalesOrder.EntityLogicalName, _salesOrderId.Value,
                new ColumnSet("statuscode")).ToEntity<SalesOrder>();

            Console.WriteLine(String.Concat("Validation of closed sales order: ", _salesOrderId.Value,
                ",\n\t status: ", salesOrder.FormattedValues["statuscode"]));
        }
        /// <summary>
        /// Returns the label for a status option
        /// </summary>
        /// <param name="entity">entity logical name</param>
        /// <param name="attribute">statuscode </param>
        /// <param name="value">numeric value</param>
        /// <returns>user label</returns>
        private static string GetLabelForStatus(string entity, string attribute, int value, CrmServiceClient service)
        {
            // Retrieve the attribute metadata
            var attributeMD = ((RetrieveAttributeResponse)service.Execute(
                new RetrieveAttributeRequest
                {
                    EntityLogicalName = entity,
                    LogicalName = attribute,
                    RetrieveAsIfPublished = true,
                })).AttributeMetadata;

            // find the option based on the numeric value and return the label
            if (attributeMD.AttributeType == AttributeTypeCode.Status)
            {
                var options = ((StatusAttributeMetadata)attributeMD).OptionSet.Options;

                var crmOption = options.FirstOrDefault(x => x.Value == value);
                if (crmOption != null)
                    return crmOption.Label.UserLocalizedLabel.Label;
            }

            return string.Empty;
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
                // Delete records created in this sample.  Delete the sales order first
                // or there will be an error due to restrict delete.
                if (_salesOrderId.HasValue)
                {
                    Console.WriteLine(String.Concat("Deleting sales order: ", _salesOrderId.Value));
                    service.Delete(SalesOrder.EntityLogicalName, _salesOrderId.Value);
                }
                if (_accountId.HasValue)
                {
                    Console.WriteLine(String.Concat("Deleting account: ", _accountId.Value));
                    service.Delete(Account.EntityLogicalName, _accountId.Value);
                }

                Console.WriteLine("Entity records have been deleted.");
            }
        }
    }
}
