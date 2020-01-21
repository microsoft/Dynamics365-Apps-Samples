using Microsoft.Xrm.Tooling.Connector;
using System;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _opportunityId;
        private static Guid _loseOpportunityId;
        private static Guid _unitGroupId;
        private static Guid _defaultUnitId;
        private static Guid _productId;
        private static Guid _priceListId;
        private static Guid _priceListItemId;
        private static Guid _accountId;
        private static Guid _quoteId;
        private static Guid _closeQuoteId;
        private static Guid _quoteDetailId;
        private static Guid _salesOrderId;
        private static Guid _closeSalesOrderId;
        private static Guid _invoiceId;

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
            // Create a unit group
            UoMSchedule newUnitGroup = new UoMSchedule
            {
                Name = "Example Unit Group",
                BaseUoMName = "Example Primary Unit"
            };
            _unitGroupId = _serviceProxy.Create(newUnitGroup);
            Console.WriteLine("Create {0}", newUnitGroup.Name);

            // Retrieve the default unit id that was automatically created
            // when we created the Unit Group
            QueryExpression unitQuery = new QueryExpression
            {
                EntityName = UoM.EntityLogicalName,
                ColumnSet = new ColumnSet("uomid", "name"),
                Criteria = new FilterExpression
                {
                    Conditions =
                        {
                            new ConditionExpression
                            {
                                AttributeName = "uomscheduleid",
                                Operator = ConditionOperator.Equal,
                                Values = { _unitGroupId }
                            }
                        }
                },
                PageInfo = new PagingInfo
                {
                    PageNumber = 1,
                    Count = 1
                }
            };

            // Retrieve the unit.
            UoM unit = (UoM)_serviceProxy.RetrieveMultiple(unitQuery).Entities[0];
            _defaultUnitId = unit.UoMId.Value;

            // Create a few products
            Product newProduct = new Product
            {
                ProductNumber = "1",
                Name = "Example Product",
                ProductStructure = new OptionSetValue(1),
                QuantityDecimal = 1,
                DefaultUoMScheduleId =
                    new EntityReference(UoMSchedule.EntityLogicalName, _unitGroupId),
                DefaultUoMId =
                    new EntityReference(UoM.EntityLogicalName, _defaultUnitId)
            };
            _productId = _serviceProxy.Create(newProduct);
            newProduct.Id = _productId;
            Console.WriteLine("Create {0}", newProduct.Name);

            // Create a price list
            PriceLevel newPriceList = new PriceLevel
            {
                Name = "Example Price List"
            };
            _priceListId = _serviceProxy.Create(newPriceList);

            // Create a price list item for the product and apply volume discount
            ProductPriceLevel newPriceListItem = new ProductPriceLevel
            {
                PriceLevelId =
                    new EntityReference(PriceLevel.EntityLogicalName, _priceListId),
                ProductId =
                    new EntityReference(Product.EntityLogicalName, _productId),
                UoMId =
                    new EntityReference(UoM.EntityLogicalName, _defaultUnitId),
                Amount = new Money(20.0M),
            };
            _priceListItemId = _serviceProxy.Create(newPriceListItem);

            // Publish the product
            SetStateRequest publishRequest = new SetStateRequest
            {
                EntityMoniker = new EntityReference(Product.EntityLogicalName, _productId),
                State = new OptionSetValue((int)ProductState.Active),
                Status = new OptionSetValue(1)
            };
            _serviceProxy.Execute(publishRequest);
            Console.WriteLine("Published {0}", newProduct.Name);

            // Create an account record for the opportunity's potential customerid 
            Account newAccount = new Account
            {
                Name = "Litware, Inc.",
                Address1_PostalCode = "60661"
            };
            _accountId = _serviceProxy.Create(newAccount);
            newAccount.Id = _accountId;

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
                _serviceProxy.Delete("invoice", _invoiceId);
                _serviceProxy.Delete("salesorder", _salesOrderId);
                _serviceProxy.Delete("salesorder", _closeSalesOrderId);
                _serviceProxy.Delete("quotedetail", _quoteDetailId);
                _serviceProxy.Delete("quote", _quoteId);
                _serviceProxy.Delete("quote", _closeQuoteId);
                _serviceProxy.Delete("opportunity", _opportunityId);
                _serviceProxy.Delete("opportunity", _loseOpportunityId);
                _serviceProxy.Delete("account", _accountId);
                _serviceProxy.Delete("productpricelevel", _priceListItemId);
                _serviceProxy.Delete("pricelevel", _priceListId);
                _serviceProxy.Delete("product", _productId);
                _serviceProxy.Delete("uomschedule", _unitGroupId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
