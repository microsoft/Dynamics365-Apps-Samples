using Microsoft.Xrm.Tooling.Connector;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using System;

namespace PowerApps.Samples
{
    public partial class SampleProgram
    {
        // TODO Define some class members
        private static Guid _unitGroupId;
        private static Guid _productId;
        private static Guid _productCloneId;
        private static Guid _priceListId;
        private static Guid _priceListItemId;
        private static OrganizationServiceProxy _serviceProxy;
        //private static Guid member1;

        private static bool prompt = true;

        public static OrganizationServiceProxy ServiceProxy { get => _serviceProxy; set => _serviceProxy = value; }

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
            Console.WriteLine("Creating required records for the sample:");
            // Create a unit group.
            UoMSchedule newUnitGroup = new UoMSchedule
            {
                Name = "Example Unit Group",
                BaseUoMName = "Example Primary Unit"
            };

            _unitGroupId = ServiceProxy.Create(newUnitGroup);

            Console.WriteLine("Created {0}", newUnitGroup.Name);

            // retrieve the unit id.
            QueryExpression unitQuery = new QueryExpression
            {
                EntityName = UoM.EntityLogicalName,
                ColumnSet = new ColumnSet("uomid", "name"),
                Criteria = new FilterExpression(),
                PageInfo = new PagingInfo
                {
                    PageNumber = 1,
                    Count = 1
                }
            };
            unitQuery.Criteria.AddCondition("uomscheduleid", ConditionOperator.Equal, _unitGroupId);

            // Retrieve the unit.
            UoM unit = (UoM)ServiceProxy.RetrieveMultiple(unitQuery).Entities[0];

            Console.WriteLine("Retrieved {0}", unit.Name);


            // Create a price list
            PriceLevel newPriceList = new PriceLevel
            {
                Name = "Example Price List"
            };
            _priceListId = ServiceProxy.Create(newPriceList);

            Console.WriteLine("Created {0}", newPriceList.Name);

            // Create a product record to be cloned.
            Product newProduct = new Product
            {
                Name = "Example Product",
                ProductNumber = "P001",
                ProductStructure = new OptionSetValue(1),
                QuantityDecimal = 2,
                DefaultUoMScheduleId = new EntityReference(UoMSchedule.EntityLogicalName, _unitGroupId),
                DefaultUoMId = new EntityReference(UoM.EntityLogicalName, unit.Id)
            };
            _productId = ServiceProxy.Create(newProduct);

            Console.WriteLine("\nCreated {0}", newProduct.Name);

            // Create a price list item for the product
            ProductPriceLevel newPriceListItem = new ProductPriceLevel
            {
                PriceLevelId = new EntityReference(PriceLevel.EntityLogicalName, _priceListId),
                ProductId = new EntityReference(Product.EntityLogicalName, _productId),
                UoMId = new EntityReference(UoM.EntityLogicalName, unit.Id),
                Amount = new Money(20)
            };
            _priceListItemId = ServiceProxy.Create(newPriceListItem);

            Console.WriteLine("Created price list for {0}", newProduct.Name);

            return;
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
                Console.WriteLine("Deleting entity records... please wait!");

                ServiceProxy.Delete(Product.EntityLogicalName, _productCloneId);
                ServiceProxy.Delete(ProductPriceLevel.EntityLogicalName, _priceListItemId);
                ServiceProxy.Delete(Product.EntityLogicalName, _productId);
                ServiceProxy.Delete(PriceLevel.EntityLogicalName, _priceListId);
                ServiceProxy.Delete(UoMSchedule.EntityLogicalName, _unitGroupId);

                Console.WriteLine("Entity records have been deleted.");
            }
        }

    }
}
