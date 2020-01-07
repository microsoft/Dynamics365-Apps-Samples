using Microsoft.Xrm.Tooling.Connector;
using System.Collections.Generic;
using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Crm.Sdk.Messages;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _salesManagerId;
        private static Guid _unitGroupId;
        private static Guid _defaultUnitId;
        private static Guid _product1Id;
        private static Guid _product2Id;
        private static Guid _priceListId;
        private static Guid _priceListItem1Id;
        private static Guid _priceListItem2Id;
        private static Guid _catalogProductId;
        private static Guid _quoteId;
        private static Guid _quoteDetailId;
        private static Guid _orderId;
        private static Guid _orderDetailId;
        private static Guid _opportunityId;
        private static Guid _accountId;
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
                SystemUserProvider.RetrieveSalespersons(serviceProxy: _serviceProxy, ldapPath: ref ldapPath);

            #endregion

            #region Create records to support Opportunity records
            // Create a unit group
            UoMSchedule newUnitGroup = new UoMSchedule
            {
                Name = "Example Unit Group",
                BaseUoMName = "Example Primary Unit"
            };
            _unitGroupId = _serviceProxy.Create(newUnitGroup);

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
            Product newProduct1 = new Product
            {
                ProductNumber = "1",
                Name = "Example Product 1",
                ProductStructure = new OptionSetValue(1),
                QuantityDecimal = 2,
                DefaultUoMScheduleId = new EntityReference(UoMSchedule.EntityLogicalName,
                    _unitGroupId),
                DefaultUoMId = new EntityReference(UoM.EntityLogicalName, _defaultUnitId)
            };
            _product1Id = _serviceProxy.Create(newProduct1);
            Console.WriteLine("Created {0}", newProduct1.Name);

            Product newProduct2 = new Product
            {
                ProductNumber = "2",
                Name = "Example Product 2",
                ProductStructure = new OptionSetValue(1),
                QuantityDecimal = 3,
                DefaultUoMScheduleId = new EntityReference(UoMSchedule.EntityLogicalName,
                    _unitGroupId),
                DefaultUoMId = new EntityReference(UoM.EntityLogicalName, _defaultUnitId)
            };
            _product2Id = _serviceProxy.Create(newProduct2);
            Console.WriteLine("Created {0}", newProduct2.Name);

            // Create a price list
            PriceLevel newPriceList = new PriceLevel
            {
                Name = "Example Price List"
            };
            _priceListId = _serviceProxy.Create(newPriceList);

            // Create a price list item for the first product and apply volume discount
            ProductPriceLevel newPriceListItem1 = new ProductPriceLevel
            {
                PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName, _priceListId),
                ProductId = new EntityReference(Product.EntityLogicalName, _product1Id),
                UoMId = new EntityReference(UoM.EntityLogicalName, _defaultUnitId),
                Amount = new Money(20)
            };
            _priceListItem1Id = _serviceProxy.Create(newPriceListItem1);

            // Create a price list item for the second product
            ProductPriceLevel newPriceListItem2 = new ProductPriceLevel
            {
                PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName, _priceListId),
                ProductId = new EntityReference(Product.EntityLogicalName, _product2Id),
                UoMId = new EntityReference(UoM.EntityLogicalName, _defaultUnitId),
                Amount = new Money(15)
            };
            _priceListItem2Id = _serviceProxy.Create(newPriceListItem2);

            //Publish Product1
            SetStateRequest publishRequest1 = new SetStateRequest
            {
                EntityMoniker = new EntityReference(Product.EntityLogicalName, _product1Id),
                State = new OptionSetValue((int)ProductState.Active),
                Status = new OptionSetValue(1)
            };
            _serviceProxy.Execute(publishRequest1);

            //Publish Product2
            SetStateRequest publishRequest2 = new SetStateRequest
            {
                EntityMoniker = new EntityReference(Product.EntityLogicalName, _product2Id),
                State = new OptionSetValue((int)ProductState.Active),
                Status = new OptionSetValue(1)
            };
            _serviceProxy.Execute(publishRequest2);
            Console.WriteLine("Published both the products");

            // Create an account record for the opportunity's potential customerid
            Account newAccount = new Account
            {
                Name = "Margie's Travel",
                Address1_PostalCode = "99999"
            };
            _accountId = (_serviceProxy.Create(newAccount));

            #endregion Create records to support Opportunity records
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
                _serviceProxy.Delete(SalesOrderDetail.EntityLogicalName, _orderDetailId);
                _serviceProxy.Delete(SalesOrder.EntityLogicalName, _orderId);
                _serviceProxy.Delete(QuoteDetail.EntityLogicalName, _quoteDetailId);
                _serviceProxy.Delete(Quote.EntityLogicalName, _quoteId);
                _serviceProxy.Delete(Opportunity.EntityLogicalName, _opportunityId);
                _serviceProxy.Delete(ProductPriceLevel.EntityLogicalName, _priceListItem1Id);
                _serviceProxy.Delete(ProductPriceLevel.EntityLogicalName, _priceListItem2Id);
                _serviceProxy.Delete(PriceLevel.EntityLogicalName, _priceListId);
                _serviceProxy.Delete(Product.EntityLogicalName, _product1Id);
                _serviceProxy.Delete(Product.EntityLogicalName, _product2Id);
                _serviceProxy.Delete(UoMSchedule.EntityLogicalName, _unitGroupId);
                _serviceProxy.Delete(Account.EntityLogicalName, _accountId);
                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
